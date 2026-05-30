[**pray-calc v2.1.1**](../README.md)

***

[pray-calc](../README.md) / getTimesAll

# Function: getTimesAll()

> **getTimesAll**(`date`, `lat`, `lng`, `tz?`, `elevation?`, `temperature?`, `pressure?`, `hanafi?`): [`PrayerTimesAll`](../interfaces/PrayerTimesAll.md)

Defined in: [getTimesAll.ts:152](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/getTimesAll.ts#L152)

Compute prayer times plus all traditional method comparisons.

## Parameters

### date

`Date`

Observer's local date (time-of-day is ignored)

### lat

`number`

Latitude in decimal degrees (-90 to 90)

### lng

`number`

Longitude in decimal degrees (-180 to 180)

### tz?

`number` = `...`

UTC offset in hours (defaults to system tz)

### elevation?

`number` = `0`

Observer elevation in meters (default: 0)

### temperature?

`number` = `15`

Ambient temperature in °C (default: 15)

### pressure?

`number` = `1013.25`

Atmospheric pressure in mbar (default: 1013.25)

### hanafi?

`boolean` = `false`

Asr convention: false = Shafi'i (default), true = Hanafi

## Returns

[`PrayerTimesAll`](../interfaces/PrayerTimesAll.md)

Prayer times for the dynamic method plus all traditional methods.
         Any time that cannot be computed is returned as `NaN`.
         Methods map contains `[fajrTime, ishaTime]` per method.

## Throws

if lat, lng, tz, or elevation are out of valid range
