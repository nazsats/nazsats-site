---
title: "Two Values, Half a Range Each: A Filter Bug in qdrant-client"
description: "A point came back from a filter it had no business matching. The cause was a pair of inverted quantifiers that only one shape of payload could ever reveal — and a one-expression fix."
date: "2026-07-29"
author: "Nazsats"
tags: ["Open Source", "Python", "Debugging", "Vector Databases"]
published: true
---

I've been spending my evenings doing something more useful than doomscrolling: reading
the source of libraries I actually use, looking for places where the code quietly
disagrees with itself.

This week that turned into a bug report and a fix in
[`qdrant-client`](https://github.com/qdrant/qdrant-client), the official Python client for
the Qdrant vector database.

## Why local mode is a good place to hunt

`qdrant-client` ships with a local mode. Instead of talking to a server, it runs an
in-memory implementation of the same API so you can write tests and prototypes without
spinning up a database:

```python
client = QdrantClient(":memory:")
```

The promise is parity: local mode should behave exactly like the real server. That promise
is what makes it a great hunting ground. You never have to argue about whether something
is a bug — there are two implementations of one spec, and **any observable difference
between them is by definition a bug**. You just have to find a query where they disagree.

So I started reading the local filter code with one question in mind: *where would a
reimplementation of this logic drift from the original?*

## The bug

Qdrant has a `values_count` filter that matches points by *how many values* a payload
field holds — "give me documents where the `tags` array has more than 2 and fewer than 9
entries."

The interesting case is a wildcard path. Given this payload:

```python
{"nested": [{"field": [1]}, {"field": list(range(10))}]}
```

the key `nested[].field` doesn't resolve to one value. It resolves to two, with counts
`[1, 10]`.

Now filter with `values_count=ValuesCount(gt=2, lt=9)`.

![Number line showing the allowed range between 2 and 9, with the counts 1 and 10 both falling outside it](/blog/qdrant-values-count-range.svg)

*Neither count is inside the range. 1 is below it, 10 is above it.*

| | Verdict | Why |
|---|---|---|
| **Server** | No match | All four bounds are checked against a single count |
| **Local mode** | **Match** | Returned the point anyway |

## Why the old code let it through

Here's the original `check_values_count` in `qdrant_client/local/payload_filters.py`:

```python
counts = get_value_counts(values)

if condition.lt is not None and all(count >= condition.lt for count in counts):
    return False
if condition.lte is not None and all(count > condition.lte for count in counts):
    return False
if condition.gt is not None and all(count <= condition.gt for count in counts):
    return False
if condition.gte is not None and all(count < condition.gte for count in counts):
    return False
return True
```

Read it as four independent vetoes. Each bound gets its own pass over *all* the counts,
and it can only veto if **every** count violates it.

Walk `counts = [1, 10]` through `gt=2, lt=9`:

| Bound | The veto asks | Answer |
|---|---|---|
| `lt=9` | is every count `>= 9`? | No — 1 isn't. No veto. |
| `gt=2` | is every count `<= 2`? | No — 10 isn't. No veto. |

Nothing vetoes, so the function returns `True`.

But look at *which* value saved each bound: the count of 1 defeated the upper-bound veto,
and the count of 10 defeated the lower-bound veto. Two different values each satisfied
half the range, and the point matched a range that neither of them is actually in.

The server does the opposite — it ANDs all four bounds against a single count, then asks
whether *any* count passes. The quantifiers were inverted: an `any(all(...))` had been
flattened into a chain of `all(...)`s.

This is also exactly the kind of bug that survives a test suite. With a single top-level
key like `tags` there's only ever one count, and with one element `any(all(...))` and the
veto chain give identical answers. Every existing test used single-value paths, so the bug
was unreachable until a path produced two counts.

## The fix

One expression, and it reads like the sentence the docs describe:

```python
# A single value's count must satisfy every bound at once, and the condition
# matches if any one value does. Checking each bound independently across all
# counts would let separate values satisfy separate bounds.
return any(
    (condition.lt is None or count < condition.lt)
    and (condition.lte is None or count <= condition.lte)
    and (condition.gt is None or count > condition.gt)
    and (condition.gte is None or count >= condition.gte)
    for count in counts
)
```

Bounds AND together against one count; counts OR together across the point. It matches the
server's `ValuesCount::check_count`, and it's shorter than what it replaced.

One detail worth checking before shipping a change from `all` to `any`: `any([])` is
`False`, so an empty `counts` would flip the answer for every empty payload. It can't
happen here — `get_value_counts` returns `[0]` rather than `[]` when there are no values —
but that's the sort of thing you confirm rather than assume.

## Proving it

A fix to a parity bug should be tested against the thing it's supposed to have parity
with. `qdrant-client` has a `congruence_tests` suite for exactly this: run the same query
against local mode and a real server, assert identical results.

So the regression test builds three points with counts of `[1, 10]`, `[3]` and `[1, 2]`,
runs three overlapping range filters through both clients, and compares:

```python
compare_client_results(
    local_client,
    remote_client,
    lambda c, f=flt: c.scroll(
        COLLECTION_NAME, scroll_filter=f, limit=100, with_payload=False
    ),
)
```

The point with counts `[1, 10]` is the trap — it's the one that used to come back. The
other two are there so the test can't pass by having the filter match nothing at all.

Final diff: **+74 / −9 across 2 files.**

- Issue: [qdrant/qdrant-client#1292](https://github.com/qdrant/qdrant-client/issues/1292)
- Pull request: [qdrant/qdrant-client#1293](https://github.com/qdrant/qdrant-client/pull/1293)

## What I took away from it

**Look for redundancy, not for mistakes.** Nobody finds bugs by reading code hoping to
spot something wrong. You find them by locating a place where the same behaviour is
specified twice — a client and a server, a cache and its source, a fast path and a slow
path — and then hunting for the input where the two copies diverge.

**Quantifiers are where logic bugs live.** "All of these, for any of those" is easy to say
and easy to implement backwards, and the mistake is invisible whenever the collection has
exactly one element. Any time you see `all(...)` over a collection that's *usually* a
singleton, there's a bug waiting for the day it isn't.

**File the issue first.** Writing #1292 forced me to state the wrong behaviour as a
reproducible example before I touched the code. It made the PR easier to write, and it
means the finding stands on its own even if a maintainer prefers a different fix than
mine.

## Next up

I'm running the same playbook on [LlamaIndex](https://github.com/run-llama/llama_index) —
big surface area, and plenty of places where the same behaviour is implemented twice
across integrations. Notes to follow.
