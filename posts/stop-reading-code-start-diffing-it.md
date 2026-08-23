---
title: "Finding Bugs in the AI Libraries Everyone Builds On"
description: "Four fixes into LangChain, Qdrant and Milvus — found not by reading code, but by making two implementations answer the same question and watching them disagree. The method, the mistakes, and why it matters that these libraries are correct."
date: "2026-08-23"
author: "Nazsats"
tags: ["Open Source", "Python", "AI", "Testing", "Debugging"]
published: true
---

Every AI product built this year sits on a short stack of libraries. LangChain
routes the calls. Qdrant, Milvus or Chroma hold the vectors. LangGraph keeps the
state. Almost nobody writing an AI feature has read the code underneath it —
they read the docs and trust the rest.

That trust is mostly earned. But these libraries are young, they are moving
fast, and the parts nobody exercises are quietly wrong in ways that only surface
in production.

I have been finding those parts. Four fixes so far — LangChain, Qdrant twice,
and an open one in Milvus — and this post is about the method, because the
method turned out to matter more than any individual bug.

## The shortcut that does not scale

My first three came from reading source until something looked wrong. It works.
It is also slow, and it only covers the corner of a library you happen to be
using that week.

Then I tried something almost embarrassingly simple:

> Find two implementations that are supposed to agree. Ask them the same
> question. Print both answers side by side.

Where they differ, one of them is wrong. You do not need to know which — that is
the maintainer's call — and you do not need to understand the internals first.
You only need the answers to differ.

That found a reportable bug in about an hour.

## Which libraries this works on

Not all of them. The ones that suit it share a shape: **a reference
implementation and a convenience implementation.**

- **Qdrant** ships local mode, a Python reimplementation of the server's
  filtering so you can develop without running the database.
- **Milvus** ships Milvus Lite, a local file-based build of the same engine.
- **LangGraph** ships four checkpoint savers — memory, SQLite, Postgres — plus a
  conformance suite that exists precisely because they must agree.

In every case the convenience version is the one nobody runs in production.
Which makes it the least exercised. Which makes it where the bugs are.

## The script

Under 200 lines. Seed both sides with identical data, run the same probes
through each, print a table, flag the rows that differ.

```
probe                        Milvus Lite       Milvus server
-------------------------------------------------------------
filter_all                   [1,2,3,4,5]       [1,2,3,4,5]
filter_empty_string          [3]               [3]
filter_like_prefix           [1,5]             [1,5]
filter_like_empty            [3]               [1,2,3,4,5]   <<<
limit_zero                   [1]               MilvusException  <<<
```

The probes are not clever either. They are the corners: empty strings, zero,
negative numbers, missing fields, empty lists, contradictory ranges, limits of
`0` and `-1` and a million. Normal test suites cover the middle of the range,
because that is what users do. The edges are where two implementations quietly
drift apart.

## What it found

**Qdrant.** Local mode accepted a `min_should` count of zero and returned the
entire collection. The server rejects it outright — 422 for zero, 400 for
negatives. So a filter that returns nothing in production returns *everything*
in development, which for a filter is the worst possible direction to be wrong
in. That became
[issue #1368 and PR #1369](https://github.com/qdrant/qdrant-client/pull/1369).

**Milvus.** `s like ""` returns one row on Milvus Lite and every row on a real
server. Every other pattern agrees exactly — `al%`, `%`, `%a`, and `== ""` all
match. Only the empty pattern diverges, and neither side raises an error. You
write the query locally, get one row, ship it, and production hands back the
collection.
[Issue #52780](https://github.com/milvus-io/milvus/issues/52780), now triaged.

**LangGraph.** Three checkpoint savers gave three different answers to
`list(limit=-1)`: memory returns nothing, SQLite returns everything, Postgres
raises `InvalidRowCountInLimitClause`. I had already reported the first two by
reading code. The differ found the third in a single run.

## The half that usually goes unwritten

Three times in one day the script reported a divergence that was **my bug, not
the library's**:

- The LangGraph run showed SQLite failing every probe. My saver factory was a
  generator; exhausting it collected the frame, which collected the context
  managers, which closed the connection.
- Postgres reported fifteen checkpoints where the others had five. It persists
  between runs and I was reusing a thread id.
- Milvus reported ten divergences on the first pass. Milvus is eventually
  consistent — I was querying immediately after inserting, so the server was
  genuinely still empty.

Every one of those looked exactly like a finding. Filing the first would have
wasted a maintainer's afternoon and taught them my reports need checking.

So the harness now asserts its own setup before comparing anything — the Milvus
version fails loudly if all five rows are not visible on both sides.
**A differential test is only as trustworthy as its seeding**, and that failure
mode is both silent and flattering: it hands you findings that look real.

## Two filters worth having

**Check who is already there.** I built a complete, Docker-verified fix for a
Qdrant datetime bug before noticing two other people had open PRs for it.
Thirty seconds on the tracker would have saved an hour. The issue list on a
popular repo is picked clean within days — which is the whole argument for
building a harness instead of shopping the list.

**Check the bug is reachable.** I found a real inconsistency in LiteLLM's cost
calculation: negative completion tokens produce a negative cost, while negative
prompt tokens are clamped. Clean asymmetry, one-line fix. Then their bug
template asked for end-to-end proof against a live proxy hitting a real
provider, and I could not produce it — because no provider returns a negative
token count, and every internal path that could already clamps.

The bug is real. It is also unreachable, which is not the same thing.

> A differential finding is worth reporting when **both sides are reachable by a
> real user**. Local mode versus server passes that. `cost_per_token(-100)` does
> not.

## Why bother

Two reasons, and neither is a portfolio.

The first is that I use these libraries. Qdrant local mode is what I develop
against; if it disagrees with the server, that is my production bug waiting to
happen. Fixing it upstream fixes it for me permanently, instead of me carrying a
workaround forever.

The second is that this layer is becoming infrastructure. A filter that silently
matches everything, in a library thousands of teams have pip-installed, is a
data-exposure bug in every one of those products at once. Somebody should be
poking at the edges. It may as well be the people using it.

That is the whole of it — not charity, not résumé-building. **Use the thing,
find where it breaks, send the fix back.** The libraries get better, and you end
up understanding your own stack far better than the docs would ever teach you.

## If you want to try it

Pick a library you actually use that has a local mode. Write thirty probes aimed
at the edges. Run both. Print the table.

Then, before believing a single row: break the harness on purpose and check it
still says what you expect. Mine lied to me three times before it told the
truth.

The scripts are on [GitHub](https://github.com/nazsats) if you want a starting
point.
