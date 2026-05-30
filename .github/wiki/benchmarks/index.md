# Bundle Size and Performance

## Bundle size

Measured with tsup production build (Node 22, pnpm 9).

| Package | Format | Raw | Min+gz |
|---|---|---|---|
| pray-calc | ESM (.mjs) | 84 KB | ~22 KB |
| pray-calc | CJS (.cjs) | 86 KB | ~22 KB |
| nrel-spa (dependency) | ESM | 51 KB | ~13 KB |
| pray-calc wrapper only (excl. nrel-spa) | ESM | ~33 KB | ~9 KB |

The bulk of pray-calc's own weight comes from the MCW seasonal coefficient tables and the ephemeris formulas. The single runtime dependency is [nrel-spa](https://github.com/acamarata/nrel-spa).

## Comparison with nrel-spa baseline

| Library | Bundle (min+gz) | Prayer times | Traditional methods | Dynamic angles |
|---|---|---|---|---|
| nrel-spa alone | ~13 KB | No (solar position only) | No | No |
| pray-calc | ~22 KB | Yes (9 times + angles) | 14 methods | Yes |
| Overhead for prayer times | +~9 KB | 9 prayer times | 14 methods | Physics-based angles |

The ~9 KB prayer-time layer delivers: dynamic twilight angles, 14 traditional fixed-angle method comparisons, Asr in both Shafi'i and Hanafi conventions, Qiyam al-Layl, Islamic midnight, and MCW direct access functions.

## Performance

Measured on Apple M2 Pro (single core), Node 22.

| Operation | Time (single call) | Notes |
|---|---|---|
| `calcTimes` | ~0.9 ms | 1 SPA call, dynamic angles |
| `calcTimesAll` | ~1.1 ms | 1 SPA call, 30 zenith angles |
| `getAngles` alone | ~0.05 ms | No SPA, Meeus ephemeris only |
| `getMscFajr` / `getMscIsha` | <0.01 ms | Arithmetic only |

`calcTimesAll` computes all 14 method comparisons in a single SPA call by passing all 30 zenith angles at once. It is not 14 times slower than `calcTimes`.

## Tree-shaking

All exports are individually tree-shakeable. If you only import `calcTimes`, a bundler excludes the `getTimesAll` / `calcTimesAll` batch machinery and the 14-method METHODS table.

```javascript
// Only calcTimes and its dependencies are included
import { calcTimes } from 'pray-calc';
```

## Accuracy versus performance tradeoff

The `solarEphemeris` function (Meeus Ch. 25) runs in under 0.1 ms and is used only for the angle correction layer. The full SPA computation (via nrel-spa) handles the precise prayer time solving. This split keeps the dynamic angle overhead small while maintaining the high accuracy of NREL SPA for the actual time results.

For batch computation across many dates or locations, `getAngles` can be cached at the date grain: solar position changes slowly, and the angles for a given latitude and date are stable within ±0.1° across a full year range.
