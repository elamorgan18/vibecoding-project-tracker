import { Calendar, CircleCheck, Clock, TriangleAlert } from 'lucide-react';

/**
 * Icon, chip colours, card left border and filter-menu swatch per due state (DESIGN.md §2.4).
 * Chip icon and label both use the AA-safe `-text` shade: the base calm /
 * done colours are under 3:1 on their own soft tint.
 * Class strings are written out in full so Tailwind can find them.
 */
export const DUE_META = {
  calm: {
    Icon: Calendar,
    chip: 'bg-due-calm-soft text-due-calm-text',
    border: 'border-l-4 border-l-due-calm',
    swatch: 'bg-due-calm',
    text: 'text-due-calm-text',
  },
  warning: {
    Icon: Clock,
    chip: 'bg-due-warning-soft text-due-warning-text',
    border: 'border-l-4 border-l-due-warning',
    swatch: 'bg-due-warning',
    text: 'text-due-warning-text',
  },
  overdue: {
    Icon: TriangleAlert,
    chip: 'bg-due-overdue-soft text-due-overdue-text',
    border: 'border-l-4 border-l-due-overdue',
    swatch: 'bg-due-overdue',
    text: 'text-due-overdue-text',
  },
  done: {
    Icon: CircleCheck,
    chip: 'bg-due-done-soft text-due-done-text',
    border: 'border-l-4 border-l-due-done',
    swatch: 'bg-due-done',
    text: 'text-due-done-text',
  },
};

/** Small pill with the due state's icon and text, e.g. "Due today". */
export default function DueChip({ due, dueDate }) {
  const { Icon, chip } = DUE_META[due.state];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${chip}`}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {dueDate ? <time dateTime={dueDate}>{due.label}</time> : due.label}
    </span>
  );
}
