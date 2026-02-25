/**
 * Core prayer times computation using the PrayCalc Dynamic Method.
 *
 * Returns all prayer times as fractional hours using the dynamic twilight
 * angle algorithm. Times are in local time as determined by the timezone
 * offset (tz parameter).
 */

import { getSpa } from 'nrel-spa';
import { toJulianDate, solarEphemeris } from './getSolarEphemeris.js';
import { getAngles } from './getAngles.js';
import { getAsr } from './getAsr.js';
import { getQiyam } from './getQiyam.js';
import type { PrayerTimes } from './types.js';

/**
 * Compute prayer times for a given date and location.
 *
 * @param date        - Observer's local date (time-of-day is ignored)
 * @param lat         - Latitude in decimal degrees (−90 to 90, south = negative)
 * @param lng         - Longitude in decimal degrees (−180 to 180, west = negative)
 * @param tz          - UTC offset in hours (e.g. −5 for EST). Defaults to the
 *                      system timezone derived from the Date object.
 * @param elevation   - Observer elevation in meters (default: 0)
 * @param temperature - Ambient temperature in °C (default: 15)
 * @param pressure    - Atmospheric pressure in mbar/hPa (default: 1013.25)
 * @param hanafi      - Asr convention: false = Shafi'i/Maliki/Hanbali (default),
 *                      true = Hanafi
 * @returns Prayer times as fractional hours and the dynamic angles used
 */
export function getTimes(
  date: Date,
  lat: number,
  lng: number,
  tz: number = -date.getTimezoneOffset() / 60,
  elevation = 0,
  temperature = 15,
  pressure = 1013.25,
  hanafi = false,
): PrayerTimes {
  // 1. Compute dynamic twilight angles.
  const { fajrAngle, ishaAngle } = getAngles(date, lat, lng, elevation, temperature, pressure);

  // 2. Convert depression angles to SPA zenith angles.
  //    SPA uses zenith angle (90° + depression) for custom altitude events.
  const fajrZenith = 90 + fajrAngle;
  const ishaZenith = 90 + ishaAngle;

  // 3. Run SPA for solar position + custom twilight times.
  const spaOpts = { elevation, temperature, pressure };
  const spaData = getSpa(date, lat, lng, tz, spaOpts, [fajrZenith, ishaZenith]);

  const fajrTime    = spaData.angles[0].sunrise;
  const sunriseTime = spaData.sunrise;
  const noonTime    = spaData.solarNoon;
  const maghribTime = spaData.sunset;
  const ishaTime    = spaData.angles[1].sunset;

  // Dhuhr: 2.5 minutes after solar noon (standard practice to confirm transit).
  const dhuhrTime = noonTime + 2.5 / 60;

  // 4. Solar declination for Asr (Meeus formula, accurate to ~0.01°).
  const jd = toJulianDate(
    new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0)),
  );
  const { decl } = solarEphemeris(jd);

  // 5. Asr time.
  const asrTime = getAsr(noonTime, lat, decl, hanafi);

  // 6. Qiyam al-Layl (last third of the night).
  const qiyamTime = getQiyam(fajrTime, ishaTime);

  return {
    Qiyam:   isFinite(qiyamTime)   ? qiyamTime   : NaN,
    Fajr:    isFinite(fajrTime)    ? fajrTime    : NaN,
    Sunrise: isFinite(sunriseTime) ? sunriseTime : NaN,
    Noon:    isFinite(noonTime)    ? noonTime    : NaN,
    Dhuhr:   isFinite(dhuhrTime)   ? dhuhrTime   : NaN,
    Asr:     isFinite(asrTime)     ? asrTime     : NaN,
    Maghrib: isFinite(maghribTime) ? maghribTime : NaN,
    Isha:    isFinite(ishaTime)    ? ishaTime    : NaN,
    angles:  { fajrAngle, ishaAngle },
  };
}
