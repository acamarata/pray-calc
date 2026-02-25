# API Reference

## getTimes

Compute prayer times as fractional hours.

```typescript
function getTimes(
  date: Date,
  lat: number,
  lng: number,
  tz?: number,           // default: system UTC offset
  elevation?: number,    // meters above sea level, default 0
  temperature?: number,  // °C, default 15
  pressure?: number,     // mbar, default 1013.25
  hanafi?: boolean,      // Asr convention, default false (Shafi'i)
): PrayerTimes
```

### PrayerTimes

| Field | Type | Description |
|-------|------|-------------|
| `Qiyam` | `number` | Start of the last third of the night (Qiyam al-Layl) |
| `Fajr` | `number` | True dawn (Subh Sadiq) |
| `Sunrise` | `number` | Astronomical sunrise |
| `Noon` | `number` | Solar noon (exact geometric transit) |
| `Dhuhr` | `number` | 2.5 minutes after solar noon |
| `Asr` | `number` | Asr (Shafi'i or Hanafi shadow ratio) |
| `Maghrib` | `number` | Astronomical sunset |
| `Isha` | `number` | Nightfall (end of shafaq) |
| `angles` | `TwilightAngles` | Dynamic depression angles used |

All times are fractional hours in local time (e.g., `5.5` = 05:30:00). `NaN` means
the event cannot be computed for this date/location (polar night, etc.).

---

## calcTimes

Same as `getTimes` but returns `HH:MM:SS` strings.

```typescript
function calcTimes(
  date: Date,
  lat: number,
  lng: number,
  tz?: number,
  elevation?: number,
  temperature?: number,
  pressure?: number,
  hanafi?: boolean,
): FormattedPrayerTimes
```

Returns `"N/A"` for any time that cannot be computed.

---

## getTimesAll

Compute the dynamic method times plus comparison times for all 14 traditional methods.

```typescript
function getTimesAll(
  date: Date,
  lat: number,
  lng: number,
  tz?: number,
  elevation?: number,
  temperature?: number,
  pressure?: number,
  hanafi?: boolean,
): PrayerTimesAll
```

### PrayerTimesAll

Extends `PrayerTimes` with:

| Field | Type | Description |
|-------|------|-------------|
| `Methods` | `Record<string, [number, number]>` | `[fajrTime, ishaTime]` per method ID |

Method IDs: `UOIF`, `ISNACA`, `ISNA`, `SAMR`, `IGUT`, `MWL`, `DIBT`, `Karachi`,
`Kuwait`, `UAQ`, `Qatar`, `Egypt`, `MUIS`, `MSC`.

---

## calcTimesAll

Same as `getTimesAll` but returns `HH:MM:SS` strings.

```typescript
function calcTimesAll(
  date: Date,
  lat: number,
  lng: number,
  tz?: number,
  elevation?: number,
  temperature?: number,
  pressure?: number,
  hanafi?: boolean,
): FormattedPrayerTimesAll
```

---

## getAngles

Compute dynamic Fajr/Isha depression angles without computing full prayer times.

```typescript
function getAngles(
  date: Date,
  lat: number,
  lng: number,
  elevation?: number,
  temperature?: number,
  pressure?: number,
): TwilightAngles
```

Returns `{ fajrAngle: number, ishaAngle: number }` in degrees (positive = below horizon).

---

## getAsr

Compute Asr time from known solar noon and solar declination.

```typescript
function getAsr(
  solarNoon: number,    // fractional hours (local time)
  latitude: number,     // decimal degrees
  declination: number,  // solar declination in degrees
  hanafi?: boolean,     // default false (Shafi'i, shadowFactor=1)
): number
```

Returns Asr as fractional hours, or `NaN` if the sun never reaches the required altitude.

Shadow factors: Shafi'i = 1 (shadow equals object height), Hanafi = 2 (shadow = 2x height).

---

## getQiyam

Compute start of the last third of the night.

```typescript
function getQiyam(
  fajrTime: number,  // fractional hours
  ishaTime: number,  // fractional hours
): number
```

Returns fractional hours. The night is divided from Isha to Fajr; Qiyam starts at the
2/3 mark: `ishaTime + (2/3) × (fajrTime + 24 − ishaTime)`.

---

## getMscFajr / getMscIsha

Compute the Moonsighting Committee Worldwide seasonal time offsets.

```typescript
function getMscFajr(date: Date, latitude: number): number
// Returns minutes before astronomical sunrise for Fajr

function getMscIsha(
  date: Date,
  latitude: number,
  shafaq?: ShafaqMode,  // 'general' | 'ahmer' | 'abyad', default 'general'
): number
// Returns minutes after astronomical sunset for Isha
```

These are the low-level functions used internally by `getAngles` and `getTimesAll`.
You rarely need to call them directly.

---

## solarEphemeris / toJulianDate

Jean Meeus solar ephemeris (Chapter 25 of *Astronomical Algorithms*, 2nd ed.).

```typescript
function toJulianDate(date: Date): number

function solarEphemeris(jd: number): {
  decl: number;    // solar declination, degrees
  r: number;       // Earth-Sun distance, AU
  eclLon: number;  // apparent ecliptic longitude, degrees
}
```

Accuracy: declination within ~0.01°, r within ~0.0001 AU. These are used internally
to drive the physics corrections in `getAngles`.

---

## METHODS

Exported array of all 14 `MethodDefinition` objects for documentation/tooling use.

```typescript
const METHODS: MethodDefinition[]

interface MethodDefinition {
  id: string;
  name: string;
  region: string;
  fajrAngle: number | null;
  ishaAngle: number | null;
  ishaMinutes?: number;   // UAQ and Qatar: 90 minutes after sunset
  useMSC?: boolean;       // MSC seasonal method
}
```

---

## Types

```typescript
type FractionalHours = number;
type TimeString = string;          // "HH:MM:SS" or "N/A"
type AsrConvention = 'shafii' | 'hanafi';
type ShafaqMode = 'general' | 'ahmer' | 'abyad';

interface TwilightAngles {
  fajrAngle: number;
  ishaAngle: number;
}

interface PrayerTimes { ... }          // see above
interface FormattedPrayerTimes { ... } // same fields but TimeString
interface PrayerTimesAll extends PrayerTimes { Methods: ... }
interface FormattedPrayerTimesAll { ... }
interface AtmosphericParams { elevation?, temperature?, pressure?: number }
interface MethodDefinition { ... }
```

---

## Moon Functions (Removed in v2)

`getMoon`, `getMoonPhase`, `getMoonPosition`, `getMoonIllumination`, and `getMoonVisibility`
were removed in v2. They now live in the dedicated
[moon-sighting](https://github.com/acamarata/moon-sighting) package.

See [Moon Migration](Moon-Migration) for the full migration guide and function mapping.

---

*[Back to Home](Home) | [Dynamic Algorithm](Dynamic-Algorithm) | [Traditional Methods](Traditional-Methods)*
