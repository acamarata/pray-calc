# Dynamic Twilight Angle Algorithm

The core differentiator of pray-calc is that it does not use a fixed depression angle
for Fajr and Isha. Instead, it computes the angle that matches the observable
astronomical phenomenon for the specific location and date.

## Why Fixed Angles Fail

A depression angle is the number of degrees the Sun sits below the horizon. Traditional
methods hard-code a value: ISNA uses 15°, MWL uses 18°, MUIS uses 20°.

This works reasonably well near the equator. At 0° latitude, the Sun's path is nearly
vertical at the horizon, so it passes through any given depression quickly. Twilight is
short, and the sky becomes astronomically dark (18°) close to when it visually darkens
for a human observer.

At higher latitudes, the Sun's path is oblique. It skims below the horizon rather than
diving through it. Two consequences follow:

1. **Twilight is extended.** The sky stays illuminated at a given depression longer
   than at the equator.
2. **The Sun may never reach the required angle.** Above 48.5°N in summer, the Sun
   never reaches 18° depression. Above 51.5°N, it never reaches 15°. A fixed-angle
   method produces no Isha in London for weeks in summer.

Even at mid-latitudes, observational campaigns show that true Fajr (the visible
"white thread" of dawn) appears when the Sun is around 14–16° below the horizon, not
18°. Using 18° makes Fajr 20–30 minutes too early in many regions.

## Three-Layer Model

The `getAngles` function computes a depression angle in three layers.

### Layer 1: MSC Seasonal Base

The Moonsighting Committee Worldwide (Khalid Shaukat) derived a piecewise-linear
empirical model by fitting to field observations across a wide range of latitudes.
The model returns the expected time offset in minutes:

- Fajr: minutes before astronomical sunrise
- Isha: minutes after astronomical sunset

The model uses four seasonal anchor points per latitude (winter solstice, spring
equinox, summer shoulder, summer solstice) and interpolates between them. The
offsets grow with latitude and peak near the summer solstice, reflecting the
astronomical reality of extended twilight.

pray-calc converts those minute offsets to depression angles using spherical
trigonometry:

```
cos(H) = (sin(a) - sin(φ)sin(δ)) / (cos(φ)cos(δ))
depression = -a  (where a is the altitude solution)
```

Where `H` is the hour angle derived from the minute offset, `φ` is latitude,
`δ` is solar declination.

### Layer 2: Physics Corrections

Three corrections are added to the MSC base angle:

**Earth-Sun distance correction (Δr)**

The Earth's orbit is elliptical. At perihelion (January 3), r ≈ 0.983 AU; at
aphelion (July 4), r ≈ 1.017 AU. When the Earth is closer to the Sun, sunlight
is more intense, and the scattering that produces twilight glow begins at a slightly
deeper depression. Conversely, at aphelion, the sky stays darker a bit longer.

```
Δr = -0.5 × ln(r)    (degrees)
```

This correction is ±0.015° over the year: small, but included for completeness.

**Fourier harmonic correction (Δf)**

A double-harmonic model captures the annual and semi-annual variation in observed
twilight angle that is not fully explained by MSC's piecewise model. It uses the
ecliptic longitude (θ, degrees) and absolute latitude (|φ|):

```
Δf = 0.1 × (|φ|/45) × sin(θ × π/180)
   + 0.05 × (|φ|/45) × sin(2θ × π/180)
```

This adds up to ±0.15° at 45°N and proportionally less near the equator.

**Atmospheric refraction**

Near the horizon, refraction bends light rays by about 34 arcminutes. At twilight
angles (Sun 14–18° below horizon), refraction is small: a few arcminutes: but
is still computed via the Bennett/Saemundsson formula for completeness. The current
atmospheric conditions (pressure, temperature) are used.

**Elevation dip**

An observer at elevation `h` meters above sea level sees a horizon that is `d`
degrees below the geometric horizon:

```
d ≈ 1.06 × sqrt(h / 1000)    (degrees)
```

At 1000 m, this is 1.06°: the effective depression for a given visual phenomenon
is reduced by this amount. The correction is:

```
Δe = -0.3 × 1.06 × sqrt(h / 1000)
```

The factor 0.3 reflects that twilight depression is only partially affected by
horizon dip (the illumination geometry is dominated by the upper atmosphere, not
the local horizon).

### Layer 3: Physical Bounds

The final angle is clipped to [10°, 22°]. Below 10° the sun is high enough that
no prayer timing convention places a twilight boundary there; above 22° is outside
the range of any empirical observation of dawn or dusk.

## Validation

The dynamic method should stay within the range defined by the full set of
traditional methods for any given location and date. At equatorial latitudes
it converges to approximately 18°, matching MWL and Karachi. At 50–55°N in
summer it typically produces 12–14°, matching the empirical UK observations
that prompted adjustments from 18° to lower values. At 30–40°N it falls in
the 15–17° range, consistent with the Egyptian and Saudi observational studies.

The `calcTimesAll` function returns comparison times for all 14 traditional
methods alongside the dynamic method, enabling direct comparison.

## High-Latitude Fallback

When the MSC minutes function would produce an angle outside [10°, 22°] or
when the Sun never reaches the computed angle, the bounds clamp the result.
For extreme latitudes (beyond approximately 57°N/S) in summer, the MSC model
itself uses a "seventh-of-night" rule as a juristic fallback, which is respected
here.

## Code Location

The implementation is in [src/getAngles.ts](../src/getAngles.ts). The MSC
piecewise model is in [src/getMSC.ts](../src/getMSC.ts). The solar ephemeris
(declination, r, ecliptic longitude) is in
[src/getSolarEphemeris.ts](../src/getSolarEphemeris.ts).

---

_[Back to Home](Home) | [Traditional Methods](Traditional-Methods) | [Twilight Physics](Twilight-Physics)_
