import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, Copy, Eye, EyeOff, FileText } from 'lucide-react';
import { AI_OUTCOMES, AI_TOOLS, CONTEXT_TEMPLATE } from '../data/context.js';
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
 */
export default function ContextSection({ values, onChange, updatedAt, dirty }) {
  const [showPreview, setShowPreview] = useState(false);
  const [copyState, setCopyState] = useState(null); // null | 'copied' | 'failed'
  const textareaRef = useRef(null);
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField id="task-context-tool" label="AI tool">
          <select
            id="task-context-tool"
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
