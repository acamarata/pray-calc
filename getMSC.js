// getMSC.js
'use strict';

/**
 * Base class for Moonsighting.com seasonal interpolation algorithm.
 * Computes a day-of-year offset (dyy) from the nearest solstice and
 * interpolates minutes for Fajr (before sunrise) or Isha (after sunset).
 */
class PrayerTimes {
  constructor(date, latitude) {
    this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.latitude = latitude;
    this.year = this.date.getFullYear();
    this.daysInYear = isLeapYear(this.year) ? 366 : 365;
    this.computeDyy();
  }

  computeDyy() {
    // Reference solstice: Dec 21 (Northern Hemisphere) or Jun 21 (Southern)
    const northSolstice = new Date(this.year, 11, 21);
    const southSolstice = new Date(this.year, 5, 21);
    const zeroDate = this.latitude >= 0 ? northSolstice : southSolstice;

    let diffDays = Math.floor((this.date - zeroDate) / 86400000);
    if (diffDays < 0) diffDays += this.daysInYear;
    this.dyy = diffDays;
  }

  getMinutesSegment() {
    const { a, b, c, d, dyy, daysInYear } = this;

    if (dyy < 91) {
      return a + ((b - a) / 91) * dyy;
    } else if (dyy < 137) {
      return b + ((c - b) / 46) * (dyy - 91);
    } else if (dyy < 183) {
      return c + ((d - c) / 46) * (dyy - 137);
    } else if (dyy < 229) {
      return d + ((c - d) / 46) * (dyy - 183);
    } else if (dyy < 275) {
      return c + ((b - c) / 46) * (dyy - 229);
    } else {
      const len = daysInYear - 275;
      return b + ((a - b) / len) * (dyy - 275);
    }
  }
}

/**
 * Fajr: returns minutes before sunrise.
 */
class Fajr extends PrayerTimes {
  constructor(date, latitude) {
    super(date, latitude);
    const latAbs = Math.abs(latitude);
    this.a = 75 + (28.65 / 55) * latAbs;
    this.b = 75 + (19.44 / 55) * latAbs;
    this.c = 75 + (32.74 / 55) * latAbs;
    this.d = 75 + (48.10 / 55) * latAbs;
  }

  getMinutesBeforeSunrise() {
    return Math.round(this.getMinutesSegment());
  }
}

/**
 * Isha: returns minutes after sunset.
 */
class Isha extends PrayerTimes {
  static SHAFAQ_GENERAL = 'general';
  static SHAFAQ_AHMER   = 'ahmer';
  static SHAFAQ_ABYAD   = 'abyad';

  constructor(date, latitude, shafaq = Isha.SHAFAQ_GENERAL) {
    super(date, latitude);
    this.setShafaq(shafaq);
  }

  setShafaq(shafaq) {
    this.shafaq = shafaq;
    const latAbs = Math.abs(this.latitude);

    switch (shafaq) {
      case Isha.SHAFAQ_AHMER:
        this.a = 62 + (17.4  / 55) * latAbs;
        this.b = 62 - (7.16  / 55) * latAbs;
        this.c = 62 + (5.12  / 55) * latAbs;
        this.d = 62 + (19.44 / 55) * latAbs;
        break;

      case Isha.SHAFAQ_ABYAD:
        this.a = 75 + (25.6  / 55) * latAbs;
        this.b = 75 + (7.16  / 55) * latAbs;
        this.c = 75 + (36.84 / 55) * latAbs;
        this.d = 75 + (81.84 / 55) * latAbs;
        break;

      default: // general
        this.a = 75 + (25.6  / 55) * latAbs;
        this.b = 75 + (2.05  / 55) * latAbs;
        this.c = 75 - (9.21  / 55) * latAbs;
        this.d = 75 + (6.14  / 55) * latAbs;
        break;
    }
  }

  getMinutesAfterSunset() {
    return Math.round(this.getMinutesSegment());
  }
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getFajr(date, latitude) {
  return new Fajr(date, latitude).getMinutesBeforeSunrise();
}

function getIsha(date, latitude, shafaq = Isha.SHAFAQ_GENERAL) {
  return new Isha(date, latitude, shafaq).getMinutesAfterSunset();
}

module.exports = { getFajr, getIsha, Isha, Fajr };