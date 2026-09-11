---
title: "The Bot Was Right Seven Minutes Before the Merge"
description: "A review bot flagged an off-by-one in a maintainer's commit. Seven minutes later the commit was merged anyway, because neither of us had read the comment. The fix was one line."
date: "2026-09-10"
author: "Nazsats"
tags: ["Open Source", "Python", "Qdrant", "Code Review", "Debugging"]
published: true
---

On 2 September a maintainer pushed a commit onto my pull request and merged it thirteen minutes later. That commit introduced a bug.

A review bot had flagged the bug seven minutes before the merge. Neither of us read the comment in time.

I found it two days later, reading the merged code to check what had changed. The fix was one line, and it went in this morning.

## An error message that names a value it rejects

`qdrant-client` supports a `SliceCondition` — a filter that partitions a collection into `total` slices and matches the points in slice `index`. Local mode validates it in `qdrant_client/local/payload_filters.py`:

```python
elif isinstance(condition, models.SliceCondition):
    total, index = condition.slice.total, condition.slice.index
    if total < 1:
        raise ValueError(f"Slice total must be >= 1, got {total}")
    if not 0 <= index < total:
        raise ValueError(f"Slice index must be in 0..{total}, got {index}")
```

Read the guard and the message together.

The guard is `0 <= index < total`. Indices are zero-based, so with `total=4` the valid values are 0, 1, 2 and 3. Four is rejected.

The message says the index must be in `0..4`.

It names the one value it has just refused. A developer who passes `index=4`, gets an exception, and reads the message carefully is told that 4 was allowed. The next thing they will do is doubt their own code, because the library has just told them the input was fine.

That is the whole defect. No behaviour changes; the guard was always correct. The message describing the guard was wrong, and a wrong error message costs someone an afternoon.

The fix:

```python
raise ValueError(f"Slice index must be in [0;{total - 1}], got {index}")
```

One line, one file, [PR #1412](https://github.com/qdrant/qdrant-client/pull/1412). Filed 9 September at 13:23, merged into `dev` at 07:58 the next morning — nineteen hours.

I had written the range as `0..{total - 1}`. The maintainer pushed one commit over mine changing the notation to `[0;{total - 1}]` before merging, which is the form the rest of the codebase uses. The bound was the point; the punctuation was his to decide.

## How it got there

This is the part worth writing down, because the mechanism is more interesting than the bug.

The `SliceCondition` validation did not exist before. It arrived in [PR #1369](https://github.com/qdrant/qdrant-client/pull/1369) — my pull request, the one about `min_should` accepting values the server rejects. That one sat untouched for eleven days, I left a single follow-up comment, and the maintainer responded within six hours: he pushed his own commit restructuring my validation and extending it to cover `SliceCondition`, then merged.

His extension is good. It closed a real gap. It also shipped with the off-by-one in its message.

CodeRabbit — the review bot on that repository — posted a comment identifying it. Timestamp: seven minutes before the merge.

Nobody was careless here. He was moving fast on a PR he had just decided to unblock. I was pleased it was moving at all and was not re-reading a commit the maintainer had written himself. The bot was correct, on time by any reasonable standard, and completely ignored — not because anyone dismissed it, but because a comment posted seven minutes before a merge lands in the gap where a human has already stopped looking.

Review bots are judged on precision: how often they are right. This one was right. It made no difference, because being right is only half of it. The other half is arriving while someone is still reading.

## What I actually did

Nothing clever. Two days after the merge I opened the merged file to see how my validation had been restructured, because I wanted to know what the maintainer's version looked like next to mine.

Reading the diff of your own merged PR is a habit I picked up late and would now recommend to anyone. The merge is not the end of the work. It is the first time you get to see your change as the maintainer thought it should have been written, which is the most direct feedback available in open source and costs ten minutes.

The off-by-one was visible in the second line I read.

## Honest limits

This fix is small, and I would rather say so than dress it up.

It changes no behaviour. Every input accepted before is still accepted; every input rejected before is still rejected. Nobody's code breaks either way, and nobody's code starts working. If you never pass an out-of-range slice index, this line will never execute for you.

It does not make the validation more correct. The guard was already right.

It is not a bug I found through any method. There was no differential harness, no fuzzing, no test sweep — the three previous `qdrant-client` fixes came out of a deliberate hunt, and this one came out of reading a file. I would have missed it entirely if I had treated the merge as the finish line.

And it does not fix the process problem underneath. The next bot comment posted seven minutes before a merge will be missed in exactly the same way, by different people, on a different repository. A one-line patch does not change when humans stop reading.

## Five minutes on your own error messages

The class of defect here — a message that misdescribes the condition it reports — is easy to find deliberately and almost never looked for. It survives review because reviewers read the guard and skim the string.

1. Grep your codebase for `raise` and `ValueError` lines whose message contains a formatted bound: `{n}`, `{total}`, `{max}`, `{len(...)}`.
2. For each, read the comparison operator in the guard directly above it. `<` and `<=` are the whole game. If the guard says `< total` and the message says `0..{total}`, they disagree.
3. Do the same for the words. "at most", "up to", "between", "no more than" — each implies an inclusive bound, and half of them sit above an exclusive one.
4. Check the empty case. If the collection can be empty, `0..{total - 1}` renders as `0..-1`, which is nonsense to read. Guard the zero case separately or word it differently.
5. Write one test that asserts the message, not just the exception. `pytest.raises(ValueError, match=r"0\.\.3")` fails loudly the day the bound moves.

Point five is the one that would have caught this. There was a test for the exception. There was no test for what it said.

## The count, for what it is worth

This is the fifth merge across these libraries — four in `qdrant-client` ([#1293](https://github.com/qdrant/qdrant-client/pull/1293), [#1333](https://github.com/qdrant/qdrant-client/pull/1333), [#1369](https://github.com/qdrant/qdrant-client/pull/1369), [#1412](https://github.com/qdrant/qdrant-client/pull/1412)) and one in `langchain` — and the second in that repository inside nine days.

The other side of the ledger, since I would rather publish it than not: four follow-ups sent on 2 September to `chroma`, `litellm` and `outlines` have drawn no replies in eight days. A `weaviate-python-client` issue is twelve days old with zero comments. A `typescript-eslint` PR is still in draft.

Most of it sits. Two of them moved this month, both after I went back and read something I had already stopped looking at.

Everything is at [github.com/nazsats](https://github.com/nazsats), diffs included.
