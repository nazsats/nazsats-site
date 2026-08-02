---
title: "RAG Can't Count"
description: "I added retrieval to my AI real-estate assistant — for one tool out of four. The other three are SQL, because a vector search asked for a median will confidently average 0.4% of your data and never mention it."
date: "2026-08-02"
author: "Nazsats"
tags: ["AI", "RAG", "Architecture", "Postgres", "Claude"]
published: true
---

Every "add knowledge to your LLM" tutorial ends the same way: chunk your documents, embed
them, stuff the top-k results into the prompt. RAG has become the reflex answer to a
question most people stop examining.

I've been building [an AI assistant for Dubai real-estate agents](/blog/building-an-ai-broker-for-dubai-real-estate) —
a broker asks a question in plain English, and Claude answers it against real data. It
needed knowledge. So I reached for the reflex, and then stopped, because for most of what
brokers actually ask, retrieval is the wrong mechanism.

Four tools ended up in the final design. Exactly one of them is RAG.

| Tool | Backed by | Answers |
|---|---|---|
| `search_properties` | SQL over inventory | "3 bed in Dubai Marina under 5M with a pool" |
| `market_check` | SQL aggregate over transactions | "What's a 2-bed in JVC actually going for?" |
| `find_comparables` | SQL, nearest by area/beds/size | "Justify this asking price to my buyer" |
| `knowledge_lookup` | **RAG** — pgvector + embeddings | "What are the transfer costs for a non-resident?" |

The reasoning behind that split is the most useful thing I've learned on this project.

## The failure mode nobody demos

Picture a table of land-department sales records. Say five thousand rows, each one a real
transaction: area, building, size, price, date.

A broker asks: **"What's the median price per square foot for a 2-bed in JVC?"**

Now run that through a RAG pipeline. The question gets embedded. The vector store returns
the twenty chunks whose embeddings sit closest to it. Those twenty rows go into the prompt.
The model reads them, averages them, and answers:

> "Based on recent transactions, 2-bedroom apartments in JVC are averaging around
> AED 1,180 per square foot."

Fluent. Specific. Formatted like an answer. And computed from **0.4% of the data**,
selected by semantic similarity rather than by anything resembling a statistical criterion.

The model isn't lying. It genuinely doesn't know that 4,980 rows exist which it never saw.
Nothing in the tool result says "this is a sample." There's no confidence interval, no row
count, no hedge — because retrieval returns *documents*, and the model's job is to read
documents.

This is the part that changed the design: **the failure is silent.** A broken SQL query
throws. A timeout throws. This returns a plausible number, in a confident sentence, to
someone who is about to repeat it to a client.

Silent and confident is the worst failure mode a system can have.

## It's not just averages

Once I started looking, the same crack ran through everything numeric.

**Filters become vibes.** "Under 2 million" is a `WHERE price < 2000000`. In embedding
space it's a direction — semantically near "affordable", "budget", "1.9M", and also near
"just over 2 million", which is exactly what it must exclude. You cannot express a boundary
as a similarity score.

**Counting is meaningless.** "How many 3-beds sold in Business Bay last quarter?" The honest
answer from a top-k retriever is "at least as many as I retrieved," which is not an answer.

**Recency is a coin flip.** "The last six months" has no embedding. A transaction from 2019
and one from last week are equally retrievable if the text around them reads similarly.

Every one of these is trivially, exactly correct in SQL — a language designed in the 1970s
specifically to answer aggregate questions over tabular data. Reaching past it for vector
search isn't sophistication. It's using the wrong tool because it's the tool everyone is
talking about.

## What I built instead

Market questions run as deterministic SQL over **every** matching row:

```python
async def market_stats(session, *, area=None, property_type=None, rooms=None, months=12):
    """Aggregate real transactions for a slice of the market.

    Returns headline stats plus a month-by-month series, so trend direction is
    computed from the data rather than inferred by the model.
    """
```

Two details worth calling out.

**Median, not mean.** One Palm Jumeirah villa in the sample drags the average across an
entire community and produces a number that describes nothing. The median survives
outliers; in a market with a 100× price range between communities, that isn't a refinement,
it's a requirement.

**Trend from thirds, not adjacent months.** Comparing this month to last month on a thin
sample measures noise. I compare the first third of the window to the last third, so
"prices are up 6%" reflects a direction rather than which weekend happened to have a big
closing.

The model never computes any of this. It receives finished numbers and explains them. That
division — **the database computes, the model communicates** — is the actual architecture,
and RAG has no role in it.

## Where retrieval genuinely earns its place

None of the above is an argument against RAG. It's an argument for knowing what RAG is
*for*.

My fourth tool answers questions like "what are the transfer costs for a non-resident
buyer?" Here everything inverts:

- The answers are **prose**, not numbers. Nothing to aggregate.
- The corpus is **small and stable** — regulations, fee structures, process guides.
- The signal genuinely is **semantic**. Someone asking about "transfer costs" needs a
  document that says "DLD registration fee." No keyword is shared. No `LIKE` clause finds
  it. Embeddings find it easily.

That's the shape of problem retrieval was built for, and on that surface it works
beautifully. One tool. Not four.

I added one more guard. When the knowledge base is unreachable, the tool returns a message
that explicitly forbids answering from memory. An earlier version, on failure, cheerfully
volunteered: *"However, I know the standard fee structure is…"* — which is precisely the
behaviour a grounded system exists to prevent. A retrieval failure has to fail loudly, or
the grounding was decorative.

## The same lesson, somewhere else entirely

Prompt caching gave me the identical experience in a different costume.

The pitch is compelling: cache your system prompt and tool definitions, pay a fraction on
every subsequent call. I built it in. Then I measured before switching it on.

My cacheable prefix — system prompt plus four tool definitions — came to roughly **1,300
tokens**. The model I run requires **4,096** before a cache write is permitted. Caching
wasn't going to activate at all. Had I shipped it on assumption, I'd have paid the
cache-write premium for a cache that never formed, and reported it internally as an
optimisation.

Measuring turned up something more useful, too: for a typical request in this app, **output
is 51–92% of the total cost**. Caching only ever touches input. Even working perfectly, it
was never the lever it appeared to be.

The code now checks the model's minimum and refuses to mark a prefix that won't cache. It
switches on by itself if the prompt grows past the threshold, or if I move to a model with
a lower one. The plumbing is right; the claim is honest.

## The principle

Both decisions came from the same question, asked early enough to matter:

> **What does this technique do when it's wrong, and would I notice?**

RAG over transaction data is wrong quietly — a confident average of an arbitrary sample.
Prompt caching below the threshold is wrong invisibly — a real cost with no effect. Neither
shows up as an error. Both show up as a system that seems to work.

The fix in both cases wasn't a cleverer technique. It was a boring one, applied where it
was correct: `GROUP BY` for aggregates, a conditional for the cache, and vector search
confined to the one surface where semantic similarity is the actual thing being asked for.

Reach for the boring tool when the boring tool is correct. It's the harder call, because
nobody writes tutorials about `GROUP BY`.

---

### Honest footnote

The transaction table in the deployed build ships **empty** — Dubai's open-data portal
requires a signed-in download, so the importer exists but the data isn't bundled. Until
it's loaded, the price-context feature falls back to current asking prices across live
listings, and **says so in the interface**: asking prices are what agents want, not what
buyers paid. The two are labelled separately and never averaged together. Mixing a fact
with an aspiration to produce one confident number would repeat the exact mistake this
whole post is about.

*Code and full architecture write-up:
[github.com/nazsats/dubai-real-estate](https://github.com/nazsats/dubai-real-estate)*
