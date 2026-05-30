/**
 * Formatted prayer times — dynamic method plus all traditional method comparisons.
 */

import { formatTime } from 'nrel-spa';
import { getTimesAll } from './getTimesAll.js';
import type { FormattedPrayerTimesAll } from './types.js';

/**
 * Compute prayer times formatted as HH:MM:SS strings, plus comparison times
 * for every supported traditional method.
 *
 * Uses the dynamic twilight angle algorithm for the primary times. See
 * getTimesAll() for full parameter documentation.
 *
 * @param date        - Observer's local date
 * @param lat         - Latitude in decimal degrees (-90 to 90)
 * @param lng         - Longitude in decimal degrees (-180 to 180)
 * @param tz          - UTC offset in hours (default: system timezone)
 * @param elevation   - Elevation in meters (default: 0)
 * @param temperature - Temperature in Celsius (default: 15)
 * @param pressure    - Pressure in mbar/hPa (default: 1013.25)
 * @param hanafi      - Hanafi Asr convention (default: false)
 * @returns All prayer times as HH:MM:SS strings. "N/A" for unreachable events.
 * @example
 * const result = calcTimesAll(new Date('2024-06-21'), 40.7128, -74.006, -4);
 * console.log(result.dynamic.Fajr); // "03:51:24"
 * console.log(result.ISNA.Fajr);    // "04:07:30"
 */
export function calcTimesAll(
  date: Date,
  lat: number,
  lng: number,
  tz: number = -date.getTimezoneOffset() / 60,
  elevation = 0,
  temperature = 15,
  pressure = 1013.25,
  hanafi = false,
): FormattedPrayerTimesAll {
  const raw = getTimesAll(date, lat, lng, tz, elevation, temperature, pressure, hanafi);

  const Methods: Record<string, [string, string]> = {};
  for (const [id, [fajr, isha]] of Object.entries(raw.Methods)) {
    Methods[id] = [formatTime(fajr), formatTime(isha)];
  }

  return {
    Qiyam: formatTime(raw.Qiyam),
    Fajr: formatTime(raw.Fajr),
    Sunrise: formatTime(raw.Sunrise),
    Noon: formatTime(raw.Noon),
    Dhuhr: formatTime(raw.Dhuhr),
    Asr: formatTime(raw.Asr),
    Maghrib: formatTime(raw.Maghrib),
    Isha: formatTime(raw.Isha),
    Midnight: formatTime(raw.Midnight),
    angles: raw.angles,
    Methods,
  };
}
