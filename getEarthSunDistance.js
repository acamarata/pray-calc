function getEarthSunDistance(date) {
    // Constants
    const a = 149597870.7; // Semi-major axis of Earth's orbit in km
    const e = 0.0167086;   // Orbital eccentricity of Earth

    // Calculate the day of the year
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 86400000; // Milliseconds in one day
    const dayOfYear = Math.floor(diff / oneDay);

    // Approximate the mean anomaly
    const g = 357.529 + 0.98560028 * dayOfYear;

    // Convert to radians
    const gInRadians = g * Math.PI / 180;

    // Use the approximation for the true anomaly (v)
    const v = gInRadians + (1.914 * Math.sin(gInRadians)); // in radians

    // Calculate the distance
    const r = a * (1 - e * e) / (1 + e * Math.cos(v));

    return r;
}

module.exports = {
    getEarthSunDistance
};
