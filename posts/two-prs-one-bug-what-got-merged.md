---
title: "Two PRs, One Bug — and Why Mine Got Merged"
description: "My first upstream fix landed in qdrant-client this week. Two days after I opened it, someone else submitted a fix for the same bug. Here's what separated them."
date: "2026-08-04"
author: "Nazsats"
tags: ["Open Source", "Python", "Career", "Debugging"]
published: true
---

On 3 August, `joein` merged [PR #1293](https://github.com/qdrant/qdrant-client/pull/1293)
into `qdrant-client`. Issue [#1292](https://github.com/qdrant/qdrant-client/issues/1292)
closed automatically thirty-six seconds later.

That's my first upstream fix in a library I actually use. +74 / −9, two files, squashed to
`962d8f4`.

The part worth writing about isn't the merge. It's that **two people submitted a fix for that
bug, and only one was merged.** That doesn't usually happen where you can see it — so it's a
rare chance to look at what actually decides these things.

![Timeline of both pull requests, and the three reasons the earlier one was merged](/blog/merged-two-prs-timeline.svg)

*Same bug, same two files. One merged, one closed.*

## What happened

I found the bug on 29 July: Qdrant's local mode matched a point against a `values_count`
range that none of its values were in. Two different values were each satisfying half the
range. [I wrote it up in detail here](/blog/finding-a-filter-bug-in-qdrant-client).

I filed the issue at 17:09 and opened the PR at 17:13 — four minutes later, because the fix
was already written by the time I understood the bug well enough to describe it.

Two days later, another contributor opened [#1301](https://github.com/qdrant/qdrant-client/pull/1301):
same bug, same two files, citing my issue number in the commit message.

On 3 August the maintainer merged mine and closed theirs.

## Three things separated them

### 1. Mine existed first

The dullest reason, and probably the biggest.

A maintainer looking at two fixes for one bug has no reason to prefer the later one unless
it's clearly better. Being there first isn't a merit — but it is a default, and defaults win
when nobody has a reason to override them.

This is the part I keep getting wrong elsewhere. On two LlamaIndex bugs I filed good reports
and then took **two days** to open the PR. Within an hour of one of those reports, two
strangers had opened their own fixes. I was third in a queue I'd started.

The lesson isn't "rush." It's that the gap between *understanding a bug* and *submitting a
fix* should be minutes, not days — because if the report is good, other people can act on it
too.

### 2. Mine was tested against the thing it was supposed to match

The bug was a **parity** bug: local mode disagreeing with the real server. So the natural test
isn't "assert this function returns 3." It's "run the same query against local mode and a real
server, and compare."

`qdrant-client` already has a suite for exactly this — `congruence_tests`. I put the
regression test there:

```python
compare_client_results(
    local_client,
    remote_client,
    lambda c, f=flt: c.scroll(
        COLLECTION_NAME, scroll_filter=f, limit=100, with_payload=False
    ),
)
```

Three points, counts of `[1, 10]`, `[3]` and `[1, 2]`, run through three overlapping range
filters. The `[1, 10]` point is the trap — it's the one that used to come back. The other two
exist so the test can't pass by matching nothing at all.

A test written in the project's own idiom, in the directory the project already keeps that
kind of test in, is a much smaller ask than a test a maintainer has to relocate.

### 3. The issue came before the pull request

By the time anyone looked at my PR, the bug had already been stated as a reproducible example
in its own thread. The review question was narrowed to *"is this the right fix?"* rather than
*"is this even broken?"*

Filing the issue first felt like extra work at the time. It turned out to be the thing that
made the PR easy to say yes to.

## What I'd tell myself a month ago

**Search pull requests, not just issues.** On one LlamaIndex bug, an open PR fixing it already
existed nine days before I filed my report. `is:pr <keyword>` takes five seconds and would
have saved me the effort.

**Ship the fix the same hour as the report.** Not because it's a race, but because a clear
report is an invitation for someone else to act.

**Write the test the project would have written.** Look at how the repo tests things like the
thing you're fixing, then do that. Novel test infrastructure is a reason to defer a merge.

**Don't take the competing PR personally.** Someone else finding your issue worth fixing is
evidence the report was good. Both of those PRs existed because the bug was worth fixing, and
neither author did anything wrong.

## Where the rest stand

Still open, and that's normal:

- [llama_index #22519](https://github.com/run-llama/llama_index/pull/22519) — `similarity_top_k=0`
  returning every embedding instead of none
- [llama_index #22520](https://github.com/run-llama/llama_index/pull/22520) — `run_async_tasks`
  swallowing task exceptions when `show_progress=True`

Both have regression tests that fail on `main`. Both have company — other contributors filed
fixes for the same bugs. On those two I was late, and I expect that to cost me.

That's fine. The point was never the merge count. It's that I now have a method that reliably
turns an evening of reading source code into something real — and one merged commit proving
the method works end to end.

If you want the method itself, it's
[here](/blog/three-bugs-in-two-ai-libraries). It's much simpler than it sounds: find a rule
written down twice, then find the input where the two copies disagree.
