# Advanced Usage

## High-latitude handling

At latitudes above ~48°N or below ~48°S, Fajr and Isha may not have valid solar depression angles during summer. Several adjustment methods are available:

```js
import { getPrayerTimes, HighLatRule } from 'pray-calc';

// Angle-based: uses the ratio of Fajr/Isha night fraction from a reference latitude
const times = getPrayerTimes(date, lat, lon, tz, {
  highLat: HighLatRule.AngleBased,
});

// Middle of night: splits the night equally
const times2 = getPrayerTimes(date, lat, lon, tz, {
  highLat: HighLatRule.MiddleOfNight,
});

// One seventh: Fajr/Isha at 1/7 of the night duration
const times3 = getPrayerTimes(date, lat, lon, tz, {
  highLat: HighLatRule.OneSeventh,
});
```

See [High Latitude](../High-Latitude) for background on why these rules exist and how to choose.

## Custom angles

Override the Fajr and Isha angles directly:

```js
const times = getPrayerTimes(date, lat, lon, tz, {
  fajrAngle: 15,   // degrees below horizon
  ishaAngle: 15,
});
```

## Time adjustments

Apply minute-based adjustments to individual prayers:

```js
const times = getPrayerTimes(date, lat, lon, tz, {
  adjustments: {
    fajr: 2,     // +2 minutes
    maghrib: -1, // -1 minute
  },
});
```

## Midnight calculation

```js
import { getPrayerTimes, MidnightMethod } from 'pray-calc';

// Standard: midpoint between Maghrib and Fajr
const times = getPrayerTimes(date, lat, lon, tz, {
  midnight: MidnightMethod.Standard,
});

// Jafari: midpoint between Maghrib and sunrise
const times2 = getPrayerTimes(date, lat, lon, tz, {
  midnight: MidnightMethod.Jafari,
});
```

## Dynamic algorithm

The DPC (Dynamic Prayer Calculation) algorithm uses verified observational data to determine Fajr and Isha angles based on the observer's latitude and season, rather than fixed angles from a single authority.

```js
import { getPrayerTimes, Method } from 'pray-calc';

const times = getPrayerTimes(date, lat, lon, tz, {
  method: Method.Dynamic, // research-based angles
});
```

See [Dynamic Algorithm](../Dynamic-Algorithm) and [Research](../Research) for how the data was collected and validated.

## Elevation

At high elevations, atmospheric refraction differs slightly. Pass elevation in metres:

```js
const times = getPrayerTimes(date, lat, lon, tz, { elevation: 2000 });
```

## Related pages

- [High Latitude](../High-Latitude) — deep dive on the problem and solutions
- [Asr Calculation](../Asr-Calculation) — shadow length derivation
- [Twilight Physics](../Twilight-Physics) — what defines Fajr and Isha astronomically
