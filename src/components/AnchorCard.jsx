import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, CircleDashed, ExternalLink } from 'lucide-react';
import { displayLink, parseLink } from '../data/anchors.js';
import { inputBorder, inputClass } from './FormField.jsx';

const textButton =
  'rounded px-1 text-sm font-medium text-ink-soft hover:text-ink hover:underline focus:outline-none focus:ring-2 focus:ring-brand';

/** Icon + text status, so "linked" never relies on colour alone (DESIGN.md §2.2). */
function AnchorStatus({ linked }) {
  return (
    <span aria-live="polite" className="flex shrink-0 items-center gap-1 text-xs font-medium">
      {linked ? (
        <>
          <span aria-hidden="true" className="flex h-4 w-4 items-center justify-center rounded-full bg-success">
            <Check className="h-3 w-3 text-on-accent" strokeWidth={3} />
          </span>
          <span className="text-success-text">Linked</span>
        </>
      ) : (
        <>
          <CircleDashed aria-hidden="true" className="h-4 w-4 text-muted" />
          <span className="text-muted">No link yet</span>
        </>
      )}
    </span>
  );
}

/**
 * One deliverable slot. Empty: a URL field + Save. Linked: the link (opens in
 * a new tab) with Change / Remove. Focus follows the switch between the two.
 */
export default function AnchorCard({ anchor, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState(null);
  const showForm = !anchor.url || editing;

  const inputRef = useRef(null);
  const linkRef = useRef(null);
  const focusNext = useRef(null); // 'input' | 'link', applied after the form/link swap
  useEffect(() => {
    if (focusNext.current === 'input') inputRef.current?.focus();
    if (focusNext.current === 'link') linkRef.current?.focus();
    focusNext.current = null;
  }, [showForm]);

  const inputId = `anchor-${anchor.id}-url`;
  const errorId = `${inputId}-error`;

  function handleSubmit(e) {
    e.preventDefault();
    const result = parseLink(draft);
    if (result.error) {
      setError(result.error);
      inputRef.current?.focus();
      return;
    }
    onSave(result.url);
    setEditing(false);
    setError(null);
    focusNext.current = 'link';
  }

  function startEditing() {
    setDraft(anchor.url);
    setEditing(true);
    focusNext.current = 'input';
  }

  function cancelEditing() {
    setEditing(false);
    setError(null);
    focusNext.current = 'link';
  }

  function remove() {
    onSave(null);
    setDraft('');
    focusNext.current = 'input';
  }

  return (
    <li className="flex flex-col rounded border border-line bg-card p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink">{anchor.label}</h3>
        <AnchorStatus linked={Boolean(anchor.url)} />
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} noValidate className="mt-3">
          <label htmlFor={inputId} className="sr-only">
            {anchor.label} link
          </label>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              id={inputId}
              type="url"
              inputMode="url"
              placeholder="https://…"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && editing) cancelEditing();
              }}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={error ? errorId : undefined}
              className={`${inputClass} ${inputBorder(error)} min-w-0 flex-1`}
            />
            <button
              type="submit"
              className="shrink-0 rounded border border-line bg-card px-3 py-2 text-sm font-medium text-ink hover:bg-muted-bg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              Save<span className="sr-only"> {anchor.label} link</span>
            </button>
          </div>
          {error && (
            <p id={errorId} className="mt-1 flex items-start gap-1 text-sm text-danger-text">
              <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}
          {editing && (
            <button type="button" onClick={cancelEditing} className={`mt-2 ${textButton}`}>
              Cancel
            </button>
          )}
        </form>
      ) : (
        <>
          <a
            ref={linkRef}
            href={anchor.url}
            target="_blank"
            rel="noopener noreferrer"
            title={anchor.url}
            className="mt-3 flex min-w-0 items-center gap-1.5 rounded text-sm font-medium text-brand hover:text-brand-hover hover:underline focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className="sr-only">Open {anchor.label}: </span>
            <span className="truncate">{displayLink(anchor.url)}</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <div className="mt-2 flex gap-3">
            <button type="button" onClick={startEditing} className={textButton}>
              Change<span className="sr-only"> {anchor.label} link</span>
            </button>
            <button type="button" onClick={remove} className={textButton}>
              Remove<span className="sr-only"> {anchor.label} link</span>
            </button>
          </div>
        </>
      )}
    </li>
  );
}
