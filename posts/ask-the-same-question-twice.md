---
title: "Ask the Same Question Twice"
description: "Six bugs in three AI libraries came out of one trick: find two things that claim to give the same answer, ask them both, and diff. You never need to know what the right answer is."
date: "2026-08-12"
author: "Nazsats"
tags: ["Open Source", "Testing", "Qdrant", "Outlines", "Python"]
published: true
---

I have spent the last two weeks filing bug fixes against libraries I use in production —
qdrant-client, LlamaIndex, Outlines. Six bugs, three libraries, one of them
[merged and shipped in a release](https://github.com/qdrant/qdrant-client/releases/tag/v1.19.0).

People keep asking how I find them, and the honest answer is boring: I do not read code
looking for mistakes. I look for **two things that claim to give the same answer**, ask them
both the same question, and compare.

That is the whole method. It is called differential testing, and its great virtue is that it
does not require you to be smart.

![One input, two implementations, a diff. Same answer means nothing to see; different answers mean one of them is wrong.](/blog/diff-method.svg)

Notice what is missing from that picture: **an expert**. You never have to know what the
correct answer is. You only have to notice that two things disagree, and at least one of them
is then wrong by definition.

## Where the second implementation comes from

Most vector databases ship a convenience mode. Qdrant has `QdrantClient(":memory:")` — an
in-process Python reimplementation of a server written in Rust. It exists so your tests do not
need Docker, and it is genuinely lovely.

It is also a **second implementation of the same contract**, written in a different language,
by different people, at a different time. Every filter operator, every edge case, every
interaction between `null` and a negation had to be re-derived by hand.

That is not a criticism. That is an invitation.

## What it found

I wrote a probe: create the same collection in both, upsert the same points, run the same
filters through each, print the two sets of matched ids side by side. Twenty-six filters. It
took about an hour.

Three of them came back different. Here is one:

![The same MatchExcept filter over eight points. Local mode returns ids 1, 3, 6 and 8; the real server returns 1, 3 and 8. Point 6, whose value is an explicit null, matches only in local mode.](/blog/diff-matchexcept.svg)

Point 6 has an explicit `null`. Local mode says it satisfies `except [1, 2]`; the server says
it does not.

Once you can see it, the cause is a single line:

```python
if isinstance(condition, models.MatchExcept):
    return not any(values_match(value, v) for v in condition.except_)
```

For `value = None`, every comparison is False, so `not any(...)` is **True** and the point
matches. `MatchExcept` is the only *negated* match condition in the file, and the only one
without a type guard — its siblings all check `isinstance(value, str)` or compare types
first. Negation is exactly where a missing guard flips the answer rather than just narrowing
it.

The second divergence was smaller and stranger. An empty `should` clause matched **nothing**,
where the server matches **everything**:

```python
check_should([])   # any([]) is False  -> reject every point
check_must([])     # all([]) is True   -> accept every point
```

Three sibling clauses, one contract, and `any` and `all` disagree on the empty list. If you
build filters in a loop and the loop happens to add no conditions, your query silently returns
zero results instead of being ignored.

I would not have found either by reading. I found them because a script printed two lists that
should have been identical and were not.

## When there is only one implementation

Outlines has no local-versus-remote split. It compiles a small type DSL down to a regular
expression. One implementation, no obvious twin.

But the contract is still there, unwritten: **`Regex(p)` should mean exactly `p`**. And Python
ships something that already knows what `p` means.

![The same pattern sent through the library and through Python's re.fullmatch. The library raises PatternError; the standard library matches.](/blog/diff-oracle.svg)

`to_regex` wrapped every term in a capturing group to bind operators. Capturing groups
renumber everything inside them, so a user pattern carrying a numbered backreference gets
quietly rewritten:

```python
re.fullmatch(r"(a)\1", "aa")      # matches
Regex(r"(a)\1").matches("aa")     # re.PatternError: cannot refer to an open group
```

`(a)\1` becomes `((a)\1)`. What you wrote as group 1 is now group 2, and `\1` points at the
wrapper — which is still open at that position, so the regex will not even compile.

The tell that makes it unambiguous: **named** backreferences work fine. `(?P<c>a)(?P=c)` is
untouched, because names are not renumbered. The behaviour of your pattern depended on which
group syntax you happened to prefer. The fix is one character in ten places: `(` becomes
`(?:`.

## The part where I was wrong

Before writing the Qdrant probe I had a theory. I had read the Rust source, decided the server
used *all*-semantics for `MatchExcept` across multi-value fields while the Python client used
*any*, and I was fairly pleased with myself.

The probe said the server uses `any` too. Point 1 — `[1, 5]`, partially excluded — matched in
both. My theory was simply wrong, and the two real bugs were things I had not considered at
all.

This is the argument for the method, not against it. A code review finds the bugs you thought
to look for. A differential probe finds the ones you did not, including in the places you were
confident about. I spent that hour being wrong in a way that still produced two merged-quality
fixes.

## Where to point it

![Libraries that ship two implementations of one contract: Qdrant local versus server, Chroma persistent versus HTTP, Milvus Lite versus server, Weaviate embedded versus remote, and structured generation across model backends.](/blog/diff-where.svg)

The pattern is everywhere in the AI tooling stack, because every one of these projects wants
you to be able to `pip install` and start without infrastructure.

A useful heuristic: **look for the congruence tests**. If a project maintains two
implementations and has no test suite comparing them, they have drifted — nobody is checking.
Qdrant is the good case; it *has* a `tests/congruence_tests/` directory, and I still found two
divergences, because the tests covered the operators and not the empty-and-null corners.

## If you want to try it

1. Pick a library you actually use. You need to care enough to know what the answers should
   look like when they differ.
2. Find the two implementations. Local versus server, one input across backends, or the
   library versus the standard library.
3. Write the smallest possible harness: same setup, same inputs, print both answers.
4. Feed it the boring corners — empty lists, explicit nulls, zero, one-element collections,
   values that are absent versus present-but-null. **Every bug in this post lives in one of
   those.**
5. When something diverges, do not guess which side is right. Reproduce it minimally, then
   read the code with a specific question in hand.

That last point is what makes it work. Reading code cold is a search with no target. Reading
code to explain a divergence you have already reproduced is a search with a bright line
pointing at it.

---

The fixes from this post: [qdrant-client #1293](https://github.com/qdrant/qdrant-client/pull/1293)
(merged, shipped in v1.19.0), [qdrant-client #1333](https://github.com/qdrant/qdrant-client/pull/1333),
and [outlines #1993](https://github.com/dottxt-ai/outlines/pull/1993).
