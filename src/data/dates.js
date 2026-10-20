/** Date helpers for ISO 'YYYY-MM-DD' strings, all in local calendar days. */

const DAY_MS = 24 * 60 * 60 * 1000;

function toISO(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Today as a local ISO date (not UTC, so late-night dates don't jump a day). */
export function todayISO() {
  return toISO(new Date());
}

/** `iso` shifted by `days` (negative = earlier). */
export function addDays(iso, days) {
  const [y, m, d] = iso.split('-').map(Number);
  return toISO(new Date(y, m - 1, d + days));
}

/** Whole calendar days from `fromISO` to `toISOString` (negative if `to` is earlier). */
export function daysBetween(fromISO, toISOString) {
  const utc = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((utc(toISOString) - utc(fromISO)) / DAY_MS);
}
