/**
 * High-latitude rules for Fajr and Isha.
 *
 * Above roughly 48.5 degrees the sun stops reaching 18 degrees below the horizon in
 * summer; above the polar circles it stops rising or setting altogether for weeks. In
 * those conditions there is no observable dawn or nightfall, so no calculation can
 * produce Fajr or Isha — every answer is a juristic substitution rather than an
 * astronomical result.
 *
 * This module implements the substitutions. It never picks one on its own: the default
 * is `none`, which reports the times as absent and leaves the choice to the caller. Every
 * substituted time is tagged with the rule that produced it (see `TimeProvenance`) so a
 * caller can always tell a computed time from a supplied one.
 *
 * Two families, with different reach:
 *
 * - **Night proportions** (`middleOfNight`, `oneSeventh`, `angleBased`) divide the night
 *   between sunset and sunrise. They need a real sunset and sunrise to measure, so they
 *   cover "no true darkness" latitudes such as Helsinki in June and do nothing at all for
 *   Svalbard in July, where neither event occurs.
 * - **Nearest substitutions** (`aqrabAlBilad`, `aqrabAlAyyam`) borrow from a place or a
 *   date where the sign is observable. These are the only rules that cover the polar
 *   circles.
 *
 * ## Output convention
 *
 * Returned times are fractional hours measured from midnight of the requested civil date
 * and are deliberately NOT wrapped into [0, 24). The observed path already works this way:
 * at Helsinki in mid-May `getTimes` returns an Isha of 24.163, meaning 00:09 the following
 * morning. Wrapping a substituted time onto the same day instead put Isha *before* Fajr,
 * which is exactly the "times are out of order" symptom that makes a polar timetable look
 * broken. Leaving it un-wrapped keeps `Fajr < Isha` true by construction and leaves the
 * day-rollover decision to the caller, which is the only place it can be rendered.
 */

import type { FractionalHours, PrayerTimes } from "./types.js";

/** Rule used to supply Fajr and Isha when no observable time exists. */
export type HighLatitudeRule =
  /** Report unreachable times as absent. The default: substitute nothing. */
  | "none"
  /** Split the night in half: Fajr at midnight, Isha at midnight. */
  | "middleOfNight"
  /** One seventh of the night: Isha after the first seventh, Fajr before the last. */
  | "oneSeventh"
  /** Portion of the night proportional to the method's depression angle. */
  | "angleBased"
  /** Nearest latitude (Aqrab al-Bilad): recompute at the 45th parallel. */
  | "aqrabAlBilad"
  /** Nearest day (Aqrab al-Ayyam): borrow the closest date with an observable sign. */
  | "aqrabAlAyyam";

/** Where a given time came from. */
export type TimeSource =
  /** Solved from the sun's actual position on this date at this location. */
  | "observed"
  | "middleOfNight"
  | "oneSeventh"
  | "angleBased"
  | "aqrabAlBilad"
  | "aqrabAlAyyam"
  /** No observable time and no rule able to supply one. */
  | "unavailable";

/** Origin of each substitutable time in a result. */
export interface TimeProvenance {
  Fajr: TimeSource;
  Isha: TimeSource;
}

/** Latitude the Aqrab al-Bilad rule falls back to, in degrees. */
export const AQRAB_AL_BILAD_LATITUDE = 45;

/** How far Aqrab al-Ayyam will search for a usable date, in days each way. */
const AQRAB_AL_AYYAM_MAX_SEARCH_DAYS = 200;

/** Recomputes a day at arbitrary coordinates/date. Supplied by the caller to keep this
 *  module free of a circular import back into getTimes. */
export type DayResolver = (
  date: Date,
  lat: number,
  lng: number,
) => Pick<PrayerTimes, "Fajr" | "Isha" | "Noon">;

export interface HighLatitudeContext {
  rule: HighLatitudeRule;
  date: Date;
  lat: number;
  lng: number;
  /** Depression angles used for this calculation, for the angleBased rule. */
  fajrAngle: number;
  ishaAngle: number;
  resolveDay: DayResolver;
}

export interface HighLatitudeResult {
  Fajr: FractionalHours;
  Isha: FractionalHours;
  provenance: TimeProvenance;
}

function isUsable(value: number): boolean {
  return Number.isFinite(value);
}

/**
 * Fraction of the night to offset from sunset/sunrise for the night-proportion rules.
 * Returns NaN for rules that are not night proportions.
 */
function nightPortion(rule: HighLatitudeRule, angleDeg: number): number {
  switch (rule) {
    case "angleBased":
      return angleDeg / 60;
    case "oneSeventh":
      return 1 / 7;
    case "middleOfNight":
      return 1 / 2;
    default:
      return NaN;
  }
}

/**
 * Night-proportion substitution. Requires a real sunset and sunrise to measure against.
 */
function applyNightPortion(
  rule: HighLatitudeRule,
  sunrise: FractionalHours,
  maghrib: FractionalHours,
  angleDeg: number,
  isFajr: boolean,
): FractionalHours {
  if (!isUsable(sunrise) || !isUsable(maghrib)) return NaN;
  const portion = nightPortion(rule, angleDeg);
  if (!isUsable(portion)) return NaN;
  // At extreme latitudes sunset can land just after local midnight and come back as a
  // small value numerically below sunrise. Unwrap onto one continuous axis first.
  const maghribUnwrapped = maghrib < sunrise ? maghrib + 24 : maghrib;
  const nightLength = 24 - (maghribUnwrapped - sunrise);
  const offset = portion * nightLength;
  return isFajr ? sunrise - offset : maghribUnwrapped + offset;
}

