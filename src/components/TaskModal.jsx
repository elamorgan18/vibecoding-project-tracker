import { useRef, useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { contextChanged, contextValues, NEW_TASK_CONTEXT } from '../data/context.js';
import { dueState } from '../data/due.js';
import { suggestTool } from '../data/insights.js';
import { STAGES, TASK_TYPES } from '../data/model.js';
import Avatar from './Avatar.jsx';
import ContextSection from './ContextSection.jsx';
import CopyContextButton from './CopyContextButton.jsx';
import Dialog from './Dialog.jsx';
import DueChip from './DueChip.jsx';
import FormField, { inputBorder, inputClass } from './FormField.jsx';
import HandOffMenu from './HandOffMenu.jsx';
import TypeBadge, { TYPE_META } from './TypeBadge.jsx';

const EMPTY_FORM = {
  title: '',
  description: '',
  type: 'feature',
  status: 'todo',
  assignee: '',
  dueDate: '',
};

/**
 * Add / edit modal for a task. `task` is null in create mode.
 * In edit mode the assignee is shown as the task's owner with a
 * "Hand off to…" dropdown that reassigns immediately via `onHandOff`.
 * Delete asks for confirmation inline before calling `onDelete`.
 * `saveError` (set by the parent when storage is full) is shown above the
 * footer; the form keeps everything typed so nothing is lost.
 * `tasks` (the project's tasks) feed the suggested AI tool (M12).
 */
export default function TaskModal({ task, tasks, members, onSave, onDelete, onHandOff, onCopyContext, onClose, saveError }) {
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
          ...contextValues(task),
        }
      : { ...EMPTY_FORM, ...NEW_TASK_CONTEXT },
  );
  const contextBaseline = isEdit ? contextValues(task) : NEW_TASK_CONTEXT;
  const contextDirty = contextChanged(contextBaseline, contextValues(form));
  const [titleError, setTitleError] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const titleRef = useRef(null);

  const owner = members.find((m) => m.id === form.assignee);
  // Live preview of the card's due chip as the date / status change.
  const due = dueState({ dueDate: form.dueDate || null, status: form.status });
  const handOffTargets = members.filter((m) => m.id !== form.assignee);
  // Follows the Type toggle; the task being edited doesn't count towards itself.
  const suggestion = suggestTool(tasks, form.type, task?.id);

  function update(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (field === 'title') setTitleError(false);
    };
  }

  function handleHandOff(memberId) {
    setForm((f) => ({ ...f, assignee: memberId }));
    onHandOff(task.id, memberId);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setTitleError(true);
      titleRef.current?.focus();
      return;
    }
    // Context fields are passed through untouched (no trimming), so pasted
    // text keeps its exact line breaks, indentation and Markdown.
    onSave({
      ...form,
      title,
      description: form.description.trim(),
      assignee: form.assignee || null,
      dueDate: form.dueDate || null,
    });
  }

  return (
    <Dialog labelledBy="task-modal-title" onClose={onClose} initialFocusRef={titleRef} className="max-w-3xl">
      <header
        className={`flex items-start justify-between rounded-t border-b border-line px-5 py-4 ${TYPE_META[form.type].tint}`}
      >
        <div>
          <div className="flex items-center gap-2">
            <h2 id="task-modal-title" className="text-base font-semibold text-ink">
              {isEdit ? 'Edit task' : 'New task'}
            </h2>
            <TypeBadge type={form.type} />
          </div>
          {isEdit && (
            <p className="mt-0.5 font-mono text-xs text-ink-soft">
              {task.id} · <span className="whitespace-nowrap">created {task.createdDate}</span>
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {/* Copies the briefing from what's in the form now, unsaved edits included. */}
          <CopyContextButton onClick={() => onCopyContext({ ...task, ...form })} />
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-ink-soft hover:bg-card hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <X aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4 px-5 py-4">
          {isEdit && (
            <div className="flex flex-col gap-3 rounded border border-line bg-surface p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar member={owner} />
                <div>
                  <p className="text-xs text-muted">Owner</p>
                  <p id="task-owner" className="text-sm font-medium text-ink">
                    {owner ? owner.name : 'Unassigned'}
                  </p>
                </div>
              </div>
              <HandOffMenu members={handOffTargets} onSelect={handleHandOff} />
            </div>
          )}

          <FormField id="task-title" label="Title" error={titleError && 'Give this task a title.'}>
            <input
              ref={titleRef}
              id="task-title"
              type="text"
              value={form.title}
              onChange={update('title')}
              aria-invalid={titleError}
              aria-describedby={titleError ? 'task-title-error' : undefined}
              className={`${inputClass} ${inputBorder(titleError)}`}
            />
          </FormField>

          <FormField id="task-description" label="Description">
            <textarea
              id="task-description"
              rows={3}
              value={form.description}
              onChange={update('description')}
              className={`${inputClass} border-line`}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <fieldset>
              <legend className="mb-1 block text-sm font-medium text-ink">Type</legend>
              <div className="grid grid-cols-2 gap-2">
                {TASK_TYPES.map((type) => {
                  const { label, Icon, icon, selected } = TYPE_META[type];
                  const checked = form.type === type;
                  return (
                    <label
                      key={type}
                      className={`flex cursor-pointer items-center justify-center gap-1.5 rounded border px-3 py-2 text-base font-medium focus-within:ring-2 focus-within:ring-brand ${
                        checked ? selected : 'border-line text-ink-soft hover:bg-muted-bg'
                      }`}
                    >
                      <input
                        type="radio"
                        name="task-type"
                        value={type}
                        checked={checked}
                        onChange={update('type')}
                        className="sr-only"
                      />
                      <Icon aria-hidden="true" className={`h-4 w-4 ${checked ? icon : ''}`} />
                      {label}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <FormField id="task-status" label="Status">
              <select id="task-status" value={form.status} onChange={update('status')} className={`${inputClass} border-line`}>
                {STAGES.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </FormField>

            {!isEdit && (
              <FormField id="task-assignee" label="Assignee">
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
              </FormField>
            )}

            <FormField id="task-due" label="Due date">
              <input
                id="task-due"
                type="date"
                value={form.dueDate}
                onChange={update('dueDate')}
                className={`${inputClass} border-line`}
              />
              {due && (
                <div id="task-due-preview" className="mt-1.5">
                  <DueChip due={due} dueDate={form.dueDate} />
                </div>
              )}
            </FormField>
          </div>

          <ContextSection
            values={contextValues(form)}
            onChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))}
            updatedAt={isEdit ? task.contextUpdatedAt : null}
            dirty={contextDirty}
            suggestion={suggestion}
            taskType={form.type}
          />
        </div>

        {saveError && (
          <div role="alert" className="mx-5 mb-4 flex items-start gap-2 rounded border border-danger bg-danger-soft p-3 text-base text-ink">
            <AlertTriangle aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-danger" />
            <p>
              <span className="font-semibold text-danger-text">Couldn't save. </span>
              {saveError} Your text is still here: use <strong>Copy</strong> on the Context box to keep a copy, then
              free up space (for example, delete old tasks) and try again.
            </p>
          </div>
        )}

        {confirmingDelete ? (
          <div className="flex flex-col gap-3 border-t border-line bg-danger-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-base text-ink">
              <AlertTriangle aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-danger" />
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
                className="flex items-center gap-1.5 rounded bg-danger px-3 py-2 text-sm font-medium text-on-accent hover:bg-danger-hover focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2"
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
                className="flex items-center gap-1.5 rounded bg-danger px-3 py-2 text-sm font-medium text-on-accent hover:bg-danger-hover focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2"
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
                className="rounded bg-brand px-4 py-2 text-sm font-medium text-on-accent hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
              >
                {isEdit ? 'Save changes' : 'Create task'}
              </button>
            </div>
          </footer>
        )}
      </form>
    </Dialog>
  );
}
