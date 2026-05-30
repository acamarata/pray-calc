[**pray-calc v2.1.1**](../README.md)

***

[pray-calc](../README.md) / getMscIsha

# Function: getMscIsha()

> **getMscIsha**(`date`, `latitude`, `shafaq?`): `number`

Defined in: [getMSC.ts:133](https://github.com/acamarata/pray-calc/blob/af34aef986c37d8de9cf8db0744a41e3b0c99c40/src/getMSC.ts#L133)

Compute Isha offset in minutes after sunset using the MCW algorithm.

Three Shafaq modes:
- 'general': blend that reduces hardship at high latitudes (default)
- 'ahmer': based on disappearance of redness (shafaq ahmer)
- 'abyad': based on disappearance of whiteness (shafaq abyad), later

## Parameters

### date

`Date`

Observer's local date

### latitude

`number`

Observer latitude in decimal degrees

### shafaq?

`ShafaqMode` = `'general'`

Twilight type: 'general' | 'ahmer' | 'abyad'

## Returns

`number`

Minutes after sunset for Isha

## Example

```ts
const offset = getMscIsha(new Date('2024-06-21'), 40.7128, 'general');
// offset ≈ 84
```
