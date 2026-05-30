[**pray-calc v2.1.1**](../README.md)

***

[pray-calc](../README.md) / MethodEntry

# Type Alias: MethodEntry

> **MethodEntry** = \[[`FractionalHours`](FractionalHours.md), [`FractionalHours`](FractionalHours.md)\]

Defined in: [types.ts:72](https://github.com/acamarata/pray-calc/blob/4227afc2c3993234794b3a1a561c080edc6d4d4e/src/types.ts#L72)

Method entry in the Methods map: `[fajrTime, ishaTime]` as fractional hours.

- Index 0 (`fajr`): Fajr time for this method (fractional hours, or `NaN`)
- Index 1 (`isha`): Isha time for this method (fractional hours, or `NaN`)

A value of `NaN` indicates the event is unreachable at this location/date
(e.g. the sun never dips to 18° below the horizon at high latitudes in summer).
