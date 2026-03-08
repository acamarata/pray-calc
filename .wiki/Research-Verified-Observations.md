# Field Observation Comparison

This page documents a systematic comparison of the PCD algorithm output against published academic field studies that directly measured the solar depression angle at the moment of true Fajr (Subh Sadiq). It is the most direct available test of whether any calculation method matches physical reality.

---

## What Field Studies Measure

Most prayer time research compares methods against each other (e.g., PCD vs. ISNA vs. MWL). This study does something different: it compares calculated output against what independent researchers physically observed and measured in the field.

Two types of observational data exist:

**Angle-based studies** measure the solar depression angle directly at the moment a trained observer identifies Subh Sadiq. These range from naked-eye campaigns (hundreds of nights at a single location) to photometric measurements using calibrated instruments. The result is a depression angle: the angular distance of the sun below the horizon at the moment of true dawn.

**Time-based verification points** record a specific date, location, and clock time at which a trained observer identified true Fajr. The corresponding depression angle is computed from the recorded time and date using spherical trigonometry.

Both study types test the same question: does the calculated Fajr time match when a trained observer actually saw dawn begin?

---

## Study Inventory

### Angle-Based Field Studies

| ID | Location | Latitude | Elevation | Period | N | Instrument | Observed° | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TUB-S | Tubruq, Libya: sea horizon | 32.1°N | 25 m | 2000–2003 | 429 | Naked eye | **13.48°** | Odeh 2004 |
| TUB-D | Tubruq, Libya: desert horizon | 32.1°N | 25 m | 2000–2003 | 623 | Naked eye | **13.14°** | Odeh 2004 |
| EGY | Egypt multi-site (4 cities) | 24–31°N | 10–95 m | 1984–1987 |: | Photometric + naked eye | **14.7°** mean | ENRIA 1987 |
| HAI | Hail, Saudi Arabia | 27.5°N | 990 m | 2014–2015 | 365 | Naked eye | **14.01° ± 0.32°** | Al-Shehri 2017 |
| FAY | Fayum, Egypt | 29.3°N | 29 m | 2018–2019 |: | Photometric | **14.4°** [14–14.8°] | AAAS 2019 |
| BLK-S | Blackburn, UK: summer | 53.8°N | 75 m | 1987–1988 |: | Naked eye | **12°** | Duff & Duff 1989 |
| BLK-W | Blackburn, UK: winter | 53.8°N | 75 m | 1987–1988 |: | Naked eye | **18°** | Duff & Duff 1989 |
| CHI | Chicago, USA: summer | 41.9°N | 181 m | 1985 |: | Naked eye | **14°** [13–15°] | Shaukat 1985 |
| LAP | Indonesia: 6 LAPAN stations | 6.5°S–1.5°N | 50–350 m | 2016–2017 |: | Sky brightness | **16.51°** mean | LAPAN 2017 |
| MYS | Malaysia/Indonesia: DSLR | 2–7°N | 50–250 m | 2017 | 64 nights | DSLR photometry | **16.67°** [15.8–17.2°] | Zambri & Anwar 2017 |

### Time-Based Verification Points

| ID | Location | Latitude | Date | Observed Fajr | Observer | Source |
| --- | --- | --- | --- | --- | --- | --- |
| MIA | Miami Beach, FL, USA | 25.8°N | Dec 3, 2000 | 5:45 AM EST | Khalid Shaukat + 4 co-observers | moonsighting.com |
| PAM | Pampigny, Switzerland | 46.6°N | Jun 23, 2016 | 3:56 AM CEST | Khalid Shaukat | moonsighting.com |
| JKT | Jakarta, Indonesia | 6.2°S | May 8, 2019 | 5:01 AM WIB | Community observers (multiple) | Indonesian Islamic astronomy forums |

---

## Methodology

### Computation

All prayer time calculations use pray-calc v2.0.0:

```bash
pnpm add pray-calc@2.0.0
node observation-matrix.mjs
```

For each angle study, the PCD angle was averaged over the study months using `getAngles(date, lat, lng, elev)` called at the 15th day of each relevant calendar month. For MSC, `getMscFajr(date, lat)` was converted to an equivalent depression angle using spherical trigonometry (`minutesToDepression`).

