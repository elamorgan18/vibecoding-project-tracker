import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TRIED_OUTCOMES } from '../../data/insights.js';
import ChartCard, { tableClass, tdClass, thClass } from './ChartCard.jsx';
import ChartTooltip from './ChartTooltip.jsx';
import { OutcomeSwatch, outcomePatterns } from './outcomeStyles.jsx';

const PATTERN_PREFIX = 'tool-outcome';
const ROW_HEIGHT = 44;

const rateText = (row) => (row.successRate == null ? 'no outcomes yet' : `${row.successRate}%`);

function rowSummary(row) {
  if (row.tried === 0) return `${row.tool}: no outcomes yet`;
  return `${row.tool} ${row.successRate}% (${row.worked} worked, ${row.partial} partial, ${row.failed} failed)`;
}

/** Legend: pattern swatch + label for each outcome, in stack order. */
function OutcomeLegend({ palette }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft" aria-label="Outcome key">
      {TRIED_OUTCOMES.map((o) => (
        <li key={o.id} className="flex items-center gap-1.5">
          <OutcomeSwatch outcome={o.id} palette={palette} />
          {o.label}
        </li>
      ))}
    </ul>
  );
}

/**
 * 2. AI tool performance: one stacked bar per AI tool (Worked / Partial /
 * Failed), with its success rate on the right-hand axis. "Not tried yet"
 * tasks aren't in the bars; the table lists them.
 */
export default function ToolInsight({ rows, palette, animate }) {
  const rateByTool = Object.fromEntries(rows.map((r) => [r.tool, rateText(r)]));
  const summary =
    rows.length === 0
      ? 'No AI tools logged yet. Pick a tool and an outcome in a task’s AI context to see results here.'
      : `Success rate is the share of tasks with an outcome that worked. ${rows.map(rowSummary).join('; ')}.`;

  const chart = (
    <div className="flex flex-col gap-2">
      <OutcomeLegend palette={palette} />
      <div style={{ height: Math.max(rows.length, 1) * ROW_HEIGHT + 40 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 8, bottom: 4, left: 0 }} barCategoryGap={10}>
            <defs>{outcomePatterns(PATTERN_PREFIX, palette)}</defs>
            <CartesianGrid horizontal={false} stroke={palette.line} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: palette['ink-soft'], fontSize: 12 }}
              stroke={palette.line}
              tickLine={false}
            />
            <YAxis
              yAxisId="tool"
              type="category"
              dataKey="tool"
              width={72}
              tick={{ fill: palette.ink, fontSize: 12 }}
              stroke={palette.line}
              tickLine={false}
            />
            <YAxis
              yAxisId="rate"
              orientation="right"
              type="category"
              dataKey="tool"
              width={96}
              tickFormatter={(tool) => rateByTool[tool]}
              tick={{ fill: palette['ink-soft'], fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: palette['muted-bg'] }}
              content={
                <ChartTooltip
                  render={(row) => (
                    <>
                      <p className="mb-1 font-semibold">
                        {row.tool} · {rateText(row)} success
                      </p>
                      {TRIED_OUTCOMES.map((o) => (
                        <p key={o.id} className="flex items-center gap-1.5">
                          <OutcomeSwatch outcome={o.id} palette={palette} size={10} />
                          {o.label}: {row[o.id]}
                        </p>
                      ))}
                      {row.notTried > 0 && <p className="mt-1 text-ink-soft">Not tried yet: {row.notTried}</p>}
                    </>
                  )}
                />
              }
            />
            {TRIED_OUTCOMES.map((o) => (
              <Bar
                key={o.id}
                yAxisId="tool"
                dataKey={o.id}
                name={o.label}
                stackId="outcomes"
                fill={`url(#${PATTERN_PREFIX}-${o.id})`}
                stroke={palette.card}
                strokeWidth={1}
                isAnimationActive={animate}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const table = (
    <table className={tableClass}>
      <caption className="sr-only">AI tool outcomes and success rate</caption>
      <thead>
        <tr>
          <th scope="col" className={thClass}>AI tool</th>
          {TRIED_OUTCOMES.map((o) => (
            <th key={o.id} scope="col" className={`${thClass} text-right`}>
              <span className="inline-flex items-center gap-1.5">
                <OutcomeSwatch outcome={o.id} palette={palette} size={10} />
                {o.label}
              </span>
            </th>
          ))}
          <th scope="col" className={`${thClass} text-right`}>Not tried yet</th>
          <th scope="col" className={`${thClass} text-right`}>Success rate</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.tool}>
            <th scope="row" className={`${tdClass} font-medium`}>{r.tool}</th>
            {TRIED_OUTCOMES.map((o) => (
              <td key={o.id} className={`${tdClass} text-right tabular-nums`}>{r[o.id]}</td>
            ))}
            <td className={`${tdClass} text-right tabular-nums`}>{r.notTried}</td>
            <td className={`${tdClass} text-right tabular-nums`}>
              {r.successRate == null ? '–' : `${r.successRate}% (${r.worked} of ${r.tried})`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <ChartCard
      id="insights-tools"
      title="AI tool performance"
      description="Outcomes logged on each task's AI context, per tool."
      summary={summary}
      chart={chart}
      table={table}
      chartLabel="Stacked bar chart of Worked, Partial and Failed tasks per AI tool, with success rates"
    />
  );
}
