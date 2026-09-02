---
title: "The Column I Threw Away"
description: "In August I published that 39.8% of US delay minutes are knock-on from an aircraft that was already late. I illustrated it with a drawing, because I could not measure it — my download script had trimmed away the only column that identifies an aircraft. Getting it back cost three lines and found two bugs, one of which was in the number I was about to publish."
date: "2026-08-31"
author: "Nazsats"
tags: ["Machine Learning", "Data Engineering", "Spark", "Aviation", "Agents"]
published: true
---

Two weeks ago I published a finding: [39.8% of US delay minutes come from an aircraft that
was already late](/blog/the-biggest-cause-of-flight-delays), against 7% for weather. To
explain how one delay becomes four, I drew a diagram — four legs, twenty minutes lost on
the first, fifty-five by the fourth.

It was a drawing. I could not measure a single real rotation, and I did not say so at the
time.

My dataset knew a flight was late. It did not know which aircraft was flying it.

## Where the column went

The feature store is keyed on route and date. There is a `late_aircraft_delay` column —
the airline's own filing of how many minutes were lost to a late inbound — so the 39.8%
figure is sound. It is filed with the regulator, not inferred by me.

But an attributed minute is not a link. Nothing in 1,626,052 rows said *this* flight and
*that* flight were the same physical aeroplane. I could count the effect and never trace a
single instance of it.

The reason was thirty lines into a script I had written months earlier and not opened
since. From `scripts/download_data.py`:

```python
# The full extract has 100+ columns. These are the ones the pipeline uses;
# keeping only them cuts each month from ~250 MB to ~35 MB on disk.
KEEP_COLUMNS = [
    "FlightDate", "Reporting_Airline", "Origin", "Dest",
    "CRSDepTime", "DepDelay", "ArrDelay", "Distance",
    "Cancelled", "Diverted",
    "CarrierDelay", "WeatherDelay", "NASDelay", "SecurityDelay", "LateAircraftDelay",
]
```

Fifteen columns out of more than a hundred. Every one earns its place for a model that
predicts whether a flight will be late. `Tail_Number` earns nothing for that model — it is
identity, not signal, and a high-cardinality identifier is exactly the sort of column you
strip before training. So it was never on the list.

That was the right call for the classifier and the wrong call for the project. I had
optimised the download for the question I was asking in month one, and thrown away the
answer to the question that turned out to matter most.

## What a missing column actually costs

I wrote the cascade tools first, against the schema I intended to have. They behave like
every other tool here: the model chooses which to call, the code produces the numbers, and
a tool without sufficient data refuses rather than estimating.

So the first thing `agent/cascade.py` does is establish whether it can answer at all:

```python
def _rotation_frame() -> pd.DataFrame:
    df = _features()
    missing = [c for c in ROTATION_FIELDS if c not in df.columns]
    if missing:
        raise ToolError(
            f"The feature store has no {', '.join(missing)} column, so aircraft "
            "rotations cannot be reconstructed and no cascade analysis is "
            "possible. Re-download the BTS extract including TAIL_NUM and "
            "CRS_ARR_TIME, then rebuild the feature store."
        )
```

Run against the old store, every cascade question returned that message. Which is correct
behaviour and completely useless. An agent that can only refuse is a well-engineered way of
knowing nothing.

There is a separate `rotation_coverage()` tool whose whole job is to answer "can this
question be answered", so the agent can say what is knowable before attempting to know it.
It reported the truth plainly:

```json
{
  "rotation_analysis_possible": false,
  "reason": "feature store is missing: tail_num, crs_arr_time",
  "flights": 1626052
}
```

## Three columns, three filters

`Tail_Number` had to survive three separate stages to reach the tools: the download trim,
the Spark read, and the rename that produces the feature store. It was being dropped at the
first, which is why nothing downstream ever complained.

Alongside it I took `Flight_Number_Reporting_Airline`, and `CRSArrTime` — scheduled arrival,
which with `ArrDelay` gives the actual landing time, and therefore the real gap before the
next departure. Without that last one you can order an aircraft's legs but not say how much
slack sat between them, and slack is the entire mechanism.

In the Spark pipeline they are optional, matching how the cause columns already behave:

```python
for col in ROTATION_COLUMNS:
    if col not in df.columns:
        df = df.withColumn(col, F.lit(None).cast("string"))
```

An older extract still runs. Nulls stay null rather than being filled with a placeholder,
because two flights sharing an empty string are not the same aircraft, and a cascade built
on that would be fiction with a tail number attached.

