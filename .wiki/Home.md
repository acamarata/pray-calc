# pray-calc Wiki

**pray-calc** is a TypeScript library for computing Islamic prayer times. Its primary
feature is a physics-grounded dynamic twilight angle algorithm that adjusts Fajr and
Isha angles for latitude, season, and atmospheric conditions. Fourteen traditional
fixed-angle methods are included for comparison.

## Pages

| Page | Description |
|------|-------------|
| [API Reference](API-Reference) | Full function signatures, parameters, return types |
| [Dynamic Algorithm](Dynamic-Algorithm) | How Fajr/Isha angles are computed dynamically |
| [Traditional Methods](Traditional-Methods) | All 14 supported methods and their parameters |
| [Architecture](Architecture) | Module structure, data flow, design decisions |
| [High-Latitude Handling](High-Latitude) | MSC rules for latitudes above 55° |
| [Twilight Physics](Twilight-Physics) | Astronomical and atmospheric background |
| [Asr Calculation](Asr-Calculation) | Shadow-ratio math, Shafi'i vs Hanafi |
| [Moon Migration](Moon-Migration) | Moon functions moved to moon-sighting (v2 migration guide) |
| [Changelog](Changelog) | Version history |

## Research & Accuracy

| Page | Description |
| --- | --- |
| [Research Overview](Research) | Study summary, headline results, PCD algorithm description |
| [Methodology](Research-Methodology) | Reference standard, measurement approach, test infrastructure |
| [Global Accuracy Study](Research-Global-Study) | 18-city comparison across latitudes 6°S–51.5°N and all seasons |
| [Home-Territory Study](Research-Home-Territory) | Each method tested at its own calibration city: PCD wins 13/14 |
| [Observational Evidence](Research-Observational-Evidence) | Field observations, published studies, academic literature |
| [Field Observation Comparison](Research-Verified-Observations) | Systematic comparison of PCD vs real-world verified Fajr measurements |

## Quick Start

```bash
pnpm add pray-calc
```

### ESM

```typescript
import { calcTimes } from 'pray-calc';

const times = calcTimes(
  new Date('2024-06-21'),
  40.7128,   // New York
  -74.0060,
);

console.log(times.Fajr);    // "03:51:24"
console.log(times.Sunrise); // "05:25:08"
console.log(times.Maghrib); // "20:31:17"
console.log(times.Isha);    // "22:07:43"
console.log(times.angles);  // { fajrAngle: 14.8, ishaAngle: 14.6 }
```

### CJS

```javascript
const { calcTimes } = require('pray-calc');
```

## What Makes This Different

Most prayer time libraries ask you to pick a method (ISNA, MWL, etc.) and use its fixed
angle for every location and every date. That works tolerably near the equator, but
produces increasingly wrong results as latitude increases or seasons shift.

This library computes the depression angle that matches the observable astronomical
phenomenon for the specific location and date. The Moonsighting Committee Worldwide
(Khalid Shaukat) validated this approach against field observations across a wide range
of latitudes. Their piecewise seasonal algorithm is the foundation; this library adds
corrections for the Earth-Sun distance, ecliptic geometry, atmospheric refraction, and
observer elevation.

The result is a dynamic primary method that generally agrees with MSC, MWL, and ISNA
at low latitudes, diverges from fixed-angle methods at high latitudes in summer, and
never produces the "Isha never ends" failure that 18°-everywhere causes above 51.5°N.

## Related Packages

- [nrel-spa](https://github.com/acamarata/nrel-spa): NREL Solar Position Algorithm (solar position foundation)
- [luxon-hijri](https://github.com/acamarata/luxon-hijri): Hijri/Gregorian calendar conversion
- [moon-sighting](https://github.com/acamarata/moon-sighting): Crescent visibility (Yallop/Odeh criteria)

---

*[Back to Repository](https://github.com/acamarata/pray-calc)*
