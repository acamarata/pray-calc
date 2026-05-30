[**pray-calc v2.1.1**](../README.md)

***

[pray-calc](../README.md) / getMscFajr

# Function: getMscFajr()

> **getMscFajr**(`date`, `latitude`): `number`

Defined in: [getMSC.ts:103](https://github.com/acamarata/pray-calc/blob/4227afc2c3993234794b3a1a561c080edc6d4d4e/src/getMSC.ts#L103)

Compute Fajr offset in minutes before sunrise using the MCW algorithm.

Returns minutes before sunrise. At latitudes above 55°, the 1/7-night
approximation is recommended (handled at the calling site).

## Parameters

### date

`Date`

Observer's local date

### latitude

`number`

Observer latitude in decimal degrees

## Returns

`number`

Minutes before sunrise for Fajr (Subh Sadiq)

## Example

```ts
const offset = getMscFajr(new Date('2024-06-21'), 40.7128);
// offset ≈ 93 (minutes before sunrise for New York in summer)
```
