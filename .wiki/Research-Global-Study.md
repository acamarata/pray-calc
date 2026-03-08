# Global Accuracy Study

**Study date:** February 2025
**pray-calc version:** 2.0.0
**Reference:** MSC (Moonsighting Committee Worldwide) observation-calibrated model
**Test cases:** 18 city/date combinations
**Latitude range:** 6.2°S (Jakarta) to 51.5°N (London)

See [Methodology](Research-Methodology) for the scoring approach, reference standard, and test infrastructure.

---

## Summary Table

Error is `method_time − MSC_reference` in minutes. Positive = later than MSC, negative = earlier.
`N/A` = sun never reaches the required depression angle (method is undefined for that case).

| # | City | Date | Lat | Elev | Sunrise | Maghrib | PCD Fajr° | PCD Isha° | MSC Fajr ref | MSC Isha ref |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | New York, USA | Jun 21 | 40.71°N | 10m | 05:25 | 20:30 | 16.21° | 12.41° | 03:35 (110 min) | 21:49 (79 min) |
| 2 | New York, USA | Dec 21 | 40.71°N | 10m | 07:16 | 16:32 | 17.48° | 17.12° | 05:40 (96 min) | 18:06 (94 min) |
| 3 | New York, USA | Mar 21 | 40.71°N | 10m | 06:56 | 19:09 | 17.48° | 15.28° | 05:27 (89 min) | 20:26 (77 min) |
| 4 | Toronto, Canada | Jun 21 | 43.65°N | 76m | 05:36 | 21:02 | 15.33° | 11.71° | 03:43 (113 min) | 22:22 (80 min) |
| 5 | London, UK | Jun 21 | 51.51°N | 11m | 04:43 | 21:21 | 11.88° | 10.00° | 02:43 (120 min) | 22:41 (80 min) |
| 6 | London, UK | Dec 21 | 51.51°N | 11m | 08:03 | 15:53 | 14.69° | 14.24° | 06:21 (102 min) | 17:32 (99 min) |
| 7 | Istanbul, Turkey | Jun 21 | 41.01°N | 114m | 05:32 | 20:39 | 16.28° | 12.40° | 03:41 (111 min) | 21:58 (79 min) |
| 8 | Makkah, S. Arabia | Jun 21 | 21.42°N | 277m | 05:39 | 19:05 | 19.79° | 16.56° | 04:05 (94 min) | 20:22 (77 min) |
| 9 | Makkah, S. Arabia | Dec 21 | 21.42°N | 277m | 06:54 | 17:43 | 19.58° | 19.36° | 05:28 (86 min) | 19:08 (85 min) |
| 10 | Tehran, Iran | Jun 21 | 35.69°N | 1191m | 04:48 | 19:23 | 17.95° | 14.09° | 03:02 (106 min) | 20:42 (79 min) |
| 11 | Cairo, Egypt | Jun 21 | 30.06°N | 23m | 04:54 | 18:59 | 18.73° | 14.97° | 03:13 (101 min) | 20:17 (78 min) |
| 12 | Cairo, Egypt | Dec 21 | 30.06°N | 23m | 06:46 | 16:59 | 19.13° | 18.72° | 05:15 (91 min) | 18:28 (89 min) |
| 13 | Karachi, Pakistan | Jun 21 | 24.86°N | 8m | 05:43 | 19:24 | 19.43° | 16.01° | 04:06 (97 min) | 20:42 (78 min) |
| 14 | Dhaka, Bangladesh | Jun 21 | 23.81°N | 4m | 05:12 | 18:48 | 19.49° | 16.19° | 03:36 (96 min) | 20:06 (78 min) |
| 15 | Jakarta, Indonesia | Jun 21 | 6.21°S | 8m | 06:01 | 17:47 | 18.72° | 18.72° | 04:43 (78 min) | 19:05 (78 min) |
| 16 | Singapore | Dec 21 | 1.35°N | 15m | 07:01 | 19:04 | 18.23° | 18.23° | 05:45 (76 min) | 20:20 (76 min) |
| 17 | Almaty, Kazakhstan | Jun 21 | 43.22°N | 848m | 04:12 | 19:36 | 15.73° | 12.05° | 02:19 (113 min) | 20:56 (80 min) |
| 18 | Riyadh, S. Arabia | Mar 21 | 24.69°N | 620m | 05:55 | 18:04 | 20.04° | 18.25° | 04:31 (84 min) | 19:20 (76 min) |

