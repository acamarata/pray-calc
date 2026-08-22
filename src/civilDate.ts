/**
 * Civil-date normalisation.
 *
 * Prayer times are a property of a calendar date at a place, not of an instant. Feeding
 * SPA the caller's raw `Date` made the result depend on two things it must not depend on:
 * the host machine's timezone, and the time of day the question happened to be asked.
 *
 * Both were observable. A caller in Tokyo writing `new Date(2024, 2, 20)` produced the
 * instant `2024-03-19T15:00Z`, so SPA computed the *previous* calendar day and New York's
 * sunrise came back 1m39s early at the equinox. And because the twilight-angle model read
 * the instant rather than the day, asking for that same 20 March at 00:00Z and again at
 * 23:00Z returned Isha times 79 seconds apart — which surfaced in apps as a countdown
 * that drifted as the day wore on.
 *
 * Normalising fixes both: take the calendar day the caller expressed and pin it to UTC
 * noon. Noon rather than midnight because it is the furthest point from either day
 * boundary, so no rounding or delta-T correction can push the instant into an adjacent
 * day, and it sits closest to solar transit, where the ephemeris is evaluated anyway.
 *
 * ## Which day did the caller mean?
 *
 * A JavaScript `Date` is an instant, not a date, and it carries no record of whether it
 * was built from local or UTC parts. `new Date(2024, 2, 20)` and `new Date('2024-03-20')`
 * are different instants that a reader would call the same day. Something has to decide.
 *
 * This library reads **local components**, because the observer's UTC offset is already a
 * separate explicit parameter (`tz`) — the date argument is therefore the observer's own
 * calendar day, which is exactly what `new Date(y, m, d)` and `new Date()` produce.
 *
 * That still leaves `new Date('2024-03-20')` ambiguous: it is UTC midnight, which reads as
 * 19 March on any host west of UTC. Rather than document a trap, pass the day itself:
 * every entry point also accepts a plain `'YYYY-MM-DD'` string, which names a calendar day
 * with no instant involved and no host timezone able to shift it.
 */

/** A calendar day: either a `Date` (read in local components) or a `'YYYY-MM-DD'` string. */
export type CivilDateInput = Date | string;

/** Matches a plain calendar day, with no time and no zone. */
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Pin a caller's date to UTC noon of the civil day they expressed.
 *
 * @param date - A `Date`, whose local calendar day is used and whose time-of-day is
 *               discarded, or a `'YYYY-MM-DD'` string naming the day outright
 * @returns UTC noon of that calendar day
 * @throws  If a string is passed that is not a valid `YYYY-MM-DD` calendar day
 */
export function toCivilDate(date: CivilDateInput): Date {
  if (typeof date === "string") {
    const m = DATE_ONLY.exec(date);
    if (!m) {
      throw new RangeError(
        `Expected a 'YYYY-MM-DD' calendar day or a Date, received '${date}'`,
      );
    }
    const [, y, mo, d] = m;
    const utc = new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d), 12, 0, 0));
    // Round-trip check: rejects 2024-02-31 and friends, which Date.UTC would roll over.
    if (utc.getUTCMonth() !== Number(mo) - 1 || utc.getUTCDate() !== Number(d)) {
      throw new RangeError(`'${date}' is not a real calendar day`);
    }
    return utc;
  }

  // Idempotence. An instant that is already exactly UTC noon is one this function
  // produced, so return it unchanged. Without this the high-latitude day-stepping rules
  // break on hosts at UTC+13 and UTC+14, where UTC noon reads as 01:00 or 02:00 of the
  // *following* local day and each re-normalisation would walk the date forward by one.
  if (
    date.getUTCHours() === 12 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0
  ) {
    return date;
  }

  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0));
}

/**
 * The default `tz` when a caller does not supply one: the host machine's current UTC
 * offset, in hours.
 *
 * Only meaningful when the caller is computing times for where they actually are. A
 * `'YYYY-MM-DD'` string carries no offset at all, so it falls back to the host's offset on
 * that day — which is why `tz` should be passed explicitly for any other location.
 */
export function defaultTimezone(date: CivilDateInput): number {
  const d = typeof date === "string" ? toCivilDate(date) : date;
  return -d.getTimezoneOffset() / 60;
}
