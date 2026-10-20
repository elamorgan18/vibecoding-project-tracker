import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, Copy, Eye, EyeOff, FileText, Lightbulb } from 'lucide-react';
import { AI_OUTCOMES, AI_TOOLS, CONTEXT_TEMPLATE } from '../data/context.js';
import { MIN_TASKS_FOR_RANKING } from '../data/insights.js';
import { timeAgo } from '../data/dates.js';
import { copyText } from '../utils/clipboard.js';
import FormField, { inputClass } from './FormField.jsx';
import MarkdownPreview from './MarkdownPreview.jsx';

const COPIED_MS = 2000;
const TICK_MS = 30_000;

const smallButton =
  'flex items-center gap-1 rounded border border-line bg-card px-2 py-1 text-xs font-medium text-ink-soft hover:bg-muted-bg hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand';

/** Re-render every `ms` so "last updated X ago" stays current while the modal is open. */
function useNow(ms) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

/**
 * The AI context part of the task modal: Markdown Context box (monospace,
 * no length limit, grows with content, resizable, Copy button, optional live
 * preview), AI tool, outcome and AI problems.
 *
 * `values` holds context / contextTool / aiOutcome / aiProblems;
 * `onChange(field, value)` updates one of them.
 *
 * `suggestion` (M12, from suggestTool() in insights.js) is the AI tool with
 * the best success rate on this team's past tasks of `taskType`, or null
 * when there isn't enough history yet.
 */
