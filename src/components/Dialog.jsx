import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal shell shared by the task modal and the Team panel.
 * Focuses `initialFocusRef` (or the dialog itself) on open, keeps Tab inside,
 * closes on Escape or a backdrop click, and returns focus to the opener.
 * If the opener is gone by then (e.g. a task card that moved column or was
 * deleted), focus goes to what `fallbackFocus()` returns instead.
 */
export default function Dialog({ labelledBy, onClose, initialFocusRef, fallbackFocus, className = 'max-w-lg', children }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const fallbackRef = useRef(fallbackFocus);
  fallbackRef.current = fallbackFocus;

  useEffect(() => {
    const opener = document.activeElement;
    (initialFocusRef?.current ?? dialogRef.current)?.focus();

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = dialogRef.current.querySelectorAll(FOCUSABLE);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      const target = opener?.isConnected ? opener : fallbackRef.current?.();
      target?.focus?.();
    };
  }, []);

  // Backdrop click closes. The inner wrapper is min-h-full so a dialog taller
  // than the viewport scrolls from its top instead of being cut off.
  const closeOnBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-scrim/40 dark:bg-scrim/60" onMouseDown={closeOnBackdrop}>
      <div className="flex min-h-full items-start justify-center p-4 sm:items-center sm:py-8" onMouseDown={closeOnBackdrop}>
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          tabIndex={-1}
          className={`w-full ${className} rounded border border-line bg-card shadow-xl focus:outline-none`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
