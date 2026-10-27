import { AlertCircle } from 'lucide-react';

export const inputClass =
  'w-full rounded border bg-card px-3 py-2 text-base text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand';

/** Border class for an input, switching to `danger` when it has an error. */
export function inputBorder(error) {
  return error ? 'border-danger' : 'border-line';
}

/**
 * Label + control + optional inline error (DESIGN.md §2.2: danger border,
 * alert icon, message in `danger-text`). Give the control
 * `aria-describedby={`${id}-error`}` when there is an error.
 * `alertError={false}` drops role="alert", for forms that announce their
 * errors another way (the login screen uses the page's live region).
 */
export default function FormField({ id, label, error, alertError = true, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role={alertError ? 'alert' : undefined} className="mt-1 flex items-start gap-1 text-sm text-danger-text">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
