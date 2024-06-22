// getMSC.js
class PrayerTimes {
    constructor(date, latitude) {
        this.date = new Date(date);
        this.latitude = latitude;
        this.getDyy();
    }

    getDyy() {
        const year = this.date.getFullYear();
        const northDate = new Date(`${year}-12-21`);
        const southDate = new Date(`${year}-06-21`);
        const zeroDate = this.latitude > 0 ? northDate : southDate;
        this.dyy = Math.floor((this.date - zeroDate) / (1000 * 60 * 60 * 24));
        if (this.dyy < 0) {
            this.dyy += 365;
        }
    }

    getMinutes() {
        if (this.dyy < 91)
            return this.a + ((this.b - this.a) / 91) * this.dyy;
        if (this.dyy < 137)
            return this.b + ((this.c - this.b) / 46) * (this.dyy - 91);
        if (this.dyy < 183)
            return this.c + ((this.d - this.c) / 46) * (this.dyy - 137);
        if (this.dyy < 229)
            return this.d + ((this.c - this.d) / 46) * (this.dyy - 183);
        if (this.dyy < 275)
            return this.c + ((this.b - this.c) / 46) * (this.dyy - 229);
        return this.b + ((this.a - this.b) / 91) * (this.dyy - 275);
    }
}

class Fajr extends PrayerTimes {
    constructor(date, latitude) {
        super(date, latitude);
        this.a = 75 + (28.65 / 55) * Math.abs(latitude);
        this.b = 75 + (19.44 / 55) * Math.abs(latitude);
        this.c = 75 + (32.74 / 55) * Math.abs(latitude);
        this.d = 75 + (48.1 / 55) * Math.abs(latitude);
    }

    getMinutesBeforeSunrise() {
        return Math.round(this.getMinutes());
    }
}

class Isha extends PrayerTimes {
    static SHAFAQ_AHMER = 'ahmer';
    static SHAFAQ_ABYAD = 'abyad';
    static SHAFAQ_GENERAL = 'general';

    constructor(date, latitude, shafaq = Isha.SHAFAQ_GENERAL) {
        super(date, latitude);
        this.setShafaq(shafaq);
    }

    setShafaq(shafaq) {
        this.shafaq = shafaq;

        if (shafaq === Isha.SHAFAQ_AHMER) {
            this.a = 62 + (17.4 / 55) * Math.abs(this.latitude);
            this.b = 62 - (7.16 / 55) * Math.abs(this.latitude);
            this.c = 62 + (5.12 / 55) * Math.abs(this.latitude);
            this.d = 62 + (19.44 / 55) * Math.abs(this.latitude);
        } else if (shafaq === Isha.SHAFAQ_ABYAD) {
            this.a = 75 + (25.6 / 55) * Math.abs(this.latitude);
            this.b = 75 + (7.16 / 55) * Math.abs(this.latitude);
            this.c = 75 + (36.84 / 55) * Math.abs(this.latitude);
            this.d = 75 + (81.84 / 55) * Math.abs(this.latitude);
        } else {
            this.a = 75 + (25.6 / 55) * Math.abs(this.latitude);
            this.c = 75 - (9.21 / 55) * Math.abs(this.latitude);
            this.b = 75 + (2.05 / 55) * Math.abs(this.latitude);
            this.d = 75 + (6.14 / 55) * Math.abs(this.latitude);
        }
    }

    getMinutesAfterSunset() {
        return Math.round(this.getMinutes());
    }
}

function getFajr(date, latitude) {
    const fajr = new Fajr(date, latitude);
    return fajr.getMinutesBeforeSunrise();
}

function getIsha(date, latitude, shafaq = Isha.SHAFAQ_GENERAL) {
    const isha = new Isha(date, latitude, shafaq);
    return isha.getMinutesAfterSunset();
}

module.exports = { getFajr, getIsha, Isha, Fajr };