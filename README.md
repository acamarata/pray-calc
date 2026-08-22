# pray-calc

[![npm version](https://img.shields.io/npm/v/pray-calc)](https://www.npmjs.com/package/pray-calc)
[![CI](https://github.com/acamarata/pray-calc/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/pray-calc/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Wiki](https://img.shields.io/badge/docs-wiki-blue)](https://github.com/acamarata/pray-calc/wiki)

Islamic prayer times for any location and date. The primary method uses a physics-grounded dynamic twilight angle algorithm that adjusts Fajr and Isha angles for latitude, season, Earth-Sun distance, and atmospheric conditions. Fourteen traditional fixed-angle methods are included for comparison. Single runtime dependency: [nrel-spa](https://github.com/acamarata/nrel-spa).

## Installation

```bash
npm install pray-calc
```

## Quick Start

```typescript
import { calcTimes } from 'pray-calc';

const times = calcTimes(
  '2024-06-21', // calendar day
  40.7128,      // New York latitude
  -74.0060,     // longitude
  -4,           // UTC offset (hours)
);

console.log(times.Fajr);     // "03:34:14"
console.log(times.Sunrise);  // "05:25:07"
console.log(times.Dhuhr);    // "13:00:29"
console.log(times.Asr);      // "16:58:15"
console.log(times.Maghrib);  // "20:30:39"
console.log(times.Isha);     // "21:50:45"
console.log(times.Midnight); // "00:02:26"
```

### Dates

Prayer times belong to a calendar day, not to an instant, and a JavaScript `Date` is an
instant. It carries no record of whether it was built from local or UTC parts, so
`new Date(2024, 5, 21)` and `new Date('2024-06-21')` are different moments that a reader
would call the same day — and which one you get depends on where the machine is.

Pass the day itself and the ambiguity disappears:

```typescript
calcTimes('2024-06-21', lat, lng, tz);   // recommended
```

A `Date` still works, and is read in **local** components — the observer's UTC offset is
already a separate argument, so the date argument is the observer's own calendar day, which
is what `new Date(y, m, d)` and `new Date()` give you. The one form to avoid is
`new Date('2024-06-21')`: that is UTC midnight, which reads as 20 June on any host west of
UTC.

Whichever form you pass, the result depends only on the calendar day, the location and the
options — never on the host timezone, and never on what time of day you asked.

CommonJS:

```js
const { calcTimes } = require('pray-calc');
```

Use `calcTimesAll` to get all 14 traditional method times alongside the dynamic result.

## TypeScript

```typescript
import type {
  PrayerTimes,
  FormattedPrayerTimes,
  PrayerTimesAll,
  MethodDefinition,
} from 'pray-calc';
```

## Documentation

Full API reference, dynamic algorithm details, traditional method table, and high-latitude handling: [GitHub Wiki](https://github.com/acamarata/pray-calc/wiki)

## High latitudes

Above roughly 48.5 degrees the sun stops reaching 18 degrees below the horizon in summer,
and inside the polar circles it stops rising or setting at all for weeks. There is then no
observable dawn or nightfall, so Fajr and Isha have no calculable time.

By default this library reports them as absent (`NaN` / `"N/A"`) rather than substituting
a value, because every substitution is a juristic position rather than an astronomical
result. Six opt-in rules are available — `middleOfNight`, `oneSeventh`, `angleBased`,
`aqrabAlBilad` (nearest latitude, the 45th parallel) and `aqrabAlAyyam` (nearest date) —
passed as the trailing `highLatitudeRule` argument. Note that the three night-proportion
rules need a real sunset to measure from, so only the two nearest-substitution rules cover
the polar circles.

Every result carries a `provenance` field naming the origin of Fajr and Isha, so a
substituted time is never mistaken for a computed one.

Dhuhr and Asr remain available every day at every latitude: the sun crosses the local
meridian even on days it never rises.

Details and the full rule-by-latitude table: [High-Latitude Handling](https://github.com/acamarata/pray-calc/wiki/High-Latitude)

## Related

- [nrel-spa](https://github.com/acamarata/nrel-spa): NREL Solar Position Algorithm (the solar foundation)
- [luxon-hijri](https://github.com/acamarata/luxon-hijri): Hijri/Gregorian calendar
- [moon-sighting](https://github.com/acamarata/moon-sighting): Crescent visibility calculations

## Acknowledgments

Solar position calculations use [nrel-spa](https://github.com/acamarata/nrel-spa), a port of the NREL SPA by Ibrahim Reda and Afshin Andreas. The seasonal twilight model builds on the work of Khalid Shaukat (Moonsighting Committee Worldwide).

## Telemetry

This package supports opt-in anonymous usage telemetry — off by default.
Enable: `ACAMARATA_TELEMETRY=1`. See [TELEMETRY.md](./TELEMETRY.md) for what is sent and how to disable.

## License

MIT. Copyright (c) 2023-2026 Aric Camarata.
