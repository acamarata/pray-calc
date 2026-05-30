[**pray-calc v2.1.1**](../README.md)

***

[pray-calc](../README.md) / PrayerTimesAll

# Interface: PrayerTimesAll

Defined in: [types.ts:75](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/types.ts#L75)

Prayer times plus all method comparison times as fractional hours.

## Extends

- [`PrayerTimes`](PrayerTimes.md)

## Properties

### angles

> **angles**: [`TwilightAngles`](TwilightAngles.md)

Defined in: [types.ts:46](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/types.ts#L46)

Dynamic twilight angles used for this calculation.

#### Inherited from

[`PrayerTimes`](PrayerTimes.md).[`angles`](PrayerTimes.md#angles)

***

### Asr

> **Asr**: `number`

Defined in: [types.ts:38](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/types.ts#L38)

Asr (Shafi'i or Hanafi shadow convention).

#### Inherited from

[`PrayerTimes`](PrayerTimes.md).[`Asr`](PrayerTimes.md#asr)

***

### Dhuhr

> **Dhuhr**: `number`

Defined in: [types.ts:36](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/types.ts#L36)

Dhuhr (2.5 minutes after solar noon).

#### Inherited from

[`PrayerTimes`](PrayerTimes.md).[`Dhuhr`](PrayerTimes.md#dhuhr)

***

### Fajr

> **Fajr**: `number`

Defined in: [types.ts:30](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/types.ts#L30)

True dawn (Subh Sadiq).

#### Inherited from

[`PrayerTimes`](PrayerTimes.md).[`Fajr`](PrayerTimes.md#fajr)

***

### Isha

> **Isha**: `number`

Defined in: [types.ts:42](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/types.ts#L42)

Isha (nightfall, end of shafaq).

#### Inherited from

[`PrayerTimes`](PrayerTimes.md).[`Isha`](PrayerTimes.md#isha)

***

### Maghrib

> **Maghrib**: `number`

Defined in: [types.ts:40](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/types.ts#L40)

Maghrib (sunset).

#### Inherited from

[`PrayerTimes`](PrayerTimes.md).[`Maghrib`](PrayerTimes.md#maghrib)

***

### Methods

> **Methods**: `Record`\<`string`, [`MethodEntry`](../type-aliases/MethodEntry.md)\>

Defined in: [types.ts:77](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/types.ts#L77)

Comparison results from all supported fixed-angle and seasonal methods.

***

### Midnight

> **Midnight**: `number`

Defined in: [types.ts:44](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/types.ts#L44)

Midnight: midpoint between Maghrib and Fajr.

#### Inherited from

[`PrayerTimes`](PrayerTimes.md).[`Midnight`](PrayerTimes.md#midnight)

***

### Noon

> **Noon**: `number`

Defined in: [types.ts:34](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/types.ts#L34)

Solar noon (exact geometric transit).

#### Inherited from

[`PrayerTimes`](PrayerTimes.md).[`Noon`](PrayerTimes.md#noon)

***

### Qiyam

> **Qiyam**: `number`

Defined in: [types.ts:28](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/types.ts#L28)

Start of the last third of the night (Qiyam al-Layl).

#### Inherited from

[`PrayerTimes`](PrayerTimes.md).[`Qiyam`](PrayerTimes.md#qiyam)

***

### Sunrise

> **Sunrise**: `number`

Defined in: [types.ts:32](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/types.ts#L32)

Astronomical sunrise.

#### Inherited from

[`PrayerTimes`](PrayerTimes.md).[`Sunrise`](PrayerTimes.md#sunrise)
