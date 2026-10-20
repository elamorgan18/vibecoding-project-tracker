/** Pure helpers for creating and updating tasks. */

/** Today as a local ISO date 'YYYY-MM-DD' (not UTC, so late-night dates don't jump a day). */
export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Next readable task ID, e.g. 'vt-5' when the highest existing one is 'vt-4'. */
export function nextTaskId(tasks) {
  const max = tasks.reduce((highest, task) => {
    const n = Number(task.id.replace(/^vt-/, ''));
    return Number.isFinite(n) ? Math.max(highest, n) : highest;
  }, 0);
  return `vt-${max + 1}`;
}

/** Insert a new task or replace an existing one with the same id. */
export function upsertTask(tasks, task) {
  return tasks.some((t) => t.id === task.id)
    ? tasks.map((t) => (t.id === task.id ? task : t))
    : [...tasks, task];
}

export function removeTask(tasks, id) {
  return tasks.filter((t) => t.id !== id);
}
