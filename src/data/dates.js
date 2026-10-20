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

const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

/** "just now", "5 minutes ago", "3 hours ago", "yesterday", "2 weeks ago"… for an ISO timestamp. */
export function timeAgo(isoTimestamp, now = Date.now()) {
  const seconds = Math.round((now - Date.parse(isoTimestamp)) / 1000);
  if (seconds < 45) return 'just now';
  const steps = [
    [60 * 60, 60, 'minute'],
    [24 * 60 * 60, 60 * 60, 'hour'],
    [7 * 24 * 60 * 60, 24 * 60 * 60, 'day'],
    [30 * 24 * 60 * 60, 7 * 24 * 60 * 60, 'week'],
    [365 * 24 * 60 * 60, 30 * 24 * 60 * 60, 'month'],
    [Infinity, 365 * 24 * 60 * 60, 'year'],
  ];
  const [, size, unit] = steps.find(([limit]) => seconds < limit);
  return relative.format(-Math.max(1, Math.round(seconds / size)), unit);
}

/** Whole calendar days from `fromISO` to `toISOString` (negative if `to` is earlier). */
export function daysBetween(fromISO, toISOString) {
  const utc = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((utc(toISOString) - utc(fromISO)) / DAY_MS);
}
