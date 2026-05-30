[**pray-calc v2.1.1**](../README.md)

***

[pray-calc](../README.md) / MethodEntry

# Type Alias: MethodEntry

> **MethodEntry** = \[[`FractionalHours`](FractionalHours.md), [`FractionalHours`](FractionalHours.md)\]

Defined in: [types.ts:72](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/types.ts#L72)

Method entry in the Methods map: `[fajrTime, ishaTime]` as fractional hours.

- Index 0 (`fajr`): Fajr time for this method (fractional hours, or `NaN`)
- Index 1 (`isha`): Isha time for this method (fractional hours, or `NaN`)

A value of `NaN` indicates the event is unreachable at this location/date
(e.g. the sun never dips to 18° below the horizon at high latitudes in summer).
