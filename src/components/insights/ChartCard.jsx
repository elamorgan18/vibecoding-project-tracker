import { useState } from 'react';
import { BarChart3, Table } from 'lucide-react';

const smallButton =
  'flex items-center gap-1 rounded border border-line bg-card px-2 py-1 text-xs font-medium text-ink-soft hover:bg-muted-bg hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand';

/**
 * A card holding one Insights chart (DESIGN.md §4).
 *
 * Every chart has a written summary (always visible, and the chart's
 * accessible description) and a "View as table" button that swaps the chart
 * for a data table with the same numbers.
 *
 *   id         prefix for element ids
 *   chartLabel what the chart is, e.g. "Bar chart of tasks per status"
 *   controls   optional controls shown under the title (e.g. a filter)
 *   summary    the text summary
 *   chart      the chart element
 *   table      the table element
 *   liveSummary  announce summary changes (when a filter changes it)
 */
export default function ChartCard({ id, title, description, controls, summary, chart, table, chartLabel, liveSummary }) {
  const [showTable, setShowTable] = useState(false);
  const bodyId = `${id}-body`;
  const summaryId = `${id}-summary`;

  return (
    <section aria-labelledby={`${id}-title`} className="flex flex-col gap-3 rounded border border-line bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 id={`${id}-title`} className="text-base font-semibold text-ink">
            {title}
          </h3>
          {description && <p className="text-xs text-muted">{description}</p>}
        </div>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          aria-controls={bodyId}
          className={smallButton}
        >
          {showTable ? (
            <BarChart3 aria-hidden="true" className="h-3.5 w-3.5" />
          ) : (
            <Table aria-hidden="true" className="h-3.5 w-3.5" />
          )}
          {showTable ? 'View as chart' : 'View as table'}
          <span className="sr-only">: {title}</span>
        </button>
      </div>

      {controls}

      <p
        id={summaryId}
        className="text-sm text-ink-soft"
        {...(liveSummary ? { role: 'status', 'aria-live': 'polite' } : {})}
      >
        {summary}
      </p>

      <div id={bodyId}>
        {showTable ? (
          <div className="overflow-x-auto">{table}</div>
        ) : (
          <div role="img" aria-label={chartLabel} aria-describedby={summaryId}>
            {chart}
          </div>
        )}
      </div>
    </section>
  );
}

/** Shared table styles for the "View as table" tables. */
export const tableClass = 'w-full border-collapse text-left text-sm text-ink';
export const thClass = 'border-b border-line px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft';
export const tdClass = 'border-b border-line px-2 py-1.5';
