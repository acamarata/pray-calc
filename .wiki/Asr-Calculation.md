# Asr Calculation

## The Rule

Asr is the afternoon prayer. Its start time is defined by shadow length, not by
a solar depression angle.

The standard definition: Asr begins when an object's shadow equals its height
**plus** the length of its shadow at solar noon.

For the Shafi'i, Maliki, and Hanbali schools of law (the majority), the shadow
multiplier is **1**. For the Hanafi school, the multiplier is **2**.

In practice, the difference is typically 30–60 minutes, with Hanafi Asr being later.

## The Math

Let:
- φ = observer latitude in radians
- δ = solar declination in radians at local noon
- s = shadow factor (1 for Shafi'i, 2 for Hanafi)

The Sun's altitude when the shadow multiplier condition is met:

```
A = arccot(s + tan(|φ - δ|))
  = arctan(1 / (s + tan(|φ - δ|)))
```

This altitude corresponds to a specific hour angle H:

```
cos(H) = (sin(A) - sin(φ)sin(δ)) / (cos(φ)cos(δ))
```

Asr time in local fractional hours:

```
asrTime = solarNoon + H / 15  (H in degrees, since 15° = 1 hour)
```

If `cos(H) < -1` or `cos(H) > 1`, the Sun never reaches the required altitude,
and `getAsr` returns `NaN`. This can happen at extreme latitudes when latitude
and declination are far apart.

## Implementation

`getAsr` is a pure math function. It requires:

1. `solarNoon`: fractional hours (from the SPA output)
2. `latitude`: decimal degrees
3. `declination`: solar declination in degrees (from `solarEphemeris`)
4. `hanafi`: boolean (default `false`)

```typescript
import { getAsr } from 'pray-calc';

const asr = getAsr(
  12.15,    // solar noon at ~12:09 local time
  40.7128,  // New York latitude
  23.44,    // solar declination at summer solstice
  false,    // Shafi'i
);
```

## Why Not Use the SPA for Asr?

Some prayer time libraries solve for Asr by running the SPA with the altitude A
as the zenith input. This requires an extra SPA call or a second zenith slot in
the batch call.

pray-calc computes Asr analytically using the Meeus declination (`solarEphemeris`)
rather than the SPA's internal declination. This avoids a second SPA call, removes
any dependency on internal SPA state, and is accurate to well within a minute
for any realistic use case.

The SPA uses a more rigorous ephemeris for declination (accurate to ~0.0003°
vs. Meeus at ~0.01°). For Asr, the difference in δ of 0.01° translates to less
than 5 seconds of timing error: completely negligible.

---

*[Back to Home](Home) | [API Reference](API-Reference) | [Architecture](Architecture)*
