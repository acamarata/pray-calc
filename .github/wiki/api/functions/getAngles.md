[**pray-calc v2.1.1**](../README.md)

***

[pray-calc](../README.md) / getAngles

# Function: getAngles()

> **getAngles**(`date`, `lat`, `lng`, `elevation?`, `temperature?`, `pressure?`): [`TwilightAngles`](../interfaces/TwilightAngles.md)

Defined in: [getAngles.ts:216](https://github.com/acamarata/pray-calc/blob/4227afc2c3993234794b3a1a561c080edc6d4d4e/src/getAngles.ts#L216)

Compute dynamic twilight depression angles for Fajr and Isha.

## Parameters

### date

`Date`

Observer's local date (time-of-day is ignored)

### lat

`number`

Latitude in decimal degrees (-90 to 90)

### lng

`number`

Longitude in decimal degrees (-180 to 180, currently unused; reserved)

### elevation?

`number` = `0`

Observer elevation in meters (default: 0)

### temperature?

`number` = `15`

Ambient temperature in °C (default: 15)

### pressure?

`number` = `1013.25`

Atmospheric pressure in mbar (default: 1013.25)

## Returns

[`TwilightAngles`](../interfaces/TwilightAngles.md)

Fajr and Isha depression angles in degrees
