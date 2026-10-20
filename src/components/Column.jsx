import { Check } from 'lucide-react';
import TaskCard from './TaskCard.jsx';

/**
 * One board column. The Done column gets the success accent (DESIGN.md §2.2):
 * a green top border plus a check icon next to its label.
 */
export default function Column({ stage, tasks, membersById }) {
  const isDone = stage.id === 'done';

  return (
    <section
      aria-labelledby={`column-${stage.id}`}
      className={`flex min-h-[16rem] flex-col rounded border-t-4 bg-muted-bg p-3 ${
        isDone ? 'border-success' : 'border-transparent'
      }`}
    >
      <header className="mb-3 flex items-center justify-between">
        <h2
          id={`column-${stage.id}`}
          className="flex items-center gap-1.5 text-base font-semibold uppercase tracking-wide text-ink"
        >
          {isDone && <Check aria-hidden="true" className="h-4 w-4 text-success" strokeWidth={3} />}
          {stage.label}
        </h2>
        <span className="rounded-full bg-card px-2 py-0.5 text-xs font-medium text-ink-soft">
          {tasks.length}
          <span className="sr-only"> tasks</span>
        </span>
      </header>

      {tasks.length === 0 ? (
        <p className="rounded border border-dashed border-line p-4 text-center text-xs text-ink-soft">
          Nothing here. Enjoy the quiet.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} member={membersById[task.assignee]} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
