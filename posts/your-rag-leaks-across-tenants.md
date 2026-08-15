---
title: "Your RAG Leaks Across Tenants"
description: "The usual multi-tenant RAG setup puts every customer's documents in one vector store and asks the model, in the system prompt, to only use the right ones. That is not a security control. Here is where the boundary actually belongs."
date: "2026-08-14"
author: "Nazsats"
tags: ["AI", "RAG", "Multi-tenant", "Security", "Postgres"]
published: true
---

Most multi-tenant RAG systems I have seen are built the same way. One vector store holding
every customer's documents. A retriever that searches all of it. And a system prompt that
says, somewhere near the bottom:

> Only answer using documents belonging to the current customer.

That line is doing an enormous amount of work, and it cannot do any of it. It is not a
security control. It is a request, made politely, to a probabilistic system, about data that
has already been handed to it.

![One vector store holding every tenant's documents. The retriever returns a mixed set, and the system prompt asks the model to ignore the ones that do not belong to the current tenant.](/blog/tenant-prompt-boundary.svg)

Look at where the boundary sits in that picture. By the time the instruction is read, tenant
B's document is already inside the context window. Everything after that point is the model
choosing to comply.

Which means:

- You cannot **audit** it. There is no query log that shows a tenant boundary being enforced,
  because none was.
- You cannot **test** it exhaustively. You can try a hundred adversarial prompts and pass all
  of them, and that tells you nothing about the hundred and first.
- You cannot **prove** it to a customer. "We instruct the model not to" is not an answer to
  "how do you know my competitor cannot see my pricing?"

The failure mode is quiet, too. Nothing errors. A user asks a slightly odd question and gets
a slightly better answer than they should have — one informed by a document they were never
entitled to. Nobody files a bug for an answer that was too good.

## Tool-calling made this worse, not better

When RAG was a single retrieve-then-generate pass, at least the retrieval was in your code.
You wrote the query. You knew what it returned.

Agents changed that. The model now decides *when* to search, *how many times*, and *with what
arguments*. The whole point is that you did not have to enumerate the paths in advance.

That is exactly the problem. If the tenant identity is something the model passes along — a
field in the tool arguments, a value it read from earlier context, anything it can see — then
the model is now a participant in your access control, and its inputs include text written by
your user.

At that point you do not have an isolation bug. You have a prompt injection with database
access.

## Where the boundary belongs

Underneath the model, in the query.

The tenant identity comes from the authenticated session. It is passed to the retrieval
function as its own parameter, next to — but never mixed with — whatever arguments the model
chose. The database filter applies it. No row belonging to anyone else is ever loaded, so
there is nothing for the model to leak.

![The tenant id comes from the session and is passed as its own parameter to the retrieval function, alongside the model's chosen arguments. The SQL filter applies it, so only that tenant's rows are ever returned.](/blog/tenant-query-boundary.svg)

Here is the shape of it, from the AI broker assistant I built for Dubai agencies. The agent
does natural-language property search, so the model genuinely does choose the filters:

```python
async def fetch_properties(session, agency_id: int | None, **filters):
    stmt = select(Property)
    # ... the model's filters: bedrooms, price, area, possession ...
    if agency_id is not None:
        stmt = stmt.where(
            or_(Property.agency_id == agency_id, Property.agency_id.is_(None))
        )
    return await session.execute(stmt)
```

And the call site, inside the agent loop:

```python
props = await fetch_properties(session, agency_id, **args)
```

`args` is the model's. `agency_id` is not. It arrived from the route:

```python
async def chat(body: ChatIn, user: User = Depends(get_current_user), ...):
    answer, props = await broker_agent.nl_search(
        session, user.agency_id, body.message, history
    )
```

`user.agency_id` comes off the verified token. `body.message` is the untrusted text. They
travel as separate arguments and never touch. There is no string the user can type that turns
one into the other.

The same rule applies to the vector search. Tenant filtering happens *in* the retrieval query,
not after it:

```sql
SELECT content, embedding <=> :q AS distance
FROM knowledge_chunks
WHERE agency_id IS NULL OR agency_id = :agency_id
ORDER BY distance
LIMIT :limit
```

One query, both conditions. Not "fetch the nearest twenty and drop the ones from other
tenants" — that version still reads them, still costs you the recall, and leaves the filtering
in application code where a future refactor can quietly remove it.

Two details that matter more than they look:

**Index the tenant column.** `CREATE INDEX ... ON knowledge_chunks (agency_id)`. Without it
the filter is correct and slow, and slow security controls are the ones people are tempted to
"optimise" later.

**Make the parameter required.** A tenant id that defaults to `None` and silently means "all
tenants" is a loaded gun. If you cannot make it required, make the unscoped path a different
function with an alarming name.

## The honest limits

A post that stops here is selling you something. So:

**This does not solve prompt injection.** It contains the blast radius. An injected prompt can
still make the assistant say something stupid, call a tool it should not have, or leak data
*within* the tenant that a particular user should not see. Tenant isolation and per-user
authorisation are different problems, and this only fixes the first.

**My system has a deliberate cross-tenant read path.** Look again at the filter:
`WHERE agency_id IS NULL OR agency_id = :agency_id`. Rows with a null tenant are shared —
public market listings that every agency should see. That is a real hole in a strict reading
of isolation, and it is intentional. What makes it defensible is that it is *visible*: it is
one clause in one query, it is written down, and adding something to the shared pool is an
explicit flag (`to_shared_pool: bool = False`) rather than an accident. Compare that with a
prompt-level system, where you could not tell me what crosses tenants even if you wanted to.

**Row-level security is stronger.** Postgres RLS pushes the rule into the database itself, so
even a hand-written query in some forgotten script obeys it. I did not use it here because
the application owns a single connection pool and the tenant would have to be set per
request via `SET LOCAL`, which interacts badly with pooling. That is a real trade-off, not a
verdict — if your architecture allows RLS, it is the better answer, because it survives a
developer forgetting.

**None of this is novel.** It is ordinary access control, applied one layer lower than people
have been applying it. That is rather the point. The reason multi-tenant RAG leaks is not that
the problem is hard; it is that a system prompt *feels* like it is doing the job, and a
`WHERE` clause is boring enough that nobody writes a blog post about it.

## What to check in your own system, today

1. Find where your retriever is called. Is the tenant id a **parameter of that function**, or
   is it somewhere in the prompt or the tool schema?
2. If a tenant id appears anywhere in a tool's JSON schema, the model can set it. That is a
   finding.
3. Read your retrieval SQL. Is the tenant condition in the `WHERE`, or applied to the results
   afterwards in Python?
4. Delete the sentence from your system prompt that asks the model to respect tenancy. Run
   your test suite. If nothing fails, you had no control — you had a comment.

That last one is the fastest honest test I know. It takes a minute, and the result tells you
which of the two diagrams above describes your system.

---

The assistant this came from is [open source](https://github.com/nazsats/dubai-real-estate) —
the isolation is in `backend/app/ai/broker_agent.py` and `backend/app/ai/knowledge.py` if you
want to check my work rather than take my word for it.
