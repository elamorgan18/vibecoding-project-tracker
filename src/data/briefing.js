/**
 * "Copy Context" (M10): turn a task into a Markdown briefing that reads
 * naturally when pasted into an AI chat. Empty fields are left out.
 */

import { AI_OUTCOMES, CONTEXT_TEMPLATE, contextValues } from './context.js';
import { STAGES } from './model.js';

const TYPE_LABELS = { feature: 'Feature', bug: 'Bug' };

/** Context that is blank or still just the untouched template counts as empty. */
function hasRealContext(context) {
  const trimmed = context.trim();
  return trimmed !== '' && trimmed !== CONTEXT_TEMPLATE.trim();
}

/**
 * @param {Partial<import('./model.js').Task>} task
 * @returns {string} Markdown
 */
export function buildBriefing(task) {
  const { context, contextTool, aiOutcome, aiProblems } = contextValues(task);
  const title = task.title?.trim() || 'Untitled task';
  const status = STAGES.find((s) => s.id === task.status)?.label;
  const outcome = AI_OUTCOMES.find((o) => o.id === aiOutcome)?.label;

  const facts = [
    TYPE_LABELS[task.type] && `- **Type:** ${TYPE_LABELS[task.type]}`,
    status && `- **Status:** ${status}`,
    contextTool && `- **AI tool used so far:** ${contextTool}`,
    outcome && `- **Outcome so far:** ${outcome}`,
  ].filter(Boolean);

  const sections = [
    "I'd like your help with a task from our project tracker. Here's a briefing on where it stands.",
    `# ${title}`,
    facts.join('\n'),
  ];
  if (task.description?.trim()) {
    sections.push('## Description', task.description.trim());
  }
  // Context is included exactly as written (not trimmed or reformatted).
  if (hasRealContext(context)) {
    sections.push('## Context', context.replace(/\n+$/, ''));
  }
  if (aiProblems.trim()) {
    sections.push('## Problems we hit with the AI', aiProblems.replace(/\n+$/, ''));
  }
  sections.push('Please read this, ask me about anything that is unclear, then suggest the next step.');

  return sections.filter(Boolean).join('\n\n') + '\n';
}
