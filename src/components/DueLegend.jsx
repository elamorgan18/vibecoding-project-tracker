import DueChip, { DUE_META } from './DueChip.jsx';

const EXAMPLES = [
  { state: 'calm', label: 'Due in 3+ days' },
  { state: 'warning', label: 'Due soon' },
  { state: 'overdue', label: 'Overdue' },
  { state: 'done', label: 'Done' },
];

/** Key for the four due-date states shown on cards. */
export default function DueLegend() {
  return (
    <section aria-labelledby="due-legend-heading" className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2">
      <h2 id="due-legend-heading" className="text-sm font-medium text-ink">
        Due dates
      </h2>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {EXAMPLES.map((example) => (
          <li key={example.state} className="flex items-center gap-2">
            <DueChip due={example} />
            <span className="text-xs text-muted">{DUE_META[example.state].legend}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
