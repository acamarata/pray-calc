const { calcTimes } = require('./index');

function formatTime(timeString) {
    return timeString.slice(0, -4); // Trims the last 4 characters (".427")
}

function getNYCPrayerTimesForYear(year) {
    const lat = 40.7128; // Latitude for New York City
    const lng = -74.0060; // Longitude for New York City
    const elevation = 10; // Average elevation for NYC in meters
    const temperature = 15; // Average temperature for NYC in Celsius
    const pressure = 1013.25; // Average atmospheric pressure in millibars

    let prayerTimesForYear = `NYC Prayer Times for ${year}:\n\n`;

    for (let month = 0; month < 12; month++) {
        for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
            const date = new Date(year, month, day);
            const formattedDate = date.toDateString().substring(4, 10); // "Dec 31"
            const prayerTimes = calcTimes(date, lat, lng, elevation, temperature, pressure);

            prayerTimesForYear += `${formattedDate} = `;
            prayerTimesForYear += `${formatTime(prayerTimes.Fajr)} / `;
            prayerTimesForYear += `${formatTime(prayerTimes.Dhuhr)} / `;
            prayerTimesForYear += `${formatTime(prayerTimes.Asr)} / `;
            prayerTimesForYear += `${formatTime(prayerTimes.Maghrib)} / `;
            prayerTimesForYear += `${formatTime(prayerTimes.Isha)}\n`;
        }
    }

    return prayerTimesForYear;
}

console.log(getNYCPrayerTimesForYear(2023));
