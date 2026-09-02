---
title: "I Said It Wasn't Résumé-Building. I Was Wrong."
description: "Nine days ago I wrote that fixing open-source bugs was not about my CV. Four merged pull requests later, recruiters are clicking the links and strangers are extending my issues. Here is what a merged PR proves that nothing else on a CV can — and what it does not."
date: "2026-09-02"
author: "Nazsats"
tags: ["Open Source", "Career", "Debugging", "Python"]
published: true
---

Nine days ago, on this blog, I wrote that finding bugs in the libraries I depend on was
about two things — using them, and the layer becoming infrastructure — and then added:

> Two reasons, and neither is a portfolio. That is the whole of it — not charity, not
> résumé-building.

I meant it. It was also wrong, and I can now show the working.

## What actually happened

Four fixes are merged: three in `qdrant-client` and one in `langchain-ai/langchain`. The
most recent landed today.

In the same period, three things happened that had nothing to do with the libraries getting
better. A recruiter opened a conversation by referencing a PR link rather than my CV. My
own CV grew a section called "Open Source Contributions — Reusable Production Libraries",
written in exactly the register you write in when you want a hiring manager to read it. And
an issue I filed about checkpoint savers disagreeing on `list(limit=-1)` was picked up by
two developers I have never met, one of whom reproduced it, found a fourth divergent
behaviour I had missed, and called it "a very clean cross-backend semantic-equivalence
fixture".

None of that is why I started. All of it is why I kept going, and pretending otherwise in
public was the part that was dishonest.

## What a merged PR proves that a CV cannot

Everything else on a CV is self-reported.

Years of experience is a number you type. "Expert in Python" is a claim with no referent.
A portfolio project proves you can build something nobody asked for, to a standard nobody
checked, on a deadline you set yourself. Even a job title is mostly a fact about what an
employer chose to call you.

A merged pull request is different in kind. Someone who had never heard of me, who owed me
nothing, who had a queue of other things to do, read my diagnosis, decided it was real,
reviewed the fix, asked for changes, and eventually put my code into software that
thousands of teams install without thinking about it.

That is a stranger's verdict, published, permanent, and checkable in one click by anyone
who doubts it.

The checkability is the part that matters most and gets discussed least. A hiring manager
assessing me has no way to verify almost anything else I say. They can verify this in
thirty seconds, and — more usefully — they can read the diff and form their own opinion
about how I think.

## The code is not the differentiator

My last merged fix was a validation helper. It rejects a `min_count` below one before the
scan starts instead of letting the comparison be trivially true for every point. It is
maybe fifteen lines. An afternoon, including the test.

If merged PRs were about writing impressive code, that one would not count for much.

What took the effort was everything around it: noticing that local mode and a real server
disagreed at all, narrowing it to the exact range where they diverge, proving the bug was
in the library rather than in my test rig — which I have got wrong before, and lost a day
to — and then writing it up so a maintainer could confirm it in five minutes rather than
fifty.

That is the skill the merge actually certifies. Not typing. Diagnosis under uncertainty,
and the discipline to make someone else's job easy.

Which is, not coincidentally, most of what the work is once you are past junior.

## Why this beats a side project, specifically

I have side projects. One of them analyses 1.6 million flights and I am fond of it. But I
chose its scope, its dataset, its definition of done, and its standard of correctness. If
it is wrong, the only person who finds out is me.

Contributing upstream removes every one of those degrees of freedom. The codebase is not
mine. The conventions are not mine. The bar is set by someone whose name is on the project
and who will be maintaining my code long after I have forgotten it. I do not get to decide
when it is finished.

Working inside a constraint you did not choose is the thing employers are actually trying
to assess in an interview, and it is the thing a side project is structurally incapable of
demonstrating.

## What it does not prove

I would rather say this than have someone say it for me.

- **Four merged fixes is not a lot.** People who do this seriously have hundreds. It is a
  signal, not a credential, and anyone treating it as seniority is misreading it.
- **These are small fixes in client libraries**, not core contributions to the engines
  themselves. Different difficulty, different depth, and I should not let the phrase "open
  source contributor" blur the two.
- **It says nothing about system design or scale.** A merged patch proves I can find and
  fix a defect in someone else's code. It does not prove I can architect anything, lead
  anyone, or make something survive real traffic.
- **The record is survivorship.** I do not publish the probes that found nothing, and there
  have been plenty. The hit rate is much worse than four merges makes it look.
- **Maintainer time is not free.** Every PR I open costs someone a review. Filing for signal
  rather than because the bug matters is a transfer from them to me, and the fact that the
  career benefit is real makes that easier to rationalise, not harder.

That last one is why the original post said "not résumé-building" in the first place. The
motive was worth guarding. I was wrong that it had stayed guarded, not wrong that it
mattered.

## If you want the same signal

1. Start from a library you actually use in production. If you do not use it, you will not
   find anything real, and you will be filing for the wrong reason.
2. Look for two implementations that are meant to agree — local against server, in-memory
   against Postgres, sync against async. The convenience one is least exercised.
3. Probe the edges, not the middle: zero, negative, empty, contradictory. The middle is
   what the existing tests cover.
4. Before believing a disagreement, feed your harness a case whose answer you already know.
   I have reported three bugs that were all defects in my own rig.
5. Write the reproduction so a maintainer can confirm it without setting anything up. That
   single file is what separates a PR that merges from one that sits.
6. Say what your fix does not cover, before you are asked. It is the fastest way to be
   trusted by someone who has never met you.

The four: [#1369](https://github.com/qdrant/qdrant-client/pull/1369),
[#1333](https://github.com/qdrant/qdrant-client/pull/1333),
[#1293](https://github.com/qdrant/qdrant-client/pull/1293) (shipped in v1.19.0), and
[langchain #39668](https://github.com/langchain-ai/langchain/pull/39668). The method is
[here](/blog/stop-reading-code-start-diffing-it) — including the paragraph this post exists
to correct.
