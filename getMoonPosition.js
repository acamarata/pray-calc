// Import the SunCalc library
const suncalc = require('suncalc');

/**
 * Calculates detailed moon position information.
 * @param {Date} date - The date and time for which to calculate the position.
 * @param {number} latitude - Observer's latitude in decimal degrees.
 * @param {number} longitude - Observer's longitude in decimal degrees.
 * @returns {Object} The moon's position (azimuth, altitude), distance, and parallactic angle.
 */
function getMoonPosition(date, latitude, longitude) {
    const moonPosition = suncalc.getMoonPosition(date, latitude, longitude);

    // Convert azimuth and altitude from radians to degrees
    const azimuth = moonPosition.azimuth * 180 / Math.PI;
    const altitude = moonPosition.altitude * 180 / Math.PI;

    return { 
        azimuth, 
        altitude,
        distance: moonPosition.distance, // distance to moon in kilometers
        parallacticAngle: moonPosition.parallacticAngle // parallactic angle in radians
    };
}

module.exports = { getMoonPosition };
