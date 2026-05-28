# pray-calc — PRI (Per-Repo Instructions)

**Cascade:** GCI → ASI → PPI (`/Volumes/X9/Sites/acamarata/.claude/CLAUDE.md`) → **PRI (this file)**

## What This Is

High-precision Islamic prayer times calculator in TypeScript. Computes Fajr, Dhuhr, Asr,
Maghrib, Isha, Qiyam, Sunrise, and solar Noon for any location on Earth. Uses a physics-
grounded dynamic twilight angle algorithm as the primary method. Includes 14 traditional
fixed-angle methods for direct comparison.

**npm:** `pray-calc@2.1.0`
**Language:** TypeScript source → dual CJS/ESM build (tsup)
**Node requirement:** >=20
**License:** MIT

## Dependencies

- **nrel-spa** (^2.0.1) — NREL Solar Position Algorithm (zero-dep, sync, acamarata's own)
- No moon dependency. Moon data: use `moon-sighting` package.

Dev: @types/node, tsup, typescript

## v2 API Surface

```typescript
// Core functions
getTimes(date, lat, lng, tz?, elevation?, temperature?, pressure?, hanafi?): PrayerTimes
calcTimes(...): FormattedPrayerTimes
getTimesAll(...): PrayerTimesAll
calcTimesAll(...): FormattedPrayerTimesAll

// Low-level
getAngles(date, lat, lng, elevation?, temperature?, pressure?): TwilightAngles
getAsr(solarNoon, latitude, declination, hanafi?): number
getQiyam(fajrTime, ishaTime): number
getMscFajr(date, latitude): number          // minutes before sunrise
getMscIsha(date, latitude, shafaq?): number // minutes after sunset

// Ephemeris
solarEphemeris(jd): { decl, r, eclLon }
toJulianDate(date): number

// Reference data
METHODS: MethodDefinition[]
```

`nrel-spa` API (v2.x): `getSpa(date, lat, lng, tz, opts, zeniths)` and `formatTime(h)`
Note: `fractalTime` was renamed to `formatTime` in v2.0.0. `fractalTime` does not exist.

## Module Structure

```
src/
├── index.ts               Main exports
├── types.ts               All TypeScript types
├── getSolarEphemeris.ts   Jean Meeus Ch. 25 — decl, r, eclLon
├── getMSC.ts              MSC piecewise seasonal model
├── getAngles.ts           Dynamic angle algorithm (3 layers)
├── getAsr.ts              Pure-math Asr (no SPA dependency)
├── getQiyam.ts            Last-third-of-night
├── getTimes.ts            Raw fractional-hour output
├── calcTimes.ts           Formatted HH:MM:SS output
├── getTimesAll.ts         All-methods batch SPA call
└── calcTimesAll.ts        All-methods formatted output
```

## Domain Reference

Algorithm math, method angle table, and astronomical research facts:
 — load when working on angle calculations or method constants.

## getSpa Batch Pattern

`getTimesAll` uses one SPA call for all 14×2 + 2 dynamic zenith angles:

```typescript
allZeniths = [90+fajrAngle, 90+ishaAngle, ...methodZeniths]
// methodZeniths: 14 methods × 2 = 28 entries
// Methods with null ishaAngle get placeholder 90+18 (overridden post-call)
spaData.angles[0].sunrise  → dynamic Fajr
spaData.angles[1].sunset   → dynamic Isha
spaData.angles[2+i*2].sunrise → method[i] Fajr
spaData.angles[2+i*2+1].sunset → method[i] Isha (if angle-based)
```

## Commands

- `pnpm build` — tsup dual CJS/ESM build
- `pnpm run typecheck` — tsc --noEmit
- `pnpm test` — build + node test.mjs + node test-cjs.cjs (94 ESM + 12 CJS = 106 tests)

## Version History

- **v2.0.0** — TypeScript rewrite, 14 methods, physics corrections, no suncalc, no moon
- **v1.7.2** — Last CJS version with moon functions (getMoon, getMoonPhase, etc.)
- Moon functions migrated to `moon-sighting` package

## Moon Migration

All moon functions removed from v2. Users should:

```bash
pnpm add moon-sighting
```

Map: `getMoon` → `getMoon`, `getMoonPhase` → `getMoonPhase`, etc.
See `.github/wiki/Moon-Migration.md` for full table. moon-sighting uses Meeus Ch.47/48 +
Odeh 2006 visibility, no suncalc dependency.

## Related

- nrel-spa: `~/Sites/acamarata/nrel-spa/` — solar foundation
- moon-sighting: `~/Sites/acamarata/moon-sighting/` — lunar data
- praycalc.com — live demo
- praycalc.net — documentation site
