const { getSpa } = require('nrel-spa');
const { getAngles } = require('./getAngles');
const { getAsr } = require('./getAsr');
const { getQiyam } = require('./getQiyam');
const { getFajr, getIsha } = require('./getMSC');

const methods = [
    {n:'UOIF', f:12, i:12, r:'France'},
    {n:'ISNACA', f:13, i:13, r:'Canada'},
    {n:'ISNAUS', f:15, i:15, r:'US, UK'},
    {n:'SAMR', f:16, i:15, r:'RU'},
    {n:'MWL', f:18, i:17, r:'EU, US, Asia'},
    {n:'DIBT', f:18, i:17, r:'TR'},
    {n:'Karachi', f:18, i:18, r:'PK, BD, IN, AF, EU'},
    {n:'UAQ', f:18.5, i:18, r:'SA'},
    {n:'Egypt', f:19.5, i:17.5, r:'Africa, SY, IQ, LB'},
    {n:'MUIS', f:20, i:18, r:'SG'},
    {n:'MSC', f:null, i:null, r:'Global'},
];

function getTimesAll(date, lat, lng, tz, elevation = 50, temperature = 15, pressure = 1013.25, standard = true) {
    // Step 1: Get the custom angles
    const { fajrAngle, ishaAngle } = getAngles(elevation, pressure, temperature);
    const methodAngles = methods.map(m => [m.f + 90, m.i + 90]);

    // Step 2: Get SPA data with custom angle for Fajr/Isha and other methods
    const spaParams = { elevation, temperature, pressure };
    const spaData = getSpa(date, lat, lng, tz, spaParams, [fajrAngle + 90, ishaAngle + 90, ...methodAngles.flat()]);

    // Organize prayer times
    const fajrTime = spaData.angles[0].sunrise;
    const sunriseTime = spaData.sunrise;
    const noonTime = spaData.solarNoon;
    const dhuhrTime = spaData.solarNoon + ((1 / 60) * 2.5);
    const maghribTime = spaData.sunset;
    const ishaTime = spaData.angles[1].sunset;

    // Step 3: Calculate Asr time
    const solarNoonHours = Math.floor(spaData.solarNoon);
    const solarNoonMinutes = Math.floor((spaData.solarNoon - solarNoonHours) * 60);
    const solarNoonSeconds = Math.floor((spaData.solarNoon * 3600) - (solarNoonHours * 3600) - (solarNoonMinutes * 60));
    const solarNoonDate = new Date(date);
    solarNoonDate.setHours(solarNoonHours, solarNoonMinutes, solarNoonSeconds);
    const asrPrayerTime = getAsr(solarNoonDate, lat, lng, tz, standard);

    // Step 4: Calculate Qiyam time
    const qiyamTime = getQiyam(fajrTime, ishaTime);

    // Final prayer times object
    const prayerTimes = {
        Qiyam: qiyamTime,
        Fajr: fajrTime,
        Sunrise: sunriseTime,
        Noon: noonTime,
        Dhuhr: dhuhrTime,
        Asr: asrPrayerTime,
        Maghrib: maghribTime,
        Isha: ishaTime,
        Methods: {},
        Angles: [ fajrAngle, ishaAngle ]
    };

    // Adding other methods
    methods.forEach((method, index) => {
        const fajrIndex = 2 + (index * 2);
        const ishaIndex = 3 + (index * 2);

        let fajrMethodTime = spaData.angles[fajrIndex].sunrise;
        let ishaMethodTime = spaData.angles[ishaIndex].sunset;

        // Adjusting Isha time for Umm Al-Qura method
        if (method.n === 'UAQ') {
            ishaMethodTime = spaData.sunset + ((1 / 60) * 90);
        }
        else if (method.n === 'MSC') {
            // Calculate Fajr and Isha for MSC method
            const fajrMSCMinutes = getFajr(date, lat);
            const ishaMSCMinutes = getIsha(date, lat);

            fajrMethodTime = spaData.sunrise - ((1 / 60) * fajrMSCMinutes);
            ishaMethodTime = spaData.sunset + ((1 / 60) * ishaMSCMinutes);
        }

        prayerTimes.Methods[method.n] = [fajrMethodTime, ishaMethodTime];
    });

    return prayerTimes;
}

module.exports = {
    getTimesAll
};
