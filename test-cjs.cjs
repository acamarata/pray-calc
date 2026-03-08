/**
 * pray-calc v2 — CJS smoke test.
 *
 * Verifies that the CommonJS build loads and the primary API works.
 */

'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
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
} = require('./dist/index.cjs');

describe('[CJS] Core exports', () => {
  it('METHODS exported and has 14 entries', () => {
    assert(Array.isArray(METHODS));
    assert.strictEqual(METHODS.length, 14);
  });

  it('getTimes returns valid structure', () => {
    const t = getTimes(new Date('2024-06-21'), 40.7128, -74.0060, -4);
    assert(isFinite(t.Fajr), `Fajr=${t.Fajr}`);
    assert(isFinite(t.Sunrise), `Sunrise=${t.Sunrise}`);
    assert(isFinite(t.Maghrib), `Maghrib=${t.Maghrib}`);
    assert(isFinite(t.Isha), `Isha=${t.Isha}`);
    assert(typeof t.angles.fajrAngle === 'number');
  });

  it('calcTimes returns HH:MM:SS strings', () => {
    const t = calcTimes(new Date('2024-06-21'), 40.7128, -74.0060, -4);
    assert(/^\d{2}:\d{2}:\d{2}$/.test(t.Fajr), `Fajr="${t.Fajr}"`);
    assert(/^\d{2}:\d{2}:\d{2}$/.test(t.Sunrise), `Sunrise="${t.Sunrise}"`);
    assert(/^\d{2}:\d{2}:\d{2}$/.test(t.Maghrib), `Maghrib="${t.Maghrib}"`);
  });

  it('getTimesAll returns 14 methods', () => {
    const t = getTimesAll(new Date('2024-06-21'), 40.7128, -74.0060, -4);
    assert.strictEqual(Object.keys(t.Methods).length, 14);
  });

  it('calcTimesAll Methods are string pairs', () => {
    const t = calcTimesAll(new Date('2024-06-21'), 40.7128, -74.0060, -4);
    for (const [fajr, isha] of Object.values(t.Methods)) {
      assert(typeof fajr === 'string');
      assert(typeof isha === 'string');
    }
  });

  it('getAngles returns bounded angles', () => {
    const a = getAngles(new Date('2024-06-21'), 40.7128, -74.0060);
    assert(a.fajrAngle >= 10 && a.fajrAngle <= 22);
    assert(a.ishaAngle >= 10 && a.ishaAngle <= 22);
  });

  it('getAsr Hanafi later than Shafii', () => {
    const s = getAsr(12.0, 40.7, 20.0, false);
    const h = getAsr(12.0, 40.7, 20.0, true);
    assert(h > s);
  });

  it('getQiyam returns a number', () => {
    const q = getQiyam(4.0, 22.0);
    assert(typeof q === 'number');
  });

  it('getMscFajr returns positive minutes', () => {
    const m = getMscFajr(new Date('2024-06-21'), 40.7);
    assert(m > 0);
  });

  it('getMscIsha returns positive minutes', () => {
    const m = getMscIsha(new Date('2024-06-21'), 40.7);
    assert(m > 0);
  });

  it('toJulianDate and solarEphemeris work', () => {
    const jd = toJulianDate(new Date(Date.UTC(2024, 5, 21, 12, 0, 0)));
    const e = solarEphemeris(jd);
    assert(typeof e.decl === 'number');
    assert(typeof e.r === 'number');
    assert(typeof e.eclLon === 'number');
  });

  it('Makkah all-methods comparison — UAQ Isha = Maghrib + 90min', () => {
    const t = getTimesAll(new Date('2024-06-21'), 21.4225, 39.8262, 3);
    const diff = (t.Methods.UAQ[1] - t.Maghrib) * 60;
    assert(Math.abs(diff - 90) < 2, `UAQ isha diff=${diff}`);
  });

  it('rejects invalid inputs', () => {
    assert.throws(() => getTimes(new Date('2024-06-21'), 91, 0, 0), { name: 'RangeError' });
  });
});
