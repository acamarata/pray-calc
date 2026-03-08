# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-02-25

### Added

- Full TypeScript rewrite with dual CJS/ESM build (tsup)
- Physics-grounded dynamic twilight angle algorithm: MSC seasonal base + Earth-Sun distance correction + Fourier harmonic smoothing + atmospheric refraction + elevation horizon dip
- Three new traditional methods: IGUT/Tehran (17.7°/14°), Kuwait (18°/17.5°), Qatar (18°/90 min): total now 14
- `getAngles()` exported as a standalone function
- `getMscFajr()` / `getMscIsha()` exported with `shafaq` mode parameter (`general`, `ahmer`, `abyad`)
- `solarEphemeris()` / `toJulianDate()` exported: Jean Meeus solar ephemeris (declination, r, ecliptic lon)
- `METHODS` array exported for documentation and tooling
- All TypeScript types exported (`PrayerTimes`, `FormattedPrayerTimes`, `PrayerTimesAll`, etc.)
- `.wiki/` documentation: Home, API Reference, Dynamic Algorithm, Traditional Methods, Architecture, Twilight Physics, High-Latitude, Asr Calculation, Changelog
- GitHub Actions CI (Node 20/22/24 matrix, typecheck, pack-check) and wiki sync workflow
- 100-scenario ESM test suite + CJS smoke tests

### Changed

- `getAsr` refactored from internal SPA dependency to pure math using Meeus declination
- `getTimesAll` now batches all 14×2 + 2 dynamic angles in a single SPA call
- `nrel-spa` updated from v1.x to v2.0.1 (`formatTime` replaces `fractalTime`)
- Node engine requirement raised from >=12 to >=20
- Package `exports` field added with types-first conditional exports
- `sideEffects: false` for tree-shaking
- `publishConfig.access: public` added
- `repository.url` uses `git+https://` prefix

### Removed

- All moon-related functions (`getMoon`, `getMoonPhase`, `getMoonPosition`, `getMoonIllumination`, `getMoonVisibility`): moved to `moon-sighting` package
- `suncalc` runtime dependency (removed with moon functions)
- `getEarthSunDistance` helper (inlined into `getSolarEphemeris`)
- `methods.json` (methods now embedded in `getTimesAll.ts` with full metadata)
- CommonJS `index.js` source (replaced by TypeScript `src/`)
- `index.d.ts` hand-written types (replaced by generated `dist/index.d.ts`)
- `mocha` and `eslint` dev dependencies (replaced by plain `node:assert` tests)

## [1.0.0] - 2023-11-11

- Initial release

## [1.1.0] - 2023-11-12

- Updated calculation behavior to be more accurate (major)

## [1.2.3] - 2023-11-12

- Moved timezone to main args and changed default behavior (major)
- Updated test cases and readme to reflect new usage (minor)

## [1.3.2] - 2023-11-13

- Major updates to getMoon with own functions

## [1.4.0] - 2023-11-14

- Renamed to "pray-calc" and removed old package
- Improved Synodic accuracy slightly and lastKnownMoon

### [1.4.1] = 2023-12-01
- Modified getMoonVisibility to use adjusted moon phase for end of cycle

## [1.6.0] = 2025-05-04
- Major fixes for core files and calculations
- Updated to use the new "nrel-spa" v1.3.0

### [1.6.1] - 2025-05-04
- Fixed missing modules and types definitions lost in last update
- Locked `suncalc` dependency to `^1.9.0`
- Clarified scripts: `build`, `test`, and `prepublishOnly` in `package.json`

### [1.6.2] - 2025-05-04
- Fixed Package issues

## [1.7.0] = 2025-05-04
- Major update to main algorithm
- Fixes to syntax and bugs

### [1.7.1] = 2025-05-14
- Update to package meta and location

### [1.7.2] = 2025-05-14
- Added tests
