# Quick Start

Five minutes from install to prayer times.

## Install

```sh
npm install pray-calc
```

## Basic usage

```js
import { getPrayerTimes } from 'pray-calc';

const times = getPrayerTimes(
  new Date('2025-06-21'),
  40.7128,   // latitude
  -74.0060,  // longitude
  -4,        // UTC offset in hours (EDT)
);

console.log(times.fajr);    // "04:01:12"
console.log(times.sunrise); // "05:25:44"
console.log(times.dhuhr);   // "12:59:58"
console.log(times.asr);     // "16:47:23"
console.log(times.maghrib); // "20:34:47"
console.log(times.isha);    // "22:08:33"
```

Times are returned as `HH:MM:SS` strings in the local timezone defined by the UTC offset.

## Choosing a calculation method

```js
import { getPrayerTimes, Method } from 'pray-calc';

// ISNA — commonly used in North America
const times = getPrayerTimes(date, lat, lon, tz, { method: Method.ISNA });

// MWL — Muslim World League
const times2 = getPrayerTimes(date, lat, lon, tz, { method: Method.MWL });

// Egyptian — Egyptian General Authority of Survey
const times3 = getPrayerTimes(date, lat, lon, tz, { method: Method.Egyptian });
```

See [Traditional Methods](../Traditional-Methods) for a full comparison of all built-in methods.

## Asr calculation schools

```js
import { getPrayerTimes, AsrSchool } from 'pray-calc';

// Standard (Shafi, Maliki, Hanbali) — shadow length = 1× object height
const standard = getPrayerTimes(date, lat, lon, tz, { asr: AsrSchool.Standard });

// Hanafi — shadow length = 2× object height
const hanafi = getPrayerTimes(date, lat, lon, tz, { asr: AsrSchool.Hanafi });
```

## Moon data

```js
import { getMoonData } from 'pray-calc';

const moon = getMoonData(new Date('2025-06-21'), 40.7128, -74.0060);
console.log(moon.phase);      // 0-1 (0=new, 0.5=full)
console.log(moon.illumination); // percentage illuminated
```

## Next steps

- [API Reference](../API-Reference) — all functions and options
- [Traditional Methods](../Traditional-Methods) — angle-based calculation methods explained
- [Dynamic Algorithm](../Dynamic-Algorithm) — how pray-calc's research-based DPC works
- [Advanced Guide](advanced) — high-latitude handling, edge cases
