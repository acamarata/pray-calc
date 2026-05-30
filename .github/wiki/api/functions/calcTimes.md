[**pray-calc v2.1.1**](../README.md)

***

[pray-calc](../README.md) / calcTimes

# Function: calcTimes()

> **calcTimes**(`date`, `lat`, `lng`, `tz?`, `elevation?`, `temperature?`, `pressure?`, `hanafi?`): [`FormattedPrayerTimes`](../interfaces/FormattedPrayerTimes.md)

Defined in: [calcTimes.ts:30](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/calcTimes.ts#L30)

Compute prayer times formatted as HH:MM:SS strings.

Uses the dynamic twilight angle algorithm. See getTimes() for full parameter
documentation.

## Parameters

### date

`Date`

Observer's local date

### lat

`number`

Latitude in decimal degrees (-90 to 90)

### lng

`number`

Longitude in decimal degrees (-180 to 180)

### tz?

`number` = `...`

UTC offset in hours (default: system timezone)

### elevation?

`number` = `0`

Elevation in meters (default: 0)

### temperature?

`number` = `15`

Temperature in Celsius (default: 15)

### pressure?

`number` = `1013.25`

Pressure in mbar/hPa (default: 1013.25)

### hanafi?

`boolean` = `false`

Hanafi Asr convention (default: false)

## Returns

[`FormattedPrayerTimes`](../interfaces/FormattedPrayerTimes.md)

Prayer times as HH:MM:SS strings. Returns "N/A" for any time that
         cannot be computed (polar night, unreachable angle, etc.).

## Example

```ts
const times = calcTimes(new Date('2024-06-21'), 40.7128, -74.006, -4);
console.log(times.Fajr);    // "03:51:24"
console.log(times.Maghrib); // "20:31:17"
```
