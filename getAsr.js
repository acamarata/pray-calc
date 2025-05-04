// getAsr.js
'use strict';

const { SpaData, spa_calculate, SPA_ZA_RTS } = require('nrel-spa/dist/spa');

/**
 * Compute Asr time (fractional hours) for a given date and location.
 *
 * @param {Date}   date       - Local date/time for the calculation.
 * @param {number} latitude   - Observer latitude in decimal degrees.
 * @param {number} longitude  - Observer longitude in decimal degrees.
 * @param {number} timezone   - Timezone offset from UTC in hours (negative west).
 * @param {boolean}[standard] - true for Shāfiʿī (shadow=1), false for Ḥanafī (shadow=2).
 * @returns {number|null} Fractional‐hour Asr time (local), or null if unreachable.
 */
function getAsr(date, latitude, longitude, timezone, standard = true) {
  // Load inputs into SPA struct
  const data = new SpaData();
  data.year          = date.getFullYear();
  data.month         = date.getMonth() + 1;
  data.day           = date.getDate();
  data.hour          = date.getHours();
  data.minute        = date.getMinutes();
  data.second        = date.getSeconds();
  data.delta_ut1     = 0.0;
  data.delta_t       = 67.0;
  data.timezone      = timezone;
  data.longitude     = longitude;
  data.latitude      = latitude;
  data.elevation     = 0.0;
  data.pressure      = 1013.0;
  data.temperature   = 15.0;
  data.slope         = 0.0;
  data.azm_rotation  = 0.0;
  data.atmos_refract = 0.5667;
  data.function      = SPA_ZA_RTS;

  // Perform SPA calculation
  if (spa_calculate(data) !== 0) return null;

  // Convert angles to radians
  const φ       = latitude * Math.PI / 180;
  const δ       = data.delta * Math.PI / 180;
  const transit = data.suntransit; // fractional‐hour solar noon

  // Compute required solar elevation A for Asr:
  const shadowFactor = standard ? 1 : 2;
  const X            = Math.abs(φ - δ);
  const opp          = 1;
  const adj          = shadowFactor + Math.tan(X);
  const hyp          = Math.hypot(opp, adj);
  const sinA         = opp / hyp;

  // Solve hour‐angle H0: cos(H0) = (sinA - sinφ·sinδ) / (cosφ·cosδ)
  const cosH0 = (sinA - Math.sin(φ) * Math.sin(δ)) /
                (Math.cos(φ) * Math.cos(δ));
  if (cosH0 < -1 || cosH0 > 1) return null;  // sun never reaches A

  // Convert H0 (rad) to hours
  const H0h = (Math.acos(cosH0) * 180 / Math.PI) / 15;

  // Asr time = solar noon + H0h
  return transit + H0h;
}

module.exports = { getAsr };