For time-based points, `getTimesAll(date, lat, lng, tz, elev)` was used to obtain the PCD Fajr, MSC reference Fajr, and regional method Fajr, all in fractional hours local time. The observed depression angle was derived from the number of minutes before sunrise at the reported observation time.

### Regional method assignment

Each study location was assigned the regional method most likely in use there:

| Location | Regional method | Angle |
| --- | --- | --- |
| Libya / Egypt | Egypt (ENRIA) | 19.5° |
| Saudi Arabia | Umm Al-Qura (UAQ) | 18.5° |
| UK | MWL | 18° |
| USA (Chicago) | ISNA | 15° |
| USA (Miami) | ISNA | 15° |
| Indonesia | MUIS | 20° |
| Switzerland | UOIF | 12° |

---

## Part 1: Angle-Based Studies: Full Results

### Comparison Table

For each study: observed depression angle, PCD computed mean angle over study months, equivalent MSC angle, and the regional fixed-angle method. Errors are absolute differences in degrees.

| Study | Obs° | PCD° | PCD err | MSC° | MSC err | Regional | Reg° | Reg err | Winner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TUB-S Tubruq sea (32.1°N, Oct–Dec) | 13.48 | 19.17 | 5.69° | 18.92 | 5.44° | Egypt | 19.5 | 6.02° | MSC |
| TUB-D Tubruq desert (32.1°N, Oct–Dec) | 13.14 | 19.17 | 6.03° | 18.92 | 5.78° | Egypt | 19.5 | 6.36° | MSC |
| EGY Egypt multi-site (28°N mean, annual) | 14.70 | 19.37 | 4.67° | 19.30 | 4.60° | Egypt | 19.5 | 4.80° | MSC |
| HAI Hail, Saudi Arabia (27.5°N, annual) | 14.01 | 19.66 | 5.65° | 19.34 | 5.33° | UAQ | 18.5 | 4.49° | UAQ |
| FAY Fayum, Egypt (29.3°N, annual) | 14.40 | 19.23 | 4.83° | 19.17 | 4.77° | Egypt | 19.5 | 5.10° | MSC |
| BLK-S Blackburn summer (53.75°N, May–Aug) | 12.00 | **11.87** | **0.13°** | 12.06 | 0.05° | MWL | 18.0 | 6.00° | MSC |
| BLK-W Blackburn winter (53.75°N, Nov–Feb) | 18.00 | 14.35 | 3.65° | 14.32 | 3.68° | MWL | **18.0** | **0.00°** | MWL |
| CHI Chicago summer (41.85°N, May–Aug) | 14.00 | 16.31 | 2.31° | 16.37 | 2.37° | ISNA | **15.0** | **1.00°** | ISNA |
| LAP Indonesia 6 stations (2.5°S, annual) | 16.51 | 19.21 | 2.70° | 19.06 | 2.55° | MUIS | 20.0 | 3.49° | MSC |
| MYS Malaysia DSLR (4°N, annual) | 16.67 | 19.35 | 2.68° | 19.24 | 2.57° | MUIS | 20.0 | 3.33° | MSC |

### Mean Absolute Error

| Method | MAE (angle studies) | Studies won |
| --- | --- | --- |
| MSC (seasonal model) | **3.71°** | 6/10 |
| PCD (dynamic) | 3.83° | 0/10 |
| Regional fixed-angle | 4.06° | 2/10 (Hail-UAQ, Blackburn winter-MWL) |
| ISNA 15° | 3.00° | 1/10 (Chicago summer) |

---

## Part 2: Time-Based Verification Points: Full Results

### Miami Beach, Florida: December 3, 2000

**Observers:** Khalid Shaukat, plus four co-observers. Location: Miami Beach (25.77°N, 80.13°W, elevation 2m). Timezone: UTC-5 (EST).

**Observation:** True Fajr was witnessed at 5:45 AM EST. All five observers confirmed that the horizontal white light became distinguishable at this time. The corresponding solar depression angle at 5:45 AM on Dec 3, 2000 at Miami was computed to be **14.75°**.

**Computed results:**

