[**pray-calc v2.1.1**](../README.md)

***

[pray-calc](../README.md) / MethodDefinition

# Interface: MethodDefinition

Defined in: [types.ts:104](https://github.com/acamarata/pray-calc/blob/4227afc2c3993234794b3a1a561c080edc6d4d4e/src/types.ts#L104)

Internal record for a single traditional method definition.

## Properties

### fajrAngle

> **fajrAngle**: `number` \| `null`

Defined in: [types.ts:115](https://github.com/acamarata/pray-calc/blob/4227afc2c3993234794b3a1a561c080edc6d4d4e/src/types.ts#L115)

Fajr depression angle in degrees. Null means the method uses a
seasonal calculation (MSC) rather than a fixed angle.

***

### id

> **id**: `string`

Defined in: [types.ts:106](https://github.com/acamarata/pray-calc/blob/4227afc2c3993234794b3a1a561c080edc6d4d4e/src/types.ts#L106)

Short identifier used as the Methods map key.

***

### ishaAngle

> **ishaAngle**: `number` \| `null`

Defined in: [types.ts:120](https://github.com/acamarata/pray-calc/blob/4227afc2c3993234794b3a1a561c080edc6d4d4e/src/types.ts#L120)

Isha depression angle in degrees. Null means the method uses a
fixed-minute offset or seasonal calculation instead.

***

### ishaMinutes?

> `optional` **ishaMinutes?**: `number`

Defined in: [types.ts:125](https://github.com/acamarata/pray-calc/blob/4227afc2c3993234794b3a1a561c080edc6d4d4e/src/types.ts#L125)

Fixed minutes after sunset for Isha. Overrides ishaAngle when set.
UAQ uses 90 year-round; Qatar uses 90 as well.

***

### name

> **name**: `string`

Defined in: [types.ts:108](https://github.com/acamarata/pray-calc/blob/4227afc2c3993234794b3a1a561c080edc6d4d4e/src/types.ts#L108)

Human-readable name.

***

### region

> **region**: `string`

Defined in: [types.ts:110](https://github.com/acamarata/pray-calc/blob/4227afc2c3993234794b3a1a561c080edc6d4d4e/src/types.ts#L110)

Geographic region of primary use.

***

### useMSC?

> `optional` **useMSC?**: `boolean`

Defined in: [types.ts:130](https://github.com/acamarata/pray-calc/blob/4227afc2c3993234794b3a1a561c080edc6d4d4e/src/types.ts#L130)

When true, the method uses the MSC seasonal algorithm for both
Fajr and Isha.
