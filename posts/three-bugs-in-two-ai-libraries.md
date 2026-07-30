---
title: "Three Bugs in Two AI Libraries, and the Method That Found Them"
description: "I spent a week reading the source of libraries I use every day. It turned into three bug reports and a fix, across qdrant-client and LlamaIndex — all found the same way."
date: "2026-07-30"
author: "Nazsats"
tags: ["Open Source", "Python", "Debugging", "AI"]
published: true
---

I've been spending my evenings reading the source of libraries I actually use — not looking
for mistakes, but looking for places where the same rule is written down twice.

In about a week that turned into three bug reports and one fix, across two libraries that a
very large number of AI applications depend on:
[qdrant-client](https://github.com/qdrant/qdrant-client) and
[LlamaIndex](https://github.com/run-llama/llama_index).

None of them were found by being clever. All three came from the same method.

## The method

![Three steps: find a duplicate, hunt the edge case, watch them disagree](/blog/oss-playbook.svg)

*You don't read code hoping to notice something wrong. You look for a rule written twice.*

The trick is that you never have to argue about whether something is a bug. If a rule is
implemented in two places — a client and a server, two sibling functions, a fast path and a
slow path — then **any input where they disagree is a bug by definition**. One of them is
wrong. You just have to find the input that separates them.

And the input is almost always the same shape: **zero instead of one. Two instead of one.
Empty instead of full.** The case a developer never typed while writing the happy path.

Here's how that played out three times.

---

## 1. A point that matched a range none of its values were in

**Where:** `qdrant-client`, the official Python client for the Qdrant vector database.

**The duplicate:** the client ships a "local mode" — an in-memory implementation of the whole
API so you can test without running a server. Two implementations, one spec.

Qdrant's `values_count` filter matches points by *how many values* a field holds. Give it a
wildcard path, and one point can produce several counts — say `[1, 10]`. Now filter for
"more than 2, fewer than 9."

Neither count is in that range. The server said no match. Local mode returned the point.

The old code checked each bound separately across all counts, and a bound could only reject
the point if *every* count violated it:

```python
if condition.lt is not None and all(count >= condition.lt for count in counts):
    return False
if condition.gt is not None and all(count <= condition.gt for count in counts):
    return False
```

Walk `[1, 10]` through it. Is every count ≥ 9? No — 1 isn't, so no rejection. Is every count
≤ 2? No — 10 isn't, so no rejection. Nothing rejects, so it matches.

Look at *which* value saved each bound: the 1 defeated the upper bound, the 10 defeated the
lower one. Two different values each satisfied half a range, and the point matched a range
neither of them was in. The quantifiers were inverted — an `any(all(...))` had been flattened
into a chain of `all(...)`s.

The fix is one expression, and it reads like the sentence the docs describe:

```python
return any(
    (condition.lt is None or count < condition.lt)
    and (condition.lte is None or count <= condition.lte)
    and (condition.gt is None or count > condition.gt)
    and (condition.gte is None or count >= condition.gte)
    for count in counts
)
```

Bounds AND together against one count; counts OR together across the point.

**Why no test caught it:** with a single-value field there's only ever *one* count, and at one
element the broken version and the correct one return identical answers. Every existing test
used single-value paths.

→ [Issue #1292](https://github.com/qdrant/qdrant-client/issues/1292) ·
[PR #1293](https://github.com/qdrant/qdrant-client/pull/1293) (+74 / −9) ·
[full write-up](/blog/finding-a-filter-bug-in-qdrant-client)

---

## 2. Asking for zero results gave me everything

**Where:** LlamaIndex, `embedding_utils.py`.

**The duplicate:** three sibling functions implement the same contract —
`get_top_k_embeddings`, `get_top_k_mmr_embeddings`, and `get_top_k_embeddings_learner`.

The first two treat `similarity_top_k` as a truthy value:

```python
if similarity_top_k and len(similarity_heap) > similarity_top_k:
similarity_top_k_count = similarity_top_k or embedding_length
```

`None` means "no limit." And in Python, `0` is falsy too — so the two are indistinguishable.

![Zero is falsy, so it takes the same branch as None and returns everything](/blog/oss-falsy-zero.svg)

*One value means "unset." The other means "none." `or` cannot tell them apart.*

Five nodes in a store, ask for `similarity_top_k=0`, get five results back:

```python
q = VectorStoreQuery(query_embedding=[1.0, 0.0], similarity_top_k=0)
print(len(vs.query(q).ids))   # expected 0, actual 5
```

The exact opposite of what was requested — and quietly, with no error.

The third sibling, `get_top_k_embeddings_learner`, uses `sorted_ix[:similarity_top_k]`, which
handles `0` correctly. So the three functions disagree with each other on the same contract.
That disagreement *is* the bug report; I didn't need anyone to tell me which behaviour was
intended.

Better still, this exact class of bug had already been fixed in the same file — for
`mmr_threshold`, where `mmr_threshold or 0.5` was discarding an explicit `0`. There's even a
test named for it. The lesson had been learned in one place and not carried to its neighbours.

→ [Issue #22508](https://github.com/run-llama/llama_index/issues/22508)

---

## 3. A progress bar that changed which error you got

**Where:** LlamaIndex, `async_utils.py`.

**The duplicate:** one function, two code paths — with the progress bar, and without it.
Those two paths should differ in exactly one way: whether a bar appears.

`run_async_tasks` wraps the tqdm path in `except Exception: pass`. The intent, judging by the
comment, is a compatibility check: fall back if `tqdm.asyncio` isn't available. But the `try`
also covers *running the tasks*.

![The try block was meant to cover a compatibility check but also covers task execution](/blog/oss-swallowed-error.svg)

*Turning on a progress bar changed which exception you got. That should never happen.*

So when a task raises, the exception is swallowed. Then the fallback path re-awaits the
coroutines — except they've already been consumed — and you get a completely unrelated error:

```python
async def ok():   return 1
async def fail(): raise ValueError("ORIGINAL task failure")

run_async_tasks([ok(), fail()], show_progress=False)  # ValueError: ORIGINAL task failure
run_async_tasks([ok(), fail()], show_progress=True)   # RuntimeError: Detected nested async...
```

Toggling `show_progress` is the only difference between those two calls.

The replacement error is worse than useless: it tells you to call `nest_asyncio.apply()`,
which `run_async_tasks` already called a few lines earlier. So you go debugging your event
loop while the real `ValueError` — which appears **nowhere** in the traceback — sits
unmentioned.

That's the part that makes this worth reporting. A crash costs you minutes. A crash with a
convincing, wrong explanation costs you an afternoon.

→ [Issue #22493](https://github.com/run-llama/llama_index/issues/22493)

---

## What the three have in common

| Bug | The duplicate | The input nobody tried |
|---|---|---|
| qdrant `values_count` | local mode vs. real server | a path yielding **two** counts, not one |
| `similarity_top_k` | three sibling functions | **zero**, not a positive number |
| `run_async_tasks` | progress path vs. plain path | a task that **fails** |

Every one of them is invisible on the happy path. One count, a positive limit, tasks that
succeed — and all three implementations look perfectly correct.

Three habits fall out of this, and I now apply them to my own code:

**`all(...)` over a usually-singleton collection is a bug waiting for the day it isn't.**
"All of these, for any of those" is easy to say and easy to implement backwards, and at one
element the correct and incorrect versions agree.

**`x or default` silently rejects every falsy value you meant to allow** — `0`, `""`, `False`,
empty list. If `None` and `0` mean different things, you need `if x is None`.

**A `try` should wrap the smallest thing that can fail.** If it covers the check *and* the
work, it will one day swallow the work's error and blame the check.

## Do this yourself

You already have everything you need: a library you use often, and enough context to know
what it's supposed to do. That second part is the hard-to-get half, and using the thing daily
gives it to you for free.

Start where behaviour is specified twice. In-memory or "local" modes are the richest seam I've
found — they exist precisely to mimic something else, so any divergence is a defect with no
argument attached. Sibling functions sharing a contract are the next best.

And **file the issue before you write the fix.** Writing the report forces you to state the
wrong behaviour as a reproducible example before you've touched anything, which makes the PR
easier to write. It also means the finding stands on its own if a maintainer prefers a
different fix than yours.

You don't need to be the smartest person reading a codebase. You need to be the one who tried
`0`.

---

*All three reports are public: [qdrant-client #1292](https://github.com/qdrant/qdrant-client/issues/1292)
and [#1293](https://github.com/qdrant/qdrant-client/pull/1293),
[llama_index #22493](https://github.com/run-llama/llama_index/issues/22493)
and [#22508](https://github.com/run-llama/llama_index/issues/22508).
More of what I build is at [nazsats.com](https://nazsats.com).*
