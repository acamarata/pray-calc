# pray-calc

A high-precision prayer times calculator using [NREL-SPA](https://midcdmz.nrel.gov/spa/) (Solar Position Algorithm) and a **dynamic Fajr and Isha angle algorithm**, refined with empirical data and machine learning. Also supports traditional static-angle methods for comparison.

**Live Demo**: [PrayCalc.com](https://praycalc.com)  
**Documentation & Wiki**: [PrayCalc.net](https://praycalc.net)

> 📌 This library is in active development and is currently in **beta**. Please test and submit feedback or issues, inshaa’ Allah.

---

## 🚀 Version 1.7 Highlights

Version 1.7 introduces major improvements:

- ✅ **Fixed a bug in the core NREL-SPA JavaScript implementation** that caused times to be off by up to several minutes.  
- ✅ **Custom dynamic angle calculation** has been completely rewritten using scientific modeling, atmospheric inputs, and ML-trained empirical data. It now generates Fajr and Isha angles that are accurate across all locations and seasons, instead of a simple offset from 18°.

Traditional calculators (based on `suncalc` or fixed-angle approximations) are known to have timing errors of **2–7 minutes or more**, especially at higher latitudes. Our implementation aims for sub-minute accuracy by default.

---

## 📦 Installation

```bash
npm install pray-calc
```

---

## 🛠️ Usage Example

```js
const { getTimes, calcTimesAll } = require('pray-calc');

// Example for New York City (minimal params)
const date = new Date('2024-01-01T00:00:00Z');
const city = "New York";
const lat = 40.7128;
const lng = -74.006;
const tz = -5;

// Full example for Jakarta:
/*
const city = "Jakarta";
const lat = -6.2088;
const lng = 106.8456;
const tz = 7;
const elevation = 18;
const temperature = 26.56;
const pressure = 1017;
*/

const get = getTimes(date, lat, lng); // Minimal args
const calc = calcTimesAll(date, lat, lng, tz); // Full formatting

console.log(`\nTest: ${city} on ${date.toISOString()}:\n`);
console.log("getTimes =", get, "\n");
console.log("calcTimesAll =", calc, "\n");
```

---

## 🔧 Functions Overview

### `getTimes(date, lat, lng, tz?, elevation?, temperature?, pressure?, standard?)`
Returns prayer times as **decimal/fractional hours** using dynamic twilight angles.

### `calcTimesAll(date, lat, lng, tz?, elevation?, temperature?, pressure?)`
Returns prayer times as **formatted HH:MM:SS** and includes traditional methods under a `.methods` key.

### `getMoon(date, accuracy = false)`
Returns:
- `fraction` – moon illumination (0–1)
- `phase` – moon phase (e.g., Full Moon)
- `angle` – angle from the sun (for visibility estimation)

Helpful for determining moon visibility after Maghrib.

---

## 🔢 Parameters

- `date`: JavaScript `Date` object
- `lat`: Latitude (decimal degrees)
- `lng`: Longitude (decimal degrees)
- `tz`: Timezone offset from UTC (optional, defaults to `Date` object)
- `elevation`: Meters above sea level (default: 50)
- `temperature`: Ambient °C (default: 15)
- `pressure`: mbar / hPa (default: 1013.25)
- `standard`: true = Shāfiʿī (Asr shadow = 1), false = Ḥanafī (shadow = 2)

---

## 📚 Static vs. Dynamic Methods

The `All` functions return both:

- The **custom dynamic method** (default)
- Multiple **legacy methods**:
  - Muslim World League (MWL)
  - Egyptian General Authority of Survey (EGAS)
  - ISNA, Umm al-Qura, Gulf, etc.

This lets developers compare traditional fixed-angle results to the more accurate dynamic calculation.

---

## 🤝 Contributing

Contributions, observations, and validations are welcome!

- GitHub: [acamarata/pray-calc](https://github.com/acamarata/pray-calc)
- NREL-SPA JS Engine: [acamarata/nrel-spa](https://github.com/acamarata/nrel-spa)

---

## 🧪 Accuracy Notes

This package is built for high-precision use cases:

- Real-time applications (e.g., adhan clocks)
- Scientific Islamic astronomy
- High-latitude and seasonal edge-case handling

All core calculations use **NREL-SPA** and angles dynamically generated to match observable twilight.

---

## 📄 License

[MIT License](./LICENSE)