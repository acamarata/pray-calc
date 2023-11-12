function getAngles(elevation = 0, pressure = 1013.25, temperature = 15) {
    const baseAngle = 18; // Base angle for astronomical twilight

    // Calculate refraction adjusted angle at the horizon (altitude = 0)
    const refraction = calculateAtmosphericRefraction(0, pressure, temperature);

    // Elevation adjustment (approximate)
    const elevationAdjustment = elevation / 1000 * 0.1; // Rough estimate

    // Adjust angles for Fajr and Isha
    const fajrAngle = baseAngle + refraction + elevationAdjustment;
    const ishaAngle = baseAngle - refraction - elevationAdjustment;

    return { fajrAngle, ishaAngle };
}

function calculateAtmosphericRefraction(altitude, pressure = 1013.25, temperature = 10) {
    const altInRadians = altitude * Math.PI / 180;
    let R = 1.0 / Math.tan(altInRadians + 7.31 / (altInRadians + 0.077));
    R = R / 60; // Convert from arcminutes to degrees
    R = (pressure / 1010) * (283 / (273 + temperature)) * R;
    return R;
}

module.exports = {
    getAngles
};
