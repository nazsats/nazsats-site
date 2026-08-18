---
title: "LangChain Couldn't See DeepSeek's Cache Hits"
description: "DeepSeek reports prompt-cache usage in a field LangChain never read, so anyone measuring their cache savings saw nothing at all. My fix is merged into langchain-ai/langchain. Here is the bug, the three judgement calls it needed, and the one part you can only find by streaming a real response."
date: "2026-08-18"
author: "Nazsats"
tags: ["LangChain", "DeepSeek", "Open Source", "LLM Cost", "Debugging"]
published: true
---

DeepSeek's context cache is a cost feature. Send a prompt whose prefix the server has
seen recently and the cached portion bills at a fraction of the normal input rate. On a
production agent that resends a long system prompt on every turn, that is most of your
bill.

So you check how much of it is being cached:

```python
response.usage_metadata["input_token_details"]["cache_read"]
```

And through LangChain, on DeepSeek, you got nothing. Not zero. Absent.

That fix is now merged into
[langchain-ai/langchain](https://github.com/langchain-ai/langchain/pull/39668).

## Two ways to report the same number

Both providers tell you how many prompt tokens came from cache. They just disagree about
where to put it.

![OpenAI reports cached prompt tokens in a nested field, prompt_tokens_details.cached_tokens. DeepSeek reports them as top-level prompt_cache_hit_tokens and prompt_cache_miss_tokens, and never populates the nested field at all.](/blog/deepseek-cache-shapes.svg)

`ChatDeepSeek` extends `BaseChatOpenAI`, because DeepSeek's API is OpenAI-compatible.
That inheritance is the whole point — it buys tool calling, streaming, structured output
and token accounting for free.

It also means usage parsing is inherited, and the base class looks in exactly one place:
the nested `prompt_tokens_details.cached_tokens`. DeepSeek never populates it. The
top-level `prompt_cache_hit_tokens` sat there, correct, and unread.

Nothing raised. `usage_metadata` came back well-formed, with `input_tokens` and
`output_tokens` populated and the cache detail simply missing. If you were building a
dashboard to prove your caching strategy worked, it showed a flat line, and the flat line
was the reporting, not the cache.

## The fix, and the part that isn't obvious

The mapping itself is small. From `libs/partners/deepseek/langchain_deepseek/chat_models.py`:

```python
def _get_prompt_cache_hit_tokens(response: dict | openai.BaseModel) -> int | None:
    usage: Any = (
        response.get("usage")
        if isinstance(response, dict)
        else getattr(response, "usage", None)
    )
    if isinstance(usage, openai.BaseModel):
        # Fields DeepSeek adds beyond OpenAI's schema are preserved as extras,
        # which `model_dump` includes.
        usage = usage.model_dump()
```

That comment is load-bearing. The response is parsed into OpenAI's own pydantic model, and
`prompt_cache_hit_tokens` is not in OpenAI's schema — so it survives only as a pydantic
extra. Reach for it as an attribute and it isn't there. `model_dump()` includes it.

Then it goes into the message:

```python
def _add_cache_read_tokens(message: BaseMessage, cache_hit_tokens: int) -> None:
    if not isinstance(message, AIMessage) or message.usage_metadata is None:
        return
    input_token_details = message.usage_metadata.get("input_token_details") or {}
    if "cache_read" in input_token_details:
        return
```

Three decisions in that function are worth more than the mapping.

## One: don't map the misses

The tempting move is to map both fields. There are two of them, they're a matched pair,
and `cache_creation` is sitting right there in the schema looking unused.

![DeepSeek defines prompt_tokens as cache hits plus cache misses. A hit belongs in cache_read. A miss is an ordinary uncached input token, not a cache write.](/blog/deepseek-hit-vs-miss.svg)

DeepSeek documents `prompt_tokens = prompt_cache_hit_tokens + prompt_cache_miss_tokens`.
A miss is not a cache write. It is an ordinary input token that happened not to be cached.
Mapping it to `cache_creation` would report cache-writing activity that never occurred,
and inflate every cost dashboard downstream.

Mapping both would have looked more thorough and been wrong.

## Two: never overwrite what's already there

`if "cache_read" in input_token_details: return`

DeepSeek is frequently served through an OpenAI-compatible gateway, and a gateway may
normalise the response into the nested form the base class already handles correctly. If
this code overwrote that, it would break the case that was working — the classic shape of
a fix that trades one bug for another.

So the rule is: only fill a gap, never replace a value.

## Three: the usage doesn't arrive where you'd look for it

This is the one you cannot reason your way to. You have to stream a real response.

![A streamed reply arrives as content chunks that each carry a choices entry, then a final chunk carrying usage with an empty choices list.](/blog/deepseek-streaming-chunks.svg)

The streaming converter already had a branch for handling a chunk's content:

```python
if (choices := chunk.get("choices")) and generation_chunk:
```

Every sensible instinct says put the cache mapping in there. It's where chunk handling
lives, it's already guarded, it reads cleanly.

It would also never run. DeepSeek sends token usage in a **trailing chunk with an empty
`choices` list**, so that branch is skipped for precisely the one chunk that carries the
numbers. The mapping has to sit above the check:

```python
# Usage arrives in a trailing chunk that carries no choices, so this
# cannot be folded into the choices branch below.
if generation_chunk:
    cache_hit_tokens = _get_prompt_cache_hit_tokens(chunk)
    if cache_hit_tokens is not None:
        _add_cache_read_tokens(generation_chunk.message, cache_hit_tokens)
```

If you only fix the non-streaming path, your tests pass, your manual check works, and
every streaming user still sees nothing. That is the difference between patching the happy
path and fixing the bug.

![Before the fix, cache_read was absent from usage metadata. After, ChatDeepSeek reads the top-level field in both the streaming and non-streaming paths and defers to any cache_read already set.](/blog/deepseek-cache-fix-flow.svg)

## What the tests had to pin down

Eight tests in `libs/partners/deepseek/tests/unit_tests/test_chat_models.py`, and the
interesting ones are not the happy path:

- A **full cache miss reports `cache_read: 0`**, not an absent key. Zero savings is a
  finding; a missing key is ambiguous.
- `cache_creation` is asserted **absent**, so nobody later "improves" this by mapping
  misses.
- A response with no DeepSeek cache fields is **unaffected** — plain OpenAI still works.
- A nested `cached_tokens` from a gateway **wins**.
- The trailing usage-only chunk maps, usage-alongside-content maps, and an ordinary
  content chunk carries **no** usage metadata at all.

Those last three exist only because of the streaming discovery. A test suite that reads
like the happy path is a suite that will let this bug back in.

## What this does not solve

- **Only hits are reported.** `prompt_cache_miss_tokens` is deliberately dropped rather
  than mapped, so if you want the hit rate you compute it from `input_tokens` yourself.
- **DeepSeek-specific.** Any other OpenAI-compatible provider that invents its own usage
  fields has the same class of bug and needs the same treatment in its own integration.
- **It doesn't price anything.** You get token counts, not money. Rates change and belong
  in your own billing layer.
- **Merged, not yet released.** It landed on `master`; it ships in the next
  `langchain-deepseek` release.

## The pattern underneath

I've now written three posts about bugs that raised nothing. A
[filter returning points it shouldn't](/blog/finding-a-filter-bug-in-qdrant-client). A
[model scoring exactly 0.500 because a dtype quietly changed](/blog/the-biggest-cause-of-flight-delays).
And this: a number that was correct at the source, never read, and never missed.

They share a shape. An inherited implementation makes a reasonable assumption about the
data it will be handed. A specific provider breaks that assumption in a way that is
perfectly legal. Nothing crashes, because nothing is malformed — a field is simply not
where the reader looked.

Inheritance is what makes it likely. `ChatDeepSeek` gets an enormous amount for free from
`BaseChatOpenAI`, and one of the things it inherits is an assumption about response shape
that nobody restated when DeepSeek's differences were documented.

## Run this on your own integration today

1. Print `usage_metadata` from one real call to every provider you use. Not the token
   totals — the whole dict.
2. Check `input_token_details` is actually populated. An empty dict where you expect
   cache numbers is this bug.
3. Do it again with `stream=True`. Streaming and non-streaming usage parsing are separate
   code paths and they diverge quietly.
4. Compare your provider's usage docs against the base class your integration inherits
   from. Any field the provider adds beyond the base schema is a field nobody is reading.
5. If a cost metric has been flat since you shipped it, suspect the reporting before you
   congratulate the cache.

The fix is in
[langchain-ai/langchain#39668](https://github.com/langchain-ai/langchain/pull/39668),
against issue #39637, with the diff and all eight tests public.
