import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Check } from 'lucide-react';
import TaskCard from './TaskCard.jsx';

/**
 * One board column. The Done column gets the success accent (DESIGN.md §2.2):
 * a green top border plus a check icon next to its label.
 *
 * It is also a drop target (M12). While a card is dragged over it, it gets a
 * brand ring and the brand-soft background.
 */
export default function Column({ stage, tasks, membersById, onOpenTask, onCopyContext }) {
  const isDone = stage.id === 'done';
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={`column-${stage.id}`}
      className={`flex min-h-[16rem] flex-col rounded border-t-4 p-3 transition-colors ${
        isDone ? 'border-success' : 'border-transparent'
      } ${isOver ? 'bg-brand-soft ring-2 ring-brand' : 'bg-muted-bg'}`}
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
        <p
          className={`rounded border border-dashed p-4 text-center text-xs text-ink-soft ${
            isOver ? 'border-brand' : 'border-line'
          }`}
        >
          {isOver ? 'Drop it here.' : 'Nothing here. Enjoy the quiet.'}
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
