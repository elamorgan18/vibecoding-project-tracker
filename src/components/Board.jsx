import { useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { STAGES } from '../data/model.js';
import Column from './Column.jsx';
import TaskCard from './TaskCard.jsx';

const stageLabel = (id) => STAGES.find((s) => s.id === id)?.label ?? id;

/**
 * Keyboard moves (M12): each arrow key jumps the picked-up card to the
 * centre of the previous / next column in STAGES order, instead of nudging
 * it a few pixels. Right/Down = next column, Left/Up = previous.
 */
const ARROW_STEPS = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

function columnKeyboardCoordinates(event, { context, currentCoordinates }) {
  const step = ARROW_STEPS[event.code];
  const { active, over, droppableRects, collisionRect } = context;
  if (!step || !active || !collisionRect) return undefined;
  event.preventDefault();

  const fromId = over?.id ?? active.data.current.task.status;
  const target = STAGES[STAGES.findIndex((s) => s.id === fromId) + step];
  const rect = target && droppableRects.get(target.id);
  if (!rect) return currentCoordinates;

  return {
    x: rect.left + (rect.width - collisionRect.width) / 2,
    y: rect.top + 48, // just under the column header
  };
}

// Pointer: the column under the pointer. Keyboard (no pointer): the column
// the card overlaps.
function collisionDetection(args) {
  const hits = pointerWithin(args);
  return hits.length > 0 ? hits : rectIntersection(args);
}

const SCREEN_READER_INSTRUCTIONS = {
  draggable:
    'Press Enter to open the task. To move it, press Space to pick it up, use the arrow keys to move between columns, then press Space to drop it or Escape to cancel.',
};

const taskName = (active) => {
  const { task } = active.data.current;
  return `Task ${task.id}, ${task.title},`;
};

// Only announce a column when it changes, so "Picked up…" isn't replaced
// straight away by "Over <the column it started in>".
let lastOverId = null;

const ANNOUNCEMENTS = {
  onDragStart: ({ active }) => {
    lastOverId = active.data.current.task.status;
    return `Picked up ${taskName(active)} in ${stageLabel(lastOverId)}.`;
  },
  onDragOver: ({ over }) => {
    const overId = over?.id ?? null;
    if (overId === lastOverId) return undefined;
    lastOverId = overId;
    return over ? `Over ${stageLabel(over.id)}.` : 'Not over a column.';
  },
  onDragEnd: ({ active, over }) => {
    const from = active.data.current.task.status;
    if (!over) return `${taskName(active)} dropped. It stays in ${stageLabel(from)}.`;
    if (over.id === from) return `${taskName(active)} dropped back in ${stageLabel(from)}.`;
    return `${taskName(active)} moved to ${stageLabel(over.id)}.`;
  },
  onDragCancel: ({ active }) =>
    `Move cancelled. ${taskName(active)} stays in ${stageLabel(active.data.current.task.status)}.`,
};

// No drop animation (the card snaps into place) when the user asks for less motion.
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The four-column Kanban board for one project.
 *
 * Drag and drop (M12, @dnd-kit/core): drag a card to another column to
 * change its status.
 *   - Mouse: starts after 6px of movement, so a click still opens the card.
 *   - Touch: press and hold 250ms, so a normal swipe still scrolls the page.
 *   - Keyboard: Space picks up / drops, arrows change column, Escape cancels.
 * The dragged card is drawn in a DragOverlay so it floats above everything.
 *
 * `tasks` is already filtered (FilterBar). Columns stay drop targets while
 * filtered; a card moved out of the filter's scope drops out of view.
 */
export default function Board({ tasks, isFiltered, members, onOpenTask, onCopyContext, onMoveTask }) {
  const membersById = Object.fromEntries(members.map((m) => [m.id, m]));
  const [activeTask, setActiveTask] = useState(null);
  // Swallow the click the browser may fire on the card at the end of a drag.
  const justDragged = useRef(false);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: columnKeyboardCoordinates,
      keyboardCodes: { start: ['Space'], cancel: ['Escape'], end: ['Space'] },
    }),
  );

  function finishDrag() {
    setActiveTask(null);
    setTimeout(() => {
      justDragged.current = false;
    }, 0);
  }

  function handleDragStart({ active }) {
    justDragged.current = true;
    setActiveTask(active.data.current.task);
  }

  function handleDragEnd({ active, over }) {
    if (over) onMoveTask(active.id, over.id);
    finishDrag();
  }

  function handleOpen(task) {
    if (!justDragged.current) onOpenTask(task);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={{ announcements: ANNOUNCEMENTS, screenReaderInstructions: SCREEN_READER_INSTRUCTIONS }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={finishDrag}
    >
      <main className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STAGES.map((stage) => (
          <Column
            key={stage.id}
            stage={stage}
            tasks={tasks.filter((task) => task.status === stage.id)}
            isFiltered={isFiltered}
            membersById={membersById}
            onOpenTask={handleOpen}
            onCopyContext={onCopyContext}
          />
        ))}
      </main>

      <DragOverlay dropAnimation={reduceMotion() ? null : undefined}>
        {activeTask && (
          // Visual copy only: the real card stays in place for focus and screen readers.
          <div aria-hidden="true" inert="">
            <TaskCard task={activeTask} member={membersById[activeTask.assignee]} isOverlay />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
