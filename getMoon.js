const { getMoonPhase } = require('./getMoonPhase');
const { getMoonPosition } = require('./getMoonPosition');
const { getMoonIllumination } = require('./getMoonIllumination');
const { getMoonVisibility } = require('./getMoonVisibility');

/**
 * Calculates detailed moon visibility information.
 * 
 * @param {Date} date - The date for which to calculate moon data.
 * @param {number} [latitude=0] - Observer's latitude in decimal degrees.
 * @param {number} [longitude=0] - Observer's longitude in decimal degrees.
 * @param {number} [elevation=50] - Observer's elevation in meters above sea level. Default is 50 meters.
 * @param {number} [temp=15] - Ambient temperature in degrees Celsius. Default is 15°C.
 * @param {number} [pressure=1013.25] - Atmospheric pressure in hPa. Default is 1013.25 hPa (average sea level pressure).
 * @param {number} [humidity=50] - Humidity in percentage. Default is 50%.
 * @param {number} [clouds=0] - Cloudiness in percentage. Default is 0% (clear sky).
 * @returns {Object} An object containing moon details: phase, position, illumination, and visibility.
 */
function getMoon(date, latitude = 0, longitude = 0, elevation = 50, temp = 15, pressure = 1013.25, humidity = 50, clouds = 0) {
    const phase = getMoonPhase(date);
    const position = getMoonPosition(date, latitude, longitude);
    const illumination = getMoonIllumination(date);

    // Calculate visibility considering all factors
    const visibility = getMoonVisibility(phase, position, illumination, elevation, temp, pressure, humidity, clouds);

    return {
        phase,
        position,
        illumination,
        visibility
    };
}

module.exports = { getMoon };
