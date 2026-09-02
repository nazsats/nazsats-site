---
title: "A Filter That Removes Itself"
description: "qdrant-client's local mode accepted a min_should min_count of zero and returned every point in the collection. The server refuses the same query outright. Third fix merged into the library — and the third one found the same way."
date: "2026-09-02"
author: "Nazsats"
tags: ["Open Source", "Python", "Vector Databases", "Qdrant", "Testing"]
published: false
---

A filter is supposed to narrow a result set. This one widened it to everything, and told
nobody.

`min_should` in Qdrant lets you say "at least N of these conditions must hold". Set
`min_count` to zero in local mode and you get the entire collection back. Not an error, not
an empty result — every point you have.

The server rejects the same query with a 422.

[PR #1369](https://github.com/qdrant/qdrant-client/pull/1369) is merged. It is the third
fix of mine in `qdrant-client`, and all three were found the same way.

## The two-line reproduction

```python
from qdrant_client import QdrantClient, models

client = QdrantClient(":memory:")
client.create_collection(
    "t", vectors_config=models.VectorParams(size=2, distance=models.Distance.COSINE)
)
client.upsert("t", points=[
    models.PointStruct(id=i, vector=[0.1 * i, 0.1 * i], payload={"a": i})
    for i in range(1, 6)
], wait=True)

flt = models.Filter(
    min_should=models.MinShould(
        conditions=[models.FieldCondition(key="a", match=models.MatchValue(value=1))],
        min_count=0,
    )
)

records, _ = client.scroll("t", scroll_filter=flt, limit=10)
print([r.id for r in records])
# local mode  -> [1, 2, 3, 4, 5]
# server      -> 422 Unprocessable Entity
```

One point matches the condition. Local mode returns five.

## Only the bottom of the range diverges

I ran the same filter against Qdrant 1.19.0 in Docker across a range of `min_count` values,
two conditions, three points.

![A comparison of how local mode and a real Qdrant server handle min_count values from minus two to three. For minus two, minus one and zero the server rejects the request with 400 or 422 while local mode returns every point in the collection. For one, two and three both behave correctly.](/blog/minshould-divergence.svg)

At one and above, the two agree exactly. Below one they diverge completely, and in opposite
directions: the server refuses to answer, local mode answers with everything.

That shape matters. A bug that fires on every input gets caught on the first run. A bug
that only fires on an edge nobody tests survives for years, because the middle of the range
behaves perfectly and gives you every reason to trust it.

## The cause is one comparison

From `qdrant_client/local/payload_filters.py`:

```python
def check_min_should(conditions, payload, point_id, vectors, min_count) -> bool:
    return (
        sum(check_condition(c, payload, point_id, vectors) for c in conditions)
        >= min_count
    )
```

That is a correct implementation of "at least N matched" for any sensible N. The problem is
not the comparison; it is that nothing upstream ever asked whether N was sensible.

With `min_count` at zero, `sum(...) >= 0` is true for every point in the collection,
including points where not a single condition matched. The filter evaluates successfully
and selects everything. There is no error path because, as far as the code is concerned,
nothing went wrong.

## Why "returns everything" is the worst possible failure

If local mode had thrown, you would fix it in the minute you wrote it.

If local mode had returned nothing, you would notice immediately — an empty page is loud.

Returning everything is quiet. Your tests pass because the points you expected are in the
result; they are simply accompanied by every other point. A search page looks populated. A
RAG retrieval returns context. A permissions filter that was meant to scope results to one
tenant returns all tenants, and the response still looks like a normal response.

Local mode is what people develop against. It is the fast one, the one with no Docker
container, the one in CI. So the failure mode is: written locally, passes locally, passes
review, reaches production, and there hits a server that refuses the query outright. The
best case is a 422 on deploy day. The worse case is that the same silent widening exists in
some other client path nobody has compared yet.

This is the same class as #1349, where local mode accepted datetime strings the server
rejects. Two independent instances of the same underlying gap: local mode implements the
happy path faithfully and validates nothing.

## The fix goes before the scan, not inside it

The obvious patch is a guard inside `check_min_should`. It is also the wrong place — that
function runs once per point, so a collection of a million points would perform the same
check a million times to answer a question about the query.

Validation belongs where the query is accepted, not where each point is tested.

![Two paths through the local filter code. Before the fix, a filter went straight into the point scan, where a min_count of zero made the comparison trivially true and every point matched. After the fix, a validate_filter step runs once before the scan and raises a ValueError for an invalid min_count, so the query fails immediately instead of returning everything.](/blog/minshould-validation-flow.svg)

So the fix is a `validate_filter()` helper in `payload_filters.py`, called once from
`calculate_payload_mask` before the scan begins. It recurses into nested filters, because a
bad `min_count` buried inside a nested `must` clause is exactly as invalid as one at the
top level and considerably easier to miss.

The error matches the shape of the limit validation already in `qdrant_local.py`, so it
reads like the library rather than like a patch:

```
min_count value 0 is invalid. Must be 1 or larger.
```

## What I could not fix, and said so

`LocalCollection.scroll` returns early when the collection is empty, before any filter code
runs. An invalid filter against an empty collection is therefore still accepted.

Catching that case means validating in each entry point rather than in one place, which is
a larger change with more surface area, and I did not think it was mine to make
unilaterally in a first patch. It is in the PR description as a known limitation.

Saying what a fix does not cover is not a weakness in a pull request. A maintainer's first
question is always "what else does this touch", and answering it before it is asked is
faster for both of you.

## The method, for the third time

I did not read the source looking for this. All three merged fixes came from the same
approach, which I have written about [before](/blog/ask-the-same-question-twice):

Find a library with two implementations that are supposed to agree — local mode against a
real server, in-memory against Postgres, `invoke` against `ainvoke`. Write thirty small
probes aimed at the edges rather than the middle: zero, negative, empty list, empty string,
contradictory range, limit of a million. Run both sides. Print a table. Read the rows where
the two disagree.

The convenience implementation is the one nobody runs in production, so it is the least
exercised and holds the most bugs. Every one of the three qdrant fixes lives in local mode.

The step people skip is verifying the harness before believing it. I have had a probe
report three bugs that were all defects in my own test rig, and a day spent chasing them
teaches you to prove the harness right on a case with a known answer before trusting it on
one without.

## What this does not solve

- Empty collections still accept an invalid filter, as above.
- Only `min_count` is validated. Other filter values may have the same gap; I checked this
  one because a probe flagged it, not because I audited the filter surface.
- This is a client-side fix. It makes local mode agree with the server; it does not change
  what the server does.
- Local mode and the server can still diverge in ways nobody has compared. Two found so far
  in this area is not evidence there are only two.

## Try this on a library you depend on today

1. Pick a library where you use a convenience mode — in-memory, local, Lite, a fake.
2. Write down what the "real" implementation is. If there isn't one, this method does not
   apply and you need a different approach.
3. Write twenty probes at the edges: zero, negative, empty, one-past-the-end, contradictory.
   Not the middle of the range — the middle is what the tests already cover.
4. Run both sides and print a table. Do not eyeball it; diff it.
5. Before you believe a disagreement, feed the harness a case whose answer you already know
   and confirm it reports that correctly.
6. When you file it, lead with the reproduction and state what your fix does not cover.

Three merged fixes in this library so far: [#1293](https://github.com/qdrant/qdrant-client/pull/1293)
(shipped in v1.19.0), [#1333](https://github.com/qdrant/qdrant-client/pull/1333), and
[#1369](https://github.com/qdrant/qdrant-client/pull/1369). The probes are public at
[github.com/nazsats](https://github.com/nazsats).