---

## Accuracy Rankings

**Mean Absolute Error vs MSC reference, sorted by combined MAE.**
`n_Fajr` / `n_Isha` = number of valid (non-NaN) results included in MAE calculation.

| Rank | Method | Fajr MAE (min) | Isha MAE (min) | Combined MAE | n_Fajr | n_Isha |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | MSC | 0.00 | 0.00 | 0.00 | 18 | 18 |
| **2** | **★ PCD (Dynamic)** | **0.64** | **1.30** | **0.97** | **18** | **18** |
| 3 | Qatar | 10.21 | 10.22 | 10.21 | 17 | 18 |
| 4 | UAQ | 11.08 | 10.22 | 10.65 | 17 | 18 |
| 5 | MWL | 10.21 | 17.09 | 13.65 | 17 | 17 |
| 6 | DIBT | 10.21 | 17.09 | 13.65 | 17 | 17 |
| 7 | IGUT | 9.81 | 17.98 | 13.90 | 17 | 18 |
| 8 | Kuwait | 10.21 | 18.92 | 14.56 | 17 | 17 |
| 9 | Karachi | 10.21 | 20.89 | 15.55 | 17 | 17 |
| 10 | SAMR | 11.54 | 19.94 | 15.74 | 17 | 18 |
| 11 | Egypt | 14.49 | 18.92 | 16.71 | 17 | 17 |
| 12 | MUIS | 17.79 | 20.89 | 19.34 | 17 | 17 |
| 13 | ISNA | 19.44 | 19.94 | 19.69 | 18 | 18 |
| 14 | ISNACA | 26.96 | 18.45 | 22.71 | 18 | 18 |
| 15 | UOIF | 31.59 | 20.00 | 25.80 | 18 | 18 |

**Notes on n values:** Methods with `n_Fajr = 17` or `n_Isha = 17` had one NaN result (typically London summer). Methods returning NaN for that case are not penalized in MAE: the actual failure rate is noted in the High-Latitude section below.

---

## Per-Case Detail: Fajr Errors by Method

Error in minutes vs MSC reference (`+` = later, `−` = earlier). `N/A` = sun does not reach required depression.

