import { daysBetween, todayISO } from './dates.js';
import { WARNING_WITHIN_DAYS } from './due.js';
import { AI_TOOLS } from './context.js';

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

/** Stands in for `contextTool: null` in the AI tool filter. */
export const NO_AI_TOOL = 'no-ai-tool';

/** AI tool filter options, in menu order: every AI tool, then "No AI tool". */
export const AI_TOOL_FILTERS = [
  ...AI_TOOLS.map((tool) => ({ id: tool, label: tool })),
  { id: NO_AI_TOOL, label: 'No AI tool' },
];

/**
 * @typedef {{ members: string[], due: string[], tools: string[] }} Filters
 *   member ids (or UNASSIGNED), DUE_FILTERS ids and AI_TOOL_FILTERS ids
 */
export const NO_FILTERS = { members: [], due: [], tools: [] };

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

export const hasFilters = (filters) =>
  filters.members.length > 0 || filters.due.length > 0 || filters.tools.length > 0;

export function matchesFilters(task, filters, today = todayISO()) {
  const memberOk = filters.members.length === 0 || filters.members.includes(task.assignee ?? UNASSIGNED);
  const dueOk = filters.due.length === 0 || filters.due.includes(dueFilterId(task, today));
  const toolOk = filters.tools.length === 0 || filters.tools.includes(task.contextTool ?? NO_AI_TOOL);
  return memberOk && dueOk && toolOk;
}

/** `values` with `value` added, or removed if it was already there. */
export const toggleValue = (values, value) =>
  values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
