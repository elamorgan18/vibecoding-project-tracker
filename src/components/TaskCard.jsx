import { dueState } from '../data/due.js';
import Avatar from './Avatar.jsx';
import CopyContextButton from './CopyContextButton.jsx';
import DueChip, { DUE_META } from './DueChip.jsx';
import TypeBadge, { TYPE_META } from './TypeBadge.jsx';

/**
 * One task on the board.
 *   - Type: background tint + thin border, backed up by the icon + label
 *     badge in the top-right corner.
 *   - Due state (when there is a due date): a 4px LEFT border in the due
 *     colour plus a due-date chip with icon and text. It never touches the
 *     background, which belongs to the type.
 *   - Owner: initials avatar and name along the bottom, next to the
 *     "Copy Context" button (M10), which sits above the click target so
 *     it copies without opening the modal.
 * Captions use `ink-soft` because `muted` fails AA on the type tints.
 * The title is a button stretched over the whole card, so clicking anywhere
 * on the card opens it for editing.
 *
 * Focused / selected state: a brand ring with a 2px offset in the column's
 * `muted-bg`, so it sits outside the type border instead of blending into it,
 * and is identical on every card whatever its type.
 *
 * Drag and drop (M12): the title button doubles as the drag handle
 * (`dragHandle` from useDraggable in Column.jsx). While dragging, the card
 * left in the column fades to a placeholder and an `isOverlay` copy follows
 * the pointer, lifted with a large shadow and a slight tilt.
 */
const FOCUS_RING =
  'focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 focus-within:ring-offset-muted-bg';

const LIFTED = 'cursor-grabbing shadow-xl ring-1 ring-brand/30 motion-safe:rotate-2 motion-safe:scale-[1.03]';

export default function TaskCard({ task, member, onOpen, onCopyContext, cardRef, dragHandle, isDragging, isOverlay }) {
  const due = dueState(task);

  return (
    <article
      ref={cardRef}
      className={`relative rounded border p-3 transition-shadow hover:shadow-md ${FOCUS_RING} ${TYPE_META[task.type].card} ${
        due ? DUE_META[due.state].border : ''
      } ${isOverlay ? LIFTED : ''} ${isDragging ? 'opacity-40' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-xs text-ink-soft">{task.id}</p>
        <TypeBadge type={task.type} />
      </div>
      <h3 className="mt-1 text-sm font-medium text-ink">
        <button
          type="button"
          {...dragHandle}
          onClick={() => onOpen?.(task)}
          className={`touch-manipulation text-left after:absolute after:inset-0 after:rounded after:content-[''] focus:outline-none ${
            isOverlay ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {task.title}
        </button>
      </h3>

      {due && (
        <div className="mt-2">
          <DueChip due={due} dueDate={task.dueDate} />
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar member={member} />
          {member ? (
            <span className="truncate text-sm font-medium text-ink">{member.name}</span>
          ) : (
            <span className="text-sm text-ink-soft">Unassigned</span>
          )}
        </div>
        <CopyContextButton onClick={() => onCopyContext?.(task)} taskTitle={task.title} />
      </div>
    </article>
  );
}
