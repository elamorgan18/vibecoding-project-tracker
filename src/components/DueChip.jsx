import { Calendar, CircleCheck, Clock, TriangleAlert } from 'lucide-react';

/**
 * Icon, chip colours and card left border per due state (DESIGN.md §2.4).
 * Chip icon and label both use the AA-safe `-text` shade: the base calm /
 * done colours are under 3:1 on their own soft tint.
 * Class strings are written out in full so Tailwind can find them.
 */
export const DUE_META = {
  calm: {
    Icon: Calendar,
    chip: 'bg-due-calm-soft text-due-calm-text',
    border: 'border-l-4 border-l-due-calm',
    legend: 'More than 2 days away',
  },
  warning: {
    Icon: Clock,
    chip: 'bg-due-warning-soft text-due-warning-text',
    border: 'border-l-4 border-l-due-warning',
    legend: 'Due within 2 days',
  },
  overdue: {
    Icon: TriangleAlert,
    chip: 'bg-due-overdue-soft text-due-overdue-text',
    border: 'border-l-4 border-l-due-overdue',
    legend: 'Past the due date',
  },
  done: {
    Icon: CircleCheck,
    chip: 'bg-due-done-soft text-due-done-text',
    border: 'border-l-4 border-l-due-done',
    legend: 'Finished, even if it was late',
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
