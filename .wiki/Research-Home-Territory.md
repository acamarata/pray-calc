# Home-Territory Accuracy Study

**Study date:** February 2025
**pray-calc version:** 2.0.0
**Reference:** MSC (Moonsighting Committee Worldwide) observation-calibrated model

This study tests each of the 14 traditional methods at the specific city and season for which it was designed. It is the most favorable possible test for each fixed-angle method — a method's best-case performance.

The question: does PCD (Prayer Calc Dynamic) remain more accurate than a method even when that method is tested in its own home territory?

---

## Overall Result

Across 34 Fajr + 34 Isha home-territory test cases:

| | PCD (Dynamic) | Traditional (avg) | Ratio |
| --- | --- | --- | --- |
| Fajr MAE | **0.65 min** | 7.53 min | 11.6× worse |
| Isha MAE | **0.64 min** | 9.84 min | 15.4× worse |
| Combined MAE | **0.64 min** | 8.69 min | **13.5× worse** |

**PCD wins 13 of 14 methods at their own home territory.** The only exception is MSC itself, which edges PCD by 0.5 minutes — expected, since PCD uses the MSC model as its Layer 1 base. MSC is the observation reference; PCD is the computed approximation of it.

---

## Per-Method Scorecard

Each row represents one traditional method, tested at its home city across all listed seasons.

| Method | Home City | Fixed Fajr° | PCD Avg Fajr° | Δ° (Dyn − Fixed) | PCD MAE | Method MAE | Winner | Margin |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UOIF | Paris, France | 12.0° | 14.30° | +2.30° | 0.45 min | 19.91 min | ★ PCD | 19.5 min |
| ISNACA | Ottawa, Canada | 13.0° | 15.59° | +2.59° | 0.51 min | 18.41 min | ★ PCD | 17.9 min |
| ISNA | Chicago, USA | 15.0° | 16.94° | +1.94° | 0.73 min | 11.48 min | ★ PCD | 10.7 min |
| SAMR | Moscow, Russia | 16.0° | 11.57° | −4.43° | 0.65 min | 20.01 min | ★ PCD | 19.4 min |
| IGUT | Tehran, Iran | 17.7° | 18.52° | +0.82° | 1.67 min | 7.06 min | ★ PCD | 5.4 min |
| MWL | Makkah, S. Arabia | 18.0° | 19.86° | +1.86° | 0.56 min | 7.42 min | ★ PCD | 6.9 min |
| DIBT | Ankara, Turkey | 18.0° | 17.40° | −0.60° | 1.88 min | 12.68 min | ★ PCD | 10.8 min |
| Karachi | Karachi, Pakistan | 18.0° | 19.41° | +1.41° | 0.12 min | 7.55 min | ★ PCD | 7.4 min |
| Kuwait | Kuwait City | 18.0° | 19.02° | +1.02° | 0.23 min | 7.91 min | ★ PCD | 7.7 min |
| UAQ | Riyadh, S. Arabia | 18.5° | 19.73° | +1.23° | 0.98 min | 7.46 min | ★ PCD | 6.5 min |
| Qatar | Doha, Qatar | 18.0° | 19.33° | +1.33° | 0.12 min | 7.18 min | ★ PCD | 7.1 min |
| Egypt | Cairo, Egypt | 19.5° | 19.06° | −0.44° | 0.17 min | 5.01 min | ★ PCD | 4.8 min |
| MUIS | Singapore | 20.0° | 18.68° | −1.32° | 0.21 min | 4.24 min | ★ PCD | 4.0 min |
| MSC | New York, USA | seasonal | 17.14° | — | 0.55 min | 0.00 min | MSC | 0.5 min |

"Δ° (Dyn − Fixed)" = PCD computed angle minus the method's fixed angle, averaged across the tested seasons for that city. A positive value means the method's fixed angle is too low for its own home city; negative means it is too high.

---

## Season-by-Season Detail

### UOIF — Paris, France (12°/12°)

*Lowest angles of any major method. Designed for France's large Muslim minority seeking the least restrictive valid times.*