/**
 * Aqrab al-Bilad — nearest location. Recompute the same date at the 45th parallel,
 * keeping longitude (and therefore the local solar day) intact, and take its Fajr/Isha.
 *
 * The 45-degree convention is the one most North American and European institutions use.
 * The sign of the observer's own latitude is preserved so a southern-hemisphere observer
 * borrows from 45 degrees south, matching their season.
 */
function applyAqrabAlBilad(ctx: HighLatitudeContext): { Fajr: number; Isha: number } {
  const fallbackLat =
    Math.sign(ctx.lat || 1) * Math.min(Math.abs(ctx.lat), AQRAB_AL_BILAD_LATITUDE);
  const day = ctx.resolveDay(ctx.date, fallbackLat, ctx.lng);
  return { Fajr: day.Fajr, Isha: day.Isha };
}

/**
 * Aqrab al-Ayyam — nearest day. Walk outward from the requested date, one day at a time
 * in both directions, until a date at this same location yields an observable time.
 *
 * The borrowed time is carried across as an offset from solar noon rather than as a
 * clock reading. Solar noon exists every day at every latitude, so the offset transfers
 * cleanly and stays anchored to the observer's own solar day instead of drifting with the
 * calendar.
 */
function applyAqrabAlAyyam(ctx: HighLatitudeContext): { Fajr: number; Isha: number } {
  const today = ctx.resolveDay(ctx.date, ctx.lat, ctx.lng);
  let fajr = today.Fajr;
  let isha = today.Isha;
  if (isUsable(fajr) && isUsable(isha)) return { Fajr: fajr, Isha: isha };

  const baseNoon = today.Noon;
  if (!isUsable(baseNoon)) return { Fajr: NaN, Isha: NaN };

  for (let delta = 1; delta <= AQRAB_AL_AYYAM_MAX_SEARCH_DAYS; delta++) {
    for (const direction of [-1, 1] as const) {
      if (isUsable(fajr) && isUsable(isha)) break;
      const probeDate = new Date(ctx.date.getTime());
      probeDate.setUTCDate(probeDate.getUTCDate() + direction * delta);
      const probe = ctx.resolveDay(probeDate, ctx.lat, ctx.lng);
      if (!isUsable(probe.Noon)) continue;
      if (!isUsable(fajr) && isUsable(probe.Fajr)) {
        fajr = baseNoon + (probe.Fajr - probe.Noon);
      }
      if (!isUsable(isha) && isUsable(probe.Isha)) {
        isha = baseNoon + (probe.Isha - probe.Noon);
      }
    }
    if (isUsable(fajr) && isUsable(isha)) break;
  }

  // Un-wrapped by design: `probe.Fajr < probe.Noon < probe.Isha`, so carrying both across
  // as offsets from this day's noon preserves Fajr < Isha even when Isha lands past midnight.
  return { Fajr: fajr, Isha: isha };
}

/**
 * Supply Fajr and Isha where the sun provides no observable time.
 *
 * Times that were solved astronomically are passed through untouched and reported as
 * `observed`. Only genuinely absent values are substituted, and only by the rule the
 * caller asked for.
 *
 * @param ctx     - Rule, location, date, angles, and a resolver for other days/places
 * @param fajr    - Astronomically solved Fajr, or NaN if unreachable
 * @param isha    - Astronomically solved Isha, or NaN if unreachable
 * @param sunrise - Sunrise for this date, or NaN (night-proportion rules need it)
 * @param maghrib - Sunset for this date, or NaN (night-proportion rules need it)
 * @returns Fajr and Isha with a `provenance` record naming each one's origin
 */
export function applyHighLatitudeRule(
  ctx: HighLatitudeContext,
  fajr: FractionalHours,
  isha: FractionalHours,
  sunrise: FractionalHours,
  maghrib: FractionalHours,
): HighLatitudeResult {
  const fajrObserved = isUsable(fajr);
  const ishaObserved = isUsable(isha);

  if (fajrObserved && ishaObserved) {
    return { Fajr: fajr, Isha: isha, provenance: { Fajr: "observed", Isha: "observed" } };
  }

  if (ctx.rule === "none") {
    return {
      Fajr: fajr,
      Isha: isha,
      provenance: {
        Fajr: fajrObserved ? "observed" : "unavailable",
        Isha: ishaObserved ? "observed" : "unavailable",
      },
    };
  }

  let suppliedFajr = NaN;
  let suppliedIsha = NaN;

  if (ctx.rule === "aqrabAlBilad") {
    const r = applyAqrabAlBilad(ctx);
    suppliedFajr = r.Fajr;
    suppliedIsha = r.Isha;
  } else if (ctx.rule === "aqrabAlAyyam") {
    const r = applyAqrabAlAyyam(ctx);
    suppliedFajr = r.Fajr;
    suppliedIsha = r.Isha;
  } else {
    suppliedFajr = applyNightPortion(ctx.rule, sunrise, maghrib, ctx.fajrAngle, true);
    suppliedIsha = applyNightPortion(ctx.rule, sunrise, maghrib, ctx.ishaAngle, false);
  }

  const resolvedFajr = fajrObserved ? fajr : suppliedFajr;
  const resolvedIsha = ishaObserved ? isha : suppliedIsha;

  return {
    Fajr: resolvedFajr,
    Isha: resolvedIsha,
    provenance: {
      Fajr: fajrObserved ? "observed" : isUsable(resolvedFajr) ? ctx.rule : "unavailable",
      Isha: ishaObserved ? "observed" : isUsable(resolvedIsha) ? ctx.rule : "unavailable",
    },
  };
}
