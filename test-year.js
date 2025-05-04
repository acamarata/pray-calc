// test-year.js
const { calcTimes } = require('./index');

/**
 * Get the DST‑aware offset (hours east of UTC) for America/New_York
 * at the given UTC date.
 */
function getNYCOffsetHours(dateUtc) {
  const str = dateUtc.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    timeZoneName: 'shortOffset',
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  // Matches "GMT-05:00" or "GMT-5"
  const m = str.match(/GMT([+-]\d{1,2})(?::(\d{2}))?$/);
  if (!m) throw new Error(`Cannot parse offset from "${str}"`);
  const hrs = parseInt(m[1], 10);
  const mins = m[2] ? parseInt(m[2], 10) : 0;
  return hrs + mins / 60;
}

/**
 * Format a UTC date as "Mon D" (e.g. "Jan  1"), in NY time, padded to 7 chars.
 */
function formatLabel(dateUtc) {
  const parts = dateUtc.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'short',
    day: 'numeric'
  }).split(' ');
  const mon = parts[0];
  const day = parts[1].padStart(2, ' ');
  return `${mon} ${day}`.padEnd(7);
}

/**
 * Format a prayer time (string "HH:MM:SS.xxx" or Date) as "HH:MM:SS" in NY time.
 */
function formatTime(val) {
  if (typeof val === 'string') {
    return val.slice(0, 8);              // strip fractional seconds
  }
  const dt = new Date(val);
  if (isNaN(dt)) return 'Invalid';
  return dt.toLocaleTimeString('en-GB', {
    timeZone: 'America/New_York',
    hour12: false,
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
}

function getNYCPrayerTimesForYear(year) {
  const lat = 40.7128, lng = -74.0060;
  const elevation = 10, temperature = 15, pressure = 1013.25;

  console.log(`\nNYC Prayer Times for ${year}\n`);
  const header = 'Date   | Fajr     | Sunrise  | Dhuhr    | Asr      | Maghrib  | Isha';
  console.log(header);
  console.log('-'.repeat(header.length));

  for (let m = 0; m < 12; m++) {
    const daysInMonth = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
    for (let d = 1; d <= daysInMonth; d++) {
      // Use UTC midnight so we handle TZ separately
      const dateUtc = new Date(Date.UTC(year, m, d, 0, 0, 0));
      const tzOffset = getNYCOffsetHours(dateUtc);

      // calcTimes(date, lat, lng, tzOffset, elevation, temperature, pressure)
      const times = calcTimes(dateUtc, lat, lng, tzOffset, elevation, temperature, pressure);

      // Support both PascalCase and camelCase keys
      const fajr     = times.Fajr     ?? times.fajr;
      const sunrise  = times.Sunrise  ?? times.sunrise;
      const dhuhr    = times.Dhuhr    ?? times.dhuhr;
      const asr      = times.Asr      ?? times.asr;
      const maghrib  = times.Maghrib  ?? times.maghrib;
      const isha     = times.Isha     ?? times.isha;

      const cols = [fajr, sunrise, dhuhr, asr, maghrib, isha]
        .map(v => formatTime(v).padEnd(9));

      console.log(
        `${formatLabel(dateUtc)}| ${cols[0]}| ${cols[1]}| ${cols[2]}| ${cols[3]}| ${cols[4]}| ${cols[5]}`
      );
    }
  }
}

// Accept a year argument, default to the current UTC year
const arg = parseInt(process.argv[2], 10);
const year = Number.isNaN(arg) ? new Date().getUTCFullYear() : arg;
getNYCPrayerTimesForYear(year);