/**
 * The AI context stored on each task (M9): a Markdown briefing, the AI tool
 * used, how it went, and problems hit with the tool.
 */

export const AI_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Gemini', 'Other'];

export const AI_OUTCOMES = [
  { id: 'worked', label: 'Worked' },
  { id: 'partial', label: 'Partial' },
  { id: 'failed', label: 'Failed' },
  { id: 'not-tried', label: 'Not tried yet' },
];

/** Pre-filled into the Context box for new tasks. */
export const CONTEXT_TEMPLATE = `## Background


## Constraints


## Tried so far


## Pick up
`;

const CONTEXT_FIELDS = ['context', 'contextTool', 'aiOutcome', 'aiProblems'];

/** A task's context fields with defaults filled in (older tasks may not have them). */
export function contextValues(task) {
  return {
    context: task?.context ?? '',
    contextTool: task?.contextTool ?? null,
    aiOutcome: task?.aiOutcome ?? 'not-tried',
    aiProblems: task?.aiProblems ?? '',
  };
}

/** What a brand-new task's context looks like before anyone touches it. */
export const NEW_TASK_CONTEXT = {
  context: CONTEXT_TEMPLATE,
  contextTool: null,
  aiOutcome: 'not-tried',
  aiProblems: '',
};

/** True if any context field differs. Text is compared exactly (no trimming). */
export function contextChanged(before, after) {
  return CONTEXT_FIELDS.some((field) => before[field] !== after[field]);
}
