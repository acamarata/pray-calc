# Contributing

## Prerequisites

- Node.js 20 or later
- pnpm (enabled via corepack: `corepack enable`)

## Setup

```sh
git clone https://github.com/acamarata/pray-calc.git
cd pray-calc
pnpm install
```

## Development

```sh
pnpm build          # compile TypeScript
pnpm test           # build + run full test suite (ESM + CJS, 106 tests)
pnpm run typecheck  # type-check without emitting
pnpm run lint       # ESLint
pnpm run format     # Prettier format
```

## Project Structure

```
src/
  index.ts              main exports
  types.ts              all TypeScript types
  getSolarEphemeris.ts  Jean Meeus Ch. 25 (decl, r, eclLon)
  getMSC.ts             MSC piecewise seasonal model
  getAngles.ts          dynamic angle algorithm (3 layers)
  getAsr.ts             pure-math Asr
  getQiyam.ts           last-third-of-night
  getTimes.ts           raw fractional-hour output
  calcTimes.ts          formatted HH:MM:SS output
  getTimesAll.ts        all-methods batch SPA call
  calcTimesAll.ts       all-methods formatted output
test.mjs               ESM test suite (94 tests)
test-cjs.cjs           CJS subset (12 tests)
```

## Making Changes

1. Algorithm changes: read [Dynamic Algorithm](Dynamic-Algorithm) and [Twilight Physics](Twilight-Physics) first.
2. Any new export must have TypeScript types and JSDoc.
3. Tests use `node:test`. Add tests in `test.mjs` for new behavior.
4. All 106 tests must pass before submitting.

## Timezone Note

The test suite uses explicit UTC offset values, not `new Date()` local timezone parsing. Keep this pattern when adding tests — CI runs in UTC and tests must pass there.

## Pull Requests

- One logical change per PR
- Include tests covering the new behavior
- Update `CHANGELOG.md` under `[Unreleased]`
- Do not bump the version number