| City / Date | PCD | UOIF | ISNACA | ISNA | SAMR | IGUT | MWL | DIBT | Karachi | Kuwait | UAQ | Qatar | Egypt | MUIS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NY Jun | **−0.2** | +34.0 | +26.3 | +10.2 | +1.7 | −13.6 | −16.4 | −16.4 | −16.4 | −16.4 | −21.2 | −16.4 | −31.3 | −36.6 |
| NY Dec | **+0.1** | +30.6 | +25.0 | +13.8 | +8.3 | −1.1 | −2.7 | −2.7 | −2.7 | −2.7 | −5.5 | −2.7 | −10.9 | −13.7 |
| NY Mar | **+0.2** | +30.0 | +24.6 | +13.8 | +8.3 | −1.0 | −2.7 | −2.7 | −2.7 | −2.7 | −5.4 | −2.7 | −11.0 | −13.7 |
| Toronto Jun | **−0.8** | +29.9 | +21.1 | +2.5 | −7.6 | −26.2 | −29.8 | −29.8 | −29.8 | −29.8 | −36.0 | −29.8 | −49.3 | −56.7 |
| London Jun | **−0.4** | −2.4 | −20.3 | −87.8 | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| London Dec | **+0.1** | +18.6 | +11.6 | −2.1 | −8.8 | −20.2 | −22.2 | −22.2 | −22.2 | −22.2 | −25.6 | −22.2 | −32.2 | −35.5 |
| Istanbul Jun | **−0.9** | +34.4 | +26.6 | +10.2 | +1.6 | −13.9 | −16.8 | −16.8 | −16.8 | −16.8 | −21.7 | −16.8 | −32.0 | −37.4 |
| Makkah Jun | **−0.8** | +39.5 | +34.4 | +24.3 | +19.1 | +10.2 | +8.7 | +8.7 | +8.7 | +8.7 | +6.0 | +8.7 | +0.7 | −2.0 |
| Makkah Dec | **−0.5** | +34.1 | +29.5 | +20.3 | +15.8 | +8.0 | +6.7 | +6.7 | +6.7 | +6.7 | +4.4 | +6.7 | −0.1 | −2.4 |
| Tehran Jun | **−2.5** | +38.6 | +32.1 | +18.6 | +11.6 | −0.7 | −2.9 | −2.9 | −2.9 | −2.9 | −6.6 | −2.9 | −14.3 | −18.2 |
| Cairo Jun | **−0.2** | +40.1 | +34.4 | +22.6 | +16.6 | +6.2 | +4.3 | +4.3 | +4.3 | +4.3 | +1.2 | +4.3 | −5.1 | −8.4 |
| Cairo Dec | **0.0** | +34.8 | +29.9 | +20.1 | +15.2 | +7.0 | +5.5 | +5.5 | +5.5 | +5.5 | +3.1 | +5.5 | −1.7 | −4.1 |
| Karachi Jun | **−0.1** | +40.4 | +35.1 | +24.4 | +19.0 | +9.6 | +7.9 | +7.9 | +7.9 | +7.9 | +5.1 | +7.9 | −0.5 | −3.3 |
| Dhaka Jun | **−0.3** | +39.8 | +34.6 | +24.1 | +18.8 | +9.6 | +7.9 | +7.9 | +7.9 | +7.9 | +5.2 | +7.9 | −0.3 | −3.1 |
| Jakarta Jun | **−0.3** | +29.0 | +24.7 | +15.9 | +11.6 | +4.2 | +2.9 | +2.9 | +2.9 | +2.9 | +0.7 | +2.9 | −3.7 | −5.9 |
| Singapore Dec | **−0.4** | +26.9 | +22.5 | +13.8 | +9.4 | +2.0 | +0.7 | +0.7 | +0.7 | +0.7 | −1.5 | +0.7 | −5.9 | −8.1 |
| Almaty Jun | **−3.0** | +30.8 | +22.2 | +4.0 | −5.7 | −23.7 | −27.2 | −27.2 | −27.2 | −27.2 | −33.1 | −27.2 | −45.7 | −52.6 |
| Riyadh Mar | **−0.9** | +34.8 | +30.4 | +21.5 | +17.1 | +9.5 | +8.2 | +8.2 | +8.2 | +8.2 | +6.0 | +8.2 | +1.5 | −0.7 |

---

## Per-Case Detail: Isha Errors by Method