| Season | PCD Fajr° | MSC Fajr | PCD Fajr err | UOIF Fajr err | PCD Isha err | UOIF Isha err | Winner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Jun 21 | 13.14° | 03:50 | **−0.6 min** | +13.7 min | **+1.0 min** | +23.4 min | ★ PCD by 17.7 min |
| Dec 21 | 15.46° | 08:01 | **−0.1 min** | +22.3 min | **+0.1 min** | −20.3 min | ★ PCD by 21.2 min |

**Note:** At Paris in summer (48.9°N, June), UOIF's 12° Fajr gives a time 13.7 minutes later than MSC. The PCD angle (13.14°) is slightly higher than UOIF's 12°, correctly recognizing that even at Paris in summer, physical twilight starts slightly earlier than UOIF assumes.

### ISNACA — Ottawa, Canada (13°/13°)

*Symmetric 13° angles for Canada. Used by the Islamic Council of North America.*

| Season | PCD Fajr° | MSC Fajr | PCD Fajr err | ISNACA Fajr err | PCD Isha err | ISNACA Isha err | Winner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Jun 21 | 14.61° | 03:20 | **−0.8 min** | +15.8 min | **+0.9 min** | +18.4 min | ★ PCD by 16.3 min |
| Dec 21 | 16.56° | 07:00 | **−0.2 min** | +21.2 min | **+0.2 min** | −18.2 min | ★ PCD by 19.5 min |

**Note:** ISNACA's 13° angles are too low by 1.6–3.6° across Ottawa's seasons. In summer, ISNACA Fajr is 15.8 minutes late vs MSC; in winter, 21.2 minutes late. ISNACA consistently underestimates the twilight angle even in its intended region.

### ISNA — Chicago, USA (15°/15°)

*Revised from 18° to 15° in 2007 after observational review by the Fiqh Council of North America. The 15° standard was justified partly by the finding that 18° produces astronomically unreachable angles in summer at North American latitudes.*

| Season | PCD Fajr° | MSC Fajr | PCD Fajr err | ISNA Fajr err | PCD Isha err | ISNA Isha err | Winner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Jun 21 | 15.94° | 03:24 | **−1.1 min** | +7.3 min | **+1.2 min** | +24.9 min | ★ PCD by 15.0 min |
| Dec 21 | 17.42° | 06:38 | **−0.5 min** | +13.1 min | **+0.5 min** | −10.1 min | ★ PCD by 11.2 min |
| Mar 21 | 17.46° | 05:21 | **−0.4 min** | +13.3 min | **+0.7 min** | +0.1 min | ★ PCD by 6.1 min |

**Note:** Even ISNA's revised 15° is too low for Chicago in summer — the PCD angle of 15.94° reflects that Chicago in June needs slightly more than 15°. ISNA's 15° remains more accurate than the old 18°, but PCD is still 10.7 minutes better on average.

### SAMR — Moscow, Russia (16°/15°)

*The most dramatically failing method at its home city. Moscow in summer (55.8°N) has such short nights that the sun never reaches 16° depression — both Fajr and Isha return NaN.*

| Season | PCD Fajr° | SAMR result | PCD Fajr err | SAMR Fajr err | Winner |
| --- | --- | --- | --- | --- | --- |
| Jun 21 | 10.00° | **N/A (NaN)** | −17.0 min | N/A | ★ PCD by 961 min avg |
| Dec 21 | 13.15° | 06:51 | **−0.7 min** | −22.3 min | ★ PCD by 19.4 min |

**Note:** SAMR silently fails for its own primary city in summer. PCD's 10° clamped result is off by 17 minutes in Fajr, but this is far better than no result at all. In winter Moscow, PCD is within 0.7 minutes while SAMR is 22.3 minutes off (its 16°/15° angles, calibrated for the region's winter worship pattern, are too high for winter morning and too low to compute in summer).

### IGUT — Tehran, Iran (17.7°/14°)

*The closest fixed-angle match at its own home territory. IGUT's 17.7° Fajr is within 0.82° of PCD's average Tehran output (18.52°).*

