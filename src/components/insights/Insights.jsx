import { toolStats } from '../../data/insights.js';
import { THEMES } from '../../theme/tokens.js';
import BestWorstInsight from './BestWorstInsight.jsx';
import ProgressInsight from './ProgressInsight.jsx';
import ToolInsight from './ToolInsight.jsx';

// No chart animation when the user asks for less motion (DESIGN.md §7).
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Insights view (M12 secret sauce), opened from the header's Board / Insights
 * switch. Everything is worked out live from this team's own logged tasks
 * (src/data/insights.js):
 *   1. Progress per status, filterable by team member
 *   2. AI tool performance (outcomes per tool, success rate)
 *   3. Best / lowest success rate
 * Charts are Recharts SVGs. They take colours from the theme tokens directly
 * (`palette`), because SVG fill attributes can't read Tailwind classes.
 */
export default function Insights({ tasks, members, projectName, isDark }) {
  const palette = THEMES[isDark ? 'dark' : 'light'];
  const animate = !reduceMotion();
  const rows = toolStats(tasks);

  return (
    <section aria-labelledby="insights-title" className="flex flex-col gap-4">
      <div>
        <h2 id="insights-title" className="text-lg font-semibold text-ink">
          Insights
        </h2>
        <p className="text-sm text-muted">
          Based on this team’s own logged tasks: {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in {projectName}.
          Updates as you edit tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <ProgressInsight tasks={tasks} members={members} palette={palette} animate={animate} />
        </div>
        <div className="flex flex-col gap-4 xl:col-span-3">
          <ToolInsight rows={rows} palette={palette} animate={animate} />
          <BestWorstInsight rows={rows} />
        </div>
      </div>
    </section>
  );
}
