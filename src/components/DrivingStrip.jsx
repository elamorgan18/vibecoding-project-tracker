import Avatar from './Avatar.jsx';

/** One card per team member showing the tasks they have In Progress. */
export default function DrivingStrip({ members, tasks, onOpenTask }) {
  return (
    <section aria-labelledby="driving-heading" className="mb-6">
      <div className="mb-2 flex flex-wrap items-baseline gap-x-3">
        <h2 id="driving-heading" className="text-base font-semibold uppercase tracking-wide text-ink">
          Who's driving what
        </h2>
        <p className="text-sm text-muted">Tasks each person has In Progress.</p>
      </div>

      {members.length === 0 ? (
        <p className="rounded border border-dashed border-line p-4 text-sm text-muted">
          No team members yet. Add someone from the Team panel.
        </p>
      ) : (
        <ul className="flex gap-3 overflow-x-auto pb-1">
          {members.map((member) => {
            const driving = tasks.filter((t) => t.assignee === member.id && t.status === 'in-progress');
            return (
              <li key={member.id} className="w-64 shrink-0 rounded border border-line bg-card p-3">
                <div className="flex items-center gap-2">
                  <Avatar member={member} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{member.name}</p>
                    <p className="text-xs text-muted">
                      {driving.length === 0
                        ? 'Nothing in progress'
                        : `Driving ${driving.length} ${driving.length === 1 ? 'task' : 'tasks'}`}
                    </p>
                  </div>
                </div>
                {driving.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {driving.map((task) => (
                      <li key={task.id}>
                        <button
                          type="button"
                          onClick={() => onOpenTask(task)}
                          className="flex w-full items-baseline gap-1.5 rounded text-left text-xs text-ink hover:text-brand-hover hover:underline focus:outline-none focus:ring-2 focus:ring-brand"
                        >
                          <span className="shrink-0 font-mono text-muted">{task.id}</span>
                          <span className="truncate">{task.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