| Season | PCD Fajr° | PCD Fajr err | IGUT Fajr err | PCD Isha err | IGUT Isha err | Winner |
| --- | --- | --- | --- | --- | --- | --- |
| Jun 21 | 17.95° | −2.5 min | **−0.7 min** | +2.3 min | **+1.6 min** | IGUT by 1.2 min |
| Dec 21 | 18.78° | **−1.5 min** | +4.0 min | **+1.5 min** | −20.2 min | ★ PCD by 10.6 min |
| Mar 21 (Nowruz) | 18.84° | **−1.5 min** | +4.3 min | **+0.9 min** | −11.5 min | ★ PCD by 6.8 min |

**Note:** IGUT wins in summer by 1.2 minutes — the only case where a fixed-angle method beats PCD at its home territory. This is because Tehran in summer happens to closely match IGUT's calibrated 17.7° Fajr angle. IGUT's 14° Isha (shafaq ahmer) is also close to PCD's summer Isha computation. However, this advantage disappears in winter and at Nowruz, where PCD is consistently better.

### MWL — Makkah, Saudi Arabia (18°/17°)

*The Muslim World League is headquartered in Makkah. 18° was historically derived from observations at equatorial and sub-tropical locations.*

| Season | PCD Fajr° | PCD Fajr err | MWL Fajr err | PCD Isha err | MWL Isha err | Winner |
| --- | --- | --- | --- | --- | --- | --- |
| Jun 21 | 19.79° | **−0.8 min** | +8.7 min | **+0.8 min** | +3.1 min | ★ PCD by 5.1 min |
| Dec 21 | 19.58° | **−0.5 min** | +6.7 min | **+0.5 min** | −10.2 min | ★ PCD by 8.0 min |
| Mar 21 | 20.22° | **−0.5 min** | +9.1 min | **+0.2 min** | −6.7 min | ★ PCD by 7.5 min |

**Note:** At Makkah, PCD consistently computes ~19.6–20.2° — higher than MWL's fixed 18°. The physics bear this out: Makkah at 21.4°N is tropical rather than equatorial, and the equatorial-calibrated 18° underestimates the actual twilight angle. PCD converges closer to the empirical MSC reference.

### DIBT — Ankara, Turkey (18°/17°)

*Same angles as MWL. Diyanet (Turkish Directorate of Religious Affairs) uses this standard nationally.*

| Season | PCD Fajr° | PCD Fajr err | DIBT Fajr err | PCD Isha err | DIBT Isha err | Winner |
| --- | --- | --- | --- | --- | --- | --- |
| Jun 21 | 16.81° | **−2.5 min** | −13.1 min | **+2.2 min** | +35.2 min | ★ PCD by 21.8 min |
| Dec 21 | 17.98° | **−1.4 min** | −1.5 min | **+1.4 min** | −1.0 min | DIBT by 0.2 min |

**Note:** In Ankara summer, DIBT's fixed 18° is too high — the sun never reaches it cleanly, producing a very early Fajr that is 13.1 minutes earlier than MSC's observation reference. PCD at 16.81° is 2.5 minutes early (still closer). In winter, DIBT and PCD are almost identical. The difference is clear: DIBT was calibrated for winter/moderate conditions; PCD adapts to both.

### Karachi — Karachi, Pakistan (18°/18°)

*Symmetric 18° angles, standard across Pakistan, Bangladesh, India, and Afghanistan.*

| Season | PCD Fajr° | PCD Fajr err | Karachi Fajr err | PCD Isha err | Karachi Isha err | Winner |
| --- | --- | --- | --- | --- | --- | --- |
| Jun 21 | 19.43° | **−0.1 min** | +7.9 min | **+0.1 min** | +11.1 min | ★ PCD by 9.4 min |
| Dec 21 | 19.39° | **+0.1 min** | +6.6 min | **−0.1 min** | −4.6 min | ★ PCD by 5.5 min |

**Note:** Karachi at 24.9°N sits in the subtropical band where PCD computes ~19.4° — higher than the fixed 18°. The Karachi method (established for a city at approximately this latitude) is 7–8 minutes off Fajr even at home. PCD tracks MSC within 0.1 minutes.

