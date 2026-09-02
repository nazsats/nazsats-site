---
title: "Eleven Days, One Comment, Six Hours"
description: "A pull request that fixed a filter returning entire collections sat untouched for eleven days. One sentence got it merged the same afternoon. What that sentence had to contain."
date: "2026-09-02"
author: "Nazsats"
tags: ["Open Source", "Python", "Qdrant", "Vector Databases", "Career"]
published: false
---

On 22 August I opened a pull request against `qdrant-client`. For eleven days the only things that touched it were a deploy-preview bot and a review bot.

On 2 September at 08:55 I left a single sentence on it. A maintainer replied at 14:15, pushed his own commit, and merged it at 14:28.

The code had not changed in those six hours. Only the comment had.

## The filter that matched everything

Qdrant's `min_should` clause lets you say "at least N of these conditions must hold". Local mode evaluates it in `qdrant_client/local/payload_filters.py` as a comparison:

```python
matches >= min_count
```

That line is the whole story. If `min_count` is zero, the comparison is true for every point in the collection, because every point matches at least zero conditions. A filter written to narrow a result set returns all of it.

The server rejects `min_count` below 1 outright. Local mode accepted it and quietly returned everything.

This is the shape of bug I keep finding in this layer: local mode and the server are two implementations of one contract, and the convenience side — the one nobody runs in production — is the one nobody exercises. A query written and tested against local mode passes there and behaves differently against a real server. You do not get an error. You get more rows than you asked for.

The fix validates the value before evaluation:

```python
if payload_filter.min_should is not None:
    min_count = payload_filter.min_should.min_count
    if min_count < 1:
        raise ValueError(f"min_count value {min_count} is invalid. Must be 1 or larger.")
    clauses.append(payload_filter.min_should.conditions)
```

An automated reviewer then caught something I had missed: filters reached through a `NestedCondition` bypassed the check entirely, because nested conditions carry their filter on `.nested.filter` rather than being one. That took a second commit and five more regression tests, each of which fails without the traversal.

Then nothing happened for eleven days.

## What eleven days of silence actually is

It is tempting to read silence as rejection. It is almost never that.

`qdrant-client` has a small maintainer team and a steady queue of external pull requests. Mine was correct, tested, and completely unremarkable in the queue. Nobody had decided against it. Nobody had decided anything, because deciding requires someone to open the tab.

The comment I eventually left was this:

> still happy to move the validation if you'd prefer, otherwise this is ready

Twelve words. Three things in them, and each one is doing work.

It names an open decision. The pull request description had disclosed a known limitation — an empty collection short-circuits before validation runs — and offered to move the check. That offer was still outstanding, so the comment gives the maintainer something to react to rather than a status request.

It states the work is finished. Not "any update?", which puts the labour back on the person you are asking. "This is ready" tells them the cost of engaging is a review, not a conversation.

It tags one person. Not the org, not everyone who has ever touched the file. The maintainer who merged my previous two pull requests in that repository.

That last point is the part people skip, and it is the part that actually matters. The comment worked because it was the fourth time that maintainer had seen my name. The first three built the standing; the fourth spent it.

## What the maintainer did next

He did not just approve it. He pushed a commit onto my branch — `fix: update filter validation, update tests` — restructured the validation, and extended it to cover `SliceCondition`, checking that `slice.total` is at least 1 and that `slice.index` falls inside the range. That was not in my pull request.

Then he merged, thirteen minutes after his first comment.

The merged code is not purely mine, and I think that is the healthiest possible outcome. A maintainer who takes your patch and builds on it has decided the problem is real and the approach is right. That is worth more than a clean merge of exactly the diff you wrote.

## Honest limits

The follow-up is not a trick, and it does not work everywhere.

It worked here because I had standing in this specific repository — three merged pull requests before this one. In repositories where I have none, the same sentence gets the same silence. I have an issue open in another project where four separate contributors have now asked to be assigned to a one-character fix, and no maintainer has replied to any of them in a fortnight. No comment I write will change that, because the gate is unmanned. Follow-ups move things that are stuck. They do not summon people who are not there.

It also only works once. A second nudge on the same pull request makes you the noise rather than the signal. My own rule is one follow-up after a week of silence, and if that produces nothing, the thing is ghosted and I stop.

And the merged code has a defect that neither of us caught. The new slice validation reads:

```python
if not 0 <= index < total:
    raise ValueError(f"Slice index must be in 0..{total}, got {index}")
```

The guard rejects `index == total`. The message tells the user `total` is acceptable. It is an off-by-one in a string, not in logic, but it will confuse whoever hits it. The review bot flagged it seven minutes before the merge and neither of us read the comment in time. I am sending a one-line follow-up for it.

I am including that because a post about a merged pull request without it reads as a victory lap, and because the failure mode here is instructive: automated review caught two real things in this pull request — the nested-condition gap and this message — and a human missed both.

## A follow-up worth sending

If you have work sitting unread in someone else's queue, this is what I would run, in order:

1. **Check the age.** Under seven days since the last human touched it, leave it alone. Past twenty-one days with no engagement at all, accept it is ghosted and either close it or forget it.
2. **Check nobody is waiting on you.** Re-read the thread. If a reviewer asked a question you did not answer, the silence is yours, not theirs.
3. **Find the open decision.** Something in your pull request that the maintainer has to choose between. Offer it explicitly. If there is genuinely nothing, say the work is complete and the CI is green — that is still a decision, just a smaller one.
4. **Say it in one or two sentences.** A long follow-up reads as an argument for work that has not been reviewed yet.
5. **Tag one person**, chosen because they have touched this area before, not because they are the most senior name in the repository.
6. **Then stop.** One follow-up. If a week passes, let it go and put the effort into something that is moving.

The merged pull request is [qdrant/qdrant-client#1369](https://github.com/qdrant/qdrant-client/pull/1369), and the linked issue with the full reproduction is [#1368](https://github.com/qdrant/qdrant-client/issues/1368). Both are worth reading before you take my summary at face value.
