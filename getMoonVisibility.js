/**
 * Calculates detailed moon visibility information.
 * 
 * @param {number} phase - The phase of the moon, from 0 (new moon) to 1 (next full moon).
 * @param {Object} position - { azimuth, altitude, distance (km), parallacticAngle (radians) }
 * @param {Object} illumination - { fraction, phase, angle }
 * @param {number} [elevation=50] - Observer's elevation in meters above sea level. Default is 50 meters.
 * @param {number} [temp=15] - Ambient temperature in degrees Celsius. Default is 15°C.
 * @param {number} [pressure=1013.25] - Atmospheric pressure in hPa. Default is 1013.25 hPa (average sea level pressure).
 * @param {number} [humidity=50] - Humidity in percentage. Default is 50%.
 * @param {number} [clouds=0] - Cloudiness in percentage. Default is 0% (clear sky).
 * @returns {Object} An object containing moon details: phase, position, illumination, and visibility.
 */

function getMoonVisibility(phase, position = 0, illumination = 0, elevation = 50, temp = 15, pressure = 1013.25, humidity = 50, clouds = 0) {
    
    /** Placeholder Simplified Algorithm...
     * This is a very simplified algorithm that is not intended to be precise or accurate.
     * It is loosely based on average observations from astronomy journals and other sources.
     * Using a window of earliest general visibility until near definite visibility is reached.
     */
    
    // Convert Phase from 0-1 to be 0 (full moon) to 0.5 (new moon) scale
    const aphase = (phase - 0.5) < 0 ? -(phase - 0.5) : (phase - 0.5);

    // Get synodic month and phase hour for adjustic moon phase
    const sMonth = 29.530588861;
    const phaseHour = 1 / 24 / sMonth;  // ~ 0.001410966333
    const ahour = phaseHour / 2;        // ~ 0.0007054831663

    // Get estimated visibility window of a new moon (and ending)
    const v1 = ahour * 15;               // ~ 0.01058224749
    const v2 = ahour * 30;               // ~ 0.02116449499
    const w1 = 0.5 - v1;                 // ~ 0.48941775251
    const w2 = 0.5 - v2;                 // ~ 0.47883550501
    const win = w1 - w2;                 // ~ 0.01058224749

    let visibility = 0;
    if (aphase < w2) {
        visibility = 1;
    } else if (aphase < w1) {
        visibility = (w1 - aphase) / win;
    }

    return visibility;
}

module.exports = { getMoonVisibility };

/* console.log(getMoonVisibility(0.010));
console.log(getMoonVisibility(0.012));
console.log(getMoonVisibility(0.014));
console.log(getMoonVisibility(0.016));
console.log(getMoonVisibility(0.018));
console.log(getMoonVisibility(0.020));
console.log(getMoonVisibility(0.022)); */
