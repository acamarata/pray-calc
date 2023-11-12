const { getSpa, fractalTime } = require('nrel-spa');

function getAsr(solarNoonDate, latitude, longitude, standard = true) {
    const solarNoonAltitude = getSpa(solarNoonDate, latitude, longitude).zenith;
    const shadowLengthAtNoon = 1 / Math.tan((90 - solarNoonAltitude) * Math.PI / 180);

    // For standard method: Shadow length = object height + shadow length at noon
    // For Hanafi method: Shadow length = 2 * object height + shadow length at noon
    const targetShadowLength = standard ? 1 + shadowLengthAtNoon : 2 + shadowLengthAtNoon;

    // Increment time from noon to find Asr time
    let asrTime;
    for (let i = 0; i < 720; i++) { // Check next 12 hours
        const testTime = new Date(solarNoonDate.getTime() + i * 60000); // Increment by one minute
        const currentAltitude = getSpa(testTime, latitude, longitude).zenith;
        const currentShadowLength = 1 / Math.tan((90 - currentAltitude) * Math.PI / 180);

        if (currentShadowLength >= targetShadowLength) {
            asrTime = testTime;
            break;
        }
    }

    return asrTime ? asrTime.getHours() + asrTime.getMinutes() / 60 + asrTime.getSeconds() / 3600 : null;
}

module.exports = {
    getAsr
};
