[**pray-calc v2.1.1**](../README.md)

***

[pray-calc](../README.md) / DHUHR\_OFFSET\_MINUTES

# Variable: DHUHR\_OFFSET\_MINUTES

> `const` **DHUHR\_OFFSET\_MINUTES**: `2.5` = `2.5`

Defined in: [constants.ts:17](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/constants.ts#L17)

Minutes added to solar noon to obtain Dhuhr time.

Standard practice adds a small buffer after geometric solar transit to
ensure the sun has clearly passed the meridian before Dhuhr begins.
The 2.5-minute convention is widely used across Islamic timekeeping
authorities and accounts for the sun's angular diameter (~0.5°) plus
a small safety margin.
