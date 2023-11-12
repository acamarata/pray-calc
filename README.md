
# praycalc

Prayer times calculator using nrel-spa and custom formula for Fajr and Isha angles (as well as traditional static angle methods in the All function).

## Installation

```bash
npm install praycalc
```

## Usage

Example of using praycalc to get prayer times:

```js
const { calcTimes } = require('./calcTimes');

const date = new Date();   // Current date
const latitude = 40.7128;  // Latitude for New York City
const longitude = -74.006; // Longitude for New York City
const elevation = 10;      // Elevation for New York City

const prayerTimes = calcTimes(date, latitude, longitude, elevation);
console.log(prayerTimes);
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

ISC License