### Kuwait — Kuwait City (18°/17.5°)

| Season | PCD Fajr° | PCD Fajr err | Kuwait Fajr err | PCD Isha err | Kuwait Isha err | Winner |
| --- | --- | --- | --- | --- | --- | --- |
| Jun 21 | 18.95° | **−0.4 min** | +5.5 min | **+0.4 min** | +14.4 min | ★ PCD by 9.6 min |
| Dec 21 | 19.09° | **−0.1 min** | +5.1 min | **+0.1 min** | −6.5 min | ★ PCD by 5.8 min |

### UAQ — Riyadh, Saudi Arabia (18.5°/+90 min)

*The official Saudi government calendar used for all religious timing in the Kingdom. 18.5° Fajr is slightly higher than MWL's 18° to account for Saudi geographic and atmospheric conditions.*

| Season | PCD Fajr° | PCD Fajr err | UAQ Fajr err | PCD Isha err | UAQ Isha err | Winner |
| --- | --- | --- | --- | --- | --- | --- |
| Jun 21 | 19.51° | **−1.3 min** | +4.4 min | **+1.3 min** | +12.0 min | ★ PCD by 6.9 min |
| Dec 21 | 19.64° | **−0.9 min** | +4.4 min | **+0.9 min** | +4.0 min | ★ PCD by 3.3 min |
| Mar 21 | 20.04° | **−0.9 min** | +6.0 min | **+0.5 min** | +14.0 min | ★ PCD by 9.3 min |

**Note:** UAQ's +90 min flat offset for Isha produces a systematic +10–14 minute Isha error at Riyadh. The UAQ Isha definition (Maghrib + 90 min) is a civil convenience rule rather than an astronomical one. The actual shafaq abyad end at Riyadh is 76–86 minutes after sunset depending on season.

### Qatar — Doha, Qatar (18°/+90 min)

| Season | PCD Fajr° | PCD Fajr err | Qatar Fajr err | PCD Isha err | Qatar Isha err | Winner |
| --- | --- | --- | --- | --- | --- | --- |
| Jun 21 | 19.33° | **−0.1 min** | +7.4 min | **+0.1 min** | +12.0 min | ★ PCD by 9.6 min |
| Dec 21 | 19.33° | **+0.1 min** | +6.3 min | **−0.1 min** | +3.0 min | ★ PCD by 4.5 min |

### Egypt — Cairo, Egypt (19.5°/17.5°)

*Egypt has the highest Fajr angle (19.5°) of any major method. It was established by the Egyptian General Authority of Survey and applies across Egypt, Syria, Iraq, and Lebanon.*

| Season | PCD Fajr° | PCD Fajr err | Egypt Fajr err | PCD Isha err | Egypt Isha err | Winner |
| --- | --- | --- | --- | --- | --- | --- |
| Jun 21 | 18.73° | **−0.2 min** | −5.1 min | **+0.2 min** | +15.6 min | ★ PCD by 10.1 min |
| Dec 21 | 19.13° | **0.0 min** | −1.7 min | **0.0 min** | −5.9 min | ★ PCD by 3.8 min |
| Mar 21 | 19.33° | **0.0 min** | −0.8 min | **−0.5 min** | +0.9 min | ★ PCD by 0.6 min |

**Note:** Egypt's 19.5° Fajr is higher than PCD's computed angle for Cairo (18.73–19.33°). The fixed angle makes Fajr slightly earlier than MSC predicts. The closest result is at equinox (−0.8 min vs 0.0 min), where PCD is only 0.6 minutes better — Egypt's best case.

### MUIS — Singapore (20°/18°)

*The highest Fajr angle of any major method. MUIS was designed for Singapore's near-equatorial location (1.35°N). However, PCD computes 18.2–19.6° at Singapore — consistently lower than 20°.*

