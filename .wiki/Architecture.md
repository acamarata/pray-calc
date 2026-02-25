# Architecture

## Module Structure

```
src/
├── index.ts              Main exports
├── types.ts              All interfaces and type aliases
├── getSolarEphemeris.ts  Jean Meeus solar declination, r, ecliptic lon
├── getMSC.ts             MSC piecewise seasonal model
├── getAngles.ts          Dynamic Fajr/Isha angle computation
├── getAsr.ts             Asr from noon + declination
├── getQiyam.ts           Last-third-of-night calculation
├── getTimes.ts           Raw fractional-hour prayer times
├── calcTimes.ts          Formatted HH:MM:SS prayer times
├── getTimesAll.ts        All-methods comparison (raw)
└── calcTimesAll.ts       All-methods comparison (formatted)
```

## Data Flow

```
Date + lat/lng/tz/elev/temp/pressure
        │
        ├─► getSolarEphemeris()  ──► decl, r, eclLon
        │
        ├─► getMscFajr/Isha()    ──► minutes offset
        │
        └─► getAngles()          ──► fajrAngle, ishaAngle
                │
                ▼
        nrel-spa getSpa()
        (batch zenith angles)
                │
                ├─► spaData.angles[0].sunrise  = Fajr
                ├─► spaData.sunrise             = Sunrise
                ├─► spaData.solarNoon           = Noon
                ├─► spaData.sunset              = Maghrib
                └─► spaData.angles[1].sunset    = Isha
                        │
                        ├─► getAsr(noon, lat, decl)
                        └─► getQiyam(fajr, isha)
```

For `getTimesAll`, the SPA call is extended to include all method zenith angles:

```
allZeniths = [
  fajrZenith,   // dynamic Fajr
  ishaZenith,   // dynamic Isha
  ...methodZeniths  // 14 × 2 = 28 more
]
```

One SPA call, 30 zenith angles. Methods with fixed-minute Isha (UAQ, Qatar) use a
placeholder zenith for the SPA call but override the result with `sunset + minutes`.
The MSC entry uses MSC minutes offsets relative to the SPA-computed sunrise/sunset.

## External Dependency

The only runtime dependency is `nrel-spa`. It provides:

- `getSpa(date, lat, lng, tz, opts, zeniths)` — batch NREL SPA computation
- `formatTime(fractionalHours)` — converts `5.5` to `"05:30:00"`, returns `"N/A"` for NaN

The SPA (Solar Position Algorithm) from the National Renewable Energy Laboratory is
the reference algorithm for solar position. It is accurate to within ±0.0003° and
covers dates from -2000 to +6000.

## Solar Ephemeris

`getSolarEphemeris` implements Jean Meeus, *Astronomical Algorithms* (2nd ed.),
Chapter 25. This provides:

- Solar declination (δ) — accurate to ~0.01°
- Earth-Sun distance (r) in AU — accurate to ~0.0001 AU
- Apparent ecliptic longitude (λ) in degrees

These values are used by `getAngles` to apply physics corrections to the MSC base
angle. They are computed independently of the full SPA call using a faster,
lower-precision path that is sufficient for the correction magnitudes involved.

Why not use the SPA declination? The nrel-spa public API does not expose solar
declination. The SPA computes it internally, but the value is not part of the
public interface. Rather than monkey-patching nrel-spa or making a second SPA call
with a known reference point, the Meeus equations provide a clean solution at
adequate accuracy.

## Asr Computation

`getAsr` does not call the SPA. Instead, it solves the shadow-ratio equation
analytically:

```
// Shadow ratio: s = 1 (Shafi'i) or s = 2 (Hanafi)
altitude = arccot(s + tan(|latitude - declination|))
cos(hourAngle) = (sin(altitude) - sin(lat)sin(decl)) / (cos(lat)cos(decl))
asrTime = solarNoon + hourAngle (converted to hours)
```

This is faster than an SPA call and avoids a dependency on internal ephemeris state.

## Type System

All public types are in `src/types.ts` and re-exported from `src/index.ts`. The key
distinction is:

- `FractionalHours` (`number`) — raw output from `getTimes` / `getTimesAll`
- `TimeString` (`string`) — formatted output from `calcTimes` / `calcTimesAll`

`PrayerTimesAll` extends `PrayerTimes` rather than duplicating fields. The `Methods`
map uses string keys (method IDs) rather than a union type, to allow forward
compatibility without breaking changes when methods are added.

## Build

`tsup` builds dual CJS/ESM output:

```
dist/
├── index.cjs       CJS bundle
├── index.mjs       ESM bundle
├── index.d.ts      CJS type declarations
└── index.d.mts     ESM type declarations
```

Source maps are included. `sideEffects: false` allows tree-shaking.

---

*[Back to Home](Home) | [API Reference](API-Reference) | [Dynamic Algorithm](Dynamic-Algorithm)*
