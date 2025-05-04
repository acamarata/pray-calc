// getAngles.js
'use strict';

const PI = Math.PI;

/**
 * Calculate dynamic Fajr and Isha depression angles based on latitude, date (season),
 * with adjustments for refraction and observer elevation.
 *
 * @param {Date} date                 Calculation date
 * @param {number} lat                Latitude in degrees
 * @param {number} lng                Longitude (currently unused but kept for compatibility)
 * @param {number} [elevation=0]      Observer elevation in meters
 * @param {number} [temperature=15]   Temperature in °C
 * @param {number} [pressure=1013.25] Atmospheric pressure in mbar
 * @returns {{ fajrAngle: number, ishaAngle: number }} Twilight angles in degrees
 */
function getAngles(date, lat, lng, elevation = 0, temperature = 15, pressure = 1013.25) {
  // 1) Compute day of year
  const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - startOfYear) / 86400000);

  // 2) Latitude factor (normalized from 0 at equator to 1 at 55° latitude)
  const latitudeFactor = Math.min(Math.abs(lat) / 55, 1);

  // 3) Approximate solar declination δ (in radians)
  const declRad = 23.44 * Math.sin((2 * PI * (dayOfYear + 284)) / 365) * (PI / 180);

  // 4) Seasonal factor (ranges -1 to +1)
  const seasonalFactor = Math.sin(declRad);

  // 5) Twilight angle calculation
  const baseAngle = 18.0;
  const latitudeAdjustment = 4.0 * latitudeFactor; // varies up to ±4°
  const seasonalAdjustment = 1.5 * seasonalFactor; // varies up to ±1.5°

  const dynamicAngle = baseAngle - latitudeAdjustment - seasonalAdjustment;

  // 6) Calculate refraction (minimal at large angles, thus simplified)
  const refraction = calculateAtmosphericRefraction(-dynamicAngle, pressure, temperature);

  // 7) Elevation adjustment (~0.1° per 1000m)
  const elevationAdjustment = (elevation / 1000) * 0.1;

  // 8) Final adjusted angles
  const fajrAngle = dynamicAngle + refraction + elevationAdjustment;
  const ishaAngle = dynamicAngle - refraction - elevationAdjustment;

  return { fajrAngle: roundAngle(fajrAngle), ishaAngle: roundAngle(ishaAngle) };
}

/**
 * Compute atmospheric refraction correction.
 * Simplified for twilight angles (negative altitude).
 *
 * @param {number} altitude - Solar altitude in degrees
 * @param {number} pressure - Atmospheric pressure in mbar
 * @param {number} temperature - Temperature in °C
 * @returns {number} Refraction correction in degrees
 */
function calculateAtmosphericRefraction(altitude, pressure = 1013.25, temperature = 15) {
  if (altitude >= 0) altitude = -0.1; // ensure negative for twilight
  const altRad = altitude * (PI / 180);
  const R = (pressure / 1010) * (283 / (273 + temperature)) * (1.02 / Math.tan(altRad + 10.3 / (altRad + 5.11))) / 60;
  return Math.abs(R); // positive correction
}

/**
 * Helper to round angles to 3 decimal places.
 *
 * @param {number} angle
 * @returns {number}
 */
function roundAngle(angle) {
  return Math.round(angle * 1000) / 1000;
}

module.exports = { getAngles };
