# Traditional Methods

pray-calc supports 14 traditional prayer time methods. They appear in the `Methods`
field returned by `getTimesAll` and `calcTimesAll`. Each entry is `[fajrTime, ishaTime]`.

## Method Table

| ID | Name | Fajr | Isha | Region |
|----|------|------|------|--------|
| `UOIF` | Union des Organisations Islamiques de France | 12° | 12° | France |
| `ISNACA` | IQNA / Islamic Council of North America | 13° | 13° | Canada |
| `ISNA` | FCNA / Islamic Society of North America | 15° | 15° | US, UK, AU, NZ |
| `SAMR` | Spiritual Administration of Muslims of Russia | 16° | 15° | Russia |
| `IGUT` | Institute of Geophysics, University of Tehran | 17.7° | 14° | Iran, Shia use |
| `MWL` | Muslim World League | 18° | 17° | Global default |
| `DIBT` | Diyanet İşleri Başkanlığı, Turkey | 18° | 17° | Turkey |
| `Karachi` | University of Islamic Sciences, Karachi | 18° | 18° | PK, BD, IN, AF |
| `Kuwait` | Kuwait Ministry of Islamic Affairs | 18° | 17.5° | Kuwait |
| `UAQ` | Umm Al-Qura University, Makkah | 18.5° | +90 min | Saudi Arabia |
| `Qatar` | Qatar / Gulf Standard | 18° | +90 min | Qatar, Gulf |
| `Egypt` | Egyptian General Authority of Survey | 19.5° | 17.5° | EG, SY, IQ, LB |
| `MUIS` | Majlis Ugama Islam Singapura | 20° | 18° | Singapore |
| `MSC` | Moonsighting Committee Worldwide | seasonal | seasonal | Global |

## Method Notes

### UOIF (12°/12°)

The lowest fixed angles in common use, adopted in France. The 12° convention is
justified by observations showing that at higher European latitudes, the Sun does
not reach 18° in summer. The French Muslims' Union settled on 12° as a year-round
compromise that avoids the "nightlessness" problem.

### ISNACA (13°/13°)

Used by IQNA (Islamic Quarterly of North America) and some Canadian communities.
A middle point between UOIF and ISNA, reflecting observations that 15° causes
very late Isha in Canadian summers.

### ISNA (15°/15°)

The Fiqh Council of North America adopted 15° in 2007 after research showing
18° produced Fajr too early and Isha too late in North American latitudes. This
was a significant shift from their prior 18°/18° position. Still the most commonly
used method in the US, UK, Australia, and New Zealand.

### SAMR (16°/15°)

The Spiritual Administration of Muslims of Russia uses a split angle — 16° for
Fajr and 15° for Isha. The asymmetry reflects differing shafaq criteria (red
twilight fades before white) and the latitudinal challenges of Russian Muslim
communities, many of whom live above 50°N.

### IGUT / Tehran (17.7°/14°)

The Institute of Geophysics at the University of Tehran derived these values from
observational studies in Iran. The 17.7° Fajr is unusual — close to the historical
18° but with a slight downward revision. The 14° Isha reflects the Shia tradition
of using shafaq ahmer (red glow) rather than shafaq abyad (white glow), since red
twilight disappears earlier. This method is used by Shia communities worldwide and
in Iran's official calendar.

### MWL (18°/17°)

The Muslim World League method is the most widely referenced global default. MWL
is headquartered in Makkah. The 18°/17° split mirrors the international consensus
of using 18° for Fajr (astronomical twilight) and allowing Isha slightly earlier
at 17°. Correct at equatorial and low latitudes; fails at high latitudes in summer.

### DIBT (18°/17°)

Diyanet İşleri Başkanlığı is Turkey's official religious authority. The angles are
identical to MWL, but this is listed as a separate method because the institution
issues its own official tables and some apps need to distinguish between them for
attribution purposes.

### Karachi (18°/18°)

The University of Islamic Sciences, Karachi uses symmetric 18° for both Fajr and
Isha. Historically one of the most conservative methods, still used across Pakistan,
Bangladesh, India, and Afghanistan.

### Kuwait (18°/17.5°)

Kuwait's Ministry of Islamic Affairs uses a small Isha relaxation (17.5° instead
of 18°) relative to Karachi. This method is commonly used across Gulf states that
do not follow UAQ or Qatar.

### UAQ (18.5°/+90 min)

Umm Al-Qura University in Makkah publishes the official Saudi calendar. The Fajr
angle is 18.5° — more conservative than most methods. Isha uses a fixed 90-minute
offset from sunset rather than an angle. In Ramadan, UAQ extends this to 120 minutes
(some implementations; this library uses 90 year-round per the standard).

The fixed-minute Isha avoids the problem that an angle-based Isha never ends during
Saudi summer (the Sun stays close to the horizon), while the 90-minute period also
aligns roughly with the 2 Isha periods (Maghrib + 90 min) used in informal practice.

### Qatar (18°/+90 min)

Qatar follows a similar approach to UAQ for Isha: 90 minutes after sunset, year-round.
Fajr is 18° (not 18.5° as in UAQ). This is the standard in Qatar and some Gulf states
that have adopted the fixed-minute Isha convention without UAQ's Fajr conservatism.

### Egypt (19.5°/17.5°)

The Egyptian General Authority of Survey uses the highest fixed Fajr angle (19.5°)
of any method. This was historically derived from observations in Egypt's clear desert
sky, where the faintest pre-dawn light was detected at a relatively deep sun position.
At the equatorial latitudes where it is used (Egypt, Syria, Iraq, Lebanon), 19.5°
doesn't cause the extreme errors it would at European latitudes. Isha at 17.5° is
similar to MWL.

### MUIS (20°/18°)

Singapore's Islamic Religious Council uses the most conservative angles in the table.
Singapore sits at about 1.3°N — very close to the equator — where atmospheric
conditions and the nearly vertical Sun path do result in a slightly later dawn and
earlier dusk compared to higher latitudes. The 20° Fajr reflects these local conditions.

### MSC (Seasonal / Moonsighting Committee Worldwide)

This is the same underlying algorithm used by the dynamic primary method. Unlike all
other entries in this table, MSC does not use a fixed angle. The offset is computed
from the latitude and day-of-year via Khalid Shaukat's piecewise model.

Including MSC in the comparison table lets you see where the dynamic primary method
agrees with or diverges from the "raw" MSC output. The dynamic method adds physics
corrections (r, Fourier, refraction, elevation) on top of the MSC base, so they
should be close but not identical.

## Computation

For all angle-based methods, `getTimesAll` makes a single batch call to the NREL
Solar Position Algorithm (via `nrel-spa`), passing all 14×2 + 2 dynamic zenith
angles at once. This is more efficient than 16 separate SPA calls.

UAQ and Qatar Isha are computed as `sunset + ishaMinutes / 60` after the SPA call.
MSC Fajr and Isha are computed from the sunrise/sunset times using the minute
offsets from `getMscFajr` / `getMscIsha`.

---

*[Back to Home](Home) | [Dynamic Algorithm](Dynamic-Algorithm) | [API Reference](API-Reference)*
