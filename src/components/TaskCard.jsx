import { UserRound } from 'lucide-react';
import TypeBadge, { TYPE_META } from './TypeBadge.jsx';

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * One task on the board. The card's background tint and border show its
 * type, backed up by the icon + label badge in the top-right corner.
 * Captions use `ink-soft` because `muted` fails AA on the type tints.
 * The title is a button stretched over the whole card, so clicking anywhere
 * on the card opens it for editing.
 * Due-date state (M8) is added in a later milestone as a left border + chip.
 */
export default function TaskCard({ task, member, onOpen }) {
  return (
    <article
      className={`relative rounded border p-3 transition-shadow focus-within:ring-2 focus-within:ring-brand hover:shadow-md ${TYPE_META[task.type].card}`}
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
        {member ? (
          <>
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft text-[11px] font-semibold text-brand-hover"
            >
              {initials(member.name)}
            </span>
            <span className="text-xs text-ink-soft">{member.name}</span>
          </>
        ) : (
          <>
            <UserRound aria-hidden="true" className="h-4 w-4 text-ink-soft" />
            <span className="text-xs text-ink-soft">Unassigned</span>
          </>
        )}
      </div>
    </article>
  );
}
