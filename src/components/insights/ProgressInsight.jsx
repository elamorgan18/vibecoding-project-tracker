import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { progressStats, tasksForMember } from '../../data/insights.js';
import { inputClass } from '../FormField.jsx';
import ChartCard, { tableClass, tdClass, thClass } from './ChartCard.jsx';
import ChartTooltip from './ChartTooltip.jsx';

const plural = (n) => `${n} ${n === 1 ? 'task' : 'tasks'}`;

/**
 * 1. Progress: tasks per status and % complete, filterable by team member.
 * Bars are `brand`, except Done in `success` (its column accent, §2.2).
 */
export default function ProgressInsight({ tasks, members, palette, animate }) {
  const [memberFilter, setMemberFilter] = useState('all');
  const scoped = tasksForMember(tasks, memberFilter);
  const stats = progressStats(scoped);

  const scopeName =
    memberFilter === 'all'
      ? 'Whole team'
      : memberFilter === 'unassigned'
        ? 'Unassigned'
        : members.find((m) => m.id === memberFilter)?.name;
  const breakdown = stats.stages.map((s) => `${s.label}: ${s.count}`).join(', ');
  let summary = `${scopeName}: ${stats.done} of ${plural(stats.total)} done (${stats.percentDone}% complete). ${breakdown}.`;
  if (stats.total === 0) {
    summary = memberFilter === 'unassigned' ? 'There are no unassigned tasks.' : `${scopeName} has no tasks yet.`;
  }

  const controls = (
    <div className="flex flex-wrap items-end gap-4">
      <div className="min-w-[12rem] flex-1">
        <label htmlFor="insights-member" className="mb-1 block text-sm font-medium text-ink">
          Team member
        </label>
        <select
          id="insights-member"
          value={memberFilter}
          onChange={(e) => setMemberFilter(e.target.value)}
          className={`${inputClass} border-line`}
        >
          <option value="all">Whole team</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
          <option value="unassigned">Unassigned</option>
        </select>
      </div>
      <div className="flex-1">
        <p className="text-2xl font-semibold text-ink">
          {stats.percentDone}%<span className="ml-1.5 text-sm font-medium text-ink-soft">complete</span>
        </p>
        <div aria-hidden="true" className="mt-1 h-2 overflow-hidden rounded-full bg-muted-bg">
          <div className="h-full rounded-full bg-success" style={{ width: `${stats.percentDone}%` }} />
        </div>
      </div>
    </div>
  );

  const chart = (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={stats.stages} margin={{ top: 20, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke={palette.line} />
          <XAxis dataKey="label" tick={{ fill: palette['ink-soft'], fontSize: 12 }} stroke={palette.line} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: palette['ink-soft'], fontSize: 12 }} stroke={palette.line} tickLine={false} />
          <Tooltip
            cursor={{ fill: palette['muted-bg'] }}
            content={<ChartTooltip render={(row) => `${row.label}: ${plural(row.count)}`} />}
          />
          <Bar dataKey="count" name="Tasks" radius={[4, 4, 0, 0]} isAnimationActive={animate}>
            {stats.stages.map((s) => (
              <Cell key={s.id} fill={s.id === 'done' ? palette.success : palette.brand} />
            ))}
            <LabelList dataKey="count" position="top" fill={palette.ink} fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const table = (
    <table className={tableClass}>
      <caption className="sr-only">Tasks per status, {scopeName}</caption>
      <thead>
        <tr>
          <th scope="col" className={thClass}>Status</th>
          <th scope="col" className={`${thClass} text-right`}>Tasks</th>
          <th scope="col" className={`${thClass} text-right`}>Share</th>
        </tr>
      </thead>
      <tbody>
        {stats.stages.map((s) => (
          <tr key={s.id}>
            <th scope="row" className={`${tdClass} font-medium`}>{s.label}</th>
            <td className={`${tdClass} text-right tabular-nums`}>{s.count}</td>
            <td className={`${tdClass} text-right tabular-nums`}>
              {stats.total === 0 ? '–' : `${Math.round((s.count / stats.total) * 100)}%`}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row" className="px-2 py-1.5 font-semibold">Total</th>
          <td className="px-2 py-1.5 text-right font-semibold tabular-nums">{stats.total}</td>
          <td className="px-2 py-1.5 text-right font-semibold tabular-nums">{stats.percentDone}% done</td>
        </tr>
      </tfoot>
    </table>
  );

  return (
    <ChartCard
      id="insights-progress"
      title="Progress"
      description="Tasks per status and how much is done."
      controls={controls}
      summary={summary}
      chart={chart}
      table={table}
      chartLabel={`Bar chart of tasks per status, ${scopeName}`}
      liveSummary
    />
  );
}
