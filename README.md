
# pray-calc

Prayer times calculator using nrel-spa and custom formula for Fajr and Isha angles (as well as traditional static angle methods in the All function).  

See PrayCalc.com for a fully functional implementation of this NPM Package.

See PrayCalc.net for our Wiki which goes into depth about what prayer times are, their definitions in Islam, how they are calculated, the explanation of the available legacy prayer time methods (using problematic static angles), issues with these in practice, and some detailed research into how we developed our custom formula for Fajr and Isha angles that should* work for any location or date dynamically with a single always working formula.

* This is still in Beta and actively being developed, inshaa' Allah.

## Version 1.7

With the release of version 1.6 and 1.7 today many improvements have been implemented.

Firstly, the core nrel-spa npm package implemenation fixed a major bug that made times off by up to a few minutes.  We originally dedicated to making the first JS implementation of this algorithm (NREL-SPA) because it is the golden standard and most accurate algorithm out there but we saw no open-source release (or even references to proprietary) anywhere.  This leads to the assumption that none of the available prayer calculators used this and relied on ones like "suncalc" which could cause errors of up to a few minutes.

Secondly, we completely remade our dynamic custom angle calculation that made it many folds more accurate.  The old formula was a rough approximation offsetting from the base 18° while this new algorithm completely calculates the angle based on scientific formulations refined using ML/AI on real-world data to come to something more ready for the public to review and give feedback on, inshaa' Allah.

## Installation

```bash
npm install pray-calc
```

## Usage

Example of using pray-calc to get prayer times:

```js
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
```

Exported functions include getTimes, calcTimes, getTimesAll, calcTimesAll where the "get" functions return fractal or decimal times directly from the source nrel-spa calculator and the "calc" functions return formatted times in HH:MM:SS.sss format.  The functions will give results including our custom angle but the "All" functions will include a methods key with all traditional static angle methods (Muslim World League, Egyptian General Authority of Survey, ISNA, etc.) included as well for their Fajr and Isha times.

Additionally we included the function "getMoon" which takes only the date object and an optional "accuracy=false" if you wish to avoid the Earth to Sun Distance calculation.  The result back will give you fraction:, phase, and angle.  This can assist in calculating the moon's illumination at specific times such as after Maghrib in a location's timezone to know the possibility of seeing the moon.

### Parameters:

- date: Javascript Date object for the date to calculate prayer times for.
- lat: Latitude of the location.
- lng: Longitude of the location.
- elevation: Elevation in meters (optional, default 50).
- temperature: Temperature in Celsius (optional, default 15).
- pressure: Atmospheric pressure in millibars (optional, default 1013.25).

## Contributing

Contributions are welcome!

## License

MIT License