# Moon Function Migration

In pray-calc v1, the package included five functions for moon data:

| v1 Function                         | Description                                                            |
| ----------------------------------- | ---------------------------------------------------------------------- |
| `getMoon(date, lat, lon)`           | Aggregated wrapper returning phase, position, illumination, visibility |
| `getMoonPhase(date)`                | Synodic-month calculation from known reference new moon                |
| `getMoonPosition(date, lat, lon)`   | Thin wrapper around `suncalc.getMoonPosition`                          |
| `getMoonIllumination(date)`         | Thin wrapper around `suncalc.getMoonIllumination`                      |
| `getMoonVisibility(date, lat, lon)` | Stub function: explicitly not accurate                                 |

All five have been removed from pray-calc v2. They live in the dedicated
[moon-sighting](https://github.com/acamarata/moon-sighting) package, which is the
right place for this work.

## Why They Moved

These functions did not belong in a prayer-times package. They were thin wrappers
around `suncalc`: a third-party library that uses simplified spherical astronomy,
not a full topocentric pipeline. The visibility function was explicitly documented
as a placeholder. Bundling them in pray-calc added a dependency (suncalc) for
functionality that was, at best, approximate.

moon-sighting does the same job properly:

- No suncalc dependency. Positions use the Meeus Ch. 47/48 low-precision lunar
  ephemeris with full topocentric correction (parallax, WGS84 geodetic model).
- Bennett atmospheric refraction applied to apparent altitude.
- Illumination uses the correct Meeus phase angle formula, not a simplified fraction.
- Visibility uses the Odeh (2006) V-parameter model: a genuine criterion from
  published research, not a placeholder window function.

The two packages complement each other. pray-calc handles solar-based prayer times.
moon-sighting handles lunar crescent data. Together they cover the Islamic astronomical
computing stack.

## Migration

Install moon-sighting:

```bash
pnpm add moon-sighting   # or npm install moon-sighting
```

Update your imports:

```typescript
// Before (pray-calc v1)
import { getMoon, getMoonPhase, getMoonPosition, getMoonIllumination } from 'pray-calc';

// After (moon-sighting v1.1+)
import { getMoon, getMoonPhase, getMoonPosition, getMoonIllumination } from 'moon-sighting';
```

### Function Mapping

| pray-calc v1                        | moon-sighting v1.1                                      | Notes                                                          |
| ----------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------- |
| `getMoonPosition(date, lat, lon)`   | `getMoonPosition(date, lat, lon, elevation?)`           | Adds WGS84 model, Bennett refraction, `parallacticAngle` field |
| `getMoonIllumination(date)`         | `getMoonIllumination(date)`                             | Adds correct phase angle, `isWaxing` field                     |
| `getMoonPhase(date)`                | `getMoonPhase(date)`                                    | Adds `phaseName`, `phaseSymbol`, more fields                   |
| `getMoonVisibility(date, lat, lon)` | `getMoonVisibilityEstimate(date, lat, lon, elevation?)` | Real Odeh V-parameter, returns zone A–D, ARCL, ARCV, W         |
| `getMoon(date, lat, lon)`           | `getMoon(date, lat, lon, elevation?)`                   | Same concept, properly computed                                |

Return shapes are additive: all fields that existed in v1 still exist in v1.1.
New fields are added but nothing is removed. The function for visibility is renamed
(`getMoonVisibility` to `getMoonVisibilityEstimate`) to be explicit about what it
returns.

## Links

- npm: [https://www.npmjs.com/package/moon-sighting](https://www.npmjs.com/package/moon-sighting)
- GitHub: [https://github.com/acamarata/moon-sighting](https://github.com/acamarata/moon-sighting)
- Wiki: [https://github.com/acamarata/moon-sighting/wiki](https://github.com/acamarata/moon-sighting/wiki)

---

_[Back to Home](Home) | [API Reference](API-Reference) | [Changelog](Changelog)_
