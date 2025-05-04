
# pray-calc

Prayer times calculator using nrel-spa and custom formula for Fajr and Isha angles (as well as traditional static angle methods in the All function).

## Version 1.5

With the release of version 1.5, we have integrated the MoonSighting (MSC) method. The MSC method is unique in its dynamic adjustment for latitude and seasonal variations, and it is well-researched and widely respected. While our custom method is still in development, the MSC method’s integration marks a significant enhancement.  

Our MSC implementation will have some accuracy improvement though due to using nrel-spa as the base calculations over other the more common but less accurate suncalc package or others.  With that said the MSC method is imported as is and does not account for elevation for angle perspective adjustment (major) nor temperature, pressure, and weather for the atmospheric refraction (minor) variables that we have included.

With some work we can incorporate all improvements from our method along with MSC's logic as well as these additional variables and come to something that is more accurate and more dynamic than currently available online anywhere in future versions, inshaa' Allah.

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
