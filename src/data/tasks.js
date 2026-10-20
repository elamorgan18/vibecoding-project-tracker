/** Pure helpers for creating and updating tasks. */

import { nextId } from './ids.js';

/** Next readable task ID, e.g. 'vt-5' when the highest existing one is 'vt-4'. */
export function nextTaskId(tasks) {
  return nextId(tasks, 'vt');
}

/** Reassign one task to a different member. */
export function reassignTask(tasks, id, memberId) {
  return tasks.map((t) => (t.id === id ? { ...t, assignee: memberId } : t));
}

/**
 * Move a task to another column (M12 drag and drop). It goes to the end of the
 * list so it lands at the bottom of its new column. Same column: no change.
 */
export function moveTask(tasks, id, status) {
  const task = tasks.find((t) => t.id === id);
  if (!task || task.status === status) return tasks;
  return [...tasks.filter((t) => t.id !== id), { ...task, status }];
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