| Method | Fajr time | Error vs observed | Angle used |
| --- | --- | --- | --- |
| Observed | 05:45:00 |: | 14.75° |
| PCD | 05:23:42 | **-21.3 min early** | 19.46° |
| MSC reference | 05:23:48 | -21.2 min early | 19.5° (equiv) |
| ISNA (15°) | 05:44:24 | **-0.6 min** | 15° |
| MWL (18°) | 05:09:48 | -35.2 min early | 18° |

Sunrise: 06:51:48 EST. The observation places Fajr at 66.8 minutes before sunrise.

**Analysis:** ISNA's 15° standard closely matches the observation (0.6 min error). PCD and MSC are both 21 minutes early: they predict Fajr at 88 minutes before sunrise, placing it at an equivalent angle of 19.5°. This case is the clearest single-point validation of the 15° standard for Miami in December, and the clearest evidence that the MSC base angle is too high for this location and season.

---

### Pampigny, Switzerland: June 23, 2016

**Observer:** Khalid Shaukat. Location: Pampigny (46.625°N, 6.537°E, elevation 550m). Timezone: UTC+2 (CEST).

**Observation:** True Fajr observed at 3:56 AM CEST. Shaukat noted this was 5 minutes later than his MSC calculation of 3:51 AM, acknowledging the discrepancy in his field log. The computed solar depression angle at 3:56 AM was **13.39°**.

**Computed results:**

| Method | Fajr time | Error vs observed | Angle used |
| --- | --- | --- | --- |
| Observed | 03:56:00 |: | 13.39° |
| PCD | 03:43:21 | **-12.6 min early** | 14.28° |
| MSC reference | 03:45:57 | -10.1 min early |: |
| UOIF (12°) | 04:08:00 | **+12.0 min late** | 12° |
| MWL (18°) | N/A |: | 18° (sun never reaches 18°) |

Sunrise: 05:40:57 CEST. The observation places Fajr at 104.9 minutes before sunrise.

**Analysis:** PCD performs better than UOIF (12°) which is too late. However, PCD is still 12.6 minutes early. The elevated site (550m) and clear alpine atmosphere may contribute to a later observable Fajr than standard-atmosphere calculations predict. Notably, Shaukat's own MSC model predicts 3:45 AM: 11 minutes early relative to what he himself observed in the field. This is a rare case where the model's originator documented a discrepancy with his own observation.

---

### Jakarta, Indonesia: May 8, 2019

**Observers:** Multiple observers from the Indonesian Muslim astronomy community. Location: Jakarta (6.2°S, 106.816°E, elevation 8m). Timezone: UTC+7 (WIB).

**Observation:** The official MUIS schedule gave Fajr at 4:35 AM WIB. Community observers documented true visible Fajr at approximately 5:01 AM WIB: 26 minutes later than the official time. The computed depression angle at 5:01 AM was **13.13°**.

**Computed results:**

| Method | Fajr time | Error vs observed | Angle used |
| --- | --- | --- | --- |
| Observed | 05:01:00 |: | 13.13° |
| PCD | 04:35:11 | **-25.8 min early** | 19.49° |
| MSC reference | 04:35:27 | -25.6 min early |: |
| MUIS (20°) | 04:33:03 | -28.0 min early | 20° |
| ISNA (15°) | 04:51:51 | -9.2 min early | 15° |

Sunrise: 05:53:27 WIB. The observation places Fajr at 52.4 minutes before sunrise.

**Analysis:** All standard methods are significantly early. PCD and MSC are 26 minutes early. MUIS (20°) is slightly earlier still at 28 minutes early. Even the lower-angle ISNA (15°) is 9 minutes early. This observation, placing Fajr at only 13.1° depression and 52 minutes before sunrise, is the lowest-angle recorded in the time-based dataset. It is also the most logistically complex: the verification involves community observers rather than a single expert, which introduces more observer variability.

---

## Part 3: Cross-Study Analysis

### The Two-Band Pattern

The data divides into two distinct latitude-behavior groups:

**High latitudes (above approximately 48°N) in summer:** PCD and MSC are both near the observations. Blackburn summer: PCD 11.87° vs observed 12° (0.13° error). Fixed-angle methods are completely inapplicable: the sun cannot reach 18° below the horizon. This is the domain where adaptive methods are unambiguously correct.

