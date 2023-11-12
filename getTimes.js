const { getSpa } = require('nrel-spa');
const { getAngles } = require('./getAngles');
const { getAsr } = require('./getAsr');
const { getQiyam } = require('./getQiyam');

function getTimes(date, lat, lng, elevation = 50, temperature = 15, pressure = 1013.25, standard = true) {
    // Step 1: Get the custom angles
    const { fajrAngle, ishaAngle } = getAngles(elevation, pressure, temperature);

    // Step 2: Get SPA data with custom angle for Fajr/Isha
    const spaParams = { elevation, temperature, pressure };
    const spaData = getSpa(date, lat, lng, spaParams, [fajrAngle+90, ishaAngle+90]);

    // Organize prayer times
    const fajrTime = spaData.angles[0].sunrise; // Lower time from custom angle
    const sunriseTime = spaData.sunrise;
    const noonTime = spaData.solarNoon;
    const dhuhrTime = spaData.solarNoon + ((1/60) * 2.5); // 2.5 minutes as a fraction of an hour
    const maghribTime = spaData.sunset;
    const ishaTime = spaData.angles[1].sunset; // Higher time from custom angle

    // Step 3: Calculate Asr time
    const solarNoonHours = Math.floor(spaData.solarNoon);
    const solarNoonMinutes = Math.floor((spaData.solarNoon - solarNoonHours) * 60);
    const solarNoonSeconds = Math.floor((spaData.solarNoon * 3600) - (solarNoonHours * 3600) - (solarNoonMinutes * 60));
    const solarNoonDate = new Date(date);
    solarNoonDate.setHours(solarNoonHours, solarNoonMinutes, solarNoonSeconds);
    const asrPrayerTime = getAsr(solarNoonDate, lat, lng, standard);
    
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
        Angles: [fajrAngle, ishaAngle]
    };

    return prayerTimes;
}

module.exports = {
    getTimes
};
