import { daysBetween, todayISO } from './dates.js';

/**
 * Due dates within this many days (today included) are 'warning';
 * anything further out is 'calm'.
 */
export const WARNING_WITHIN_DAYS = 2;

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * Due-date urgency for a task (DESIGN.md §2.4), or null when it has no due date.
 *   done     — status is Done, whatever the date (even if it was overdue)
 *   overdue  — due date is in the past
 *   warning  — due today or within WARNING_WITHIN_DAYS
 *   calm     — further out than that
 *
 * @returns {{ state: 'calm'|'warning'|'overdue'|'done', label: string } | null}
 */
export function dueState(task, today = todayISO()) {
  if (!task.dueDate) return null;
  if (task.status === 'done') return { state: 'done', label: 'Done' };

  const days = daysBetween(today, task.dueDate);
  if (days < 0) return { state: 'overdue', label: `Overdue by ${plural(-days, 'day')}` };
  if (days === 0) return { state: 'warning', label: 'Due today' };
  if (days === 1) return { state: 'warning', label: 'Due tomorrow' };
  if (days <= WARNING_WITHIN_DAYS) return { state: 'warning', label: `Due in ${plural(days, 'day')}` };
  return { state: 'calm', label: `Due in ${plural(days, 'day')}` };
}
