[**pray-calc v2.1.1**](../README.md)

***

[pray-calc](../README.md) / getTimes

# Function: getTimes()

> **getTimes**(`date`, `lat`, `lng`, `tz?`, `elevation?`, `temperature?`, `pressure?`, `hanafi?`): [`PrayerTimes`](../interfaces/PrayerTimes.md)

Defined in: [getTimes.ts:39](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/getTimes.ts#L39)

Compute prayer times for a given date and location.

Uses the dynamic twilight angle algorithm to determine Fajr and Isha
depression angles, then solves for all prayer events via SPA.

## Parameters

### date

`Date`

Observer's local date (time-of-day is ignored)

### lat

`number`

Latitude in decimal degrees (-90 to 90, south = negative)

### lng

`number`

Longitude in decimal degrees (-180 to 180, west = negative)

### tz?

`number` = `...`

UTC offset in hours (e.g. -5 for EST). Defaults to the
                     system timezone derived from the Date object.

### elevation?

`number` = `0`

Observer elevation in meters (default: 0)

### temperature?

`number` = `15`

Ambient temperature in °C (default: 15)

### pressure?

`number` = `1013.25`

Atmospheric pressure in mbar/hPa (default: 1013.25)

### hanafi?

`boolean` = `false`

Asr convention: false = Shafi'i/Maliki/Hanbali (default),
                     true = Hanafi

## Returns

[`PrayerTimes`](../interfaces/PrayerTimes.md)

Prayer times as fractional hours and the dynamic angles used.
         Any time that cannot be computed (e.g. polar night/day, or the
         sun never reaching the required depression) is returned as `NaN`.

## Throws

if lat, lng, tz, or elevation are out of valid range
