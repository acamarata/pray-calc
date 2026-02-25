# Observational Evidence

This page documents the empirical basis for the twilight angle values used in the PCD (Prayer Calc Dynamic) algorithm. It compiles published field observations, academic studies, and institutional validations that establish what depression angles actually correspond to the Islamic twilight phenomena (Fajr and Isha) at different latitudes.

---

## Why Observational Evidence Matters

Islamic prayer times are not purely mathematical constructs. Fajr (Subh Sadiq, true dawn) is defined as the moment horizontal white light becomes distinguishable along the eastern horizon — a physical phenomenon, not a calculation. Isha (the end of shafaq) similarly corresponds to the disappearance of the post-sunset glow — again, a physical event.

Depression angles are a mathematical proxy for these physical events. The question of which angle correctly represents the physical phenomenon can only be settled by looking at what trained observers actually record when they witness the event.

The core finding across all published observational studies: **the twilight angle is not fixed. It varies with latitude and season.** Fixed-angle methods that apply a single value globally are systematically inaccurate at any latitude other than their calibration point.

---

## Published Observational Studies

### Khalid Shaukat — Moonsighting Committee Worldwide (MSC)

Decades of field observation, primarily 1980s–2010s. Reference: moonsighting.com.

Khalid Shaukat conducted and compiled field observations of Fajr and Isha across multiple continents over several decades. His observations led to the MSC seasonal model — a piecewise function of latitude and month that returns minutes-before-sunrise (Fajr) and minutes-after-sunset (Isha).

Selected reference values from Shaukat's seasonal tables:

| Latitude band | Month | Fajr (min before sunrise) | Isha (min after sunset) |
| --- | --- | --- | --- |
| 0–10°N | All months | ~108 | ~108 |
| 20–25°N | Jun | ~88–93 | ~82–87 |
| 20–25°N | Dec | ~100–104 | ~94–98 |
| 30–35°N | Jun | ~83–89 | ~78–82 |
| 30–35°N | Dec | ~91–95 | ~89–93 |
| 40–45°N | Jun | ~73–84 | ~67–80 |
| 40–45°N | Dec | ~87–96 | ~80–94 |
| 50–55°N | Jun | ~68–79 | ~63–81 |
| 50–55°N | Dec | ~102–110 | ~99–107 |

Key conclusions from Shaukat's work:

1. At the equator, the MSC model converges to approximately 108 minutes, corresponding to roughly 18° depression. This confirms the historical basis of the 18° standard.
2. At 40–45°N in summer, the model yields 73–84 minutes — corresponding to approximately 13–16° depression, not 18°.
3. At 50–55°N in summer, 68–79 minutes corresponds to approximately 11–14° depression.
4. In winter, at all latitudes, the minute offsets increase and converge — differences between methods become smaller.

The PCD algorithm implements Shaukat's piecewise model directly as its Layer 1 base.

### Anugraha and Satria (2012)

**"A Revisit of Fajr and Isha Prayer Time Criteria in Indonesia"**
**Published in Journal of Astrophysics and Astronomy, Springer.**

Anugraha and Satria conducted photometric and naked-eye observations at Bandung, Indonesia (6.9°S) and Jakarta (6.2°S). Their study measured the solar depression angle at the moment of observable Subh Sadiq (true dawn).

**Key findings:**

- At Jakarta/Bandung (near-equatorial, 6°S–6°N range), Fajr was observed at solar depression angles of **17–19°**, consistent with the historical 18° baseline.
- The study found no significant seasonal variation at equatorial latitudes, confirming that equatorial locations are where fixed-18° methods are most accurate.
- The 20° angle used by MUIS (Singapore) was found to be systematically too early — the study observed Fajr at ~18°, not 20°.

**Relevance to PCD:** At Jakarta, PCD computes 18.72° Fajr (summer) — directly supported by Anugraha and Satria's observational range of 17–19°. MUIS at 20° is too early by approximately 6–8 minutes at these equatorial latitudes.

### Karahanoglu (2019)

**"An Analysis of Fajr Prayer Time at Turkish Latitudes"**
**Turkish meteorological and astronomical context, 2019.**

A study of observed Fajr times at Turkish locations (latitudes 36°N–42°N) compared against calculated times using multiple methods.

**Key findings:**

- At 36–38°N, observed Fajr depression angle ranged from **15–17°** in summer and **17–19°** in winter.
- At 40–42°N, summer observed Fajr was **14–16°** depression.
- The DIBT official Turkish schedule (18°) was found to give Fajr times 10–18 minutes earlier than observed in summer at northern Turkish cities.

**Relevance to PCD:** At Istanbul (41°N), PCD computes 16.28° Fajr in summer, placing it within the 14–16° observed range for 40–42°N locations. DIBT at 18° makes Fajr 13.1 minutes earlier than MSC, consistent with Karahanoglu's finding of 10–18 minutes early for fixed-18° at Turkish latitudes.

