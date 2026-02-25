# Research Methodology

## Reference Standard

Accuracy comparisons require a ground truth. For Islamic twilight times, no universally agreed observational dataset exists with city/date/time precision. However, one model stands above others for empirical grounding: the **Moonsighting Committee Worldwide (MSC) seasonal model**, developed by Khalid Shaukat.

Shaukat compiled his seasonal tables from direct field observations across multiple continents over several decades. The model represents minutes-before-sunrise (Fajr) and minutes-after-sunset (Isha) as piecewise functions of latitude and month. Unlike fixed-angle methods, which were derived from theoretical or historical-document reasoning, the MSC values were adjusted iteratively to match what trained observers actually saw.

Because the PCD algorithm uses the MSC model as its Layer 1 base, using MSC as the accuracy reference is a conservative test — it measures how much the physics corrections in Layers 2 and 3 deviate from the MSC base. A PCD result that closely tracks MSC demonstrates the physics corrections do not introduce noise; a PCD result that slightly improves on MSC at specific locations (high elevation, perihelion dates) would confirm the corrections add value.

### Why Not Astronomical Twilight as Reference?

Astronomical twilight (18° depression, the moment sky background is fully dark) is a defined, computable quantity. However, it does not correspond to Islamic Fajr or Isha for two reasons:

1. **Fajr (Subh Sadiq)** is the horizontal spread of light along the horizon, not full astronomical darkness. Field observations consistently place this between 12° and 18° depending on latitude and season — not at a fixed 18°.
2. **Isha (end of Shafaq Abyad)** is when the white twilight glow vanishes. This corresponds to approximately 14–18° depression, not a single value.

Using a fixed 18° as "truth" would prejudge the result in favor of fixed-18° methods and defeat the purpose of the study.

### Alternative References

For specific cities where national religious authorities publish schedules calibrated against actual observations, those schedules serve as supplementary reference. These include:

- **Saudi Arabia**: Umm Al-Qura (UAQ) calendar, published by the Saudi government and audited by the King Abdul Aziz City for Science and Technology (KACST). Fajr angle 18.5°, Isha = Maghrib + 90 min.
- **Egypt**: Egyptian General Authority of Survey schedule, calibrated at 19.5° Fajr / 17.5° Isha through observation campaigns.
- **Turkey**: Diyanet (DIBT) schedule at 18°/17°, which closely matches MWL and serves as the Turkish state standard.
- **Iran**: IGUT schedule at 17.7° Fajr / 14° Isha (shafaq ahmer), calibrated by the Institute of Geophysics, University of Tehran.

These are used as contextual cross-checks in the individual city analyses, not as the primary reference for scoring.

---

## Test Infrastructure

All computations were run using pray-calc v2.0.0, installed from a packed npm tarball:

```
npm pack  →  pray-calc-2.0.0.tgz
pnpm add ./pray-calc-2.0.0.tgz  (temp validation directory)
node validate.mjs
node home-territory.mjs
```

Computations use:
- `getTimesAll()` for raw fractional-hour times across all 14 methods + dynamic simultaneously
- `getAngles()` for the PCD-computed depression angles
- `getMscFajr(date, lat)` / `getMscIsha(date, lat, 'general')` for the MSC minute reference
- MSC Fajr reference = `sunrise − mscMinutes / 60`
- MSC Isha reference = `sunset + mscMinutes / 60`

Elevation data was sourced from airport/city databases for each location. Timezone offsets reflect the observed clock time at each test date (accounting for DST where applicable).

---

## Scoring

**Mean Absolute Error (MAE)** in minutes is used throughout:

```
MAE = (1/N) × Σ |method_time − MSC_reference_time| × 60
```

where `method_time` and `MSC_reference_time` are in fractional hours.

Cases where a method produces NaN (sun never reaches the required depression angle) are excluded from that method's Fajr or Isha MAE calculation respectively. This means high-depression-angle methods (MWL 18°, Karachi 18°, Egypt 19.5°, MUIS 20°) are scored only on the cities/dates where they can produce a result. Their practical failure rate at high latitudes is noted separately.

**Reported MAE values are therefore conservative for fixed-angle methods**: they count only cases where the method produces a number, not the cases where it silently fails.

---

## Study 1: Global Accuracy (18 cities)

Tests across diverse latitudes, longitudes, elevations, and seasons. See [Global Accuracy Study](Research-Global-Study).

**Coverage:**

| Region | Cities | Latitude range |
| --- | --- | --- |
| North America | New York (×3), Toronto | 40.7°N – 43.7°N |
| Europe | London (×2), Istanbul | 41.0°N – 51.5°N |
| Middle East | Makkah (×2), Tehran, Kuwait City, Riyadh | 21.4°N – 35.7°N |
| Africa | Cairo (×2) | 30.1°N |
| South/Southeast Asia | Karachi, Dhaka, Jakarta, Singapore | 6.2°S – 24.9°N |
| Central Asia | Almaty | 43.2°N |

**Seasons covered:** Summer solstice, winter solstice, spring/autumn equinoxes.

---

## Study 2: Home-Territory Test (14 methods)

Each method tested at the specific city and seasons for which it was designed. This is the most favorable possible test for each fixed-angle method. See [Home-Territory Study](Research-Home-Territory).

**Rationale:** Fixed-angle methods were not designed for global use. They were calibrated for a specific region. Testing ISNA at Chicago in summer (their target calibration scenario) rather than at London in winter gives each method its best chance. If PCD outperforms a method even in its home territory, the case for PCD's superiority is unambiguous.

---

## Limitations

1. **MSC is the reference, not ground truth.** MSC itself has uncertainty, estimated at ±3–5 minutes based on field observation scatter. PCD errors within this range may not be meaningful.

2. **Isha comparison uses general shafaq (abyad).** IGUT uses shafaq ahmer (red glow, ~4–7° depression). Comparing IGUT's Isha against the abyad reference is methodologically inconsistent. IGUT's Isha is counted separately in analyses where noted.

3. **No real-time meteorological data.** Atmospheric refraction varies with actual temperature and pressure lapse rates. Standard atmosphere values are used (15°C, 1013.25 mbar at sea level).

4. **Extreme polar latitudes (>60°N) not tested.** Moscow in summer (55.8°N) is the highest-latitude test. At 60°N+ in summer, MSC itself has no standard definition and high-latitude juristic methods (seventh-of-night, nearest-day) are used instead.

---

*[Research](Research) | [Global Study](Research-Global-Study) | [Home-Territory Study](Research-Home-Territory) | [Observational Evidence](Research-Observational-Evidence)*