export default function ContextSection({ values, onChange, updatedAt, dirty, suggestion, taskType }) {
  const [showPreview, setShowPreview] = useState(false);
  const [copyState, setCopyState] = useState(null); // null | 'copied' | 'failed'
  const textareaRef = useRef(null);
  const toolRef = useRef(null);
  const now = useNow(TICK_MS);

  // Grow the box to fit its content (up to the CSS max height, then it
  // scrolls). Runs before paint so it doesn't flicker.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [values.context, showPreview]);

  useEffect(() => {
    if (!copyState) return undefined;
    const id = setTimeout(() => setCopyState(null), COPIED_MS);
    return () => clearTimeout(id);
  }, [copyState]);

  async function handleCopy() {
    try {
      await copyText(values.context);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  }

  const status = updatedAt ? `Last updated ${timeAgo(updatedAt, now)}` : 'Not updated yet';

  return (
    <section aria-labelledby="context-heading" className="space-y-4 border-t border-line pt-4">
      <div>
        <h3 id="context-heading" className="text-sm font-semibold uppercase tracking-wide text-ink">
          AI context
        </h3>
        <p className="text-xs text-muted">A briefing so the next person (or AI) can pick this up.</p>
      </div>

      <div>
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <label htmlFor="task-context" className="text-sm font-medium text-ink">
              Context
            </label>
            <span id="task-context-updated" className="text-xs text-muted">
              {status}
              {dirty && <span className="text-ink-soft"> · unsaved changes</span>}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!values.context && (
              <button type="button" onClick={() => onChange('context', CONTEXT_TEMPLATE)} className={smallButton}>
                <FileText aria-hidden="true" className="h-3.5 w-3.5" />
                Use template
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              aria-pressed={showPreview}
              className={smallButton}
            >
              {showPreview ? (
                <EyeOff aria-hidden="true" className="h-3.5 w-3.5" />
              ) : (
                <Eye aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              {showPreview ? 'Hide preview' : 'Preview'}
            </button>
            <button type="button" onClick={handleCopy} className={smallButton}>
              {copyState === 'copied' ? (
                <Check aria-hidden="true" className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              {copyState === 'copied' ? 'Copied!' : 'Copy'}
              <span className="sr-only"> Context box text</span>
            </button>
          </div>
        </div>

        <div className={showPreview ? 'grid grid-cols-1 gap-3 md:grid-cols-2' : ''}>
          <textarea
            ref={textareaRef}
            id="task-context"
            rows={10}
            value={values.context}
            onChange={(e) => onChange('context', e.target.value)}
            spellCheck={false}
            aria-describedby="task-context-updated task-context-copy-status"
            className={`${inputClass} block min-h-[10rem] max-h-[70vh] resize-y overflow-y-auto border-line font-mono`}
          />
          {showPreview && (
            <div
              id="task-context-preview"
              aria-label="Context preview"
              className="max-h-[70vh] min-h-[10rem] overflow-y-auto rounded border border-line bg-surface p-3"
            >
              <MarkdownPreview markdown={values.context} />
            </div>
          )}
        </div>

        <p id="task-context-copy-status" role="status" aria-live="polite" className="mt-1 text-sm">
          {copyState === 'copied' && <span className="sr-only">Copied! The context is on your clipboard.</span>}
          {copyState === 'failed' && (
            <span className="text-danger-text">Couldn't copy. Select the text and copy it manually.</span>
          )}
        </p>
      </div>

      <ToolSuggestion
        suggestion={suggestion}
        taskType={taskType}
        selectedTool={values.contextTool}
        onUse={(tool) => {
          onChange('contextTool', tool);
          toolRef.current?.focus();
        }}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField id="task-context-tool" label="AI tool">
          <select
            ref={toolRef}
            id="task-context-tool"
            aria-describedby="task-tool-suggestion"
            value={values.contextTool ?? ''}
            onChange={(e) => onChange('contextTool', e.target.value || null)}
            className={`${inputClass} border-line`}
          >
            <option value="">Choose a tool…</option>
            {AI_TOOLS.map((tool) => (
              <option key={tool} value={tool}>
                {tool}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="task-ai-outcome" label="Outcome">
          <select
            id="task-ai-outcome"
            value={values.aiOutcome}
            onChange={(e) => onChange('aiOutcome', e.target.value)}
            className={`${inputClass} border-line`}
          >
            {AI_OUTCOMES.map((outcome) => (
              <option key={outcome.id} value={outcome.id}>
                {outcome.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField id="task-ai-problems" label="AI problems">
        <textarea
          id="task-ai-problems"
          rows={3}
          value={values.aiProblems}
          onChange={(e) => onChange('aiProblems', e.target.value)}
          placeholder="Hallucinations, wrong versions, loops, anything that went wrong with the AI tool…"
          className={`${inputClass} resize-y border-line`}
        />
      </FormField>
    </section>
  );
}

/**
 * "Suggested AI tool" note above the AI tool field (M12). Says plainly that
 * it comes from this team's history, and offers a one-click "Use" button.
 */
function ToolSuggestion({ suggestion, taskType, selectedTool, onUse }) {
  return (
    <div id="task-tool-suggestion" className="flex flex-col gap-2 rounded border border-brand/40 bg-brand-soft p-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-2">
        <Lightbulb aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        {suggestion ? (
          <p className="text-sm text-ink">
            <span className="font-semibold">Suggested AI tool for {taskType}s: {suggestion.tool}.</span>{' '}
            {suggestion.reason}{' '}
            <span className="text-ink-soft">Based on this team’s history, not a general ranking.</span>
          </p>
        ) : (
          <p className="text-sm text-ink">
            <span className="font-semibold">No suggested AI tool for {taskType}s yet.</span>{' '}
            <span className="text-ink-soft">
              A tool needs at least {MIN_TASKS_FOR_RANKING} {taskType} tasks with an outcome in this team’s history.
            </span>
          </p>
        )}
      </div>
      {suggestion &&
        (selectedTool === suggestion.tool ? (
          <p className="flex shrink-0 items-center gap-1 text-xs font-medium text-success-text">
            <Check aria-hidden="true" className="h-3.5 w-3.5" />
            Selected
          </p>
        ) : (
          <button type="button" onClick={() => onUse(suggestion.tool)} className={`${smallButton} shrink-0 self-start`}>
            Use {suggestion.tool}
          </button>
        ))}
    </div>
  );
}
