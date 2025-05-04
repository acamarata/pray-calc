// getTimes.js
const { getSpa } = require('nrel-spa');
const { getAngles } = require('./getAngles');
const { getAsr } = require('./getAsr');
const { getQiyam } = require('./getQiyam');

/**
 * Compute all prayer times for a given date and location.
 *
 * @param {Date}    date         - Local date for calculation
 * @param {number}  lat          - Latitude in decimal degrees
 * @param {number}  lng          - Longitude in decimal degrees
 * @param {number}  [tz]         - Timezone offset from UTC in hours (default: derived from date)
 * @param {number}  [elevation]  - Observer elevation in meters (default: 50)
 * @param {number}  [temperature]- Ambient temperature in °C (default: 15)
 * @param {number}  [pressure]   - Atmospheric pressure in mbar (default: 1013.25)
 * @param {boolean} [standard]   - true=Shāfiʿī (shadow factor 1), false=Ḥanafī (factor 2)
 *
 * @returns {Object} prayer times (fractional hours for Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha), plus Qiyam and angles
 */
function getTimes(
  date,
  lat,
  lng,
  tz = -date.getTimezoneOffset() / 60,
  elevation = 50,
  temperature = 15,
  pressure = 1013.25,
  standard = true
) {
  // 1️⃣ Compute Fajr/Isha angles
  const { fajrAngle, ishaAngle } = getAngles(date, lat, lng, elevation, temperature, pressure);

  // 2️⃣ Get core SPA output with custom angles
  const spaParams = { elevation, temperature, pressure };
  const spaData = getSpa(date, lat, lng, tz, spaParams, [fajrAngle + 90, ishaAngle + 90]);

  // Basic prayer times (fractional hours)
  const fajrTime    = spaData.angles[0].sunrise;
  const sunriseTime = spaData.sunrise;
  const noonTime    = spaData.solarNoon;
  const dhuhrTime   = spaData.solarNoon + (2.5 / 60);
  const maghribTime = spaData.sunset;
  const ishaTime    = spaData.angles[1].sunset;

  // 3️⃣ Calculate Asr (fractional hours)
  // Build a Date for solar noon in local time
  const hn = Math.floor(noonTime);
  const mn = Math.floor((noonTime - hn) * 60);
  const sn = Math.floor(noonTime * 3600 - hn * 3600 - mn * 60);
  const solarNoonDate = new Date(date);
  solarNoonDate.setHours(hn, mn, sn, 0);
  const asrTime = getAsr(solarNoonDate, lat, lng, tz, standard);

  // 4️⃣ Calculate Qiyam (last third of the night)
  const qiyamTime = getQiyam(fajrTime, ishaTime);

  return {
    Qiyam:   qiyamTime,
    Fajr:    fajrTime,
    Sunrise: sunriseTime,
    Noon:    noonTime,
    Dhuhr:   dhuhrTime,
    Asr:     asrTime,
    Maghrib: maghribTime,
    Isha:    ishaTime,
    Angles:  [fajrAngle, ishaAngle]
  };
}

module.exports = { getTimes };
