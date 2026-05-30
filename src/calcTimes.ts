/**
 * Formatted prayer times using the PrayCalc Dynamic Method.
 */

import { formatTime } from 'nrel-spa';
import { getTimes } from './getTimes.js';
import type { FormattedPrayerTimes } from './types.js';

/**
 * Compute prayer times formatted as HH:MM:SS strings.
 *
 * Uses the dynamic twilight angle algorithm. See getTimes() for full parameter
 * documentation.
 *
 * @param date        - Observer's local date
 * @param lat         - Latitude in decimal degrees (-90 to 90)
 * @param lng         - Longitude in decimal degrees (-180 to 180)
 * @param tz          - UTC offset in hours (default: system timezone)
 * @param elevation   - Elevation in meters (default: 0)
 * @param temperature - Temperature in Celsius (default: 15)
 * @param pressure    - Pressure in mbar/hPa (default: 1013.25)
 * @param hanafi      - Hanafi Asr convention (default: false)
 * @returns Prayer times as HH:MM:SS strings. Returns "N/A" for any time that
 *          cannot be computed (polar night, unreachable angle, etc.).
 * @example
 * const times = calcTimes(new Date('2024-06-21'), 40.7128, -74.006, -4);
 * console.log(times.Fajr);    // "03:51:24"
 * console.log(times.Maghrib); // "20:31:17"
 */
export function calcTimes(
  date: Date,
  lat: number,
  lng: number,
  tz: number = -date.getTimezoneOffset() / 60,
  elevation = 0,
  temperature = 15,
  pressure = 1013.25,
  hanafi = false,
): FormattedPrayerTimes {
  const raw = getTimes(date, lat, lng, tz, elevation, temperature, pressure, hanafi);

  // Sort by fractional hour value so output reflects chronological order.
  // Angles are preserved as-is (not time values).
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
  };
}