### ISNA 2007 Observational Review

**Fiqh Council of North America / Islamic Society of North America, 2007.**
**Reference: ISNA Fiqh Committee advisory, adopted as FCNA standard.**

In 2007, the Fiqh Council of North America formally revised the ISNA prayer time standard from 18° to 15° Fajr and Isha. The revision was based on an observational review conducted at North American latitudes (approximately 38°N–45°N).

**Key findings cited in the advisory:**

- At latitudes above approximately 40°N in North America, the sun rarely or never reaches 18° below the horizon in summer months.
- Field observation placed true Fajr at approximately **14–16°** depression at these latitudes in summer.
- The 15° compromise was adopted to balance astronomical accuracy with doctrinal continuity.

The ISNA revision is significant because it represents a formal institutional acknowledgment that fixed 18° was empirically wrong for North American latitudes. PCD confirms this: at New York in summer, PCD computes 16.21° Fajr. At Chicago, 15.94°. The 2007 revision moved in the right direction but stopped at 15° — still slightly low.

**Relevance to PCD:** PCD computes 15.9–16.9° for Chicago across seasons — consistently slightly above the ISNA 15° standard, consistent with the expectation that 15° understates the phenomenon by ~1–2°.

### UK Observations — HMNAO and Academic Sources

**Her Majesty's Nautical Almanac Office (HMNAO) and UK Islamic Scholars, various dates.**

The HMNAO publishes detailed astronomical twilight tables for UK cities. For London in midsummer:

- Solar depression at astronomical midnight (deepest point, ~01:00 BST): approximately **11.8°**
- This means no fixed-angle method above 11.8° can compute an Isha time for London in June.

UK Islamic scholars and the Muslim Council of Britain have noted that:
- True Fajr at London in summer corresponds to approximately **12–13°** solar depression.
- Methods using 18° (MWL) or higher are unusable for London in summer — they produce times before midnight or N/A.
- The MSC model (which PCD implements) yields 120 minutes before sunrise at London in June, corresponding to approximately 12° — matching these observations.

The Edinburgh Observation (cited by Shaukat): at 56°N in summer, Fajr was observed at approximately 65 minutes before sunrise — corresponding to roughly **11.5°** depression.

**Relevance to PCD:** At London (51.5°N) in summer, PCD computes 11.88° Fajr and clips Isha to 10° (the lower bound). This is consistent with UK observations of 12–13° true Fajr.

### Iranian Institute of Geophysics — Tehran (IGUT Calibration)

**Institute of Geophysics, University of Tehran. Calibration basis for the IGUT method.**

The IGUT method (17.7°/14°) was developed with observational input from the Institute of Geophysics. The 14° Isha angle reflects shafaq ahmer (red glow disappearance) rather than shafaq abyad (white glow) — an intentional juristic distinction followed in Iranian Shia fiqh.

The 17.7° Fajr angle for Tehran (35.7°N, 1191m elevation) was derived from observations at this specific location. PCD computes 17.95–18.84° for Tehran across seasons — within approximately 0.3–1.1° of IGUT's 17.7° calibration. This close agreement validates both IGUT's observational basis and PCD's physics model for high-elevation mid-latitude locations.

---

## Twilight Angle vs Latitude: Observed vs Calculated

Compiled from the published studies cited on this page and the automated comparison study. See [Verified Observations](Research-Verified-Observations) for the full comparison matrix including computed errors for all methods.

| Latitude band | Season | Observed Fajr° | PCD output | Fixed 18° (MWL) | Fixed 15° (ISNA) |
| --- | --- | --- | --- | --- | --- |
| 0–6°S (Jakarta) | Jun | 13–19°† | **18.72°** | 18° ≈ | 15° ✗ |
| 1–2°N (Singapore) | Dec | ~18° | **18.23°** | 18° ✓ | 15° ✗ |
| 21–30°N (Egypt, Arabia) | Annual | ~13–15°‡ | **19.4–19.8°** | 18° ✗✗ | 15° ≈ |
| 30–35°N (Cairo/Tehran) | Annual | ~14–17°‡ | **17.95–18.77°** | 18° ✗ | 15° ✗ |
| 36–40°N (Istanbul/NY) | Jun | 14–16° | **16.21–16.28°** | 18° ✗ (too early) | 15° ~ |
| 40–45°N (Toronto/Ottawa) | Jun | 13–15° | **14.61–15.31°** | 18° ✗✗ | 15° ≈ |
| 48–52°N (Paris/London) | Jun | 11–13° | **11.88–13.14°** | N/A | N/A |
| 55°N (Moscow) | Jun | ~10–11° | **10.00°** | N/A | N/A |

Legend: ✓ = within 0.5° of observed, ≈ = within 1°, ✗ = 1–3° off, ✗✗ = >3° off or N/A

