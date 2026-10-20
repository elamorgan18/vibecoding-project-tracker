import { TrendingDown, TrendingUp } from 'lucide-react';
import { bestAndWorst, MIN_TASKS_FOR_RANKING } from '../../data/insights.js';

const NOT_ENOUGH = 'Not enough data yet';

function StatCard({ id, title, Icon, iconClass, row, emptyText }) {
  return (
    <section aria-labelledby={id} className="flex-1 rounded border border-line bg-card p-4">
      <h3 id={id} className="flex items-center gap-1.5 text-sm font-semibold text-ink">
        <Icon aria-hidden="true" className={`h-4 w-4 ${iconClass}`} />
        {title}
      </h3>
      {row ? (
        <>
          <p className="mt-2 text-2xl font-semibold text-ink">{row.tool}</p>
          <p className="text-sm text-ink-soft">
            {row.successRate}% success · worked on {row.worked} of {row.tried} tasks
          </p>
        </>
      ) : (
        <>
          <p className="mt-2 text-base font-semibold text-ink">{NOT_ENOUGH}</p>
          <p className="text-sm text-ink-soft">{emptyText}</p>
        </>
      )}
    </section>
  );
}

/**
 * 3. Best / worst AI: the tools with the highest and lowest success rate,
 * counting only tools with at least MIN_TASKS_FOR_RANKING tasks with an
 * outcome. "Other" is a catch-all, so it is never ranked.
 */
export default function BestWorstInsight({ rows }) {
  const { best, worst } = bestAndWorst(rows);
  const unranked = rows.filter((r) => r !== best && r !== worst && (r.tool === 'Other' || r.tried < MIN_TASKS_FOR_RANKING));
  const need = `Each tool needs at least ${MIN_TASKS_FOR_RANKING} tasks marked Worked, Partial or Failed.`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4 sm:flex-row">
        <StatCard
          id="insights-best"
          title="Best success rate"
          Icon={TrendingUp}
          iconClass="text-success"
          row={best}
          emptyText={need}
        />
        <StatCard
          id="insights-worst"
          title="Lowest success rate"
          Icon={TrendingDown}
          iconClass="text-danger"
          row={worst}
          emptyText={best ? `Only ${best.tool} has enough tasks so far. ${need}` : need}
        />
      </div>
      <p className="text-xs text-muted">
        Only tools with {MIN_TASKS_FOR_RANKING} or more tasks with an outcome are ranked.
        {unranked.length > 0 &&
          ` Not ranked: ${unranked
            .map((r) => (r.tool === 'Other' ? 'Other (a mix of tools)' : `${r.tool} (${r.tried} of ${MIN_TASKS_FOR_RANKING})`))
            .join(', ')}.`}
      </p>
    </div>
  );
}
