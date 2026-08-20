## 2.2.0 — 2026-08-19

### Added
- **High-latitude rules for Fajr and Isha**, opt-in via a trailing `highLatitudeRule` argument on `getTimes`, `getTimesAll`, `calcTimes` and `calcTimesAll`. Six options: `none` (default), `middleOfNight`, `oneSeventh`, `angleBased`, `aqrabAlBilad` (nearest latitude, the 45th parallel) and `aqrabAlAyyam` (nearest date with an observable sign). The default substitutes nothing: past the geometric limit every answer is a juristic position rather than a calculation, and a library that picks one silently is issuing a ruling on the caller's behalf.
- **`provenance` on every result**, naming the origin of Fajr and Isha as `observed`, the rule that supplied it, or `unavailable`. A substituted time can never be mistaken for a computed one.

### Fixed
- Requires `nrel-spa` >= 2.1.0, which stops the NREL `-99999` sentinel from reaching callers. With earlier versions an unreachable time arrived as a finite number, passed every `Number.isFinite` guard, and rendered as "09:00". This affected `getTimes` and `getTimesAll` (the numeric APIs); `calcTimes`/`calcTimesAll` masked it as `"N/A"`.
- `Dhuhr` and `Asr` are now available every day at every latitude, following the `solarNoon` recovery in nrel-spa 2.1.0. At Longyearbyen on 2026-06-21 the library previously returned nothing at all; it now returns Dhuhr 12:01:43 and Asr 18:07:51 with Fajr, Sunrise, Maghrib and Isha correctly absent.

### Notes
- The three night-proportion rules divide the span between sunset and sunrise, so inside the polar circles they have nothing to measure and correctly decline. Only `aqrabAlBilad` and `aqrabAlAyyam` cover those latitudes.
- Per-method entries in `getTimesAll` are never substituted: that map exists to show which methods are applicable where.
- Documentation corrected — the wiki previously claimed `getTimes` "always returns a finite time for all latitudes", that the library "propagates NaN unchanged", and that the MSC model applied an automatic seventh-of-night rule above 57 degrees. None of the three was true.

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.2] - 2026-05-30

### Fixed
- Add explicit `files` field to package.json; remove `.npmignore` to ensure correct published file set
- Include `dist/index.d.mts` in published package (was missing from 2.1.1)

## [2.1.1] - 2026-05-28

### Changed
- Flatten exports map to ADR-015 standard (import/require/types at top level)
- Add "./package.json" export condition
- Add coverage script (c8 --reporter=lcov)
- Migrate CI from pnpm/action-setup to corepack enable

## [2.1.0] - 2026-05-28

### Added
- Initial release
