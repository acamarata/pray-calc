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

function getMoonVisibility(phase, position, illumination, elevation = 50, temp = 15, pressure = 1013.25, humidity = 50, clouds = 0) {
    
    /** Placeholder Simplified Algorithm...
     * This is a very simplified algorithm that is not intended to be precise or accurate.
     * It is loosely based on average observations from astronomy journals and other sources.
     * Using a window of earliest general visibility until near definite visibility is reached.
     */
    
    const sMonth = 29.530588861;
    const phaseHour = 1 / 24 / sMonth; // ~ 0.001410966333
    const startVis = phaseHour * 15;   // ~ 0.02116449584
    const endofVis = phaseHour * 30;   // ~ 0.04232899168
    const visWindow = endofVis - startVis;

    let visibility = 0;
    if (phase > endofVis) {
        visibility = 1;
    } else if (phase > startVis) {
        visibility = (phase - startVis) / visWindow;
    }

    return visibility;
}

module.exports = { getMoonVisibility };
