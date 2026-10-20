/** Pure helpers for creating and updating tasks. */

import { nextId } from './ids.js';

/** Today as a local ISO date 'YYYY-MM-DD' (not UTC, so late-night dates don't jump a day). */
export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Next readable task ID, e.g. 'vt-5' when the highest existing one is 'vt-4'. */
export function nextTaskId(tasks) {
  return nextId(tasks, 'vt');
}

/** Reassign one task to a different member. */
export function reassignTask(tasks, id, memberId) {
  return tasks.map((t) => (t.id === id ? { ...t, assignee: memberId } : t));
}

/** Unassign every task owned by a member (used when they leave the team). */
export function unassignMember(tasks, memberId) {
  return tasks.map((t) => (t.assignee === memberId ? { ...t, assignee: null } : t));
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
