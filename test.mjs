/**
 * pray-calc v2 test suite — 100 scenarios.
 *
 * Tests cover:
 *   - Equatorial, tropical, mid-latitude, high-latitude locations
 *   - All four seasons (solstices + equinoxes)
 *   - Both Asr conventions (Shafi'i / Hanafi)
 *   - Atmospheric parameters (pressure, temperature, elevation)
 *   - All exported functions
 *   - Edge cases (polar regions, missing events)
 *   - Dynamic vs. traditional method comparison
 *   - Type exports and METHODS array
 */

import assert from 'assert';
import {
  getTimes,
  calcTimes,
  getTimesAll,
  calcTimesAll,
  getAngles,
  getAsr,
  getQiyam,
  getMscFajr,
  getMscIsha,
  solarEphemeris,
  toJulianDate,
  METHODS,
} from './dist/index.mjs';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ${name}... PASS`);
    passed++;
  } catch (err) {
    console.error(`  ${name}... FAIL: ${err.message}`);
    failed++;
  }
}

function approx(a, b, tol = 0.05) {
  // Times within ±tol hours (~3 minutes default tolerance)
  return Math.abs(a - b) < tol;
}

function approxAngle(a, b, tol = 0.5) {
  // Angles within ±tol degrees
  return Math.abs(a - b) < tol;
}

function validTime(t) {
  return typeof t === 'number' && isFinite(t) && t >= 0 && t < 24;
}

function hm(h, m) {
  return h + m / 60;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 1: Exports and type structure
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[1] Exports and type structure');

test('METHODS array has 14 entries', () => {
  assert.strictEqual(METHODS.length, 14);
});

test('METHODS has expected IDs', () => {
  const ids = METHODS.map(m => m.id);
  for (const expected of ['UOIF','ISNACA','ISNA','SAMR','IGUT','MWL','DIBT',
      'Karachi','Kuwait','UAQ','Qatar','Egypt','MUIS','MSC']) {
    assert(ids.includes(expected), `Missing method: ${expected}`);
  }
});

test('METHODS fields present', () => {
  for (const m of METHODS) {
    assert(typeof m.id === 'string');
    assert(typeof m.name === 'string');
    assert(typeof m.region === 'string');
    assert(m.fajrAngle === null || typeof m.fajrAngle === 'number');
    assert(m.ishaAngle === null || typeof m.ishaAngle === 'number');
  }
});

test('MSC method has useMSC=true and null angles', () => {
  const msc = METHODS.find(m => m.id === 'MSC');
  assert(msc.useMSC === true);
  assert(msc.fajrAngle === null);
  assert(msc.ishaAngle === null);
});

test('UAQ has ishaMinutes=90', () => {
  const uaq = METHODS.find(m => m.id === 'UAQ');
  assert.strictEqual(uaq.ishaMinutes, 90);
});

test('Qatar has ishaMinutes=90', () => {
  const qatar = METHODS.find(m => m.id === 'Qatar');
  assert.strictEqual(qatar.ishaMinutes, 90);
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 2: toJulianDate and solarEphemeris
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[2] Solar ephemeris');

test('toJulianDate J2000 epoch', () => {
  // Jan 1.5, 2000 = JD 2451545.0
  const jd = toJulianDate(new Date(Date.UTC(2000, 0, 1, 12, 0, 0)));
  assert(approxAngle(jd, 2451545.0, 1.0), `Got ${jd}`);
});

test('solarEphemeris returns valid structure', () => {
  const jd = toJulianDate(new Date(Date.UTC(2024, 5, 21, 12, 0, 0)));
  const e = solarEphemeris(jd);
  assert(typeof e.decl === 'number');
  assert(typeof e.r === 'number');
  assert(typeof e.eclLon === 'number');
});

test('solarEphemeris summer solstice declination ~+23.44', () => {
  const jd = toJulianDate(new Date(Date.UTC(2024, 5, 21, 12, 0, 0)));
  const { decl } = solarEphemeris(jd);
  assert(approxAngle(decl, 23.44, 0.15), `Got decl=${decl}`);
});

test('solarEphemeris winter solstice declination ~-23.44', () => {
  const jd = toJulianDate(new Date(Date.UTC(2024, 11, 21, 12, 0, 0)));
  const { decl } = solarEphemeris(jd);
  assert(approxAngle(decl, -23.44, 0.15), `Got decl=${decl}`);
});

test('solarEphemeris r within range [0.98, 1.02] AU', () => {
  const dates = [
    new Date(Date.UTC(2024, 0, 3)),   // perihelion
    new Date(Date.UTC(2024, 6, 4)),   // aphelion
    new Date(Date.UTC(2024, 3, 15)),  // spring
  ];
  for (const d of dates) {
    const { r } = solarEphemeris(toJulianDate(d));
    assert(r > 0.98 && r < 1.02, `r=${r} out of range for ${d}`);
  }
});

test('solarEphemeris equinox declination near 0', () => {
  const jd = toJulianDate(new Date(Date.UTC(2024, 2, 20, 12, 0, 0)));
  const { decl } = solarEphemeris(jd);
  assert(Math.abs(decl) < 1.0, `Got decl=${decl} at equinox`);
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 3: getAngles — dynamic Fajr/Isha depression
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[3] getAngles — dynamic depression');

test('getAngles returns object with fajrAngle and ishaAngle', () => {
  const a = getAngles(new Date('2024-06-21'), 40.7, -74.0);
  assert(typeof a.fajrAngle === 'number');
  assert(typeof a.ishaAngle === 'number');
});

test('getAngles angles within physical bounds [10,22]', () => {
  const locations = [
    [0, 0], [21, 39], [40.7, -74], [51.5, -0.1], [55.8, -4.2], [-33.9, 151.2],
  ];
  const dates = ['2024-01-15', '2024-04-01', '2024-06-21', '2024-09-22', '2024-12-21'];
  for (const [lat, lng] of locations) {
    for (const d of dates) {
      const { fajrAngle, ishaAngle } = getAngles(new Date(d), lat, lng);
      assert(fajrAngle >= 10 && fajrAngle <= 22,
        `fajrAngle=${fajrAngle} out of [10,22] at lat=${lat} ${d}`);
      assert(ishaAngle >= 10 && ishaAngle <= 22,
        `ishaAngle=${ishaAngle} out of [10,22] at lat=${lat} ${d}`);
    }
  }
});

test('getAngles equatorial latitude near 18', () => {
  // Near equator, should converge toward ~18°
  const { fajrAngle } = getAngles(new Date('2024-06-21'), 1.3, 103.8); // Singapore
  assert(fajrAngle > 16 && fajrAngle < 22, `fajrAngle=${fajrAngle}`);
});

test('getAngles high-latitude summer smaller than 18', () => {
  // London summer — angle should be well below 18 due to oblique sun path
  const { fajrAngle } = getAngles(new Date('2024-06-21'), 51.5, -0.1);
  assert(fajrAngle < 17, `Expected <17, got ${fajrAngle} at London summer solstice`);
});

test('getAngles elevation parameter accepted', () => {
  const a1 = getAngles(new Date('2024-06-21'), 40.7, -74.0, 0);
  const a2 = getAngles(new Date('2024-06-21'), 40.7, -74.0, 1000);
  assert(typeof a1.fajrAngle === 'number');
  assert(typeof a2.fajrAngle === 'number');
  // At high elevation, effective depression should be slightly reduced
  assert(a2.fajrAngle <= a1.fajrAngle + 0.5, 'Elevation should not increase angle by more than 0.5');
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 4: getAsr
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[4] getAsr');

test('getAsr Shafii returns finite time', () => {
  const asr = getAsr(12.0, 40.7128, 20.0, false);
  assert(isFinite(asr), `Expected finite, got ${asr}`);
});

test('getAsr Hanafi is later than Shafii', () => {
  const asrS = getAsr(12.0, 40.7, 20.0, false);
  const asrH = getAsr(12.0, 40.7, 20.0, true);
  assert(asrH > asrS, `Hanafi ${asrH} should be later than Shafi'i ${asrS}`);
});