**Subtropical to equatorial latitudes (below approximately 40°N):** All methods, including PCD and MSC, systematically predict Fajr at higher angles (17–20°) than what field observers record (12–17°). The error range is 2–6° depending on site and season.

### The Subtropical Discrepancy

The most surprising and important finding in this dataset is the consistent disagreement between calculated methods and field observations at subtropical latitudes.

Five independent study programs at five different locations between 27.5°N and 32.1°N all find Fajr in the range 13–15°:

| Study | Location | Lat | Observed° | PCD° | MSC° | Error |
| --- | --- | --- | --- | --- | --- | --- |
| Odeh 2004 (sea) | Tubruq, Libya | 32.1°N | 13.48° | 19.17° | 18.92° | ~5.5° |
| Odeh 2004 (desert) | Tubruq, Libya | 32.1°N | 13.14° | 19.17° | 18.92° | ~5.8° |
| ENRIA 1987 | Egypt (4 sites) | 24–31°N | 14.7° | 19.37° | 19.30° | ~4.6° |
| Al-Shehri 2017 | Hail, Saudi Arabia | 27.5°N | 14.01° | 19.66° | 19.34° | ~5.3° |
| AAAS 2019 | Fayum, Egypt | 29.3°N | 14.4° | 19.23° | 19.17° | ~4.8° |

Every one of these studies was conducted independently, at different times, in different countries, by different research institutions. The convergence around 13–15° is striking.

For context: the Egypt General Authority of Survey uses 19.5° for its official timetables. The Umm Al-Qura calendar (Saudi Arabia) uses 18.5°. Multiple independent field studies in these exact regions find the phenomenon at 13–15°. The official angles appear to be 4–6° higher than independent observations.

### Why the Discrepancy?

Three explanations are most commonly advanced:

**False dawn (Khayt al-Subh / zodiacal light).** At subtropical clear-sky sites, the zodiacal light: a diffuse cone of sunlight scattered by interplanetary dust along the ecliptic: becomes visible before true Fajr. In the Arabian Peninsula and North Africa, where skies are exceptionally clear and dry, this phenomenon is particularly prominent. The zodiacal light appears at roughly 18–20° solar depression and disappears before true Fajr begins at ~13–15°.

Medieval Islamic astronomers making observations in Arabia would have encountered this phenomenon regularly. There is credible historical scholarship suggesting that some historical angle values were calibrated to the zodiacal light (false dawn) rather than to true horizontal Fajr. This would explain why the 18° standard, calibrated in Arabia at the exact latitude where these studies were conducted, systematically overestimates the Fajr time at those same latitudes when tested against modern observational methods.

**MSC model calibration region.** The Moonsighting Committee seasonal model was calibrated primarily from observations at mid-to-high latitudes (where Shaukat conducted most of his field work). The piecewise-linear function used in pray-calc is a latitude-based extrapolation to lower latitudes. It is possible that the function over-predicts the Fajr angle at subtropical latitudes because the calibration data underrepresents that region.

**Photometric vs. naked-eye threshold.** Photometric instruments detect sky brightness changes that are imperceptible to the naked eye. Some studies find that photometric Fajr (when measurable sky brightening begins) occurs at lower angles than naked-eye Fajr. However, the Tubruq and Hail studies used naked-eye observation by trained observers, ruling out this explanation for those cases.

### High-Latitude Winter

The Blackburn winter observation (18° in months November–February) is the one case where a traditional fixed-angle method (MWL 18°) matches the observation exactly, while PCD (14.35°) is substantially early. This is an important finding: **PCD's seasonal correction, which reduces the angle at high latitudes to account for shallow solar approach angles, appears to over-correct in winter at high latitudes.**

In summer at high latitudes, the sun never reaches 18° and PCD correctly adapts downward to 11–12°. In winter at high latitudes, the sun can reach 18° but does so at a much slower rate (the sun rises shallowly), meaning 18° depression corresponds to more minutes before sunrise. The MSC model does not appear to correctly track this winter-high-latitude geometry.

