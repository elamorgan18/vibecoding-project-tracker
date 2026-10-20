import { daysBetween, todayISO } from './dates.js';
import { WARNING_WITHIN_DAYS } from './due.js';

/**
 * Board filters. Pure helpers, so the board, the result count and the chips
 * all agree on what matches.
 *
 * A task shows when it matches every active group. Inside one group the
 * options are OR'd (e.g. "Ela or Unassigned"). An empty group filters nothing.
 */

/** Stands in for `assignee: null` in the Team member filter. */
export const UNASSIGNED = 'unassigned';

/** Due date filter options, in menu order. */
export const DUE_FILTERS = [
  { id: 'overdue', label: 'Overdue' },
  { id: 'due-24h', label: 'Due within 24h' },
  { id: 'due-later', label: 'Due in more than 2 days' },
  { id: 'done', label: 'Done' },
  { id: 'no-date', label: 'No due date' },
];

/** @typedef {{ members: string[], due: string[] }} Filters  member ids (or UNASSIGNED) and DUE_FILTERS ids */
export const NO_FILTERS = { members: [], due: [] };

/**
 * Which due date option a task falls under. Every task gets at most one:
 *   done       — status is Done, with or without a due date
 *   no-date    — not done, no due date
 *   overdue    — due date is in the past
 *   due-24h    — due today or tomorrow (dates have no time, so this is the
 *                closest whole-day match)
 *   due-later  — more than WARNING_WITHIN_DAYS away (the 'calm' state)
 * A task due in exactly 2 days matches none of them.
 */
export function dueFilterId(task, today = todayISO()) {
  if (task.status === 'done') return 'done';
  if (!task.dueDate) return 'no-date';
  const days = daysBetween(today, task.dueDate);
  if (days < 0) return 'overdue';
  if (days <= 1) return 'due-24h';
  if (days > WARNING_WITHIN_DAYS) return 'due-later';
  return null;
}

export const hasFilters = (filters) => filters.members.length > 0 || filters.due.length > 0;

export function matchesFilters(task, filters, today = todayISO()) {
  const memberOk = filters.members.length === 0 || filters.members.includes(task.assignee ?? UNASSIGNED);
  const dueOk = filters.due.length === 0 || filters.due.includes(dueFilterId(task, today));
  return memberOk && dueOk;
}

/** `values` with `value` added, or removed if it was already there. */
export const toggleValue = (values, value) =>
  values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
