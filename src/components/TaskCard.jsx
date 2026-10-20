import Avatar from './Avatar.jsx';
import TypeBadge, { TYPE_META } from './TypeBadge.jsx';

/**
 * One task on the board. The card's background tint and border show its
 * type, backed up by the icon + label badge in the top-right corner. The
 * owner's initials avatar and name sit along the bottom.
 * Captions use `ink-soft` because `muted` fails AA on the type tints.
 * The title is a button stretched over the whole card, so clicking anywhere
 * on the card opens it for editing.
 * Due-date state (M8) is added in a later milestone as a left border + chip.
 *
 * Focused / selected state: a brand ring with a 2px offset in the column's
 * `muted-bg`, so it sits outside the type border instead of blending into it,
 * and is identical on every card whatever its type.
 */
const FOCUS_RING =
  'focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 focus-within:ring-offset-muted-bg';

export default function TaskCard({ task, member, onOpen }) {
  return (
    <article
      className={`relative rounded border p-3 transition-shadow hover:shadow-md ${FOCUS_RING} ${TYPE_META[task.type].card}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-xs text-ink-soft">{task.id}</p>
        <TypeBadge type={task.type} />
      </div>
      <h3 className="mt-1 text-sm font-medium text-ink">
        <button
          type="button"
          onClick={() => onOpen(task)}
          className="text-left after:absolute after:inset-0 after:rounded after:content-[''] focus:outline-none"
        >
          {task.title}
        </button>
      </h3>

      <div className="mt-3 flex items-center gap-2">
        <Avatar member={member} />
        {member ? (
          <span className="text-sm font-medium text-ink">{member.name}</span>
        ) : (
          <span className="text-sm text-ink-soft">Unassigned</span>
        )}
      </div>
    </article>
  );
}