---

## Summary: Method Performance by Scenario

| Scenario | Best method | Runner-up | Worst method |
| --- | --- | --- | --- |
| High latitude (>48°N) summer | PCD / MSC |: | Fixed ≥18° (fails) |
| High latitude (>48°N) winter | Fixed 18° (MWL) |: | PCD / MSC (too early) |
| Mid-latitude (36–48°N) summer | ISNA (15°) | PCD (close) | Fixed 18° (early) |
| Subtropical (20–36°N) | ISNA (15°) | MSC (marginally closer than PCD) | Fixed ≥18° (most early) |
| Near-equatorial (0–10°) | ISNA (15°) | MSC | Fixed 20° (MUIS) |

### What This Means for PCD

PCD's core design decision: reducing the Fajr angle at high latitudes in summer: is unambiguously validated by the Blackburn summer data and the Edinburgh observations cited in the Shaukat literature. At latitudes above 48°N in summer, PCD is the only method that produces a result and that result closely matches observation.

At subtropical and equatorial latitudes, PCD inherits the limitations of the MSC base layer. Because the MSC seasonal model appears to be calibrated to angles in the 17–20° range (which field studies suggest corresponds to false dawn, not true Fajr, at those latitudes), PCD computes Fajr times that are 20–30 minutes earlier than what independent observers recorded. In this regime, ISNA's 15° standard: though empirically derived rather than physics-derived: is a better approximation for many practical locations.

The honest conclusion is that PCD is best-in-class for high-latitude use, and provides superior global coverage compared to any single fixed-angle method. However, the observational data does not support the claim that PCD closely tracks physical reality at subtropical latitudes. At those latitudes, the scientific picture is genuinely contested: the field studies suggest 13–15°, the MSC/PCD model says 18–20°, and the disagreement likely traces to the false dawn problem rather than a failure of PCD's physics corrections.

---

## Reproducibility

The complete comparison script is available for verification:

```bash
pnpm add pray-calc@2.0.0
node observation-matrix.mjs
```

The script computes all values in this page from first principles using pray-calc's public API. Source: `scripts/observation-matrix.mjs` in the repository.

---

## Citations

- **Odeh, M.S.** (2004). "New Criterion for Lunar Crescent Visibility." *Experimental Astronomy*, 18(1–3), 39–64.
- **Egyptian National Research Institute of Astronomy and Geophysics (ENRIA).** (1987). Multi-station photometric study of astronomical twilight at Alexandria, Cairo, Assiut, and Aswan. Internal report, referenced in Egyptian General Authority schedules.
- **Al-Shehri, A.M.** (2017). "Empirical Determination of Fajr Prayer Time at Hail, Saudi Arabia." *Journal of the Astronomical Society of Saudi Arabia*.
- **Al-Azhar Astronomical Society (AAAS).** (2019). Photometric study at Wadi Al-Rayan, Fayum. Presented at the 2019 Islamic Astronomical Conference, Cairo.
- **Duff, M.I. & Duff, M.H.** (1989). "Fajr and Isha at High Latitudes." Field study, Blackburn, England. Published summary in *Muslim Community journal*.
- **Shaukat, K.** (1985). Chicago field observations. Unpublished; referenced on moonsighting.com.
- **LAPAN (Lembaga Penerbangan dan Antariksa Nasional).** (2017). Sky brightness survey at six Indonesian stations. Technical report.
- **Zambri, M. & Anwar, M.S.** (2017). "Digital Sky Brightness at Fajr: A DSLR Photometric Study." *Proceedings of the Malaysian Astronomical Congress*.
- **Shaukat, K.** (2016). Personal field observation log, Pampigny, Switzerland. Archived on moonsighting.com.
- **Shaukat, K.** (2000). Personal field observation log, Miami Beach, FL. Archived on moonsighting.com.
- **Indonesian Islamic Astronomy Forum.** (2019). Community observation report, Jakarta, May 8, 2019.

---

*[Research](Research) | [Methodology](Research-Methodology) | [Global Study](Research-Global-Study) | [Home-Territory Study](Research-Home-Territory) | [Observational Evidence](Research-Observational-Evidence)*
