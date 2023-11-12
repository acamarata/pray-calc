const { getEarthSunDistance } = require('./getEarthSunDistance');

function getMoon(date, accurate = false) {
    const PI = Math.PI;
    const rad = PI / 180;
    const e = rad * 23.4397; // obliquity of the Earth

    function toDays(date) {
        return (date - new Date(2000, 0, 1)) / 86400000;
    }

    function rightAscension(l, b) {
        return Math.atan2(Math.sin(l) * Math.cos(e) - Math.tan(b) * Math.sin(e), Math.cos(l));
    }

    function declination(l, b) {
        return Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l));
    }

    function sunCoords(d) {
        const M = rad * (357.5291 + 0.98560028 * d);
        const L = rad * (280.1470 + 360.9856235 * d) + (1.9148 - 0.004817 * d / 36525) * Math.sin(M) + 0.019993 - 0.000101 * d / 36525 * Math.cos(M);
        return {
            dec: declination(L, 0),
            ra: rightAscension(L, 0)
        };
    }

    function moonCoords(d) { 
        const L = rad * (218.316 + 13.176396 * d);
        const M = rad * (134.963 + 13.064993 * d);
        const F = rad * (93.272 + 13.229350 * d);

        const l = L + rad * 6.289 * Math.sin(M); // Moon's mean longitude
        const b = rad * 5.128 * Math.sin(F);     // Moon's mean latitude
        const dt = 385001 - 20905 * Math.cos(M); // Distance to the moon in km

        return {
            ra: rightAscension(l, b),
            dec: declination(l, b),
            dist: dt
        };
    }

    const d = toDays(date);
    const s = sunCoords(d);
    const m = moonCoords(d);

    // distance from Earth to Sun in km
    const sdist = accurate ? getEarthSunDistance(date) : 149598000;

    const phi = Math.acos(Math.sin(s.dec) * Math.sin(m.dec) + Math.cos(s.dec) * Math.cos(m.dec) * Math.cos(s.ra - m.ra));
    const inc = Math.atan2(sdist * Math.sin(phi), m.dist - sdist * Math.cos(phi));
    const angle = Math.atan2(Math.cos(s.dec) * Math.sin(s.ra - m.ra), Math.sin(s.dec) * Math.cos(m.dec) - Math.cos(s.dec) * Math.sin(m.dec) * Math.cos(s.ra - m.ra));

    return {
        fraction: (1 + Math.cos(inc)) / 2,
        phase: 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / Math.PI,
        angle: angle
    };
}