| Season | PCD Fajr° | PCD Fajr err | MUIS Fajr err | PCD Isha err | MUIS Isha err | Winner |
| --- | --- | --- | --- | --- | --- | --- |
| Jun 21 | 18.21° | **−0.3 min** | −8.3 min | **+0.1 min** | +0.2 min | ★ PCD by 4.0 min |
| Dec 21 | 18.23° | **−0.4 min** | −8.1 min | **−0.1 min** | −1.1 min | ★ PCD by 4.4 min |
| Mar 21 | 19.59° | **+0.2 min** | −1.4 min | **+0.1 min** | −6.3 min | ★ PCD by 3.7 min |

**Note:** At the equatorial city it was designed for, MUIS's 20° Fajr makes Fajr 8 minutes earlier than MSC in summer and winter. The MSC model, calibrated from actual observations, places Singapore Fajr at approximately 76 minutes before sunrise — shorter than what 20° would produce. PCD's 18.2–18.4° is the more accurate description of actual equatorial twilight.

### MSC — New York, USA (seasonal/seasonal)

*This comparison tests PCD against the MSC seasonal model at MSC's own home (the latitude for which Khalid Shaukat published and validated his tables most extensively).*

| Season | PCD Fajr err | MSC err | PCD Isha err | MSC Isha err | Winner |
| --- | --- | --- | --- | --- | --- |
| Jun 21 | −0.2 min | 0.0 min | +0.4 min | 0.0 min | MSC by 0.3 min |
| Dec 21 | +0.1 min | 0.0 min | −0.1 min | 0.0 min | MSC by 0.1 min |
| Sep 21 | −0.9 min | 0.0 min | +1.6 min | 0.0 min | MSC by 1.3 min |

**Note:** MSC wins by a fraction of a minute at its own home. This is expected and appropriate — PCD uses MSC as its base, and the physics corrections introduce small deviations at the reference latitude. The question is whether those physics corrections help elsewhere (they do — PCD is more accurate at Tehran, high-elevation cities, and polar-season locations).

---

## Calibration Analysis: How Well Do Fixed Angles Match Their Home Cities?

The "Δ°" column in the scorecard shows the gap between a method's fixed angle and what PCD (and by proxy MSC) indicates is physically appropriate at that city.

| Method | Fixed° | Actual° (PCD avg) | Δ° | Calibration quality |
| --- | --- | --- | --- | --- |
| IGUT | 17.7° | 18.52° | +0.82° | Excellent — closest fixed calibration |
| Egypt | 19.5° | 19.06° | −0.44° | Good — slightly high |
| DIBT | 18.0° | 17.40° | −0.60° | Good — slightly high for Ankara |
| MUIS | 20.0° | 18.68° | −1.32° | Fair — overcorrected high |
| Karachi | 18.0° | 19.41° | +1.41° | Fair — too low for subtropical Karachi |
| MWL | 18.0° | 19.86° | +1.86° | Fair — 18° too low for equatorial-adjacent latitudes |
| ISNA | 15.0° | 16.94° | +1.94° | Moderate — revised from 18° but still too low |
| UAQ | 18.5° | 19.73° | +1.23° | Fair — better than MWL but still low |
| Kuwait | 18.0° | 19.02° | +1.02° | Fair — similar to MWL |
| Qatar | 18.0° | 19.33° | +1.33° | Fair |
| UOIF | 12.0° | 14.30° | +2.30° | Weak — 2.3° too low even for Paris |
| ISNACA | 13.0° | 15.59° | +2.59° | Weak — too low for Canadian latitudes |
| SAMR | 16.0° | 11.57° | −4.43° | Very poor — too high to function in Moscow summer |

**IGUT is the best-calibrated fixed-angle method**: its 17.7° Fajr angle was clearly derived from observation at Tehran's latitude and elevation. The 0.82° deviation from PCD is within the margin of seasonal variation, and IGUT beats PCD in summer at Tehran by 1.2 minutes.

**SAMR has the worst calibration**: its 16°/15° angles cannot be reached by the sun at Moscow in midsummer, making it completely undefined for the city it was designed to serve.

---

*[Research](Research) | [Methodology](Research-Methodology) | [Global Study](Research-Global-Study) | [Observational Evidence](Research-Observational-Evidence)*
