import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Trash2, UserPlus, X } from 'lucide-react';
import Avatar from './Avatar.jsx';
import Dialog from './Dialog.jsx';
import FormField, { inputBorder, inputClass } from './FormField.jsx';

const EMPTY_FORM = { name: '', email: '', githubUsername: '' };
const FIELD_ORDER = ['name', 'email', 'githubUsername'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// GitHub: letters, numbers and single hyphens, not starting or ending with one, max 39.
const GITHUB_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;

function validate(values, members) {
  const errors = {};
  if (!values.name) errors.name = 'Enter a name.';
  if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'Enter a valid email, like name@example.com.';
  } else if (members.some((m) => m.email.toLowerCase() === values.email.toLowerCase())) {
    errors.email = 'Someone on the team already uses this email.';
  }
  if (!GITHUB_PATTERN.test(values.githubUsername)) {
    errors.githubUsername = 'Enter a GitHub username (letters, numbers and hyphens).';
  }
  return errors;
}

/** View, add and remove team members. */
export default function TeamPanel({ team, tasks, onAdd, onRemove, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [confirmingId, setConfirmingId] = useState(null);
  const fieldRefs = { name: useRef(null), email: useRef(null), githubUsername: useRef(null) };
  const keepRef = useRef(null);
  const removeRefs = useRef({});
  const lastConfirmingId = useRef(null);

  // Focus follows the inline remove confirmation: "Keep" when it opens, then
  // back to that member's Remove button, or the Name field if they were removed.
  useEffect(() => {
    if (confirmingId) keepRef.current?.focus();
    else if (lastConfirmingId.current) (removeRefs.current[lastConfirmingId.current] ?? fieldRefs.name.current)?.focus();
    lastConfirmingId.current = confirmingId;
  }, [confirmingId]);

  function update(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((errs) => ({ ...errs, [field]: undefined }));
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    const values = {
      name: form.name.trim(),
      email: form.email.trim(),
      githubUsername: form.githubUsername.trim().replace(/^@/, ''),
    };
    const found = validate(values, team.members);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      fieldRefs[FIELD_ORDER.find((f) => found[f])].current?.focus();
      return;
    }
    onAdd(values);
    setForm(EMPTY_FORM);
    setErrors({});
    fieldRefs.name.current?.focus();
  }

  const taskCount = (memberId) => tasks.filter((t) => t.assignee === memberId).length;
  const plural = (n) => `${n} ${n === 1 ? 'task' : 'tasks'}`;

  return (
    <Dialog labelledBy="team-panel-title" onClose={onClose}>
      <div className="flex items-start justify-between border-b border-line px-5 py-4">
        <div>
          <h2 id="team-panel-title" className="text-base font-semibold text-ink">
            Team
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            {team.name} · {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-ink-soft hover:bg-muted-bg hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand"
        >
          <X aria-hidden="true" className="h-5 w-5" />
          <span className="sr-only">Close Team panel</span>
        </button>
      </div>

      {team.members.length === 0 ? (
        <p className="m-5 rounded border border-dashed border-line p-4 text-center text-sm text-muted">
          No members yet. Add the first one below.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {team.members.map((member) => {
            const count = taskCount(member.id);
            const confirming = confirmingId === member.id;
            return (
              <li key={member.id}>
                <div className="flex items-center gap-3 px-5 py-3">
                  <Avatar member={member} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{member.name}</p>
                    <p className="truncate text-xs text-muted">
                      {member.email} · <span className="font-mono">@{member.githubUsername}</span>
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">{plural(count)}</span>
                  {!confirming && (
                    <button
                      ref={(el) => (removeRefs.current[member.id] = el)}
                      type="button"
                      onClick={() => setConfirmingId(member.id)}
                      className="flex shrink-0 items-center gap-1 rounded px-2 py-1 text-xs font-medium text-danger-text hover:bg-danger-soft focus:outline-none focus:ring-2 focus:ring-danger"
                    >
                      <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                      Remove<span className="sr-only"> {member.name}</span>
                    </button>
                  )}
                </div>
                {confirming && (
                  <div className="flex flex-col gap-3 bg-danger-soft px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <p id={`remove-${member.id}-question`} className="flex items-start gap-2 text-base text-ink">
                      <AlertTriangle aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-danger" />
                      {count > 0
                        ? `Remove ${member.name} from the team? Their ${plural(count)} will become unassigned.`
                        : `Remove ${member.name} from the team?`}
                    </p>
                    <div className="flex shrink-0 items-center gap-3">
                      <button
                        type="button"
                        ref={keepRef}
                        aria-describedby={`remove-${member.id}-question`}
                        onClick={() => setConfirmingId(null)}
                        className="rounded px-2 py-1 text-sm font-medium text-ink-soft hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand"
                      >
                        Keep
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmingId(null);
                          onRemove(member.id);
                        }}
                        className="flex items-center gap-1.5 rounded bg-danger px-3 py-2 text-sm font-medium text-on-accent hover:bg-danger-hover focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2"
                      >
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
                        Remove member
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={handleSubmit} noValidate className="border-t border-line px-5 py-4">
        <h3 className="mb-3 text-sm font-semibold text-ink">Add a member</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField id="member-name" label="Name" error={errors.name}>
              <input
                ref={fieldRefs.name}
                id="member-name"
                type="text"
                autoComplete="off"
                value={form.name}
                onChange={update('name')}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'member-name-error' : undefined}
                className={`${inputClass} ${inputBorder(errors.name)}`}
              />
            </FormField>
          </div>
          <FormField id="member-email" label="Email" error={errors.email}>
            <input
              ref={fieldRefs.email}
              id="member-email"
              type="email"
              autoComplete="off"
              value={form.email}
              onChange={update('email')}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'member-email-error' : undefined}
              className={`${inputClass} ${inputBorder(errors.email)}`}
            />
          </FormField>
          <FormField id="member-github" label="GitHub username" error={errors.githubUsername}>
            <input
              ref={fieldRefs.githubUsername}
              id="member-github"
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={form.githubUsername}
              onChange={update('githubUsername')}
              aria-invalid={!!errors.githubUsername}
              aria-describedby={errors.githubUsername ? 'member-github-error' : undefined}
              className={`${inputClass} font-mono ${inputBorder(errors.githubUsername)}`}
            />
          </FormField>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded bg-brand px-4 py-2 text-sm font-medium text-on-accent hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            <UserPlus aria-hidden="true" className="h-4 w-4" />
            Add member
          </button>
        </div>
      </form>
    </Dialog>
  );
}
