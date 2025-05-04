// getAngles.js
'use strict';

const PI = Math.PI;

/**
 * Calculate dynamic Fajr and Isha depression angles based on the current date (season)
 * plus refraction and elevation adjustments.
 *
 * @param {number} [elevation=0]     Observer elevation in meters.
 * @param {number} [pressure=1013.25] Atmospheric pressure in mbar.
 * @param {number} [temperature=15]   Temperature in °C.
 * @returns {{ fajrAngle: number, ishaAngle: number }} Depression angles in degrees.
 */
function getAngles(elevation = 0, pressure = 1013.25, temperature = 15) {
  // 1) Compute day of year (1–365/366)
  const today     = new Date();
  const start     = Date.UTC(today.getFullYear(), 0, 0);
  const diffMs    = today - start;
  const dayOfYear = Math.floor(diffMs / 86400000);

  // 2) Approximate solar declination δ (radians):
  //    δ = 23.44° * sin(2π * (day + 284) / 365)
  const declRad = (23.44 * Math.sin(2 * PI * (dayOfYear + 284) / 365)) * (PI / 180);

  // 3) Seasonal factor (−1 to +1)
  const seasonalFactor = Math.sin(declRad);

  // 4) Base and amplitude for twilight angle (±2° variation)
  const baseAngle = 18.0;
  const amplitude = 2.0;
  const seasonalAngle = baseAngle + amplitude * seasonalFactor;

  // 5) Refraction correction at horizon (altitude = 0)
  const refraction = calculateAtmosphericRefraction(0, pressure, temperature);

  // 6) Elevation adjustment (0.1° per 1000 m)
  const elevationAdjustment = (elevation / 1000) * 0.1;

  // 7) Final angles
  const fajrAngle = seasonalAngle + refraction + elevationAdjustment;
  const ishaAngle = seasonalAngle - refraction - elevationAdjustment;

  return { fajrAngle, ishaAngle };
}

/**
 * Compute atmospheric refraction correction at a given altitude.
 *
 * @param {number} altitude    Solar altitude in degrees.
 * @param {number} pressure    Atmospheric pressure in mbar.
 * @param {number} temperature Temperature in °C.
 * @returns {number} Refraction correction in degrees.
 */
function calculateAtmosphericRefraction(altitude, pressure = 1013.25, temperature = 10) {
  const altRad = altitude * PI / 180;
  let R = 1.0 / Math.tan(altRad + 7.31 / (altRad + 0.077));
  R = R / 60; // arcminutes → degrees
  R = (pressure / 1010) * (283 / (273 + temperature)) * R;
  return R;
}

module.exports = { getAngles };