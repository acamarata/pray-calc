[**pray-calc v2.1.1**](../README.md)

***

[pray-calc](../README.md) / toJulianDate

# Function: toJulianDate()

> **toJulianDate**(`date`): `number`

Defined in: [getSolarEphemeris.ts:22](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/getSolarEphemeris.ts#L22)

Convert a JavaScript Date to a Julian Date number.

## Parameters

### date

`Date`

Any JavaScript Date object (uses UTC internally)

## Returns

`number`

Julian Date: days since noon January 1, 4713 BC UTC

## Example

```ts
const jd = toJulianDate(new Date('2024-06-21'));
// jd ≈ 2460482.5
```
