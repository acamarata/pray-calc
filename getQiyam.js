function getQiyam(fajrTime, ishaTime) {
    // Adjust Fajr time if it is earlier than Isha time
    const adjustedFajrTime = fajrTime < ishaTime ? fajrTime + 24 : fajrTime;

    // Calculate the length of the night
    const nightLength = adjustedFajrTime - ishaTime;

    // Calculate the start of the last third of the night
    const lastThirdStart = ishaTime + (2 * nightLength / 3);

    // If the result is greater than 24, adjust it to get the correct time
    return lastThirdStart > 24 ? lastThirdStart - 24 : lastThirdStart;
}

module.exports = {
    getQiyam
};
