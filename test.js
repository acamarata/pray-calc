const { getTimes, calcTimesAll } = require('./index');

// Manually setting the date to January 1, 2024
const date = new Date('2024-01-01T00:00:00Z');

// NYC - minimum params
const city = "New York"
const lat = 40.7128;
const lng = -74.006;
const tz = -5
const elevation = null
const temperature = null
const pressure = null

/* Jakarta - all params
const city = "Jakarta"
const lat = -6.2088
const lng = 106.8456
const tz = 7
const elevation = 18
const temperature = 26.56
const pressure = 1017
*/

// Get results
const get = getTimes(date, lat, lng); // minimal args
const calc = calcTimesAll(date, lat, lng, tz, elevation, temperature, pressure);

// Print results
console.log(`\nTest: ${city} with current Date():\n`)
console.log("getTimes =", get, "\n");
console.log("calcTimesAll =", calc, "\n");
