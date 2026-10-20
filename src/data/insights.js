/**
 * Insights (M12): numbers worked out from the team's own logged tasks.
 * Pure functions, shared by the Insights view and the task modal's
 * suggested AI tool.
 *
 * "Success rate" = Worked ÷ tasks with an outcome (Worked + Partial + Failed).
 * "Not tried yet" tasks don't count towards it.
 */

import { AI_TOOLS, contextValues } from './context.js';
import { STAGES } from './model.js';

/** A tool needs at least this many tasks with an outcome to be ranked or suggested. */
export const MIN_TASKS_FOR_RANKING = 3;

/** The outcomes that count as "tried", in chart / legend order. */
export const TRIED_OUTCOMES = [
  { id: 'worked', label: 'Worked' },
  { id: 'partial', label: 'Partial' },
  { id: 'failed', label: 'Failed' },
];

// "Other" is a catch-all, not one tool, so it is charted but never ranked or suggested.
const RANKABLE = (tool) => tool !== 'Other';

const percent = (n, total) => (total === 0 ? 0 : Math.round((n / total) * 100));

/** Member filter for the progress chart: 'all', 'unassigned' or a Member.id. */
export function tasksForMember(tasks, memberFilter) {
  if (memberFilter === 'all') return tasks;
  if (memberFilter === 'unassigned') return tasks.filter((t) => !t.assignee);
  return tasks.filter((t) => t.assignee === memberFilter);
}

/**
 * Tasks per status, in board order, plus % complete (Done ÷ all).
 * @returns {{ stages: {id, label, count}[], total: number, done: number, percentDone: number }}
 */
export function progressStats(tasks) {
  const stages = STAGES.map((s) => ({ ...s, count: tasks.filter((t) => t.status === s.id).length }));
  const done = stages.find((s) => s.id === 'done').count;
  return { stages, total: tasks.length, done, percentDone: percent(done, tasks.length) };
}

function emptyRow(tool) {
  return { tool, worked: 0, partial: 0, failed: 0, notTried: 0, tried: 0, successRate: null };
}

function finish(row) {
  row.tried = row.worked + row.partial + row.failed;
  row.successRate = row.tried === 0 ? null : percent(row.worked, row.tried);
  return row;
}

/**
 * Outcome counts for each AI tool that has at least one task, in AI_TOOLS
 * order. Tasks with no tool picked are left out. Pass `type` to count only
 * 'feature' or 'bug' tasks.
 */
export function toolStats(tasks, type = null) {
  const rows = Object.fromEntries(AI_TOOLS.map((tool) => [tool, emptyRow(tool)]));
  for (const task of tasks) {
    if (type && task.type !== type) continue;
    const { contextTool, aiOutcome } = contextValues(task);
    const row = rows[contextTool];
    if (!row) continue;
    if (aiOutcome === 'not-tried') row.notTried += 1;
    else row[aiOutcome] += 1;
  }
  return AI_TOOLS.map((tool) => finish(rows[tool])).filter((r) => r.tried + r.notTried > 0);
}

// Higher rate first; on a tie, the tool with more evidence; then AI_TOOLS order.
const byRateDesc = (a, b) => b.successRate - a.successRate || b.tried - a.tried;
const byRateAsc = (a, b) => a.successRate - b.successRate || b.tried - a.tried;

/** Tools that have enough tasks with an outcome to be compared. */
export function rankableTools(rows) {
  return rows.filter((r) => RANKABLE(r.tool) && r.tried >= MIN_TASKS_FOR_RANKING);
}

/**
 * The tools with the highest and lowest success rate, counting only tools
 * with at least MIN_TASKS_FOR_RANKING tasks with an outcome. `best` is null
 * when no tool qualifies; `worst` is null unless at least two do.
 */
export function bestAndWorst(rows) {
  const ranked = rankableTools(rows);
  if (ranked.length === 0) return { best: null, worst: null };
  const best = [...ranked].sort(byRateDesc)[0];
  if (ranked.length < 2) return { best, worst: null };
  const worst = [...ranked].filter((r) => r !== best).sort(byRateAsc)[0];
  return { best, worst };
}

/**
 * The tool with the best success rate on this team's past tasks of `type`,
 * with a reason like "Claude worked on 4 of 5 bug tasks". Null when no tool
 * has MIN_TASKS_FOR_RANKING tasks of that type with an outcome.
 * `excludeTaskId` leaves out the task being edited, so it doesn't vote for itself.
 */
export function suggestTool(tasks, type, excludeTaskId = null) {
  const history = tasks.filter((t) => t.id !== excludeTaskId);
  const [top] = rankableTools(toolStats(history, type)).sort(byRateDesc);
  if (!top) return null;
  const noun = `${type} task${top.tried === 1 ? '' : 's'}`;
  return {
    tool: top.tool,
    successRate: top.successRate,
    worked: top.worked,
    tried: top.tried,
    reason: `${top.tool} worked on ${top.worked} of ${top.tried} ${noun} (${top.successRate}%).`,
  };
}
