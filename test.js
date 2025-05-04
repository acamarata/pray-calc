// test.js
const { getTimes, calcTimesAll } = require('./index');

// Use: Today's date in NY
const date = new Date();
const city = "New York";
const lat  = 40.7128;
const lng  = -74.0060;
process.env.TZ = 'America/New_York';
const tzOffset = -date.getTimezoneOffset() / 60;

const min = getTimes(date, lat, lng); // use minimal paramter input
const full = calcTimesAll(date, lat, lng, tzOffset); // full params

// Output
console.log(`\nTest: ${city} on ${date.toLocaleString('en-US', { timeZone: 'America/New_York' })}\n`);
console.log("getTimes =", min, "\n");
console.log("calcTimesAll =", full, "\n");
