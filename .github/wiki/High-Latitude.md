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

The Moonsighting Committee Worldwide algorithm handles this by design. Because it
works in minutes rather than angles, it naturally produces reasonable times even
when fixed angles would fail:

- The minute offsets grow with latitude but are bounded by the seasonal interpolation
- At very high latitudes, the model applies a "Sab'u lail" (seventh-of-night) rule:
  divide the night into 7 parts; Isha starts at the end of the first seventh, Fajr
  ends at the start of the last seventh

This produces the longest practical Isha-Fajr interval allowed by the model, which
corresponds roughly to the juristic principle of not making the night shorter than
1/7 of the 24-hour period.

## When This Applies

The MSC model is used as the base for the dynamic method. The model transitions to
the seventh-of-night rule at approximately latitude 57°N/S (varies slightly by season
and longitude). pray-calc inherits this behavior automatically.

For the MSC entry in `getTimesAll`, the same model is used directly.

## Fixed-Angle Methods at High Latitudes

The 13 other methods in `getTimesAll` use fixed depression angles. For dates and
locations where the Sun never reaches the specified angle, the NREL SPA returns
`NaN` for that rise/set event. pray-calc propagates `NaN` unchanged; `calcTimesAll`
renders it as `"N/A"`.

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

The dynamic method (`getTimes`, `calcTimes`) uses the MSC model as its base.
The MSC model handles high latitudes with the seventh-of-night fallback. This
means `getTimes` always returns a finite time for all latitudes.

The Methods map in `getTimesAll` returns `NaN` for any fixed-angle method that
fails for a given location/date. This allows the caller to detect which methods
are inapplicable and apply their own high-latitude policy.

---

_[Back to Home](Home) | [Twilight Physics](Twilight-Physics) | [Dynamic Algorithm](Dynamic-Algorithm)_
