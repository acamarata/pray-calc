# pray-calc

[![npm version](https://img.shields.io/npm/v/pray-calc)](https://www.npmjs.com/package/pray-calc)
[![CI](https://github.com/acamarata/pray-calc/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/pray-calc/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Islamic prayer times for any location and date. The primary method uses a physics-grounded dynamic twilight angle algorithm that adjusts Fajr and Isha angles for latitude, season, Earth-Sun distance, and atmospheric conditions. Fourteen traditional fixed-angle methods are included for comparison. Single runtime dependency: [nrel-spa](https://github.com/acamarata/nrel-spa).

## Installation

```bash
npm install pray-calc
```

## Quick Start

```typescript
import { calcTimes } from 'pray-calc';

const times = calcTimes(
  new Date('2024-06-21'),
  40.7128,  // New York latitude
  -74.0060, // longitude
  -4,       // UTC offset (hours)
);

console.log(times.Fajr);    // "03:51:24"
console.log(times.Sunrise); // "05:25:08"
console.log(times.Dhuhr);   // "13:01:17"
console.log(times.Asr);     // "17:02:43"
console.log(times.Maghrib); // "20:31:17"
console.log(times.Isha);    // "22:07:43"
```

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

## Related

- [nrel-spa](https://github.com/acamarata/nrel-spa): NREL Solar Position Algorithm (the solar foundation)
- [luxon-hijri](https://github.com/acamarata/luxon-hijri): Hijri/Gregorian calendar
- [moon-sighting](https://github.com/acamarata/moon-sighting): Crescent visibility calculations

## Acknowledgments

Solar position calculations use [nrel-spa](https://github.com/acamarata/nrel-spa), a port of the NREL SPA by Ibrahim Reda and Afshin Andreas. The seasonal twilight model builds on the work of Khalid Shaukat (Moonsighting Committee Worldwide).

## License

MIT. Copyright (c) 2023-2026 Aric Camarata.
