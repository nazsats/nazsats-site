---
title: "I Built an AI Assistant for Dubai Real-Estate Agents"
description: "A look inside the app I'm building — it remembers every buyer, tells you who to call today, finds the right property in plain English, and writes the message for you. Explained simply, with pictures."
date: "2026-07-29"
author: "Nazsats"
tags: ["AI", "Real Estate", "Dubai", "Product"]
published: true
---

Ask a Dubai property agent what they actually do all day, and very little of it is
selling.

It's copying a buyer's budget into a spreadsheet. Scrolling a portal for something with
three bedrooms and a pool. Retyping the same message to the fifth client this week.
Trying to remember who they promised to call back on Tuesday.

None of that is difficult. All of it eats the day.

So I'm building an assistant that does it — **Dubai AI Broker Assistant**. Here's what
it looks like and how it works, in plain language.

**Try it:** [dubai-real-estate-ashy.vercel.app](https://dubai-real-estate-ashy.vercel.app)
— sign in with `demo@demo.ae` / `demo12345`

> The demo sleeps when nobody's using it, so the first page can take about 30 seconds
> to wake up. After that it's quick.

## The problem, in one picture

![Before: eight disconnected apps. After: one app.](/blog/broker-before-after.svg)

*Most agents run six to eight tools that don't talk to each other.*

Every one of those needs the same information typed in again. And the moment a buyer's
details live in four places, three of them are out of date.

## Monday morning: who do I call?

This is the screen an agent opens first. Not a dashboard full of numbers — a list of
**exactly who to contact today**, most overdue at the top.

![The Today page, showing which leads to follow up on first](https://raw.githubusercontent.com/nazsats/dubai-real-estate/main/docs/screenshots/today.png)

*No thinking required. Open it, work down the list.*

The app watches how long it's been since you last spoke to each buyer. If someone goes
quiet, they surface here automatically.

![How long before a quiet lead is flagged](/blog/broker-lead-journey.svg)

*A buyer moves left to right. If they stall, you get told — you don't have to remember.*

## Finding the right property, in plain English

You don't fill in six dropdown filters. You type what the client told you:

> "3 bed in Dubai Marina under 5M with a pool"

![The AI search page returning matching properties](https://raw.githubusercontent.com/nazsats/dubai-real-estate/main/docs/screenshots/search.png)

*It answers in normal sentences, and shows the actual properties underneath.*

Here's the part that matters most, and the part I was strictest about:

![The five steps: you ask, it understands, it looks up your real listings, it explains, you send](/blog/broker-how-it-works.svg)

*Step 3 is the promise. The assistant cannot invent a property.*

This sounds obvious, but a lot of "AI" tools get it wrong. If you let the AI answer from
memory, it will happily describe a beautiful three-bedroom in Marina that **does not
exist** — and you'll only find out standing in front of the client.

So in this app, the AI isn't allowed to answer from memory. It has to go and look in
your actual property list, and it can only show you what's really there. It handles the
language; your database handles the facts.

## Your properties, with photos

![The listings page with property photos, prices and details](https://raw.githubusercontent.com/nazsats/dubai-real-estate/main/docs/screenshots/listings.png)

*Three ways to fill this: pull live Dubai listings by area, upload your own stock as a
spreadsheet, or add them by hand.*

Duplicates get removed on the way in, so importing the same area twice doesn't leave you
with the same villa listed four times.

## Every buyer on one board

![The pipeline board showing leads at each stage from New to Won](https://raw.githubusercontent.com/nazsats/dubai-real-estate/main/docs/screenshots/pipeline.png)

*Drag a buyer along as the deal progresses. Nobody gets forgotten in someone's inbox.*

Open any buyer and you see the whole history — every call, WhatsApp, viewing and note,
in order. And three buttons that do the writing for you:

| Button | What you get |
|---|---|
| **Match** | The best properties for this specific buyer, with a reason for each pick |
| **Pitch** | A ready-to-send WhatsApp or email — **written in the client's own language** |
| **Marketing** | Portal ad, Instagram caption, story script and an email blast for a property |

That language detail is not a small thing in Dubai. Your buyers speak Arabic, Hindi,
Russian, Mandarin, English — often in the same week. The app writes in whichever one the
buyer speaks, so you're not pasting messages through a translator before you send them.

## The numbers, without building a report

![The dashboard with live statistics and a map of Dubai](https://raw.githubusercontent.com/nazsats/dubai-real-estate/main/docs/screenshots/dashboard.png)

*Live totals, plus a map of Dubai where each circle is an area — bigger means more
stock, and the colour shows the price band.*

![The market trends page with nine different charts](https://raw.githubusercontent.com/nazsats/dubai-real-estate/main/docs/screenshots/market.png)

*Nine views of your inventory — price spread, bedroom mix, price per square foot by
area, and more.*

Useful for a listing pitch: you can show an owner where their property actually sits
against everything else on the market, instead of saying "trust me."

## "Won't the AI cost a fortune?"

The honest fear with any AI product is the bill. So I designed the app so the parts you
use most **don't use AI at all**.

![Donut chart: six of the seven daily screens use no AI](/blog/broker-ai-usage.svg)

*Your busiest screen — the morning call list — costs nothing to run.*

Sorting your follow-ups by who's most overdue is simple maths. It doesn't need an AI,
and an AI would do it worse. So it doesn't use one.

The AI only wakes up when you press a button: search, match, pitch, marketing, or draft
a follow-up. Nothing runs in the background. Nothing runs while you sleep. On top of
that there's a cap on how much any one agency can use per minute, so a runaway bill
isn't possible.

## Your client list stays yours

Several agencies can use the same app — but each one only ever sees its own data.

![Two agencies, separated, with a shared pool of public market listings](/blog/broker-privacy.svg)

*Your buyers, your listings, your deals — walled off. Only public market listings are shared.*

Your client book is the business. That was non-negotiable.

## How everything is filed

![Tree diagram: agency, then agents, buyers and properties, then conversations, reminders and deals](/blog/broker-data-tree.svg)

*Everything hangs off your agency — so if an agent leaves, the history stays with you.*

## It works on a phone

Agents aren't at a desk. The whole app works on a phone, sidebar and all.

![The app running on a mobile screen](https://raw.githubusercontent.com/nazsats/dubai-real-estate/main/docs/screenshots/today-mobile.png)

*The same follow-up list, in your hand between viewings.*

## What it can't do yet

I'd rather tell you now than have you find out:

- **It writes messages, but it doesn't send them.** You copy and paste for the moment.
  Sending straight to WhatsApp is the next thing I'm building.
- **Deals and reminders work behind the scenes, but don't have their own screens yet.**
- **The demo account is public**, so don't put real client data in it.
- **It's still being built.** Some rough edges are still rough.

## What's coming next

Sending messages straight to WhatsApp. Email built in. A form on your website that drops
new enquiries into the pipeline automatically. After that: real Dubai transaction data,
automatic scoring of which buyers are most likely to close, a viewing scheduler that
syncs with your calendar, and Arabic support throughout.

---

The idea behind all of it is simple. An agent's real job is talking to people and
closing deals. Everything around that — the typing, the remembering, the searching, the
chasing — is work a computer should be doing.

**Want to see it on your own listings?**
[Get in touch](/contact), or
[open the demo](https://dubai-real-estate-ashy.vercel.app) and click around first.