† At equatorial latitudes, observations diverge by study methodology. The 2019 Jakarta community observation found 13.1° at true Fajr; the Anugraha/Satria (2012) photometric study at Bandung (6.9°S) found 17–19°. LAPAN's 2017 six-station photometry returned 16.51°. The range reflects genuine methodological disagreement.

‡ Based on adjacent-latitude field studies: Egyptian NRIA study (24–31°N, 1984–1987) found a mean of 14.7°; the Hail study (27.5°N, 2014–2015, 365 nights) found 14.01° ± 0.32°; the Fayum photometric study (29.3°N, 2018–2019) found 14–14.8°. All three are annual means, not summer-only. Direct summer observations for 21–25°N are not available in the published literature.

**The high-latitude summer band (>48°N) is where PCD's advantage is clearest.** At Blackburn, England (53.75°N) in summer, PCD computed 11.87° vs the observed 12.0° — an error of 0.13°. Fixed-angle methods at 18° cannot produce any result at these latitudes in summer. At subtropical latitudes, the picture is more complex: all calculation methods, including PCD and the MSC base, compute angles in the 18–20° range, while multiple independent field studies consistently find true Fajr at 13–15° at these locations. This discrepancy is an active area of research and may reflect differences in observation methodology, atmospheric clarity, or the distinction between false dawn (zodiacal light) and true Subh Sadiq.

---

## Historical Basis of the 18° Standard

The 18° value for Fajr was first systematically documented in the medieval Islamic astronomical tradition, based on observations at locations primarily in the Arabian Peninsula and Persia (approximately 20–35°N latitude).

At these latitudes, 18° is a reasonable approximation. The Umm al-Qura calendar (Saudi Arabia, calibrated at Makkah 21.4°N) uses 18.5°. The Egyptian General Authority uses 19.5° for Cairo (30°N). These higher-than-18° values are consistent with PCD's calculation: at subtropical latitudes, the actual depression angle exceeds 18°, not falls below it.

The 18° standard became problematic only when it was exported globally without adjustment. At 40–55°N, 18° was never observed to correspond to Fajr. The ISNA 2007 revision acknowledged this explicitly. PCD resolves it computationally.

---

## The Shafaq Distinction

Isha is defined by the disappearance of shafaq — the post-sunset glow. There are two recognized criteria:

**Shafaq Ahmer (red glow):** The red/orange color at the horizon disappears. This occurs at approximately **4–7°** solar depression. Used by: IGUT (14°), Iranian Shia fiqh, some Hanbali scholars.

**Shafaq Abyad (white glow):** The diffuse white light on the western horizon vanishes. This occurs at approximately **14–18°** depending on latitude and season. Used by: all other major methods, Hanafi and Shafi'i fiqh.

The PCD algorithm uses the shafaq abyad (white glow) standard by default, consistent with MSC. The MSC `getMscIsha(date, lat, 'general')` function returns the shafaq abyad reference. For locations using the ahmer standard, `getMscIsha(date, lat, 'ahmer')` and `getMscIsha(date, lat, 'abyad')` are also available as explicit options.

**Implication for IGUT comparison:** When PCD is compared against IGUT's Isha at Tehran, the comparison mixes standards (PCD uses abyad, IGUT uses ahmer). IGUT's 14° Isha corresponds to red-glow disappearance, which genuinely occurs earlier than white-glow disappearance. The 1.6-minute difference at Tehran summer between PCD and IGUT Isha is partly attributable to this distinction.

---

## Limitations and Areas for Future Observation

1. **Southern hemisphere data is sparse.** The MSC model has limited observational validation south of 10°S. PCD's physics corrections are applied symmetrically; their accuracy at southern mid-latitudes (30–45°S) is extrapolated from northern-hemisphere calibration.

2. **Urban light pollution.** Published sky observation studies were conducted at dark-sky sites. Urban twilight perception is affected by artificial light, which can reduce the visible depression angle slightly.

3. **Extreme latitudes (>55°N).** Above 55°N in summer, the sun remains within 18° of the horizon throughout the night. No standard Islamic method handles this definitively. PCD clips to 10° and provides a continuous result, but this is an approximation of a genuinely ambiguous situation.

4. **Atmospheric variability.** Refraction and twilight intensity vary with atmospheric water vapor, dust, and temperature inversions. Single-night observations have ±1–2° uncertainty. The PCD physics correction uses standard atmosphere values.

---

## Reproducibility

All PCD results in this research section are reproducible:

```bash
pnpm add pray-calc@2.0.0
node -e "
  import { getTimes, getAngles, getMscFajr } from 'pray-calc';
  const angles = getAngles(new Date('2024-06-21'), 40.7128, -74.006, 10);
  console.log(angles);  // { fajrAngle: 16.21, ishaAngle: 12.41 }
"
```

The full validation scripts are in the repository under `scripts/validate-real-world.mjs`.

---

*[Research](Research) | [Methodology](Research-Methodology) | [Global Study](Research-Global-Study) | [Home-Territory Study](Research-Home-Territory)*