The extract grew from 33 MB a month to 42 MB. Coverage came back at 1.0 across all
1,626,052 flights, with 5,779 distinct aircraft. The rebuilt store had the same row count
and the same 0.196 delay rate, so nothing else had moved.

## Reconstruction is a sort, not a model

There is no machine learning in any of this, which is worth saying because the instinct is
to reach for some. Partition by tail number, order by scheduled departure, and consecutive
rows are consecutive legs. The gap between one leg landing and the next pushing back is the
buffer. When a delay exceeds the buffer, it propagates.

The propagation loop is the analytical core of the whole thing, and it is nine lines:

```python
earliest_departure = previous_actual_arrival + MIN_TURNAROUND_MINUTES
pushed = max(0.0, earliest_departure - float(row.dep_min))
simulated_arrival = baseline_arrival + pushed
```

An aircraft lands at `previous_actual_arrival`. It cannot push back before it has been
unloaded, serviced and boarded, so the earliest it can leave is that plus the minimum
turnaround. If that is later than the scheduled departure, the difference is pushed into
this leg, and this leg lands later, and the loop continues.

`MIN_TURNAROUND_MINUTES` is thirty. It is the only number in the module not read from data,
and every simulated result returns it in an `assumptions` list so it cannot be quoted
without its caveat.

## The rotation that made the point

The busiest rotation in three months of data is N476HA on 12 January 2024 — a Hawaiian
inter-island aircraft flying fourteen legs between Honolulu, Lihue, Kona and Kahului:

```
leg  1  HNL->LIH  dep 05:36  arr 06:15  delay    +4  turnaround   -
leg  2  LIH->HNL  dep 06:45  arr 07:21  delay    -1  turnaround  30
leg  3  HNL->KOA  dep 08:00  arr 08:47  delay    -3  turnaround  39
leg  4  KOA->LIH  dep 09:17  arr 10:13  delay    +1  turnaround  30
leg  5  LIH->HNL  dep 10:41  arr 11:20  delay    +2  turnaround  28
leg  6  HNL->LIH  dep 12:09  arr 12:52  delay    +3  turnaround  49
leg  7  LIH->HNL  dep 13:20  arr 14:01  delay    +0  turnaround  28
leg  8  HNL->LIH  dep 14:40  arr 15:22  delay   +15  turnaround  39
leg  9  LIH->HNL  dep 15:50  arr 16:30  delay   +20  turnaround  28
leg 10  HNL->OGG  dep 17:05  arr 17:44  delay   +28  turnaround  35
leg 11  OGG->HNL  dep 18:15  arr 18:55  delay   +36  turnaround  31
leg 12  HNL->LIH  dep 19:30  arr 20:11  delay   +37  turnaround  35
leg 13  LIH->HNL  dep 20:39  arr 21:15  delay   +25  turnaround  28
```

Read the delay column downward. The morning is clean — four minutes, minus one, minus
three. From leg 8 onward it climbs and never recovers: fifteen, twenty, twenty-eight,
thirty-six, thirty-seven. That is not thirteen independent delays. That is one aircraft
falling progressively further behind its own schedule, and it is the 39.8% happening in
front of you rather than in a bar chart.

Now look at the turnarounds. Twenty-eight, thirty, thirty-one, thirty-five. Against an
assumed minimum of thirty, this rotation has effectively no slack anywhere in it.

Injecting delay makes that concrete:

```
 20 min injected ->    63 min cascade,  4 legs,  3.15x
 60 min injected ->   827 min cascade, 12 legs, 13.78x
 90 min injected ->  1187 min cascade, 12 legs, 13.19x
```

Twenty minutes — the length of a slow bag load — costs an hour across the day. Ninety
minutes costs **nineteen and a half hours**, spread over twelve flights and several
thousand passengers who were never on the delayed aircraft.

The per-leg figures show why the drawing was wrong:

```
leg  2  +94    leg  6  +67    leg 10  +95
leg  3  +84    leg  7  +72    leg 11  +122
leg  4  +81    leg  8  +63    leg 12  +153
leg  5  +84    leg  9  +80    leg 13  +192
```

The cascade does not decay. It grows. Each leg is scheduled tighter than the aircraft is
now running, so every turnaround adds rather than absorbs. My August diagram showed a delay
roughly tripling across four legs, and it understated the problem because I had drawn a
four-leg day. Real short-haul rotations run to fourteen.

## The bug in the number I was about to publish

I had a draft of this post that said the amplification was **15.4** and the cascade 1,389
minutes. Both are wrong, and the reason is in the rotation above if you look for it.

The real fourteenth leg is `OGG->HNL`, departing 22:00. Leg thirteen lands at **HNL** at
21:15. The aircraft is in Honolulu and the next leg departs from Kahului.

