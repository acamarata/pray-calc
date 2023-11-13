const { getMoon } = require('./index');

const date = new Date();

/* NYC - minimum params
const city = "New York"
const lat = 40.7128;
const lng = -74.006;
*/

// Jakarta - all params
const city = "Jakarta"
const lat = -6.2088
const lng = 106.8456

// Get results
const get = getMoon(date, lat, lng);

// Print results
console.log(`\nTest: ${city} with current Date():\n`)
console.log("getMoon =", get, "\n");