| City / Date | PCD | UOIF | ISNACA | ISNA | SAMR | IGUT | MWL | DIBT | Karachi | Kuwait | UAQ | Qatar | Egypt | MUIS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NY Jun | **+0.4** | −2.8 | +4.9 | +21.1 | +21.1 | +12.9 | +38.4 | +38.4 | +47.6 | +43.0 | +11.0 | +11.0 | +43.0 | +47.6 |
| NY Dec | **−0.1** | −28.6 | −23.0 | −11.8 | −11.8 | −17.4 | −0.8 | −0.8 | +4.7 | +2.0 | −4.0 | −4.0 | +2.0 | +4.7 |
| NY Mar | **−0.9** | −18.7 | −13.3 | −2.5 | −2.5 | −7.9 | +8.5 | +8.5 | +14.0 | +11.2 | +13.0 | +13.0 | +11.2 | +14.0 |
| Toronto Jun | **+0.8** | +3.3 | +12.1 | +30.7 | +30.7 | +21.2 | +51.5 | +51.5 | +63.0 | +57.1 | +10.0 | +10.0 | +57.1 | +63.0 |
| London Jun | **+13.3** | +42.4 | +60.4 | +127.8 | +127.8 | +83.4 | N/A | N/A | N/A | N/A | +10.0 | +10.0 | N/A | N/A |
| London Dec | **−0.1** | −15.6 | −8.6 | +5.1 | +5.1 | −1.8 | +18.6 | +18.6 | +25.2 | +21.9 | −9.0 | −9.0 | +21.9 | +25.2 |
| Istanbul Jun | **+0.7** | −2.3 | +5.4 | +21.8 | +21.8 | +13.5 | +39.4 | +39.4 | +48.8 | +44.0 | +11.0 | +11.0 | +44.0 | +48.8 |
| Makkah Jun | **+0.8** | −22.5 | −17.4 | −7.2 | −7.2 | −12.4 | +3.1 | +3.1 | +8.3 | +5.7 | +13.0 | +13.0 | +5.7 | +8.3 |
| Makkah Dec | **+0.5** | −33.1 | −28.5 | −19.3 | −19.3 | −23.9 | −10.2 | −10.2 | −5.7 | −8.0 | +5.0 | +5.0 | −8.0 | −5.7 |
| Tehran Jun | **+2.3** | −11.6 | −5.0 | +8.5 | +8.5 | +1.6 | +22.6 | +22.6 | +29.9 | +26.2 | +11.0 | +11.0 | +26.2 | +29.9 |
| Cairo Jun | **+0.2** | −17.1 | −11.4 | +0.4 | +0.4 | −5.5 | +12.5 | +12.5 | +18.7 | +15.6 | +12.0 | +12.0 | +15.6 | +18.7 |
| Cairo Dec | **0.0** | −32.8 | −27.9 | −18.1 | −18.1 | −23.0 | −8.4 | −8.4 | −3.5 | −5.9 | +1.0 | +1.0 | −5.9 | −3.5 |
| Karachi Jun | **+0.1** | −21.4 | −16.1 | −5.4 | −5.4 | −10.8 | +5.5 | +5.5 | +11.1 | +8.3 | +12.0 | +12.0 | +8.3 | +11.1 |
| Dhaka Jun | **0.0** | −22.1 | −16.9 | −6.3 | −6.3 | −11.6 | +4.4 | +4.4 | +9.8 | +7.1 | +12.0 | +12.0 | +7.1 | +9.8 |
| Jakarta Jun | **+0.1** | −29.2 | −24.9 | −16.2 | −16.2 | −20.5 | −7.4 | −7.4 | −3.1 | −5.3 | +12.0 | +12.0 | −5.3 | −3.1 |
| Singapore Dec | **−0.1** | −27.4 | −23.0 | −14.3 | −14.3 | −18.7 | −5.5 | −5.5 | −1.1 | −3.3 | +14.0 | +14.0 | −3.3 | −1.1 |
| Almaty Jun | **+2.4** | +2.0 | +10.5 | +28.7 | +28.7 | +19.4 | +48.8 | +48.8 | +59.9 | +54.3 | +10.0 | +10.0 | +54.3 | +59.9 |
| Riyadh Mar | **+0.5** | −27.2 | −22.8 | −13.9 | −13.9 | −18.4 | −5.0 | −5.0 | −0.6 | −2.8 | +14.0 | +14.0 | −2.8 | −0.6 |

---

## High-Latitude Edge Case

London, UK on June 21 (51.5°N) is the most extreme test case. As the sun approaches its highest declination, it never reaches deep depression angles.

