/**
 * Generates the cross-language parity fixture consumed by the Dart port.
 *
 * The two ports are transcriptions of one algorithm and must agree exactly. This script
 * writes the formatted output of THIS package across a spread of locations, dates, Asr
 * conventions and high-latitude rules; `pray_calc_dart` asserts every value as an exact
 * string match in `test/parity_test.dart`.
 *
 * Usage, from the repository root:
 *
 *   pnpm build
 *   node tool/generate-parity-fixture.mjs > ../pray-calc-dart/test/fixtures/cross_language_golden.json
 *
 * Regenerate only when an intentional algorithm change lands in both ports. If the Dart
 * suite fails against an unchanged fixture, that is the divergence it exists to catch —
 * fix the port, do not refresh the fixture.
 */

import { calcTimesAll } from "../dist/index.mjs";
const locs = [
  ["NYC",40.7128,-74.006,-5],["Makkah",21.4225,39.8262,3],["London",51.5074,-0.1278,0],
  ["Sydney",-33.8688,151.2093,10],["Singapore",1.3521,103.8198,8],["Helsinki",60.1699,24.9384,2],
  ["Tromso",69.6492,18.9553,1],["Svalbard",78.2233,15.6469,1],["Tokyo",35.6762,139.6503,9],
  ["Cairo",30.0444,31.2357,2],["Jakarta",-6.2088,106.8456,7],["Reykjavik",64.1466,-21.9426,0],
  ["Quito",-0.1807,-78.4678,-5],["McMurdo",-77.8419,166.6863,12],["Anchorage",61.2181,-149.9003,-9],
];
const dates = ["2024-01-15","2024-03-20","2024-06-21","2024-09-22","2024-12-21","2024-02-29","2025-07-04"];
const rules = ["none","middleOfNight","oneSeventh","angleBased","aqrabAlBilad","aqrabAlAyyam"];
const out = [];
for (const [name,lat,lng,tz] of locs) {
  for (const d of dates) {
    for (const hanafi of [false,true]) {
      const r = calcTimesAll(d, lat, lng, tz, 0, 15, 1013.25, hanafi, "none");
      const M = {}; for (const [k,v] of Object.entries(r.Methods)) M[k]=v;
      out.push({name,lat,lng,tz,d,hanafi,rule:"none",
        t:[r.Qiyam,r.Fajr,r.Sunrise,r.Noon,r.Dhuhr,r.Asr,r.Maghrib,r.Isha,r.Midnight],
        a:[+r.angles.fajrAngle.toFixed(9),+r.angles.ishaAngle.toFixed(9)],
        p:[r.provenance.Fajr,r.provenance.Isha], M});
    }
  }
}
// High-latitude rule coverage at polar sites.
for (const [name,lat,lng,tz] of [["Svalbard",78.2233,15.6469,1],["Tromso",69.6492,18.9553,1],["McMurdo",-77.8419,166.6863,12]]) {
  for (const d of ["2024-06-21","2024-12-21","2024-05-20","2024-08-01"]) {
    for (const rule of rules) {
      const r = calcTimesAll(d, lat, lng, tz, 0, 15, 1013.25, false, rule);
      const M = {}; for (const [k,v] of Object.entries(r.Methods)) M[k]=v;
      out.push({name,lat,lng,tz,d,hanafi:false,rule,
        t:[r.Qiyam,r.Fajr,r.Sunrise,r.Noon,r.Dhuhr,r.Asr,r.Maghrib,r.Isha,r.Midnight],
        a:[+r.angles.fajrAngle.toFixed(9),+r.angles.ishaAngle.toFixed(9)],
        p:[r.provenance.Fajr,r.provenance.Isha], M});
    }
  }
}
console.log(JSON.stringify(out, null, 0));