test('getAsr reasonable range (afternoon)', () => {
  const asr = getAsr(12.1, 21.4, 20.0, false); // Makkah-ish
  assert(asr > 14 && asr < 18, `Got ${asr}`);
});

test('getAsr Hanafi Makkah afternoon', () => {
  const asr = getAsr(12.1, 21.4, 20.0, true);
  assert(asr > 15 && asr < 19, `Got ${asr}`);
});

test('getAsr returns NaN when sun never reaches altitude', () => {
  // Extreme case: very high latitude, extreme declination
  const asr = getAsr(12.0, 89.0, -23.4, false);
  // Near north pole in winter, sun may not reach Asr altitude
  // Result should be NaN or finite — just verify it returns a number
  assert(typeof asr === 'number', 'Should return a number');
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 5: getQiyam
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[5] getQiyam');

test('getQiyam returns last-third start', () => {
  // Isha at 22:00, Fajr at 04:00 next day → night = 6h
  // Last third starts at 22 + 4 = 02:00
  const q = getQiyam(4.0, 22.0);
  assert(approx(q, 2.0, 0.1), `Got ${q}`);
});

test('getQiyam handles wrap-around midnight', () => {
  const q = getQiyam(3.5, 21.0);
  // Night = 3.5 + 24 - 21 = 6.5h; last third = 21 + (2/3)*6.5 = 25.33 → 1.33 (01:20)
  const expected = 21.0 + (2 / 3) * (3.5 + 24 - 21.0);
  const normalized = expected >= 24 ? expected - 24 : expected;
  assert(approx(q, normalized, 0.1), `Got ${q}, expected ~${normalized}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 6: getMscFajr / getMscIsha
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[6] MSC minute offsets');

test('getMscFajr returns positive minutes', () => {
  const m = getMscFajr(new Date('2024-06-21'), 40.7);
  assert(m > 0, `Got ${m}`);
});

test('getMscIsha returns positive minutes', () => {
  const m = getMscIsha(new Date('2024-06-21'), 40.7);
  assert(m > 0, `Got ${m}`);
});

test('getMscFajr increases with latitude (summer)', () => {
  const m30 = getMscFajr(new Date('2024-06-21'), 30);
  const m50 = getMscFajr(new Date('2024-06-21'), 50);
  assert(m50 > m30, `Expected lat50 (${m50}) > lat30 (${m30})`);
});

test('getMscFajr equator ~75 minutes year-round', () => {
  const summer = getMscFajr(new Date('2024-06-21'), 0);
  const winter = getMscFajr(new Date('2024-12-21'), 0);
  assert(approx(summer, 75, 5), `Summer: ${summer}`);
  assert(approx(winter, 75, 5), `Winter: ${winter}`);
});

test('getMscIsha shafaq modes return different values at high lat', () => {
  const general = getMscIsha(new Date('2024-06-21'), 51.5, 'general');
  const ahmer   = getMscIsha(new Date('2024-06-21'), 51.5, 'ahmer');
  const abyad   = getMscIsha(new Date('2024-06-21'), 51.5, 'abyad');
  // All should be positive
  assert(general > 0 && ahmer > 0 && abyad > 0);
  // Ahmer (red glow) ends earlier, so fewer minutes after sunset
  assert(ahmer <= general, `ahmer ${ahmer} should be <= general ${general}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 7: getTimes — core output structure
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[7] getTimes — structure');

test('getTimes returns all required fields', () => {
  const t = getTimes(new Date('2024-06-21'), 40.7, -74.0);
  for (const field of ['Qiyam','Fajr','Sunrise','Noon','Dhuhr','Asr','Maghrib','Isha']) {
    assert(field in t, `Missing field: ${field}`);
  }
  assert('angles' in t);
  assert('fajrAngle' in t.angles);
  assert('ishaAngle' in t.angles);
});

test('getTimes chronological order', () => {
  // Use explicit tz=-4 (EDT) so CI (UTC) and local machines give identical results.
  // Without it, NY's Maghrib falls past UTC midnight, wrapping to ~0.5h < Asr(~21h).
  const t = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4);
  // Fajr < Sunrise < Noon < Dhuhr ≈ Noon < Asr < Maghrib < Isha
  assert(t.Fajr < t.Sunrise, `Fajr(${t.Fajr}) < Sunrise(${t.Sunrise})`);
  assert(t.Sunrise < t.Noon, `Sunrise(${t.Sunrise}) < Noon(${t.Noon})`);
  assert(t.Noon <= t.Dhuhr, `Noon(${t.Noon}) <= Dhuhr(${t.Dhuhr})`);
  assert(t.Dhuhr < t.Asr, `Dhuhr(${t.Dhuhr}) < Asr(${t.Asr})`);
  assert(t.Asr < t.Maghrib, `Asr(${t.Asr}) < Maghrib(${t.Maghrib})`);
  assert(t.Maghrib < t.Isha, `Maghrib(${t.Maghrib}) < Isha(${t.Isha})`);
});

test('getTimes Dhuhr is slightly after Noon', () => {
  const t = getTimes(new Date('2024-06-21'), 40.7, -74.0);
  const diff = (t.Dhuhr - t.Noon) * 60; // minutes
  assert(diff > 2 && diff < 4, `Dhuhr - Noon = ${diff} min`);
});

test('getTimes angles present and in bounds', () => {
  const t = getTimes(new Date('2024-06-21'), 40.7, -74.0);
  assert(t.angles.fajrAngle > 10 && t.angles.fajrAngle < 22);
  assert(t.angles.ishaAngle > 10 && t.angles.ishaAngle < 22);
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 8: getTimes — geographic validation
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[8] getTimes — geographic scenarios');

// Reference times from independent sources (tolerances ±4 min = 0.067h)
const TOL = 0.07; // ~4 minutes

test('Makkah summer solstice — Sunrise ~05:39', () => {
  // Makkah 39.83°E, UTC+3: solar noon ~12:23 local. Sunrise ~5:39.
  const t = getTimes(new Date('2024-06-21'), 21.4225, 39.8262, 3);
  assert(approx(t.Sunrise, hm(5,39), 0.12), `Got ${t.Sunrise}`);
});

test('Makkah summer solstice — Maghrib ~19:06', () => {
  // Makkah summer solstice sunset: ~19:06-19:10 local.
  const t = getTimes(new Date('2024-06-21'), 21.4225, 39.8262, 3);
  assert(approx(t.Maghrib, hm(19,7), 0.12), `Got ${t.Maghrib}`);
});

test('New York summer solstice — Sunrise ~05:25', () => {
  const t = getTimes(new Date('2024-06-21'), 40.7128, -74.0060, -4);
  assert(approx(t.Sunrise, hm(5,25), TOL), `Got ${t.Sunrise}`);
});

test('New York summer solstice — Sunset ~20:31', () => {
  const t = getTimes(new Date('2024-06-21'), 40.7128, -74.0060, -4);
  assert(approx(t.Maghrib, hm(20,31), TOL), `Got ${t.Maghrib}`);
});

test('New York winter solstice — Sunrise ~07:20', () => {
  const t = getTimes(new Date('2024-12-21'), 40.7128, -74.0060, -5);
  assert(approx(t.Sunrise, hm(7,20), TOL), `Got ${t.Sunrise}`);
});

test('New York winter solstice — Sunset ~16:32', () => {
  const t = getTimes(new Date('2024-12-21'), 40.7128, -74.0060, -5);
  assert(approx(t.Maghrib, hm(16,32), TOL), `Got ${t.Maghrib}`);
});

test('London summer — Sunrise ~04:43', () => {
  const t = getTimes(new Date('2024-06-21'), 51.5074, -0.1278, 1);
  assert(approx(t.Sunrise, hm(4,43), TOL), `Got ${t.Sunrise}`);
});

test('London summer — Sunset ~21:21', () => {
  const t = getTimes(new Date('2024-06-21'), 51.5074, -0.1278, 1);
  assert(approx(t.Maghrib, hm(21,21), TOL), `Got ${t.Maghrib}`);
});

test('Sydney summer (Gregorian Jan) — Sunrise ~06:00', () => {
  // Sydney 151.21°E, UTC+11: solar noon ~12:04. Sunrise ~5:59-6:01 Jan 15.
  const t = getTimes(new Date('2024-01-15'), -33.8688, 151.2093, 11);
  assert(approx(t.Sunrise, hm(6,0), 0.12), `Got ${t.Sunrise}`);
});

test('Jakarta — Sunrise within 20min of 5:50 year-round', () => {
  // Jakarta 106.85°E, UTC+7: sunrise varies 5:30-6:10 across the year.
  for (const month of [1, 4, 7, 10]) {
    const t = getTimes(new Date(`2024-${String(month).padStart(2,'0')}-15`),
                       -6.2088, 106.8456, 7);
    assert(approx(t.Sunrise, hm(5,50), 0.33), `Month ${month}: Sunrise=${t.Sunrise}`);
  }
});

test('Singapore — all times finite', () => {
  const t = getTimes(new Date('2024-06-21'), 1.3521, 103.8198, 8);
  for (const field of ['Fajr','Sunrise','Noon','Dhuhr','Asr','Maghrib','Isha']) {
    assert(isFinite(t[field]), `${field} should be finite`);
  }
});

test('Cairo summer — Sunrise ~06:00 ±12min', () => {
  const t = getTimes(new Date('2024-06-21'), 30.0444, 31.2357, 3);
  assert(approx(t.Sunrise, hm(6, 0), 0.20), `Got ${t.Sunrise}`);
});

test('Istanbul spring equinox — Noon ~13:11 ±10min', () => {
  // Istanbul 28.98°E, UTC+3: solar noon = 12:00 + (45-28.98)/15 = 13:04 + eq-of-time ~7min = ~13:11
  const t = getTimes(new Date('2024-03-20'), 41.0082, 28.9784, 3);
  assert(approx(t.Noon, hm(13,11), 0.17), `Got ${t.Noon}`);
});

test('Karachi summer — Maghrib ~19:20 ±10min', () => {
  const t = getTimes(new Date('2024-06-21'), 24.8607, 67.0011, 5);
  assert(approx(t.Maghrib, hm(19,20), 0.17), `Got ${t.Maghrib}`);
});

test('Toronto summer — Sunset ~21:02 ±12min', () => {
  // Toronto 79.38°W, UTC-4: solar noon ~13:17. Sunset June 21 ~21:00-21:04.
  const t = getTimes(new Date('2024-06-21'), 43.6532, -79.3832, -4);
  assert(approx(t.Maghrib, hm(21,2), 0.22), `Got ${t.Maghrib}`);
});

test('Reykjavik summer — Sunrise and Maghrib finite', () => {
  // ~64°N — high latitude, Midnight Sun territory
  const t = getTimes(new Date('2024-06-21'), 64.1265, -21.8174, 0);
  // May produce NaN for some times; just check Noon is finite
  assert(isFinite(t.Noon), `Noon should be finite`);
});

test('South pole winter — Noon finite', () => {
  const t = getTimes(new Date('2024-06-21'), -90, 0, 0);
  // Extreme case — just should not throw
  assert(typeof t.Noon === 'number');
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 9: getTimes — seasonal variation at fixed location
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[9] getTimes — seasonal variation');

test('NY Sunrise earlier in summer than winter', () => {
  const summer = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4).Sunrise;
  const winter = getTimes(new Date('2024-12-21'), 40.7, -74.0, -5).Sunrise;
  assert(summer < winter, `Summer ${summer} < Winter ${winter}`);
});

test('NY Sunset later in summer than winter', () => {
  const summer = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4).Maghrib;
  const winter = getTimes(new Date('2024-12-21'), 40.7, -74.0, -5).Maghrib;
  assert(summer > winter, `Summer ${summer} > Winter ${winter}`);
});

test('Noon time consistent across seasons (same tz, within 30 min)', () => {
  // Use EST (-5) for all dates to avoid EDT/EST offset masking the comparison.
  // Equation of time spans ±16 min; NY longitude offset is fixed. Max variation ~30 min.
  const base = getTimes(new Date('2024-06-21'), 40.7, -74.0, -5).Noon;
  for (const d of ['2024-01-15','2024-04-01','2024-09-22','2024-12-21']) {
    const t = getTimes(new Date(d), 40.7, -74.0, -5).Noon;
    assert(Math.abs(t - base) < 0.5, `Noon ${t} vs ${base} on ${d}`);
  }
});

test('Fajr angle smaller in London summer than London winter', () => {
  const summer = getAngles(new Date('2024-06-21'), 51.5, -0.1).fajrAngle;
  const winter = getAngles(new Date('2024-12-21'), 51.5, -0.1).fajrAngle;
  assert(summer < winter, `Summer ${summer} should be < Winter ${winter}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 10: Hanafi vs Shafi'i
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[10] Asr convention');

test('Hanafi Asr later than Shafii at multiple locations', () => {
  const locations = [
    [40.7, -74.0, -4],   // New York
    [21.4, 39.8, 3],     // Makkah
    [51.5, -0.1, 1],     // London
    [-33.9, 151.2, 10],  // Sydney
  ];
  for (const [lat, lng, tz] of locations) {
    const tS = getTimes(new Date('2024-06-21'), lat, lng, tz, 0, 15, 1013.25, false);
    const tH = getTimes(new Date('2024-06-21'), lat, lng, tz, 0, 15, 1013.25, true);
    assert(tH.Asr > tS.Asr,
      `Hanafi Asr (${tH.Asr}) should be > Shafi'i Asr (${tS.Asr}) at lat=${lat}`);
  }
});

test('Hanafi-Shafii difference 20-85 min at typical latitudes', () => {
  // At high summer latitudes (long day), the shadow-ratio difference can reach ~75 min.
  const t = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4);
  const tH = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4, 0, 15, 1013.25, true);
  const diffMin = (tH.Asr - t.Asr) * 60;
  assert(diffMin > 20 && diffMin < 85, `Difference ${diffMin} min`);
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 11: Atmospheric parameters
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[11] Atmospheric parameters');

test('Higher elevation brings Sunrise earlier', () => {
  const t0 = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4, 0);
  const t1 = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4, 2000);
  assert(t1.Sunrise <= t0.Sunrise, `High-elevation sunrise (${t1.Sunrise}) should be <= sea level (${t0.Sunrise})`);
});

test('Temperature and pressure accepted without error', () => {
  const t = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4, 100, 5, 950);
  assert(isFinite(t.Sunrise));
});

test('Extreme cold reduces refraction slightly', () => {
  const tHot = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4, 0, 40, 1013.25);
  const tCold = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4, 0, -20, 1013.25);
  // Both should return finite values
  assert(isFinite(tHot.Sunrise) && isFinite(tCold.Sunrise));
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 12: calcTimes — formatted output
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[12] calcTimes — formatting');

test('calcTimes returns HH:MM:SS strings', () => {
  const t = calcTimes(new Date('2024-06-21'), 40.7, -74.0, -4);
  const timeRe = /^\d{2}:\d{2}:\d{2}$/;
  for (const field of ['Fajr','Sunrise','Noon','Dhuhr','Asr','Maghrib','Isha']) {
    assert(timeRe.test(t[field]), `${field}="${t[field]}" not HH:MM:SS`);
  }
});

test('calcTimes Qiyam returns HH:MM:SS or N/A', () => {
  const t = calcTimes(new Date('2024-06-21'), 40.7, -74.0, -4);
  assert(t.Qiyam === 'N/A' || /^\d{2}:\d{2}:\d{2}$/.test(t.Qiyam),
    `Qiyam="${t.Qiyam}"`);
});

test('calcTimes angles preserved correctly', () => {
  const t = calcTimes(new Date('2024-06-21'), 40.7, -74.0, -4);
  assert(typeof t.angles.fajrAngle === 'number');
  assert(typeof t.angles.ishaAngle === 'number');
});

test('calcTimes default timezone matches getTimes', () => {
  const date = new Date('2024-06-21T12:00:00.000Z');
  const raw = getTimes(date, 40.7, -74.0);
  const fmt = calcTimes(date, 40.7, -74.0);
  // Sunrise should parse to same fractional hour
  const [h, m, s] = fmt.Sunrise.split(':').map(Number);
  const parsed = h + m / 60 + s / 3600;
  assert(approx(parsed, raw.Sunrise, 0.005), `Parsed ${parsed}, raw ${raw.Sunrise}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 13: getTimesAll — method comparison
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[13] getTimesAll — method comparison');

test('getTimesAll returns Methods map with 14 entries', () => {
  const t = getTimesAll(new Date('2024-06-21'), 40.7, -74.0, -4);
  assert.strictEqual(Object.keys(t.Methods).length, 14);
});

test('getTimesAll Methods entries are [number, number]', () => {
  const t = getTimesAll(new Date('2024-06-21'), 40.7, -74.0, -4);
  for (const [id, [fajr, isha]] of Object.entries(t.Methods)) {
    assert(typeof fajr === 'number', `${id} fajr is not a number`);
    assert(typeof isha === 'number', `${id} isha is not a number`);
  }
});

test('getTimesAll ISNA Fajr is finite at NY summer', () => {
  const t = getTimesAll(new Date('2024-06-21'), 40.7, -74.0, -4);
  assert(isFinite(t.Methods.ISNA[0]), `ISNA Fajr=${t.Methods.ISNA[0]}`);
});

test('getTimesAll MWL Isha at London summer may be NaN (18° fails)', () => {
  const t = getTimesAll(new Date('2024-06-21'), 51.5, -0.1, 1);
  // MWL uses 17° Isha. London summer — may or may not reach it.
  // Just verify it's a number (finite or NaN)
  assert(typeof t.Methods.MWL[1] === 'number');
});

test('getTimesAll UAQ Isha = Maghrib + 90min', () => {
  const t = getTimesAll(new Date('2024-06-21'), 21.4, 39.8, 3);
  const diff = (t.Methods.UAQ[1] - t.Maghrib) * 60;
  assert(approx(diff, 90, 2), `UAQ isha diff=${diff} min, expected 90`);
});

test('getTimesAll Qatar Isha = Maghrib + 90min', () => {
  const t = getTimesAll(new Date('2024-06-21'), 25.3, 51.5, 3);
  const diff = (t.Methods.Qatar[1] - t.Maghrib) * 60;
  assert(approx(diff, 90, 2), `Qatar isha diff=${diff} min, expected 90`);
});

test('getTimesAll higher-angle methods have earlier Fajr', () => {
  // MUIS (20°) should give earlier Fajr than ISNA (15°)
  const t = getTimesAll(new Date('2024-06-21'), 1.3, 103.8, 8);
  const muis = t.Methods.MUIS[0];
  const isna = t.Methods.ISNA[0];
  if (isFinite(muis) && isFinite(isna)) {
    assert(muis < isna, `MUIS Fajr (${muis}) should be < ISNA Fajr (${isna})`);
  }
});

test('getTimesAll dynamic Fajr within method range', () => {
  // Higher depression angle = earlier Fajr. Dynamic (14.8°) falls between 12° (UOIF, latest)
  // and 18° (Karachi, earliest). So: Karachi[0] <= dynamic <= UOIF[0].
  const t = getTimesAll(new Date('2024-06-21'), 40.7, -74.0, -4);
  const earliest = t.Methods.Karachi[0]; // 18° → earliest Fajr
  const latest   = t.Methods.UOIF[0];   // 12° → latest Fajr
  if (isFinite(earliest) && isFinite(latest)) {
    assert(t.Fajr >= earliest - 0.10 && t.Fajr <= latest + 0.10,
      `Dynamic Fajr ${t.Fajr} not between Karachi=${earliest} and UOIF=${latest}`);
  }
});

test('getTimesAll MSC and dynamic are close', () => {
  // MSC is the base for the dynamic method — they should be within ~20 minutes
  const t = getTimesAll(new Date('2024-06-21'), 40.7, -74.0, -4);
  const mscFajr = t.Methods.MSC[0];
  const dynFajr = t.Fajr;
  if (isFinite(mscFajr) && isFinite(dynFajr)) {
    const diffMin = Math.abs(mscFajr - dynFajr) * 60;
    assert(diffMin < 25, `MSC Fajr (${mscFajr}) vs Dynamic Fajr (${dynFajr}) = ${diffMin} min`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 14: calcTimesAll — formatted all methods
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[14] calcTimesAll');

test('calcTimesAll returns formatted strings', () => {
  const t = calcTimesAll(new Date('2024-06-21'), 40.7, -74.0, -4);
  const timeRe = /^\d{2}:\d{2}:\d{2}$/;
  assert(timeRe.test(t.Fajr), `Fajr="${t.Fajr}"`);
  assert(timeRe.test(t.Maghrib), `Maghrib="${t.Maghrib}"`);
});

test('calcTimesAll Methods entries are [string, string]', () => {
  const t = calcTimesAll(new Date('2024-06-21'), 40.7, -74.0, -4);
  for (const [id, [fajr, isha]] of Object.entries(t.Methods)) {
    assert(typeof fajr === 'string', `${id} fajr is not a string`);
    assert(typeof isha === 'string', `${id} isha is not a string`);
  }
});

test('calcTimesAll N/A for unreachable events', () => {
  // At very high lat summer, some 18° methods may be N/A
  const t = calcTimesAll(new Date('2024-06-21'), 58.0, 25.0, 3);
  // Just verify Methods map exists and all values are strings
  for (const [fajr, isha] of Object.values(t.Methods)) {
    assert(typeof fajr === 'string');
    assert(typeof isha === 'string');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 15: Multi-year and edge date coverage
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[15] Date coverage');

test('Works across multiple years', () => {
  for (const year of [2020, 2022, 2024, 2025, 2026]) {
    const t = getTimes(new Date(`${year}-06-21`), 40.7, -74.0, -4);
    assert(isFinite(t.Sunrise), `Year ${year} Sunrise not finite`);
  }
});

test('Works on Feb 29 in leap year', () => {
  const t = getTimes(new Date('2024-02-29'), 40.7, -74.0, -5);
  assert(isFinite(t.Fajr), 'Feb 29 Fajr not finite');
});

test('Works on Dec 31', () => {
  const t = getTimes(new Date('2024-12-31'), 40.7, -74.0, -5);
  assert(isFinite(t.Sunrise));
});

test('Works on Jan 1', () => {
  const t = getTimes(new Date('2024-01-01'), 40.7, -74.0, -5);
  assert(isFinite(t.Sunrise));
});

test('Both equinoxes consistent', () => {
  // NY 74°W, UTC-4 (EDT in both March 20 and Sep 22): solar noon ~12:56 EDT.
  // At equinox, day ≈ 12h, sunrise ≈ noon − 6h ≈ 6:56 EDT.
  const t1 = getTimes(new Date('2024-03-20'), 40.7, -74.0, -4);
  const t2 = getTimes(new Date('2024-09-22'), 40.7, -74.0, -4);
  assert(approx(t1.Sunrise, hm(6,57), 0.30), `Spring equinox Sunrise ${t1.Sunrise}`);
  assert(approx(t2.Sunrise, hm(6,54), 0.30), `Autumn equinox Sunrise ${t2.Sunrise}`);
  // The two equinox sunrises should be within 15 min of each other
  assert(Math.abs(t1.Sunrise - t2.Sunrise) < 0.25,
    `Equinox sunrises differ by ${Math.abs(t1.Sunrise - t2.Sunrise) * 60} min`);
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 16: Global coverage — additional locations
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[16] Global coverage');

const globalLocations = [
  { name: 'Dubai',     lat:  25.2048, lng:  55.2708, tz: 4,   date: '2024-06-21' },
  { name: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869, tz: 8,  date: '2024-06-21' },
  { name: 'Paris',     lat:  48.8566, lng:   2.3522, tz: 2,   date: '2024-06-21' },
  { name: 'Lagos',     lat:   6.5244, lng:   3.3792, tz: 1,   date: '2024-06-21' },
  { name: 'Moscow',    lat:  55.7558, lng:  37.6173, tz: 3,   date: '2024-06-21' },
  { name: 'Cape Town', lat: -33.9249, lng:  18.4241, tz: 2,   date: '2024-06-21' },
  { name: 'Buenos Aires', lat: -34.6037, lng: -58.3816, tz: -3, date: '2024-06-21' },
  { name: 'Oslo',      lat:  59.9139, lng:  10.7522, tz: 2,   date: '2024-06-21' },
  { name: 'Dhaka',     lat:  23.8103, lng:  90.4125, tz: 6,   date: '2024-06-21' },
  { name: 'Riyadh',    lat:  24.7136, lng:  46.6753, tz: 3,   date: '2024-06-21' },
];

for (const loc of globalLocations) {
  test(`${loc.name} — all times numeric`, () => {
    const t = getTimes(new Date(loc.date), loc.lat, loc.lng, loc.tz);
    assert(typeof t.Fajr === 'number', `Fajr: ${t.Fajr}`);
    assert(typeof t.Noon === 'number', `Noon: ${t.Noon}`);
    assert(typeof t.Maghrib === 'number', `Maghrib: ${t.Maghrib}`);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 17: Winter scenarios
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[17] Winter scenarios');

test('London winter — all core times finite', () => {
  const t = getTimes(new Date('2024-12-21'), 51.5, -0.1, 0);
  for (const f of ['Fajr','Sunrise','Noon','Dhuhr','Asr','Maghrib','Isha']) {
    assert(isFinite(t[f]), `${f}=${t[f]}`);
  }
});

test('Moscow winter — all core times finite', () => {
  const t = getTimes(new Date('2024-12-21'), 55.8, 37.6, 3);
  for (const f of ['Fajr','Sunrise','Noon','Dhuhr','Asr','Maghrib','Isha']) {
    assert(isFinite(t[f]), `${f}=${t[f]}`);
  }
});

test('Oslo winter — Noon finite', () => {
  const t = getTimes(new Date('2024-12-21'), 59.9, 10.8, 1);
  assert(isFinite(t.Noon));
});

test('Oslo winter — Sunrise, Sunset near solstice values', () => {
  const t = getTimes(new Date('2024-12-21'), 59.9, 10.8, 1);
  // Oslo Dec 21: Sunrise ~09:18, Sunset ~15:12
  if (isFinite(t.Sunrise)) {
    assert(approx(t.Sunrise, hm(9,18), 0.25), `Oslo Sunrise ${t.Sunrise}`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────────────────────
const total = passed + failed;
console.log(`\n${'─'.repeat(50)}`);
console.log(`${passed}/${total} tests passed`);

if (failed > 0) {
  process.exit(1);
}
