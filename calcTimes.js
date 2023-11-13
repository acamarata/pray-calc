const { fractalTime } = require('nrel-spa');
const { getTimes } = require('./getTimes');

/**
 * Calculates Islamic prayer times.
 * 
 * @param {Date} date - Date for which prayer times are calculated.
 * @param {number} lat - Latitude of the location.
 * @param {number} lng - Longitude of the location.
 * @param {number} [elevation=10] - Elevation in meters (default 10).
 * @param {number} [temperature=15] - Temperature in Celsius (default 15).
 * @param {number} [pressure=1013.25] - Atmospheric pressure in millibars (default 1013.25).
 * @returns {Object} - Object containing prayer times.
 */
function calcTimes(date, lat, lng, tz, elevation = 50, temperature = 15, pressure = 1013.25) {
    let result = getTimes(date, lat, lng, tz, elevation, temperature, pressure);

    // Sort the result object by their values, excluding "Angle"
    let sortedEntries = Object.entries(result)
        .filter(([key]) => key !== "Angles")
        .sort(([, a], [, b]) => a - b);

    // Apply fractalTime on all sorted entries (except "Angle")
    let sortedAndFormatted = sortedEntries.reduce((acc, [key, value]) => {
        acc[key] = fractalTime(value);
        return acc;
    }, {});

    // Add the "Angle" at the end
    sortedAndFormatted["Angles"] = result["Angles"];

    return sortedAndFormatted;
}

module.exports = {
    calcTimes
};
