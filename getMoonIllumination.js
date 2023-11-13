// Import the SunCalc library
const suncalc = require('suncalc');

/**
 * Calculates the moon's illumination for a given phase.
 * @param {number} phase - The phase of the moon, from 0 (new moon) to 1 (full moon).
 * @returns {Object} The moon's illumination details.
 */
function getMoonIllumination(date) {
    const illuminationDetails = suncalc.getMoonIllumination(date);

    return {
        fraction: illuminationDetails.fraction, // Illuminated fraction of the moon; 0 = new moon, 1 = full moon
        phase: illuminationDetails.phase,       // Moon phase (0 to 1)
        angle: illuminationDetails.angle        // Angle in radians of the moon's bright limb
    };
}

module.exports = { getMoonIllumination };
