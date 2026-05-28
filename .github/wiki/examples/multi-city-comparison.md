# Example: Multi-City Prayer Time Comparison

Compare Fajr and Isha times across multiple cities for the same date.

```js
import { getPrayerTimes, Method } from 'pray-calc';

const date = new Date('2025-06-21'); // summer solstice

const cities = [
  { name: 'Mecca',        lat: 21.3891,   lon:  39.8579, tz:  3, method: Method.UmmAlQura },
  { name: 'London',       lat: 51.5074,   lon:  -0.1278, tz:  1, method: Method.MWL       },
  { name: 'New York',     lat: 40.7128,   lon: -74.0060, tz: -4, method: Method.ISNA      },
  { name: 'Kuala Lumpur', lat:  3.1390,   lon: 101.6869, tz:  8, method: Method.JAKIM     },
  { name: 'Jakarta',      lat: -6.2088,   lon: 106.8456, tz:  7, method: Method.Kemenag   },
];

console.log(`Prayer times for ${date.toDateString()}\n`);
console.log('City'.padEnd(16) + 'Method'.padEnd(12) + 'Fajr     Isha');
console.log('-'.repeat(52));

for (const city of cities) {
  const times = getPrayerTimes(date, city.lat, city.lon, city.tz, {
    method: city.method,
  });
  const method = city.method.toString().slice(0, 10);
  console.log(
    city.name.padEnd(16) +
    method.padEnd(12) +
    `${times.fajr}  ${times.isha}`,
  );
}
```

Sample output:

```
Prayer times for Sat Jun 21 2025

City            Method      Fajr     Isha
----------------------------------------------------
Mecca           UmmAlQura   04:19    21:20
London          MWL         01:44    23:17
New York        ISNA        03:43    21:37
Kuala Lumpur    JAKIM       05:50    19:49
Jakarta         Kemenag     04:37    18:06
```

> **Note:** London in summer has very short nights. Fajr and Isha times shown here use the MWL method without a high-latitude adjustment. See [High Latitude](../High-Latitude) for adjustment options.
