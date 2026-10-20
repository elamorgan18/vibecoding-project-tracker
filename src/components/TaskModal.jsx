import { useEffect, useRef, useState } from 'react';
import { AlertCircle, AlertTriangle, Trash2, X } from 'lucide-react';
import { STAGES, TASK_TYPES } from '../data/model.js';

const TYPE_LABELS = { feature: 'Feature', bug: 'Bug' };

const EMPTY_FORM = {
  title: '',
  description: '',
  type: 'feature',
  status: 'todo',
  assignee: '',
  dueDate: '',
};

const inputClass =
  'w-full rounded border bg-card px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand';

function Field({ id, label, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint}
    </div>
  );
}

/**
 * Add / edit modal for a task. `task` is null in create mode.
 * Delete asks for confirmation inline before calling `onDelete`.
 */
export default function TaskModal({ task, members, onSave, onDelete, onClose }) {
  const isEdit = task != null;
  const [form, setForm] = useState(() =>
    isEdit
      ? {
          title: task.title,
          description: task.description,
          type: task.type,
          status: task.status,
          assignee: task.assignee ?? '',
          dueDate: task.dueDate ?? '',
        }
      : EMPTY_FORM,
  );
  const [titleError, setTitleError] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Focus the title on open, keep Tab inside the dialog, close on Escape,
  // and hand focus back to whatever opened the modal when it closes.
  useEffect(() => {
    const opener = document.activeElement;
    titleRef.current?.focus();

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = dialogRef.current.querySelectorAll(
        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      opener?.focus?.();
    };
  }, []);

  function update(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (field === 'title') setTitleError(false);
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setTitleError(true);
      titleRef.current?.focus();
      return;
    }
    onSave({
      ...form,
      title,
      description: form.description.trim(),
      assignee: form.assignee || null,
      dueDate: form.dueDate || null,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="w-full max-w-lg rounded border border-line bg-card shadow-xl"
      >
        <header className="flex items-start justify-between border-b border-line px-5 py-4">
          <div>
            <h2 id="task-modal-title" className="text-base font-semibold text-ink">
              {isEdit ? 'Edit task' : 'New task'}
            </h2>
            {isEdit && (
              <p className="mt-0.5 font-mono text-xs text-muted">
                {task.id} · created {task.createdDate}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-muted hover:bg-muted-bg hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <X aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 px-5 py-4">
            <Field
              id="task-title"
              label="Title"
              hint={
                titleError && (
                  <p id="task-title-error" className="mt-1 flex items-center gap-1 text-xs text-danger-text">
                    <AlertCircle aria-hidden="true" className="h-3.5 w-3.5" />
                    Give this task a title.
                  </p>
                )
              }
            >
              <input
                ref={titleRef}
                id="task-title"
                type="text"
                value={form.title}
                onChange={update('title')}
                aria-invalid={titleError}
                aria-describedby={titleError ? 'task-title-error' : undefined}
                className={`${inputClass} ${titleError ? 'border-danger' : 'border-line'}`}
              />
            </Field>

            <Field id="task-description" label="Description">
              <textarea
                id="task-description"
                rows={3}
                value={form.description}
                onChange={update('description')}
                className={`${inputClass} border-line`}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="task-type" label="Type">
                <select id="task-type" value={form.type} onChange={update('type')} className={`${inputClass} border-line`}>
                  {TASK_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="task-status" label="Status">
                <select id="task-status" value={form.status} onChange={update('status')} className={`${inputClass} border-line`}>
                  {STAGES.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="task-assignee" label="Assignee">
                <select
                  id="task-assignee"
                  value={form.assignee}
                  onChange={update('assignee')}
                  className={`${inputClass} border-line`}
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="task-due" label="Due date">
                <input
                  id="task-due"
                  type="date"
                  value={form.dueDate}
                  onChange={update('dueDate')}
                  className={`${inputClass} border-line`}
                />
              </Field>
            </div>
          </div>

          {confirmingDelete ? (
            <div className="flex flex-col gap-3 border-t border-line bg-danger-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2 text-sm text-ink">
                <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                Delete this task and its prompt history? This can't be undone.
              </p>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  autoFocus
                  onClick={() => setConfirmingDelete(false)}
                  className="rounded px-2 py-1 text-sm font-medium text-ink-soft hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  Keep it
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(task.id)}
                  className="flex items-center gap-1.5 rounded bg-danger px-3 py-2 text-sm font-medium text-white hover:bg-danger-hover focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                  Delete task
                </button>
              </div>
            </div>
          ) : (
            <footer className="flex items-center justify-between border-t border-line px-5 py-4">
              {isEdit ? (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="flex items-center gap-1.5 rounded bg-danger px-3 py-2 text-sm font-medium text-white hover:bg-danger-hover focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                  Delete task
                </button>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded px-2 py-1 text-sm font-medium text-ink-soft hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
                >
                  {isEdit ? 'Save changes' : 'Create task'}
                </button>
              </div>
            </footer>
          )}
        </form>
      </div>
    </div>
  );
}
