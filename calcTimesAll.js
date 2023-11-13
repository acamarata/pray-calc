const { fractalTime } = require('nrel-spa');
const { getTimesAll } = require('./getTimesAll');

function calcTimesAll(date, lat, lng, tz, elevation = 10, temperature = 15, pressure = 1013.25) {
    let result = getTimesAll(date, lat, lng, tz, elevation, temperature, pressure);

    // Sort the methods by Fajr time
    let sortedMethods = Object.entries(result.Methods)
        .sort((a, b) => a[1][0] - b[1][0])
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

    // Format the times inside sorted Methods
    Object.entries(sortedMethods).forEach(([methodName, times]) => {
        sortedMethods[methodName] = times.map(time => fractalTime(time));
    });

    // Sort and format the other prayer times, excluding "Angles" and "Methods"
    let sortedEntries = Object.entries(result)
        .filter(([key]) => key !== "Angles" && key !== "Methods")
        .sort(([, a], [, b]) => a - b);

    // Apply fractalTime on all sorted entries
    let sortedAndFormatted = sortedEntries.reduce((acc, [key, value]) => {
        acc[key] = fractalTime(value);
        return acc;
    }, {});

    // Add the formatted "Methods" and "Angles" to the result
    sortedAndFormatted["Methods"] = sortedMethods;
    sortedAndFormatted["Angles"] = result["Angles"];

    return sortedAndFormatted;
}

module.exports = {
    calcTimesAll
};