It cannot be in two places. A leg is missing — a cancelled or diverted flight, filtered out
upstream by design, or a positioning flight that never appears in the on-time file at all.
My reconstruction saw a forty-five minute gap and called it a turnaround, then propagated
delay across a connection that does not exist.

So the tool now checks that each leg departs from where the previous one landed:

```python
if previous_dest is not None and previous_dest != str(row.origin):
    # The aircraft did not fly here from where it last landed, so a leg
    # is missing and the gap is not a turnaround. Propagating across it
    # would invent a connection the data does not support.
    stopped_at_break = seq
    break
```

The corrected figures are twelve legs, 1,187 minutes, **13.19x**, and the result reports
`stopped_at_continuity_break: 14` so the truncation is visible rather than silent.

Thirteen is a less impressive number than fifteen. It is also the true one, and I only
found it because the rotation was printed in full and something looked wrong.

## The tests passed and the code was wrong

The first run against real data failed immediately, with all twenty-three tests green.

The fixture built `fl_date` as `"2024-01-05"`, a string, because I typed it by hand. The
feature store stores a datetime, where that text matches nothing — the value is
`"2024-01-05 00:00:00"`. The filter matched zero rows and the tool refused, politely, for a
reason with nothing to do with aircraft.

The arithmetic tests were right. The schema assumption underneath them was wrong, and no
amount of testing the arithmetic was going to surface that. Both sides are now normalised
to a date before comparing, an unparseable date is refused rather than silently matching
nothing, and the regression test builds its fixture with real timestamps.

Synthetic fixtures verify maths. They do not verify that your data looks like you think it
does. Both bugs in this post — the string date and the impossible turnaround — were found
by running against real rows and reading the output, not by testing.

## Two agents, and the three I did not build

Cascade analysis reads different columns and reasons differently from route statistics, so
it became its own specialist: an analyst over the aggregate tools, a cascade specialist
over the rotation tools, and a router that makes one choice between them. The router is a
single classification, separated into its own function so a wrong route is diagnosable on
its own rather than through whatever the specialist said afterwards.

I was offered a design with six agents: add a predictor, an explainer, and a critic.

The predictor would wrap one tool. The explainer would rephrase another agent's sentence.
Each costs a round trip and adds a failure mode without adding a decision.

The critic is worse than unnecessary. Its job would be checking that every number came from
a tool — but that is decidable in code. Figures enter the conversation only as tool output,
so the property is structural. Replacing it with a language model that reviews another
language model swaps a guarantee for a probability, and calls that an improvement. It is
the one part of this system I am least willing to weaken.

## What this does not solve

- Rotations crossing midnight are not followed into the next day. The tool reports
  `crosses_midnight` rather than pretending a day is self-contained.
- The thirty-minute minimum turnaround is an assumption. A real figure varies by carrier,
  airport and aircraft size, and every simulated result returns the assumption alongside it.
- A simulation is not a forecast. It says what the schedule implies with no re-timing, no
  aircraft swap and no recovery action — which is precisely what an operations team would
  actually do. The number is an upper bound on a day nobody intervenes in.
- Continuity breaks stop the simulation rather than bridging it. That is the honest
  behaviour and it means a rotation with a mid-day gap is analysed only up to the gap.
- I have not yet checked whether simulated cascade across all 1,626,052 flights reproduces
  the 39.8% I published. If it disagrees, the model is wrong, and I would rather find that
  than have a reader find it.

## Check your own pipeline today

1. Open the script that acquires your data, not the one that transforms it, and read its
   column list. Acquisition is where columns disappear without an error.
2. For every column you dropped, write down the question it would have answered. If you
   cannot think of one, keep dropping it.
3. Take your most-cited finding and ask whether you can compute it or only quote it. Those
   are different, and only one survives a follow-up question.
4. Check that identity columns are nullable and left null. A placeholder that silently
   joins unrelated rows is worse than an absent column.
5. Build one test fixture from a real row instead of by hand, and diff its dtypes against
   the fixture you wrote. That is a two-minute check that would have saved me an afternoon.
6. Print one full record end to end and read it. Not a summary statistic — the actual rows.
   The impossible turnaround was visible the moment fourteen legs were on screen together.
7. For every agent in your design, name the decision it makes. If the answer is "it
   rephrases" or "it double-checks", delete it and put the check in code.

Code, tests and the rotation tooling are at
[github.com/nazsats/flight-delay-intelligence](https://github.com/nazsats/flight-delay-intelligence).
The data is public-domain US DOT on-time performance — flights, not passengers, so there is
nothing personal in it.
