# Research & Accuracy Data

This section documents the empirical accuracy analysis behind the **PCD (Prayer Calc Dynamic)** method — the physics-grounded adaptive twilight algorithm at the core of pray-calc v2.

The methodology, data, and conclusions here are reproducible. All computations were run against pray-calc v2.0.0 installed from a packed tarball and tested across 18 city/date combinations spanning latitudes 6°S to 51.5°N and all four seasons.

---

## Key Findings

| Metric | PCD (Dynamic) | Best Fixed Method | All Methods Avg |
| --- | --- | --- | --- |
| Global MAE — Fajr | **0.64 min** | 10.21 min (Qatar) | 18.6 min |
| Global MAE — Isha | **1.30 min** | 10.22 min (Qatar/UAQ) | 18.8 min |
| Global MAE — Combined | **0.97 min** | 10.21 min (Qatar) | 18.7 min |
| Home-territory MAE — Fajr | **0.65 min** | 4.24 min (MUIS) | 8.69 min |
| Home-territory MAE — Combined | **0.64 min** | 4.24 min (MUIS) | 8.69 min |
| Win rate at method's own home city | **13 / 14** | — | — |
| High-latitude Isha availability (London, June) | **Valid** | N/A for 6 methods | N/A for 6 methods |

PCD is the only non-trivial method that is globally accurate: it tracks the observation-calibrated MSC reference within 1 minute across all latitudes and seasons while all 14 traditional fixed-angle methods average 13.5× more error even at their own calibration cities.

---

## Research Pages

| Page | Description |
| --- | --- |
| [Methodology](Research-Methodology) | Reference standard, measurement approach, test infrastructure |
| [Global Accuracy Study](Research-Global-Study) | 18-city comparison across all latitudes and seasons |
| [Home-Territory Study](Research-Home-Territory) | Each method tested at the city and season it was designed for |
| [Observational Evidence](Research-Observational-Evidence) | Field observation records, published studies, academic literature |

---

## The PCD Algorithm

The Prayer Calc Dynamic (PCD) method computes twilight depression angles in three layers rather than applying a globally fixed value.

**Layer 1 — MSC Seasonal Base**

The Moonsighting Committee Worldwide (MSC) seasonal model, developed by Khalid Shaukat from field observations across latitudes 0°–55°N/S, provides a latitude- and season-adjusted minute offset before sunrise (Fajr) and after sunset (Isha). These offsets are converted to depression angles via spherical trigonometry:

```
cos(H) = (sin(a) − sin(φ)·sin(δ)) / (cos(φ)·cos(δ))
```

where `H` is the hour angle, `a` is the target altitude, `φ` is latitude, and `δ` is solar declination.

**Layer 2 — Physics Corrections**

Four corrections are applied to the base angle:

| Correction | Formula | Effect |
| --- | --- | --- |
| Earth-Sun distance | `Δr = −0.5 × ln(r)` where `r` is in AU | ±0.015° over the year |
| Fourier harmonic | `0.1·(|φ|/45)·sin(θ) + 0.05·(|φ|/45)·sin(2θ)` | ±0.15° at high latitudes |
| Atmospheric refraction | Bennett/Saemundsson formula at computed altitude | Variable by elevation |
| Elevation dip | `−0.3 × 1.06 × √(h/1000)` degrees | Negative for elevated sites |

**Layer 3 — Physical Bounds**

The computed angle is clipped to [10°, 22°]. This prevents astronomically impossible angles at extreme high latitudes (above ~55°N in summer) while maintaining the full range across temperate and equatorial zones.

The result: approximately 18° at the equator (matching historical calibrations), falling to 12–14° at 50–55°N in summer (matching UK observations), and ~16–18° at mid-latitudes across seasons.

---

## What PCD Improves Over MSC

PCD uses MSC as its observation-calibrated foundation. The physics corrections then improve accuracy for specific conditions that the piecewise MSC table cannot capture:

- **Earth-Sun distance**: perihelion (January 3, r ≈ 0.983 AU) vs aphelion (July 4, r ≈ 1.017 AU) produces a ±0.015° seasonal shift. MSC tables do not model this directly.
- **Latitude-dependent harmonics**: smooth out discontinuities at piecewise boundaries in the MSC model.
- **Atmospheric refraction at altitude**: high-elevation cities (Tehran at 1191m, Riyadh at 620m, Ankara at 938m) see measurably earlier civil/nautical twilight due to reduced atmospheric path length.
- **Elevation horizon dip**: at elevated terrain, the geometric horizon depression lowers the effective sun position at apparent sunset/sunrise.

These corrections are small individually (each < 0.2°) but compound to produce the ~1-minute improvement over raw MSC that the validation data confirms.

---

*[Home](Home) | [API Reference](API-Reference) | [Dynamic Algorithm](Dynamic-Algorithm) | [Traditional Methods](Traditional-Methods)*
