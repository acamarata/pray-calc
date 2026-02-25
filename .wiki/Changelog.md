# Changelog

See [CHANGELOG.md](https://github.com/acamarata/pray-calc/blob/main/CHANGELOG.md)
in the repository for the full version history.

## v2.0.0 Highlights

- Full TypeScript rewrite (dual CJS/ESM build)
- Physics-grounded dynamic angle algorithm (MSC base + r correction + Fourier + refraction + elevation)
- 14 traditional methods (added IGUT/Tehran, Kuwait, Qatar)
- Removed suncalc dependency; removed moon functionality (moved to moon-sighting)
- `getAsr` refactored to pure math using Meeus declination
- `formatTime` replaces `fractalTime` (nrel-spa v2 API)
- Node >= 20 requirement; proper exports field; publishConfig

## v1.7.x (Legacy)

CommonJS, JavaScript source, 10 traditional methods, suncalc for moon data.

---

*[Back to Home](Home)*
