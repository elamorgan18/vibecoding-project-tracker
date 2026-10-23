import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import TaskCard from './TaskCard.jsx';

/**
 * One board column. The Done column gets the success accent (DESIGN.md §2.2):
 * a green top border plus a check icon next to its label.
 *
 * It is also a drop target (M12). While a card is dragged over it, it gets a
 * brand ring and the brand-soft background.
 *
 * With filters on (`isFiltered`), `tasks` and the count pill are the matching
 * tasks only, and an empty column says so instead of "Enjoy the quiet".
 *
 * The arrow button in the header collapses the column (`isCollapsed`): the
 * cards are hidden but the header, its count and the column's width stay.
 * Arrow down = expanded, arrow up = collapsed. A collapsed column is still
 * a drop target.
 */
export default function Column({
  stage,
  tasks,
  isFiltered,
  isCollapsed,
  onToggleCollapsed,
  membersById,
  onOpenTask,
  onCopyContext,
}) {
  const isDone = stage.id === 'done';
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const bodyId = `column-${stage.id}-body`;
  const toggleLabel = `${isCollapsed ? 'Expand' : 'Collapse'} ${stage.label}`;
  const ToggleIcon = isCollapsed ? ChevronUp : ChevronDown;

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={`column-${stage.id} column-${stage.id}-count`}
      className={`flex flex-col rounded border-t-4 p-3 transition-colors ${
        isCollapsed ? 'self-start' : 'min-h-[16rem]'
      } ${isDone ? 'border-success' : 'border-transparent'} ${
        isOver ? 'bg-brand-soft ring-2 ring-brand' : 'bg-muted-bg'
      }`}
    >
      <header className={`flex items-center justify-between gap-2 ${isCollapsed ? '' : 'mb-3'}`}>
        <h2
          id={`column-${stage.id}`}
          className="flex items-center gap-1.5 text-base font-semibold uppercase tracking-wide text-ink"
        >
          {isDone && <Check aria-hidden="true" className="h-4 w-4 text-success" strokeWidth={3} />}
          {stage.label}
        </h2>
        <div className="flex items-center gap-1.5">
          <span id={`column-${stage.id}-count`} className="rounded-full bg-card px-2 py-0.5 text-xs font-medium text-ink-soft">
            <span className="sr-only">, </span>
            {tasks.length}
            <span className="sr-only"> {tasks.length === 1 ? 'task' : 'tasks'}</span>
          </span>
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-expanded={!isCollapsed}
            aria-controls={bodyId}
            aria-label={toggleLabel}
            title={toggleLabel}
            className="rounded p-1 text-ink-soft hover:bg-card hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-muted-bg"
          >
            <ToggleIcon aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div id={bodyId} hidden={isCollapsed}>
        {isCollapsed ? null : tasks.length === 0 ? (
          <p
            className={`rounded border border-dashed p-4 text-center text-xs text-ink-soft ${
              isOver ? 'border-brand' : 'border-line'
            }`}
          >
            {isOver ? 'Drop it here.' : isFiltered ? 'No tasks match these filters' : 'Nothing here. Enjoy the quiet.'}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {tasks.map((task) => (
              <li key={task.id}>
                <DraggableTaskCard
                  task={task}
                  member={membersById[task.assignee]}
                  onOpen={onOpenTask}
                  onCopyContext={onCopyContext}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/** A TaskCard wired up as a draggable; its title button is the drag handle. */
function DraggableTaskCard({ task, ...props }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
    attributes: { roleDescription: 'draggable task' },
  });

  return (
    <TaskCard
      {...props}
      task={task}
      cardRef={setNodeRef}
      dragHandle={{ ref: setActivatorNodeRef, ...attributes, ...listeners }}
      isDragging={isDragging}
    />
  );
}
