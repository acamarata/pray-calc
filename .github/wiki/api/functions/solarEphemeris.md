[**pray-calc v2.1.1**](../README.md)

***

[pray-calc](../README.md) / solarEphemeris

# Function: solarEphemeris()

> **solarEphemeris**(`jd`): `SolarEphemeris`

Defined in: [getSolarEphemeris.ts:46](https://github.com/acamarata/pray-calc/blob/4227afc2c3993234794b3a1a561c080edc6d4d4e/src/getSolarEphemeris.ts#L46)

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
