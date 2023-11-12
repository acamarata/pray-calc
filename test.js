const { calcTimesAll } = require('./index');

const lat = 40.7128; // Latitude for New York City
const lng = -74.0060; // Longitude for New York City
const elevation = 10; // Average elevation for NYC in meters
const temperature = 15; // Average temperature for NYC in Celsius
const pressure = 1013.25; // Average atmospheric pressure in millibars

const date = new Date();
const prayerTimes = calcTimesAll(date, lat, lng, elevation, temperature, pressure);

console.log(`NYC Prayer Times for Today:\n\n`);
console.log(prayerTimes);