| Method | Fixed Isha° | Isha result |
| --- | --- | --- |
| UOIF | 12° | 23:24 (valid) |
| ISNACA | 13° | 23:42 (valid) |
| ISNA | 15° | 24:49 (technically computed, next day) |
| SAMR | 15° | 24:49 (same as ISNA Isha) |
| IGUT | 14° | 24:05 (next day) |
| UAQ | +90 min | 22:51 (valid: not angle-based) |
| Qatar | +90 min | 22:51 (valid: not angle-based) |
| MSC | seasonal | 22:41 (valid: observation-based) |
| **PCD** | **10.00°** | **22:54 (valid: adapted)** |
| MWL | 17° | **N/A** |
| DIBT | 17° | **N/A** |
| Karachi | 18° | **N/A** |
| Kuwait | 17.5° | **N/A** |
| Egypt | 17.5° | **N/A** |
| MUIS | 18° | **N/A** |

Six of the 14 methods produce no Isha time at London in midsummer. PCD adapts by clamping to the 10° lower bound and produces 22:54: 13 minutes later than MSC's 22:41 (the largest single error in the study). The error is structural: at 51.5°N in June, the sky never fully darkens, and both the observation reference and any computed method are approximations of a genuinely ambiguous twilight condition.

---

## Dynamic Angle Profile

How the PCD-computed depression angle varies across the test cases.

| City | Lat | Season | Fajr° | Isha° | Closest Fixed Method |
| --- | --- | --- | --- | --- | --- |
| Jakarta | 6.2°S | Jun | 18.72° | 18.72° | UAQ (18.5°) |
| Singapore | 1.4°N | Dec | 18.23° | 18.23° | MWL/DIBT (18°) |
| Makkah | 21.4°N | Jun | 19.79° | 16.56° | MUIS (20°) / Egypt |
| Makkah | 21.4°N | Dec | 19.58° | 19.36° | Egypt (19.5°) |
| Riyadh | 24.7°N | Mar | 20.04° | 18.25° | MUIS (20°) |
| Karachi | 24.9°N | Jun | 19.43° | 16.01° | Egypt (19.5°) |
| Dhaka | 23.8°N | Jun | 19.49° | 16.19° | Egypt (19.5°) |
| Cairo | 30.1°N | Jun | 18.73° | 14.97° | UAQ (18.5°) |
| Cairo | 30.1°N | Dec | 19.13° | 18.72° | Egypt (19.5°) |
| Tehran | 35.7°N | Jun | 17.95° | 14.09° | IGUT (17.7°/14°) |
| New York | 40.7°N | Dec | 17.48° | 17.12° | IGUT (17.7°) |
| New York | 40.7°N | Mar | 17.48° | 15.28° | IGUT (17.7°) |
| Istanbul | 41.0°N | Jun | 16.28° | 12.40° | SAMR (16°) |
| New York | 40.7°N | Jun | 16.21° | 12.41° | SAMR (16°) |
| Almaty | 43.2°N | Jun | 15.73° | 12.05° | SAMR (16°) |
| Toronto | 43.7°N | Jun | 15.33° | 11.71° | ISNA (15°) |
| London | 51.5°N | Dec | 14.69° | 14.24° | ISNA (15°) |
| London | 51.5°N | Jun | 11.88° | 10.00° | UOIF (12°) |

The angle moves from ~20° at tropical latitudes in summer to ~12° at high-latitude summer. No fixed method tracks this gradient correctly. SAMR (16°) is closest for North American and Central Asian summers. ISNA (15°) handles Toronto and London winter. IGUT (17.7°) is closest for Tehran and mid-latitude winters. But each of these methods fails in other conditions: only PCD adapts dynamically across the full range.

---

*[Research](Research) | [Methodology](Research-Methodology) | [Home-Territory Study](Research-Home-Territory) | [Observational Evidence](Research-Observational-Evidence)*
