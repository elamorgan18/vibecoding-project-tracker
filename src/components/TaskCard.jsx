import { UserRound } from 'lucide-react';

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * One task on the board. Shows the task ID, title and assignee.
 * The title is a button stretched over the whole card, so clicking anywhere
 * on the card opens it for editing.
 * Type badge (M6) and due-date tint (M8) are added in later milestones.
 */
export default function TaskCard({ task, member, onOpen }) {
  return (
    <article className="relative rounded border border-line bg-card p-3 transition-shadow focus-within:ring-2 focus-within:ring-brand hover:shadow-md">
      <p className="font-mono text-xs text-muted">{task.id}</p>
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
            <span className="text-xs text-muted">{member.name}</span>
          </>
        ) : (
          <>
            <UserRound aria-hidden="true" className="h-4 w-4 text-muted" />
            <span className="text-xs text-muted">Unassigned</span>
          </>
        )}
      </div>
    </article>
  );
}
