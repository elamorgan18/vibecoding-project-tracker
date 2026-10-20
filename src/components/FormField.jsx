import { AlertCircle } from 'lucide-react';

export const inputClass =
  'w-full rounded border bg-card px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand';

/** Border class for an input, switching to `danger` when it has an error. */
export function inputBorder(error) {
  return error ? 'border-danger' : 'border-line';
}

/**
 * Label + control + optional inline error (DESIGN.md §2.2: danger border,
 * alert icon, message in `danger-text`). Give the control
 * `aria-describedby={`${id}-error`}` when there is an error.
 */
export default function FormField({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 flex items-center gap-1 text-xs text-danger-text">
          <AlertCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
