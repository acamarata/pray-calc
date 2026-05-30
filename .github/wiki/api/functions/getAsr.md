[**pray-calc v2.1.1**](../README.md)

***

[pray-calc](../README.md) / getAsr

# Function: getAsr()

> **getAsr**(`solarNoon`, `latitude`, `declination`, `hanafi?`): `number`

Defined in: [getAsr.ts:21](https://github.com/acamarata/pray-calc/blob/4227afc2c3993234794b3a1a561c080edc6d4d4e/src/getAsr.ts#L21)

Compute Asr time as fractional hours.

## Parameters

### solarNoon

`number`

Solar noon in fractional hours (from getSpa)

### latitude

`number`

Observer latitude in degrees

### declination

`number`

Solar declination in degrees (from solarEphemeris)

### hanafi?

`boolean` = `false`

true for Hanafi (shadow factor 2), false for Shafi'i (factor 1)

## Returns

`number`

Fractional hours, or NaN if the sun never reaches the required altitude
