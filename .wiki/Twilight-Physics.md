# Twilight Physics

Understanding what Fajr and Isha represent astronomically is essential context for
evaluating any prayer time calculation.

## The Islamic Definition

Neither the Quran nor Hadith specifies a numeric angle. The required criteria are:

- **Fajr**: The appearance of *Subh Sadiq* (true dawn) — a broad, horizontal
  whitening of the eastern sky that stretches from north to south. Distinguished from
  *Subh Kadhib* (false dawn), which is a vertical column of zodiacal light that
  appears and then vanishes before true dawn.
- **Isha**: The disappearance of *Shafaq* — the twilight glow remaining in the western
  sky after sunset. Classical scholars disagreed on which glow: *shafaq ahmer* (red
  glow, which fades first) or *shafaq abyad* (white glow, which persists longer).
  Shia tradition and the IGUT/Tehran method use shafaq ahmer; Sunni tradition generally
  uses shafaq abyad.

Any calculation must reproduce these observable cues as closely as possible.

## Three Stages of Twilight

Astronomers define twilight by the Sun's depression angle below the true horizon:

| Stage | Sun Depression | Sky Condition |
|-------|---------------|---------------|
| Civil | 0–6° | Horizon clearly visible; enough light for outdoor work |
| Nautical | 6–12° | Horizon visible at sea; brightest stars visible |
| Astronomical | 12–18° | Sky nearly dark; all but faintest objects visible |
| True night | > 18° | Sky fully dark by most definitions |

Fajr roughly corresponds to the end of astronomical night (transition from true night
to astronomical twilight). Isha roughly corresponds to the end of nautical or
astronomical twilight, depending on the convention.

## Why the Angle Varies

### Latitude Effect

The Sun's path intersects the horizon at a shallower angle at higher latitudes. Near
the equator, the path is nearly vertical — the Sun passes through 18° of depression
quickly. At 55°N in summer, the Sun may skim 5–10° below the horizon before rising
again. The geometry forces twilight to persist at much smaller depression angles.

Quantitatively, the hour angle H corresponding to a depression of angle a obeys:

```
cos(H) = (sin(-a) - sin(φ)sin(δ)) / (cos(φ)cos(δ))
```

When φ (latitude) is large and δ (declination) has the same sign, the denominator
shrinks, and the solution for H spreads out — more time is spent near the horizon.

### Seasonal Effect (Declination)

Solar declination δ ranges from -23.45° (December solstice) to +23.45° (June
solstice). When δ matches the observer's latitude, the Sun rises and sets at its
furthest north (or south), and its path is most oblique to the horizon. This is
when extended twilight is most extreme.

### Earth-Sun Distance

The Earth's orbit is slightly elliptical (eccentricity ≈ 0.017). At perihelion
(~January 3), the Earth is about 3.4% closer to the Sun than at aphelion (~July 4).
Closer means more solar flux, which means slightly more intense scattering in the
upper atmosphere. The effect on twilight depression is small (~0.03°) but nonzero.

### Atmospheric Scattering

Twilight glow is produced by sunlight scattering in the stratosphere and upper
troposphere (roughly 20–50 km altitude). At deeper depression angles, only the
very top of the atmosphere is illuminated, and the scattered light is fainter. The
sky brightness follows roughly an exponential decay with depression angle.

The human eye's threshold for detecting sky illumination above the nighttime
background is approximately 0.01–0.015 cd/m². Photometric studies measuring sky
surface brightness find this threshold is crossed when the Sun is about 14–16°
below the horizon at mid-latitudes (Saudi Arabia, Egypt), and closer to 12–13° at
higher latitudes (50–55°N) where the scattering geometry is different.

This is the observational basis for the claim that 18° is too conservative for Fajr
at most latitudes: the visual threshold for dawn is reached at a lesser depression.

## Observational Evidence

Several major observational campaigns have mapped true Fajr/Isha angles:

| Location | Latitude | Fajr Angle (observed) | Source |
|----------|----------|----------------------|--------|
| Indonesia (multiple sites) | ~6°S–7°S | 16.5° | National Observatory Study |
| Saudi Arabia (desert) | ~27.5°N | 14.0° avg | Hail Campaign |
| Egypt (multiple sites) | ~26–30°N | 14.56° avg | 2015–2019 photometric study |
| UK observations | ~51–53°N | 12–14° (seasonal) | Local community data |

The pattern is clear: the angle decreases as latitude increases, and the equatorial
18° is not universal. At mid-latitudes, empirical Fajr is consistently around 14–15°.
The Moonsighting Committee's algorithm was calibrated to these observations.

## False Dawn (Zodiacal Light)

The zodiacal light is sunlight scattered by interplanetary dust along the ecliptic
plane. It appears as a faint, cone-shaped glow pointing upward from the western
horizon after evening twilight, or from the eastern horizon before dawn. It is most
prominent at equatorial latitudes in spring (evening) and autumn (morning), and
requires very dark skies to see.

False dawn (*Subh Kadhib*) is the zodiacal light seen in the east before true dawn.
Observers have reported it disappearing by around 15–16° Sun depression, after which
the genuine horizontal twilight takes over. The distinction matters for Fajr timing:
Subh Sadiq (true dawn) is later than any zodiacal light brightening.

## Atmospheric Refraction Near the Horizon

At the horizon (0° altitude), atmospheric refraction bends sunlight upward by about
34 arcminutes (0.567°). This is why the Sun appears to sit on the horizon when it is
geometrically 34' below it. Standard sunrise/sunset calculations account for this by
using an effective solar altitude of -0.833° (0.267° for half-disk + 0.567° for
refraction).

At twilight angles (Sun 12–20° below horizon), the refraction is much smaller:
approximately 0.1–0.2 arcminutes. This is negligible for prayer timing purposes but
is still computed by `getAngles` for completeness.

## Shafaq: Red vs. White

After sunset, the western sky transitions through several phases:

1. **Shafaq ahmer** (red glow): The brilliant red/orange color disappears when the Sun
   is about 4–7° below the horizon — well before astronomical Isha. The Tehran/IGUT
   method places Isha at 14° depression, reflecting this earlier boundary.
2. **Shafaq abyad** (white glow): The diffuse white luminosity persists longer. Most
   Sunni calculations use this, placing Isha at 15–18° depression.

The practical difference is 20–40 minutes at mid-latitudes. The pray-calc dynamic
method uses the shafaq abyad (white glow) convention by default, consistent with the
MSC "general" shafaq mode.

---

*[Back to Home](Home) | [Dynamic Algorithm](Dynamic-Algorithm) | [High-Latitude Handling](High-Latitude)*
