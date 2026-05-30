[**pray-calc v2.1.1**](../README.md)

***

[pray-calc](../README.md) / solarEphemeris

# Function: solarEphemeris()

> **solarEphemeris**(`jd`): `SolarEphemeris`

Defined in: [getSolarEphemeris.ts:46](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/getSolarEphemeris.ts#L46)

Compute solar declination, Earth-Sun distance, and ecliptic longitude
from a Julian Date. Accuracy: ~0.01° for declination, ~0.0001 AU for r.

## Parameters

### jd

`number`

Julian Date (use toJulianDate to convert a JS Date)

## Returns

`SolarEphemeris`

Solar ephemeris data: declination (degrees), Earth-Sun distance (AU),
         and ecliptic longitude (radians, 0-2π season phase)

## Example

```ts
const jd = toJulianDate(new Date('2024-06-21'));
const { decl, r, eclLon } = solarEphemeris(jd);
```
