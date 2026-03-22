# pray-calc

[![npm version](https://img.shields.io/npm/v/pray-calc)](https://www.npmjs.com/package/pray-calc)
[![CI](https://github.com/acamarata/pray-calc/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/pray-calc/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Islamic prayer times for any location and date. The primary method uses a physics-grounded dynamic twilight angle algorithm that adjusts Fajr and Isha angles for latitude, season, Earth-Sun distance, and atmospheric conditions. Fourteen traditional fixed-angle methods are included for direct comparison.

## Installation

```bash
pnpm add pray-calc   # or npm install pray-calc
```

## Quick Start

```typescript
import { calcTimes } from 'pray-calc';

const times = calcTimes(
  new Date('2024-06-21'),
  40.7128,   // New York latitude
  -74.0060,  // longitude
  -4,        // UTC offset (hours)
);

console.log(times.Fajr);    // "03:51:24"
console.log(times.Sunrise); // "05:25:08"
console.log(times.Dhuhr);   // "13:01:17"
console.log(times.Asr);     // "17:02:43"
console.log(times.Maghrib); // "20:31:17"
console.log(times.Isha);    // "22:07:43"
console.log(times.angles);  // { fajrAngle: 14.8, ishaAngle: 14.6 }
```

### CJS

```javascript
const { calcTimes } = require('pray-calc');
```

### Compare all methods

```typescript
import { calcTimesAll } from 'pray-calc';

const all = calcTimesAll(new Date('2024-06-21'), 40.7128, -74.0060, -4);

// Dynamic primary times
console.log(all.Fajr);   // "03:51:24"

// Traditional method comparison
console.log(all.Methods.ISNA);    // ["03:57:12", "22:22:18"]  [fajr, isha]
console.log(all.Methods.MWL);     // ["03:25:08", "22:40:31"]
console.log(all.Methods.MSC);     // ["03:53:41", "22:09:12"]
```

## API

### `getTimes(date, lat, lng, tz?, elevation?, temperature?, pressure?, hanafi?)`

Returns raw fractional-hour prayer times using the dynamic method.

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `date` | `Date` | required | Observer's local date |
| `lat` | `number` | required | Latitude, decimal degrees |
| `lng` | `number` | required | Longitude, decimal degrees |
| `tz` | `number` | system offset | UTC offset in hours |
| `elevation` | `number` | `0` | Meters above sea level |
| `temperature` | `number` | `15` | Ambient temperature, °C |
| `pressure` | `number` | `1013.25` | Atmospheric pressure, mbar |
| `hanafi` | `boolean` | `false` | Asr convention: false = Shafi'i, true = Hanafi |

Returns `PrayerTimes`: `{ Qiyam, Fajr, Sunrise, Noon, Dhuhr, Asr, Maghrib, Isha, Midnight, angles }`.
All times are fractional hours in local time (e.g., `5.5` = 05:30:00). `NaN` when an event
cannot be computed (polar night, etc.).

### `calcTimes(date, lat, lng, tz?, elevation?, temperature?, pressure?, hanafi?)`

Same as `getTimes`, formatted as `HH:MM:SS` strings. Returns `"N/A"` for unavailable times.

### `getTimesAll(...)`

Same signature. Returns `PrayerTimesAll`: extends `PrayerTimes` with `Methods`, a record
mapping each of the 14 method IDs to `[fajrTime, ishaTime]` as fractional hours.

### `calcTimesAll(...)`

Same as `getTimesAll`, fully formatted. `Methods` values are `[fajrString, ishaString]`.

### `getAngles(date, lat, lng, elevation?, temperature?, pressure?)`

Returns `{ fajrAngle, ishaAngle }` in degrees (positive = below horizon).

### `getAsr(solarNoon, latitude, declination, hanafi?)`

Computes Asr from solar noon time, latitude, and solar declination. Returns fractional hours.

### `getQiyam(fajrTime, ishaTime)`

Returns the start of the last third of the night as fractional hours.

### `getMidnight(maghribTime, endTime)`

Returns the midpoint of the night as fractional hours. Pass Fajr as `endTime` for the
standard definition (Maghrib-to-Fajr midpoint), or Sunrise for the astronomical variant.

### `getMscFajr(date, latitude)` / `getMscIsha(date, latitude, shafaq?)`

Moonsighting Committee Worldwide minute offsets: minutes before sunrise (Fajr) and
minutes after sunset (Isha). `shafaq` controls which twilight phase is used for Isha:
`'general'` (default), `'ahmer'` (red glow), or `'abyad'` (white glow).

### `METHODS`

Exported array of all 14 `MethodDefinition` objects.

## Supported Methods

| ID | Name | Fajr | Isha | Region |
| -- | ---- | ---- | ---- | ------ |
| `UOIF` | Union des Organisations Islamiques de France | 12° | 12° | France |
| `ISNACA` | IQNA / Islamic Council of North America | 13° | 13° | Canada |
| `ISNA` | FCNA / Islamic Society of North America | 15° | 15° | US, UK, AU, NZ |
| `SAMR` | Spiritual Administration of Muslims of Russia | 16° | 15° | Russia |
| `IGUT` | Institute of Geophysics, Univ. of Tehran | 17.7° | 14° | Iran |
| `MWL` | Muslim World League | 18° | 17° | Global |
| `DIBT` | Diyanet, Turkey | 18° | 17° | Turkey |
| `Karachi` | Univ. of Islamic Sciences, Karachi | 18° | 18° | PK, BD, IN, AF |
| `Kuwait` | Kuwait Ministry of Islamic Affairs | 18° | 17.5° | Kuwait |
| `UAQ` | Umm Al-Qura Univ., Makkah | 18.5° | +90 min | Saudi Arabia |
| `Qatar` | Qatar / Gulf Standard | 18° | +90 min | Qatar, Gulf |
| `Egypt` | Egyptian General Authority of Survey | 19.5° | 17.5° | EG, SY, IQ, LB |
| `MUIS` | Majlis Ugama Islam Singapura | 20° | 18° | Singapore |
| `MSC` | Moonsighting Committee Worldwide | seasonal | seasonal | Global |

## Dynamic Method

Standard prayer time libraries use a fixed angle (e.g., MWL: 18°) applied globally.
This works near the equator but fails at higher latitudes: above 48.5°N in summer, the
Sun never reaches 18° depression, so a 18°-everywhere library produces missing Isha
times. Observational campaigns also show that at mid-latitudes, true dawn appears when
the Sun is around 14–16° below the horizon, not 18°.

The dynamic method computes the angle in three layers:

1. **MSC seasonal base**: Khalid Shaukat's piecewise model, calibrated against field
   observations across latitudes 0°–55°N/S. Returns minutes before/after sunrise/sunset,
   converted to depression degrees via spherical trigonometry.

2. **Physics corrections**: Earth-Sun distance (r via Jean Meeus elliptical orbit),
   Fourier harmonic smoothing, atmospheric refraction at the computed altitude, and
   elevation horizon dip.

3. **Physical bounds**: clipped to [10°, 22°].

At the equator the result converges to approximately 18°, consistent with historical
usage. At 50–55°N in summer it falls to 12–14°, matching empirical UK observations.

Full detail: [Dynamic Algorithm wiki page](https://github.com/acamarata/pray-calc/wiki/Dynamic-Algorithm)

## Architecture

- Only runtime dependency: `nrel-spa` (NREL Solar Position Algorithm)
- `getSolarEphemeris`: Jean Meeus Ch. 25: declination, Earth-Sun distance, ecliptic lon
- `getTimesAll`: single batch SPA call for all 14×2 + 2 dynamic zenith angles

Full detail: [Architecture wiki page](https://github.com/acamarata/pray-calc/wiki/Architecture)

## Compatibility

- Node.js >= 20
- ESM and CJS builds included
- TypeScript types bundled
- No browser-incompatible APIs

## TypeScript

```typescript
import type {
  PrayerTimes,
  FormattedPrayerTimes,
  PrayerTimesAll,
  FormattedPrayerTimesAll,
  TwilightAngles,
  MethodDefinition,
} from 'pray-calc';
```

## Documentation

Full documentation: [GitHub Wiki](https://github.com/acamarata/pray-calc/wiki)

- [API Reference](https://github.com/acamarata/pray-calc/wiki/API-Reference)
- [Dynamic Algorithm](https://github.com/acamarata/pray-calc/wiki/Dynamic-Algorithm)
- [Traditional Methods](https://github.com/acamarata/pray-calc/wiki/Traditional-Methods)
- [Architecture](https://github.com/acamarata/pray-calc/wiki/Architecture)
- [Twilight Physics](https://github.com/acamarata/pray-calc/wiki/Twilight-Physics)
- [High-Latitude Handling](https://github.com/acamarata/pray-calc/wiki/High-Latitude)

## Related

- [nrel-spa](https://github.com/acamarata/nrel-spa): NREL Solar Position Algorithm
- [luxon-hijri](https://github.com/acamarata/luxon-hijri): Hijri/Gregorian calendar
- [moon-sighting](https://github.com/acamarata/moon-sighting): Crescent visibility

## Acknowledgments

The solar position calculations use [nrel-spa](https://github.com/acamarata/nrel-spa), a pure JavaScript port of the Solar Position Algorithm (SPA) developed by Ibrahim Reda and Afshin Andreas at the National Renewable Energy Laboratory (NREL):

> Reda, I., Andreas, A. (2004). "Solar Position Algorithm for Solar Radiation Applications." Solar Energy, 76(5), 577-589. <https://doi.org/10.1016/j.solener.2003.12.003>

The seasonal twilight model builds on the work of Khalid Shaukat (Moonsighting Committee Worldwide).

## License

MIT. Copyright (c) 2023-2026 Aric Camarata.

See [LICENSE](LICENSE) for full terms.
