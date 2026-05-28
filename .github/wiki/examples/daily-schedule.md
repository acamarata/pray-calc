# Example: Daily Prayer Schedule

Print a formatted prayer schedule for any date and location.

```js
import { getPrayerTimes, Method } from 'pray-calc';

const date = new Date('2025-03-20'); // spring equinox
const LAT  = 21.3891;  // Mecca
const LON  = 39.8579;
const TZ   = 3;        // AST (Arabia Standard Time)

const times = getPrayerTimes(date, LAT, LON, TZ, { method: Method.UmmAlQura });

console.log(`Prayer times for ${date.toDateString()} — Mecca`);
console.log('');
console.log(`  Fajr:    ${times.fajr}`);
console.log(`  Sunrise: ${times.sunrise}`);
console.log(`  Dhuhr:   ${times.dhuhr}`);
console.log(`  Asr:     ${times.asr}`);
console.log(`  Maghrib: ${times.maghrib}`);
console.log(`  Isha:    ${times.isha}`);
```

Sample output:

```
Prayer times for Thu Mar 20 2025 — Mecca

  Fajr:    04:45:00
  Sunrise: 06:07:00
  Dhuhr:   12:14:00
  Asr:     15:37:00
  Maghrib: 18:21:00
  Isha:    19:51:00
```
