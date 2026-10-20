import { useState, useEffect } from 'react';

// Checked by name/code rather than `instanceof DOMException`, which can fail
// across realms. 22 / 1014 are the legacy Chrome-Safari / Firefox codes.
function isQuotaError(e) {
  return (
    e != null &&
    (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22 || e.code === 1014)
  );
}

/**
 * Write a value to localStorage now. Returns { ok: true } or
 * { ok: false, error } with a message a user can act on.
 */
export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: isQuotaError(e)
        ? "Your browser's storage for this site is full."
        : 'Your browser blocked saving (for example in a private window).',
    };
  }
}

/**
 * A tiny localStorage hook — survives reloads, no library needed.
 * The third value is a user-facing error message when the last write failed
 * (e.g. storage full), otherwise null.
 *
 * Usage:
 *   const [tasks, setTasks, tasksError] = useLocalStorage('vibetracker.tasks', []);
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const result = writeStorage(key, value);
    setError(result.ok ? null : result.error);
  }, [key, value]);

  return [value, setValue, error];
}
