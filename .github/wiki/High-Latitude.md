# High-Latitude Handling

## The Problem

At latitudes above approximately 48.5°N/S, the Sun never reaches 18° below the
horizon during summer months. Above 51.5°N/S, it never reaches 15° below the
horizon. During these periods, a fixed-angle method produces no Isha: or computes
a sunrise before Fajr, or other nonsensical results.

Even at latitudes where the Sun does reach 18°, the resulting times can be extreme.
At 52°N in summer, a 15° Isha occurs around 2–3 AM, making a 4 AM Fajr effectively
continuous with Isha. Islamic jurisprudence recognizes this as hardship (_haraj_)
and provides accommodations.

## The MSC Approach

The Moonsighting Committee Worldwide algorithm works in minutes from sunrise and sunset
rather than in depression angles, so its offsets grow with latitude and stay bounded by
the seasonal interpolation. That keeps it usable at latitudes where a fixed angle has
already failed.

It does not, however, remove the underlying limit. The model still measures from sunrise
and sunset, so on a day with neither — anywhere inside the polar circles — it has nothing
to measure from and produces no time.

> **Correction (2026-08-19).** Earlier versions of this page stated that the model
> "applies a Sab'u lail (seventh-of-night) rule" above roughly 57 degrees and that
> "pray-calc inherits this behavior automatically". No such branch existed in the code:
> `getMSC` is a piecewise-linear seasonal interpolation with no latitude fallback, and
> its own source comment said the seventh-of-night approximation was "handled at the
> calling site" while no calling site implemented it. The seventh-of-night rule is now
> genuinely available, but as one of the opt-in high-latitude rules below rather than as
> automatic behaviour.

## Fixed-Angle Methods at High Latitudes

The 13 other methods in `getTimesAll` use fixed depression angles. For dates and
locations where the Sun never reaches the specified angle, the event has no time.
`getTimesAll` reports it as `NaN` and `calcTimesAll` renders it as `"N/A"`.

> **Correction (2026-08-19).** This page previously said the SPA "returns `NaN`" and that
> pray-calc "propagates `NaN` unchanged". Neither was true. The NREL reference writes the
> sentinel `-99999` for an event that does not occur, and that value flowed through the
> public API untouched. Because `-99999` is a *finite* number it passed every
> `Number.isFinite` guard downstream and rendered as a confident clock time — `-99999`
> reduced modulo 24 is exactly 9, so consumers displayed "09:00" for both sunrise and
> sunset on a Svalbard summer day. Fixed in nrel-spa: the sentinel now stops at the API
> boundary and the statement above is accurate.

This is intentional. The Methods map in `getTimesAll` shows you exactly which methods
are applicable for a given location and date. If ISNA returns `N/A` for Isha in
London in June, that is the correct answer for that method: it simply doesn't work
there.

## Juristic Solutions

Islamic scholars have proposed several approaches for high-latitude regions:

### Nearest Latitude (Aqrab al-Bilad)

Use the prayer times of the nearest city where the Sun does reach the required
angle, scaled to local midnight.

### Nearest Day (Aqrab al-Ayyam)

Use the prayer times from the nearest date in the year when the Sun does reach
the required angle at the same location.

### Seventh of Night (Sab'u lail)

Divide the 24-hour period (from midnight to midnight, or from Maghrib to Fajr)
into 7 equal parts. Isha begins at the end of the first seventh; Fajr begins at
the start of the last seventh.

### Specific Latitude Cutoff

Many North American institutions use the rule: above 48.5°N, compute times as
if the latitude were 48.5°N. This is simple and avoids discontinuities.

### Makkah Time

A minority position: use Makkah's times globally. Not widely adopted outside
of specific communities.

## What pray-calc Does

Nothing, unless you ask it to.

`getTimes` and `calcTimes` return Fajr and Isha as `NaN` / `"N/A"` whenever the sun does
not reach the required depression, and every result carries a `provenance` field naming
the origin of each time:

| provenance value | meaning |
|---|---|
| `observed` | solved from the sun's actual position on that date at that location |
| `middleOfNight`, `oneSeventh`, `angleBased`, `aqrabAlBilad`, `aqrabAlAyyam` | supplied by that rule |
| `unavailable` | no observable time, and no rule able to supply one |

Pass a rule as the trailing `highLatitudeRule` argument to enable a substitution:

```js
import { calcTimes } from "pray-calc";

// Default: nothing is substituted.
const strict = calcTimes(date, 78.22334, 15.64689, 1);
// → Fajr "N/A", Isha "N/A", provenance.Fajr "unavailable"

// Nearest latitude (the 45th parallel).
const supplied = calcTimes(date, 78.22334, 15.64689, 1, 0, 15, 1013.25, false, "aqrabAlBilad");
// → Fajr and Isha present, provenance.Fajr "aqrabAlBilad"
```

### Which rule reaches which latitudes

| Rule | Needs | Covers Helsinki in June | Covers Svalbard in July |
|---|---|---|---|
| `none` (default) | nothing | reports absent | reports absent |
| `middleOfNight` | a real sunset and sunrise | yes | **no** |
| `oneSeventh` | a real sunset and sunrise | yes | **no** |
| `angleBased` | a real sunset and sunrise | yes | **no** |
| `aqrabAlBilad` | nothing | yes | yes |
| `aqrabAlAyyam` | nothing | yes | yes |

The night-proportion rules divide the span between sunset and sunrise. Inside the polar
circles neither event occurs, so there is no night to divide and those three rules
correctly decline to invent one. Only the two nearest-substitution rules cover the polar
circles.

### Why the default substitutes nothing

Past the geometric limit there is no observable dawn or nightfall, so every candidate
answer is a juristic position rather than a calculation. Scholars differ, and a library
that silently picks one is issuing a ruling on the caller's behalf. `pray-calc` reports
the absence, offers the recognised options, and records which one produced any given time.

### Methods map

The `Methods` entries in `getTimesAll` are never substituted, whatever rule is enabled.
That map exists to show which methods are applicable at a location and date, so a method
that cannot produce a time there has to keep saying so.

### A note on Dhuhr and Asr inside the polar circles

Sunrise and sunset genuinely stop occurring, but the sun crosses the local meridian every
day everywhere on Earth, so solar noon is always defined and Dhuhr and Asr remain
computable. During polar *night* that crossing happens below the horizon — at Longyearbyen
in late December the sun peaks near -11.7 degrees — so those times are astronomically real
but never observable. They are reported; whether to use them is, again, a question for the
caller.

---

_[Back to Home](Home) | [Twilight Physics](Twilight-Physics) | [Dynamic Algorithm](Dynamic-Algorithm)_
