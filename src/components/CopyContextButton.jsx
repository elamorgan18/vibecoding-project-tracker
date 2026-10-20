import { ClipboardCopy } from 'lucide-react';

/**
 * "Copy Context" button (M10): copies the task's Markdown briefing.
 * `relative z-10` lifts it above a card's full-card click target, so
 * clicking it copies without opening the modal.
 */
export default function CopyContextButton({ onClick, taskTitle }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative z-10 flex shrink-0 items-center gap-1 rounded border border-line bg-card px-2 py-1 text-xs font-medium text-ink-soft hover:bg-muted-bg hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand"
    >
      <ClipboardCopy aria-hidden="true" className="h-3.5 w-3.5" />
      Copy Context
      {taskTitle && <span className="sr-only">: {taskTitle}</span>}
    </button>
  );
}
