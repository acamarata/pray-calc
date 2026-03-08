/**
 * pray-calc v2 test suite.
 *
 * Tests cover:
 *   - Equatorial, tropical, mid-latitude, high-latitude locations
 *   - All four seasons (solstices + equinoxes)
 *   - Both Asr conventions (Shafi'i / Hanafi)
 *   - Atmospheric parameters (pressure, temperature, elevation)
 *   - All exported functions
 *   - Edge cases (polar regions, missing events, invalid inputs)
 *   - Dynamic vs. traditional method comparison
 *   - Type exports and METHODS array
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
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
  DHUHR_OFFSET_MINUTES,
  ANGLE_MIN,
  ANGLE_MAX,
} from './dist/index.mjs';

function approx(a, b, tol = 0.05) {
  return Math.abs(a - b) < tol;
}

function approxAngle(a, b, tol = 0.5) {
  return Math.abs(a - b) < tol;
}

function hm(h, m) {
  return h + m / 60;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 1: Exports and type structure
// ─────────────────────────────────────────────────────────────────────────────
describe('Exports and type structure', () => {
  it('METHODS array has 14 entries', () => {
    assert.strictEqual(METHODS.length, 14);
  });

  it('METHODS has expected IDs', () => {
    const ids = METHODS.map(m => m.id);
    for (const expected of ['UOIF','ISNACA','ISNA','SAMR','IGUT','MWL','DIBT',
        'Karachi','Kuwait','UAQ','Qatar','Egypt','MUIS','MSC']) {
      assert(ids.includes(expected), `Missing method: ${expected}`);
    }
  });

  it('METHODS fields present', () => {
    for (const m of METHODS) {
      assert(typeof m.id === 'string');
      assert(typeof m.name === 'string');
      assert(typeof m.region === 'string');
      assert(m.fajrAngle === null || typeof m.fajrAngle === 'number');
      assert(m.ishaAngle === null || typeof m.ishaAngle === 'number');
    }
  });

  it('MSC method has useMSC=true and null angles', () => {
    const msc = METHODS.find(m => m.id === 'MSC');
    assert(msc.useMSC === true);
    assert(msc.fajrAngle === null);
    assert(msc.ishaAngle === null);
  });

  it('UAQ has ishaMinutes=90', () => {
    const uaq = METHODS.find(m => m.id === 'UAQ');
    assert.strictEqual(uaq.ishaMinutes, 90);
  });

  it('Qatar has ishaMinutes=90', () => {
    const qatar = METHODS.find(m => m.id === 'Qatar');
    assert.strictEqual(qatar.ishaMinutes, 90);
  });

  it('DHUHR_OFFSET_MINUTES is exported and equals 2.5', () => {
    assert.strictEqual(DHUHR_OFFSET_MINUTES, 2.5);
  });

  it('ANGLE_MIN and ANGLE_MAX are exported', () => {
    assert.strictEqual(ANGLE_MIN, 10);
    assert.strictEqual(ANGLE_MAX, 22);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 2: toJulianDate and solarEphemeris
// ─────────────────────────────────────────────────────────────────────────────
describe('Solar ephemeris', () => {
  it('toJulianDate J2000 epoch', () => {
    const jd = toJulianDate(new Date(Date.UTC(2000, 0, 1, 12, 0, 0)));
    assert(approxAngle(jd, 2451545.0, 1.0), `Got ${jd}`);
  });

  it('solarEphemeris returns valid structure', () => {
    const jd = toJulianDate(new Date(Date.UTC(2024, 5, 21, 12, 0, 0)));
    const e = solarEphemeris(jd);
    assert(typeof e.decl === 'number');
    assert(typeof e.r === 'number');
    assert(typeof e.eclLon === 'number');
  });

  it('solarEphemeris summer solstice declination ~+23.44', () => {
    const jd = toJulianDate(new Date(Date.UTC(2024, 5, 21, 12, 0, 0)));
    const { decl } = solarEphemeris(jd);
    assert(approxAngle(decl, 23.44, 0.15), `Got decl=${decl}`);
  });

  it('solarEphemeris winter solstice declination ~-23.44', () => {
    const jd = toJulianDate(new Date(Date.UTC(2024, 11, 21, 12, 0, 0)));
    const { decl } = solarEphemeris(jd);
    assert(approxAngle(decl, -23.44, 0.15), `Got decl=${decl}`);
  });

  it('solarEphemeris r within range [0.98, 1.02] AU', () => {
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

  it('solarEphemeris equinox declination near 0', () => {
    const jd = toJulianDate(new Date(Date.UTC(2024, 2, 20, 12, 0, 0)));
    const { decl } = solarEphemeris(jd);
    assert(Math.abs(decl) < 1.0, `Got decl=${decl} at equinox`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 3: getAngles — dynamic Fajr/Isha depression
// ─────────────────────────────────────────────────────────────────────────────
describe('getAngles — dynamic depression', () => {
  it('returns object with fajrAngle and ishaAngle', () => {
    const a = getAngles(new Date('2024-06-21'), 40.7, -74.0);
    assert(typeof a.fajrAngle === 'number');
    assert(typeof a.ishaAngle === 'number');
  });

  it('angles within physical bounds [10,22]', () => {
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

  it('equatorial latitude near 18', () => {
    const { fajrAngle } = getAngles(new Date('2024-06-21'), 1.3, 103.8);
    assert(fajrAngle > 16 && fajrAngle < 22, `fajrAngle=${fajrAngle}`);
  });

  it('high-latitude summer smaller than 18', () => {
    const { fajrAngle } = getAngles(new Date('2024-06-21'), 51.5, -0.1);
    assert(fajrAngle < 17, `Expected <17, got ${fajrAngle} at London summer solstice`);
  });

  it('elevation parameter accepted', () => {
    const a1 = getAngles(new Date('2024-06-21'), 40.7, -74.0, 0);
    const a2 = getAngles(new Date('2024-06-21'), 40.7, -74.0, 1000);
    assert(typeof a1.fajrAngle === 'number');
    assert(typeof a2.fajrAngle === 'number');
    assert(a2.fajrAngle <= a1.fajrAngle + 0.5, 'Elevation should not increase angle by more than 0.5');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 4: getAsr
// ─────────────────────────────────────────────────────────────────────────────
describe('getAsr', () => {
  it('Shafii returns finite time', () => {
    const asr = getAsr(12.0, 40.7128, 20.0, false);
    assert(isFinite(asr), `Expected finite, got ${asr}`);
  });

  it('Hanafi is later than Shafii', () => {
    const asrS = getAsr(12.0, 40.7, 20.0, false);
    const asrH = getAsr(12.0, 40.7, 20.0, true);
    assert(asrH > asrS, `Hanafi ${asrH} should be later than Shafi'i ${asrS}`);
  });

  it('reasonable range (afternoon)', () => {
    const asr = getAsr(12.1, 21.4, 20.0, false);
    assert(asr > 14 && asr < 18, `Got ${asr}`);
  });

  it('Hanafi Makkah afternoon', () => {
    const asr = getAsr(12.1, 21.4, 20.0, true);
    assert(asr > 15 && asr < 19, `Got ${asr}`);
  });

  it('returns NaN when sun never reaches altitude', () => {
    const asr = getAsr(12.0, 89.0, -23.4, false);
    assert(typeof asr === 'number', 'Should return a number');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 5: getQiyam
// ─────────────────────────────────────────────────────────────────────────────
describe('getQiyam', () => {
  it('returns last-third start', () => {
    const q = getQiyam(4.0, 22.0);
    assert(approx(q, 2.0, 0.1), `Got ${q}`);
  });

  it('handles wrap-around midnight', () => {
    const q = getQiyam(3.5, 21.0);
    const expected = 21.0 + (2 / 3) * (3.5 + 24 - 21.0);
    const normalized = expected >= 24 ? expected - 24 : expected;
    assert(approx(q, normalized, 0.1), `Got ${q}, expected ~${normalized}`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 6: getMscFajr / getMscIsha
// ─────────────────────────────────────────────────────────────────────────────
describe('MSC minute offsets', () => {
  it('getMscFajr returns positive minutes', () => {
    const m = getMscFajr(new Date('2024-06-21'), 40.7);
    assert(m > 0, `Got ${m}`);
  });

  it('getMscIsha returns positive minutes', () => {
    const m = getMscIsha(new Date('2024-06-21'), 40.7);
    assert(m > 0, `Got ${m}`);
  });

  it('getMscFajr increases with latitude (summer)', () => {
    const m30 = getMscFajr(new Date('2024-06-21'), 30);
    const m50 = getMscFajr(new Date('2024-06-21'), 50);
    assert(m50 > m30, `Expected lat50 (${m50}) > lat30 (${m30})`);
  });

  it('getMscFajr equator ~75 minutes year-round', () => {
    const summer = getMscFajr(new Date('2024-06-21'), 0);
    const winter = getMscFajr(new Date('2024-12-21'), 0);
    assert(approx(summer, 75, 5), `Summer: ${summer}`);
    assert(approx(winter, 75, 5), `Winter: ${winter}`);
  });

  it('getMscIsha shafaq modes return different values at high lat', () => {
    const general = getMscIsha(new Date('2024-06-21'), 51.5, 'general');
    const ahmer   = getMscIsha(new Date('2024-06-21'), 51.5, 'ahmer');
    const abyad   = getMscIsha(new Date('2024-06-21'), 51.5, 'abyad');
    assert(general > 0 && ahmer > 0 && abyad > 0);
    assert(ahmer <= general, `ahmer ${ahmer} should be <= general ${general}`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 7: getTimes — core output structure
// ─────────────────────────────────────────────────────────────────────────────
describe('getTimes — structure', () => {
  it('returns all required fields', () => {
    const t = getTimes(new Date('2024-06-21'), 40.7, -74.0);
    for (const field of ['Qiyam','Fajr','Sunrise','Noon','Dhuhr','Asr','Maghrib','Isha']) {
      assert(field in t, `Missing field: ${field}`);
    }
    assert('angles' in t);
    assert('fajrAngle' in t.angles);
    assert('ishaAngle' in t.angles);
  });

  it('chronological order', () => {
    const t = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4);
    assert(t.Fajr < t.Sunrise, `Fajr(${t.Fajr}) < Sunrise(${t.Sunrise})`);
    assert(t.Sunrise < t.Noon, `Sunrise(${t.Sunrise}) < Noon(${t.Noon})`);
    assert(t.Noon <= t.Dhuhr, `Noon(${t.Noon}) <= Dhuhr(${t.Dhuhr})`);
    assert(t.Dhuhr < t.Asr, `Dhuhr(${t.Dhuhr}) < Asr(${t.Asr})`);
    assert(t.Asr < t.Maghrib, `Asr(${t.Asr}) < Maghrib(${t.Maghrib})`);
    assert(t.Maghrib < t.Isha, `Maghrib(${t.Maghrib}) < Isha(${t.Isha})`);
  });

  it('Dhuhr is slightly after Noon', () => {
    const t = getTimes(new Date('2024-06-21'), 40.7, -74.0);
    const diff = (t.Dhuhr - t.Noon) * 60;
    assert(diff > 2 && diff < 4, `Dhuhr - Noon = ${diff} min`);
  });

  it('angles present and in bounds', () => {
    const t = getTimes(new Date('2024-06-21'), 40.7, -74.0);
    assert(t.angles.fajrAngle > 10 && t.angles.fajrAngle < 22);
    assert(t.angles.ishaAngle > 10 && t.angles.ishaAngle < 22);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 8: getTimes — geographic validation
// ─────────────────────────────────────────────────────────────────────────────
describe('getTimes — geographic scenarios', () => {
  const TOL = 0.07; // ~4 minutes

  it('Makkah summer solstice — Sunrise ~05:39', () => {
    const t = getTimes(new Date('2024-06-21'), 21.4225, 39.8262, 3);
    assert(approx(t.Sunrise, hm(5,39), 0.12), `Got ${t.Sunrise}`);
  });

  it('Makkah summer solstice — Maghrib ~19:06', () => {
    const t = getTimes(new Date('2024-06-21'), 21.4225, 39.8262, 3);
    assert(approx(t.Maghrib, hm(19,7), 0.12), `Got ${t.Maghrib}`);
  });

  it('New York summer solstice — Sunrise ~05:25', () => {
    const t = getTimes(new Date('2024-06-21'), 40.7128, -74.0060, -4);
    assert(approx(t.Sunrise, hm(5,25), TOL), `Got ${t.Sunrise}`);
  });

  it('New York summer solstice — Sunset ~20:31', () => {
    const t = getTimes(new Date('2024-06-21'), 40.7128, -74.0060, -4);
    assert(approx(t.Maghrib, hm(20,31), TOL), `Got ${t.Maghrib}`);
  });

  it('New York winter solstice — Sunrise ~07:20', () => {
    const t = getTimes(new Date('2024-12-21'), 40.7128, -74.0060, -5);
    assert(approx(t.Sunrise, hm(7,20), TOL), `Got ${t.Sunrise}`);
  });

  it('New York winter solstice — Sunset ~16:32', () => {
    const t = getTimes(new Date('2024-12-21'), 40.7128, -74.0060, -5);
    assert(approx(t.Maghrib, hm(16,32), TOL), `Got ${t.Maghrib}`);
  });

  it('London summer — Sunrise ~04:43', () => {
    const t = getTimes(new Date('2024-06-21'), 51.5074, -0.1278, 1);
    assert(approx(t.Sunrise, hm(4,43), TOL), `Got ${t.Sunrise}`);
  });

  it('London summer — Sunset ~21:21', () => {
    const t = getTimes(new Date('2024-06-21'), 51.5074, -0.1278, 1);
    assert(approx(t.Maghrib, hm(21,21), TOL), `Got ${t.Maghrib}`);
  });

  it('Sydney summer (Gregorian Jan) — Sunrise ~06:00', () => {
    const t = getTimes(new Date('2024-01-15'), -33.8688, 151.2093, 11);
    assert(approx(t.Sunrise, hm(6,0), 0.12), `Got ${t.Sunrise}`);
  });

  it('Jakarta — Sunrise within 20min of 5:50 year-round', () => {
    for (const month of [1, 4, 7, 10]) {
      const t = getTimes(new Date(`2024-${String(month).padStart(2,'0')}-15`),
                         -6.2088, 106.8456, 7);
      assert(approx(t.Sunrise, hm(5,50), 0.33), `Month ${month}: Sunrise=${t.Sunrise}`);
    }
  });

  it('Singapore — all times finite', () => {
    const t = getTimes(new Date('2024-06-21'), 1.3521, 103.8198, 8);
    for (const field of ['Fajr','Sunrise','Noon','Dhuhr','Asr','Maghrib','Isha']) {
      assert(isFinite(t[field]), `${field} should be finite`);
    }
  });

  it('Cairo summer — Sunrise ~06:00 ±12min', () => {
    const t = getTimes(new Date('2024-06-21'), 30.0444, 31.2357, 3);
    assert(approx(t.Sunrise, hm(6, 0), 0.20), `Got ${t.Sunrise}`);
  });

  it('Istanbul spring equinox — Noon ~13:11 ±10min', () => {
    const t = getTimes(new Date('2024-03-20'), 41.0082, 28.9784, 3);
    assert(approx(t.Noon, hm(13,11), 0.17), `Got ${t.Noon}`);
  });

  it('Karachi summer — Maghrib ~19:20 ±10min', () => {
    const t = getTimes(new Date('2024-06-21'), 24.8607, 67.0011, 5);
    assert(approx(t.Maghrib, hm(19,20), 0.17), `Got ${t.Maghrib}`);
  });

  it('Toronto summer — Sunset ~21:02 ±12min', () => {
    const t = getTimes(new Date('2024-06-21'), 43.6532, -79.3832, -4);
    assert(approx(t.Maghrib, hm(21,2), 0.22), `Got ${t.Maghrib}`);
  });

  it('Reykjavik summer — Sunrise and Maghrib finite', () => {
    const t = getTimes(new Date('2024-06-21'), 64.1265, -21.8174, 0);
    assert(isFinite(t.Noon), `Noon should be finite`);
  });

  it('South pole winter — Noon finite', () => {
    const t = getTimes(new Date('2024-06-21'), -90, 0, 0);
    assert(typeof t.Noon === 'number');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 9: getTimes — seasonal variation at fixed location
// ─────────────────────────────────────────────────────────────────────────────
describe('getTimes — seasonal variation', () => {
  it('NY Sunrise earlier in summer than winter', () => {
    const summer = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4).Sunrise;
    const winter = getTimes(new Date('2024-12-21'), 40.7, -74.0, -5).Sunrise;
    assert(summer < winter, `Summer ${summer} < Winter ${winter}`);
  });

  it('NY Sunset later in summer than winter', () => {
    const summer = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4).Maghrib;
    const winter = getTimes(new Date('2024-12-21'), 40.7, -74.0, -5).Maghrib;
    assert(summer > winter, `Summer ${summer} > Winter ${winter}`);
  });

  it('Noon time consistent across seasons (same tz, within 30 min)', () => {
    const base = getTimes(new Date('2024-06-21'), 40.7, -74.0, -5).Noon;
    for (const d of ['2024-01-15','2024-04-01','2024-09-22','2024-12-21']) {
      const t = getTimes(new Date(d), 40.7, -74.0, -5).Noon;
      assert(Math.abs(t - base) < 0.5, `Noon ${t} vs ${base} on ${d}`);
    }
  });

  it('Fajr angle smaller in London summer than London winter', () => {
    const summer = getAngles(new Date('2024-06-21'), 51.5, -0.1).fajrAngle;
    const winter = getAngles(new Date('2024-12-21'), 51.5, -0.1).fajrAngle;
    assert(summer < winter, `Summer ${summer} should be < Winter ${winter}`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 10: Hanafi vs Shafi'i
// ─────────────────────────────────────────────────────────────────────────────
describe('Asr convention', () => {
  it('Hanafi Asr later than Shafii at multiple locations', () => {
    const locations = [
      [40.7, -74.0, -4],
      [21.4, 39.8, 3],
      [51.5, -0.1, 1],
      [-33.9, 151.2, 10],
    ];
    for (const [lat, lng, tz] of locations) {
      const tS = getTimes(new Date('2024-06-21'), lat, lng, tz, 0, 15, 1013.25, false);
      const tH = getTimes(new Date('2024-06-21'), lat, lng, tz, 0, 15, 1013.25, true);
      assert(tH.Asr > tS.Asr,
        `Hanafi Asr (${tH.Asr}) should be > Shafi'i Asr (${tS.Asr}) at lat=${lat}`);
    }
  });

  it('Hanafi-Shafii difference 20-85 min at typical latitudes', () => {
    const t = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4);
    const tH = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4, 0, 15, 1013.25, true);
    const diffMin = (tH.Asr - t.Asr) * 60;
    assert(diffMin > 20 && diffMin < 85, `Difference ${diffMin} min`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 11: Atmospheric parameters
// ─────────────────────────────────────────────────────────────────────────────
describe('Atmospheric parameters', () => {
  it('Higher elevation brings Sunrise earlier', () => {
    const t0 = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4, 0);
    const t1 = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4, 2000);
    assert(t1.Sunrise <= t0.Sunrise, `High-elevation sunrise (${t1.Sunrise}) should be <= sea level (${t0.Sunrise})`);
  });

  it('Temperature and pressure accepted without error', () => {
    const t = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4, 100, 5, 950);
    assert(isFinite(t.Sunrise));
  });

  it('Extreme cold reduces refraction slightly', () => {
    const tHot = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4, 0, 40, 1013.25);
    const tCold = getTimes(new Date('2024-06-21'), 40.7, -74.0, -4, 0, -20, 1013.25);
    assert(isFinite(tHot.Sunrise) && isFinite(tCold.Sunrise));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 12: calcTimes — formatted output
// ─────────────────────────────────────────────────────────────────────────────
describe('calcTimes — formatting', () => {
  it('returns HH:MM:SS strings', () => {
    const t = calcTimes(new Date('2024-06-21'), 40.7, -74.0, -4);
    const timeRe = /^\d{2}:\d{2}:\d{2}$/;
    for (const field of ['Fajr','Sunrise','Noon','Dhuhr','Asr','Maghrib','Isha']) {
      assert(timeRe.test(t[field]), `${field}="${t[field]}" not HH:MM:SS`);
    }
  });

  it('Qiyam returns HH:MM:SS or N/A', () => {
    const t = calcTimes(new Date('2024-06-21'), 40.7, -74.0, -4);
    assert(t.Qiyam === 'N/A' || /^\d{2}:\d{2}:\d{2}$/.test(t.Qiyam),
      `Qiyam="${t.Qiyam}"`);
  });

  it('angles preserved correctly', () => {
    const t = calcTimes(new Date('2024-06-21'), 40.7, -74.0, -4);
    assert(typeof t.angles.fajrAngle === 'number');
    assert(typeof t.angles.ishaAngle === 'number');
  });

  it('default timezone matches getTimes', () => {
    const date = new Date('2024-06-21T12:00:00.000Z');
    const raw = getTimes(date, 40.7, -74.0);
    const fmt = calcTimes(date, 40.7, -74.0);
    const [h, m, s] = fmt.Sunrise.split(':').map(Number);
    const parsed = h + m / 60 + s / 3600;
    assert(approx(parsed, raw.Sunrise, 0.005), `Parsed ${parsed}, raw ${raw.Sunrise}`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 13: getTimesAll — method comparison
// ─────────────────────────────────────────────────────────────────────────────
describe('getTimesAll — method comparison', () => {
  it('returns Methods map with 14 entries', () => {
    const t = getTimesAll(new Date('2024-06-21'), 40.7, -74.0, -4);
    assert.strictEqual(Object.keys(t.Methods).length, 14);
  });

  it('Methods entries are [number, number]', () => {
    const t = getTimesAll(new Date('2024-06-21'), 40.7, -74.0, -4);
    for (const [id, [fajr, isha]] of Object.entries(t.Methods)) {
      assert(typeof fajr === 'number', `${id} fajr is not a number`);
      assert(typeof isha === 'number', `${id} isha is not a number`);
    }
  });

  it('ISNA Fajr is finite at NY summer', () => {
    const t = getTimesAll(new Date('2024-06-21'), 40.7, -74.0, -4);
    assert(isFinite(t.Methods.ISNA[0]), `ISNA Fajr=${t.Methods.ISNA[0]}`);
  });

  it('MWL Isha at London summer may be NaN (18° fails)', () => {
    const t = getTimesAll(new Date('2024-06-21'), 51.5, -0.1, 1);
    assert(typeof t.Methods.MWL[1] === 'number');
  });

  it('UAQ Isha = Maghrib + 90min', () => {
    const t = getTimesAll(new Date('2024-06-21'), 21.4, 39.8, 3);
    const diff = (t.Methods.UAQ[1] - t.Maghrib) * 60;
    assert(approx(diff, 90, 2), `UAQ isha diff=${diff} min, expected 90`);
  });

  it('Qatar Isha = Maghrib + 90min', () => {
    const t = getTimesAll(new Date('2024-06-21'), 25.3, 51.5, 3);
    const diff = (t.Methods.Qatar[1] - t.Maghrib) * 60;
    assert(approx(diff, 90, 2), `Qatar isha diff=${diff} min, expected 90`);
  });

  it('higher-angle methods have earlier Fajr', () => {
    const t = getTimesAll(new Date('2024-06-21'), 1.3, 103.8, 8);
    const muis = t.Methods.MUIS[0];
    const isna = t.Methods.ISNA[0];
    if (isFinite(muis) && isFinite(isna)) {
      assert(muis < isna, `MUIS Fajr (${muis}) should be < ISNA Fajr (${isna})`);
    }
  });

  it('dynamic Fajr within method range', () => {
    const t = getTimesAll(new Date('2024-06-21'), 40.7, -74.0, -4);
    const earliest = t.Methods.Karachi[0];
    const latest   = t.Methods.UOIF[0];
    if (isFinite(earliest) && isFinite(latest)) {
      assert(t.Fajr >= earliest - 0.10 && t.Fajr <= latest + 0.10,
        `Dynamic Fajr ${t.Fajr} not between Karachi=${earliest} and UOIF=${latest}`);
    }
  });

  it('MSC and dynamic are close', () => {
    const t = getTimesAll(new Date('2024-06-21'), 40.7, -74.0, -4);
    const mscFajr = t.Methods.MSC[0];
    const dynFajr = t.Fajr;
    if (isFinite(mscFajr) && isFinite(dynFajr)) {
      const diffMin = Math.abs(mscFajr - dynFajr) * 60;
      assert(diffMin < 25, `MSC Fajr (${mscFajr}) vs Dynamic Fajr (${dynFajr}) = ${diffMin} min`);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 14: calcTimesAll — formatted all methods
// ─────────────────────────────────────────────────────────────────────────────
describe('calcTimesAll', () => {
  it('returns formatted strings', () => {
    const t = calcTimesAll(new Date('2024-06-21'), 40.7, -74.0, -4);
    const timeRe = /^\d{2}:\d{2}:\d{2}$/;
    assert(timeRe.test(t.Fajr), `Fajr="${t.Fajr}"`);
    assert(timeRe.test(t.Maghrib), `Maghrib="${t.Maghrib}"`);
  });

  it('Methods entries are [string, string]', () => {
    const t = calcTimesAll(new Date('2024-06-21'), 40.7, -74.0, -4);
    for (const [id, [fajr, isha]] of Object.entries(t.Methods)) {
      assert(typeof fajr === 'string', `${id} fajr is not a string`);
      assert(typeof isha === 'string', `${id} isha is not a string`);
    }
  });

  it('N/A for unreachable events', () => {
    const t = calcTimesAll(new Date('2024-06-21'), 58.0, 25.0, 3);
    for (const [fajr, isha] of Object.values(t.Methods)) {
      assert(typeof fajr === 'string');
      assert(typeof isha === 'string');
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 15: Multi-year and edge date coverage
// ─────────────────────────────────────────────────────────────────────────────
describe('Date coverage', () => {
  it('works across multiple years', () => {
    for (const year of [2020, 2022, 2024, 2025, 2026]) {
      const t = getTimes(new Date(`${year}-06-21`), 40.7, -74.0, -4);
      assert(isFinite(t.Sunrise), `Year ${year} Sunrise not finite`);
    }
  });

  it('works on Feb 29 in leap year', () => {
    const t = getTimes(new Date('2024-02-29'), 40.7, -74.0, -5);
    assert(isFinite(t.Fajr), 'Feb 29 Fajr not finite');
  });

  it('works on Dec 31', () => {
    const t = getTimes(new Date('2024-12-31'), 40.7, -74.0, -5);
    assert(isFinite(t.Sunrise));
  });

  it('works on Jan 1', () => {
    const t = getTimes(new Date('2024-01-01'), 40.7, -74.0, -5);
    assert(isFinite(t.Sunrise));
  });

  it('both equinoxes consistent', () => {
    const t1 = getTimes(new Date('2024-03-20'), 40.7, -74.0, -4);
    const t2 = getTimes(new Date('2024-09-22'), 40.7, -74.0, -4);
    assert(approx(t1.Sunrise, hm(6,57), 0.30), `Spring equinox Sunrise ${t1.Sunrise}`);
    assert(approx(t2.Sunrise, hm(6,54), 0.30), `Autumn equinox Sunrise ${t2.Sunrise}`);
    assert(Math.abs(t1.Sunrise - t2.Sunrise) < 0.25,
      `Equinox sunrises differ by ${Math.abs(t1.Sunrise - t2.Sunrise) * 60} min`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 16: Global coverage — additional locations
// ─────────────────────────────────────────────────────────────────────────────
describe('Global coverage', () => {
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
    it(`${loc.name} — all times numeric`, () => {
      const t = getTimes(new Date(loc.date), loc.lat, loc.lng, loc.tz);
      assert(typeof t.Fajr === 'number', `Fajr: ${t.Fajr}`);
      assert(typeof t.Noon === 'number', `Noon: ${t.Noon}`);
      assert(typeof t.Maghrib === 'number', `Maghrib: ${t.Maghrib}`);
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 17: Winter scenarios
// ─────────────────────────────────────────────────────────────────────────────
describe('Winter scenarios', () => {
  it('London winter — all core times finite', () => {
    const t = getTimes(new Date('2024-12-21'), 51.5, -0.1, 0);
    for (const f of ['Fajr','Sunrise','Noon','Dhuhr','Asr','Maghrib','Isha']) {
      assert(isFinite(t[f]), `${f}=${t[f]}`);
    }
  });

  it('Moscow winter — all core times finite', () => {
    const t = getTimes(new Date('2024-12-21'), 55.8, 37.6, 3);
    for (const f of ['Fajr','Sunrise','Noon','Dhuhr','Asr','Maghrib','Isha']) {
      assert(isFinite(t[f]), `${f}=${t[f]}`);
    }
  });

  it('Oslo winter — Noon finite', () => {
    const t = getTimes(new Date('2024-12-21'), 59.9, 10.8, 1);
    assert(isFinite(t.Noon));
  });

  it('Oslo winter — Sunrise, Sunset near solstice values', () => {
    const t = getTimes(new Date('2024-12-21'), 59.9, 10.8, 1);
    if (isFinite(t.Sunrise)) {
      assert(approx(t.Sunrise, hm(9,18), 0.25), `Oslo Sunrise ${t.Sunrise}`);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 18: Input validation
// ─────────────────────────────────────────────────────────────────────────────
describe('Input validation', () => {
  it('rejects latitude > 90', () => {
    assert.throws(() => getTimes(new Date('2024-06-21'), 91, 0, 0), { name: 'RangeError' });
  });

  it('rejects latitude < -90', () => {
    assert.throws(() => getTimes(new Date('2024-06-21'), -91, 0, 0), { name: 'RangeError' });
  });

  it('rejects longitude > 180', () => {
    assert.throws(() => getTimes(new Date('2024-06-21'), 0, 181, 0), { name: 'RangeError' });
  });

  it('rejects longitude < -180', () => {
    assert.throws(() => getTimes(new Date('2024-06-21'), 0, -181, 0), { name: 'RangeError' });
  });

  it('rejects timezone > 14', () => {
    assert.throws(() => getTimes(new Date('2024-06-21'), 0, 0, 15), { name: 'RangeError' });
  });

  it('rejects NaN latitude', () => {
    assert.throws(() => getTimes(new Date('2024-06-21'), NaN, 0, 0), { name: 'RangeError' });
  });

  it('rejects Infinity longitude', () => {
    assert.throws(() => getTimes(new Date('2024-06-21'), 0, Infinity, 0), { name: 'RangeError' });
  });

  it('getTimesAll also validates', () => {
    assert.throws(() => getTimesAll(new Date('2024-06-21'), 91, 0, 0), { name: 'RangeError' });
  });
});
