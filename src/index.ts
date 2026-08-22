/**
 * pray-calc — Islamic prayer times with a physics-grounded dynamic angle algorithm.
 *
 * Main exports:
 *   getTimes       - Raw fractional-hour prayer times (dynamic method)
 *   calcTimes      - Formatted HH:MM:SS prayer times (dynamic method)
 *   getTimesAll    - Raw times + all 14 traditional method comparisons
 *   calcTimesAll   - Formatted times + all 14 traditional method comparisons
 *   getAngles      - Dynamic Fajr/Isha twilight depression angles
 *   getAsr         - Asr prayer time from solar noon and declination
 *   getQiyam       - Start of the last third of the night
 *   getMidnight    - Midpoint of the night (Isha endpoint)
 *   getMscFajr     - MSC Fajr offset in minutes before sunrise
 *   getMscIsha     - MSC Isha offset in minutes after sunset
 *   solarEphemeris - Jean Meeus solar ephemeris (declination, Earth-Sun distance, ecliptic lon)
 *   METHODS        - Array of all supported traditional method definitions
 */

export { getTimes } from "./getTimes.js";
export { calcTimes } from "./calcTimes.js";
export { getTimesAll, METHODS } from "./getTimesAll.js";
export { calcTimesAll } from "./calcTimesAll.js";
export { getAngles } from "./getAngles.js";
export { getAsr } from "./getAsr.js";
export { getQiyam } from "./getQiyam.js";
export { getMidnight } from "./getMidnight.js";
export { toCivilDate } from "./civilDate.js";
export type { CivilDateInput } from "./civilDate.js";
export { getMscFajr, getMscIsha } from "./getMSC.js";
export { solarEphemeris, toJulianDate } from "./getSolarEphemeris.js";
export { DHUHR_OFFSET_MINUTES, ANGLE_MIN, ANGLE_MAX } from "./constants.js";
// Exported so a consumer that computes Fajr/Isha its own way — a fixed-method overlay, or
// user-supplied custom depression angles — can apply the same substitution rules to its own
// values instead of reimplementing them and drifting from this package's semantics.
export { applyHighLatitudeRule, AQRAB_AL_BILAD_LATITUDE } from "./highLatitude.js";
export type {
  HighLatitudeRule,
  TimeSource,
  TimeProvenance,
  HighLatitudeContext,
  HighLatitudeResult,
  DayResolver,
} from "./highLatitude.js";

export type {
  FractionalHours,
  TimeString,
  AsrConvention,
  ShafaqMode,
  TwilightAngles,
  PrayerTimes,
  FormattedPrayerTimes,
  MethodEntry,
  PrayerTimesAll,
  FormattedPrayerTimesAll,
  AtmosphericParams,
  MethodDefinition,
} from "./types.js";

// ── Opt-in anonymous telemetry ────────────────────────────────────────────────
// Off by default. Enable: ACAMARATA_TELEMETRY=1
// What is sent + how to disable: https://github.com/acamarata/telemetry/blob/main/TELEMETRY.md
import('@acamarata/telemetry')
  .then(({ track }) =>
    track('load', { package: 'pray-calc', version: '2.1.2' }),
  )
  .catch(() => {
    // telemetry not installed or disabled — that is fine
  });
