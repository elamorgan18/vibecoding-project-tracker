import { BarChart3, SquareKanban } from 'lucide-react';

const VIEWS = [
  { id: 'board', label: 'Board', Icon: SquareKanban },
  { id: 'insights', label: 'Insights', Icon: BarChart3 },
];

/**
 * Header switch between the Kanban board and the Insights view (M12).
 * A group of two toggle buttons; `aria-pressed` marks the current view.
 */
export default function ViewSwitch({ view, onChange }) {
  return (
    <div role="group" aria-label="View" className="flex rounded border border-line bg-card p-0.5">
      {VIEWS.map(({ id, label, Icon }) => {
        const active = view === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(id)}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
              active ? 'bg-brand-soft text-ink' : 'text-ink-soft hover:bg-muted-bg hover:text-ink'
            }`}
          >
            <Icon aria-hidden="true" className={`h-4 w-4 ${active ? 'text-brand' : ''}`} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
