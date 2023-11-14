/**
 * Calculates the current phase of the moon as a fraction.
 * @param {Date} date - The date for which to calculate the moon phase.
 * @returns {number} The moon phase as a fraction from 0 (new moon) to just under 1 (end of lunar cycle).
 */
function getMoonPhase(date) {
    const synodicMonth = 29.53058821398858; // Average length of a synodic month in days
    // Most recent known new moon: November 13, 2023, 09:27 AM UTC
    const knownNewMoon = new Date(Date.UTC(2023, 10, 13, 9, 27, 0)); 

    // Convert both dates to the number of milliseconds since Unix Epoch and find the difference
    const diffInMilliseconds = date - knownNewMoon;

    // Convert the difference to days
    const diffInDays = diffInMilliseconds / 1000 / 60 / 60 / 24;

    // Calculate the phase as a fraction of the synodic month
    const phase = (diffInDays % synodicMonth) / synodicMonth;

    return phase;
}

module.exports = { getMoonPhase };
