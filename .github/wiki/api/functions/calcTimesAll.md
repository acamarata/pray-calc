[**pray-calc v2.1.1**](../README.md)

***

[pray-calc](../README.md) / calcTimesAll

# Function: calcTimesAll()

> **calcTimesAll**(`date`, `lat`, `lng`, `tz?`, `elevation?`, `temperature?`, `pressure?`, `hanafi?`): [`FormattedPrayerTimesAll`](../interfaces/FormattedPrayerTimesAll.md)

Defined in: [calcTimesAll.ts:30](https://github.com/acamarata/pray-calc/blob/4227afc2c3993234794b3a1a561c080edc6d4d4e/src/calcTimesAll.ts#L30)

Compute prayer times formatted as HH:MM:SS strings, plus comparison times
for every supported traditional method.

Uses the dynamic twilight angle algorithm for the primary times. See
getTimesAll() for full parameter documentation.

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

[`FormattedPrayerTimesAll`](../interfaces/FormattedPrayerTimesAll.md)

All prayer times as HH:MM:SS strings. "N/A" for unreachable events.

## Example

```ts
const result = calcTimesAll(new Date('2024-06-21'), 40.7128, -74.006, -4);
console.log(result.dynamic.Fajr); // "03:51:24"
console.log(result.ISNA.Fajr);    // "04:07:30"
```
