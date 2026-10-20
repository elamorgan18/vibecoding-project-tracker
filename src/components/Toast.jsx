import { useEffect } from 'react';
import { CircleCheck, TriangleAlert, X } from 'lucide-react';

const DURATION_MS = 4000;

const TONES = {
  success: { Icon: CircleCheck, box: 'border-success bg-success-soft', icon: 'text-success' },
  danger: { Icon: TriangleAlert, box: 'border-danger bg-danger-soft', icon: 'text-danger' },
};

/**
 * Toast (DESIGN.md §2.2): `success` (default) or `danger` tone, always with
 * an icon and text. The live region is always rendered so screen readers
 * announce new messages.
 */
export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onDismiss, DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast?.id]);

  const tone = TONES[toast?.tone ?? 'success'];

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 sm:inset-x-auto sm:right-4"
    >
      {toast && (
        <div
          key={toast.id}
          className={`pointer-events-auto flex animate-toast-in items-center gap-2 rounded border py-3 pl-4 pr-2 text-base text-ink shadow-lg motion-reduce:animate-none ${tone.box}`}
        >
          <tone.Icon aria-hidden="true" className={`h-4 w-4 shrink-0 ${tone.icon}`} />
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded p-1 text-ink-soft hover:bg-card hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <X aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </button>
        </div>
      )}
    </div>
  );
}
