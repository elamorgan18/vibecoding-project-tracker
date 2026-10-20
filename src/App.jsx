import { useState } from 'react';
import { AlertTriangle, Plus, Users } from 'lucide-react';
import { contextChanged, contextValues, NEW_TASK_CONTEXT } from './data/context.js';
import { STORAGE_KEYS } from './data/model.js';
import { SEED_TEAMS, SEED_PROJECTS, SEED_TASKS } from './data/seed.js';
import { todayISO } from './data/dates.js';
import { nextTaskId, reassignTask, removeTask, unassignMember, upsertTask } from './data/tasks.js';
import { addMember, removeMember } from './data/team.js';
import { useLocalStorage, writeStorage } from './hooks/useLocalStorage.js';
import Board from './components/Board.jsx';
import DrivingStrip from './components/DrivingStrip.jsx';
import DueLegend from './components/DueLegend.jsx';
import TaskModal from './components/TaskModal.jsx';
import TeamPanel from './components/TeamPanel.jsx';
import Toast from './components/Toast.jsx';

/**
 * Vibecoding Project Tracker.
 *
 *   src/data/model.js           Team / Project / Task typedefs, STAGES, storage keys
 *   src/data/seed.js            mock team, project and tasks for first load
 *   src/data/tasks.js, team.js  pure update helpers
 *   src/hooks/useLocalStorage.js
 *   src/components/             DrivingStrip, Board → Column → TaskCard,
 *                               TaskModal, TeamPanel, Toast (+ shared Dialog,
 *                               FormField, Avatar, TypeBadge)
 *
 * Search for `TODO M<n>` to find the hook for each remaining milestone.
 */
export default function App() {
  const [teams, setTeams, teamsError] = useLocalStorage(STORAGE_KEYS.teams, SEED_TEAMS);
  const [projects] = useLocalStorage(STORAGE_KEYS.projects, SEED_PROJECTS);
  const [tasks, setTasks, tasksError] = useLocalStorage(STORAGE_KEYS.tasks, SEED_TASKS);
  const storageError = tasksError ?? teamsError;

  // null = closed, { task: null } = create, { task } = edit.
  const [modal, setModal] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [teamOpen, setTeamOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // One team, one project for now. A project switcher can replace this later.
  const project = projects[0];
  const team = teams.find((t) => t.id === project.teamId);
  const projectTasks = tasks.filter((task) => task.projectId === project.id);

  function showToast(message) {
    setToast({ id: Date.now(), message });
  }

  function openModal(task) {
    setSaveError(null);
    setModal({ task });
  }

  function closeModal() {
    setSaveError(null);
    setModal(null);
  }

  function handleSave(values) {
    const existing = modal.task;
    const before = existing ? contextValues(existing) : NEW_TASK_CONTEXT;
    const contextUpdatedAt = contextChanged(before, contextValues(values))
      ? new Date().toISOString()
      : (existing?.contextUpdatedAt ?? null);
    const task = existing
      ? { ...existing, ...values, contextUpdatedAt }
      : { ...values, id: nextTaskId(tasks), projectId: project.id, createdDate: todayISO(), contextUpdatedAt };
    const next = upsertTask(tasks, task);

    // Write now (not just in the hook's effect) so a full storage is caught
    // while the modal is still open with the user's text in it.
    const result = writeStorage(STORAGE_KEYS.tasks, next);
    if (!result.ok) {
      setSaveError(result.error);
      return;
    }
    setTasks(next);
    closeModal();
  }

  function handleDelete(id) {
    setTasks((all) => removeTask(all, id));
    closeModal();
  }

  function handleHandOff(taskId, memberId) {
    setTasks((all) => reassignTask(all, taskId, memberId));
    const member = team.members.find((m) => m.id === memberId);
    showToast(`Handed to ${member.name}. It's on their board now.`);
  }

  function handleAddMember(values) {
    const result = addMember(teams, team.id, values);
    setTeams(result.teams);
    showToast(`Added ${result.member.name} to the team.`);
  }

  function handleRemoveMember(memberId) {
    const member = team.members.find((m) => m.id === memberId);
    setTeams((all) => removeMember(all, team.id, memberId));
    setTasks((all) => unassignMember(all, memberId));
    showToast(`Removed ${member.name} from the team.`);
  }

  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  return (
    <div className="min-h-screen bg-surface p-6 font-sans text-ink">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-ink">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-brand" />
            Vibecoding Project Tracker
          </h1>
          <p className="mt-1 text-sm text-muted">
            {team.name} · {project.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTeamOpen(true)}
            className="flex items-center gap-1.5 rounded border border-line bg-card px-4 py-2 text-sm font-medium text-ink hover:bg-muted-bg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            <Users aria-hidden="true" className="h-4 w-4 text-ink-soft" />
            Team
            <span className="rounded-full bg-muted-bg px-1.5 text-xs text-ink-soft">{team.members.length}</span>
          </button>
          <button
            type="button"
            onClick={() => openModal(null)}
            className="flex items-center gap-1.5 rounded bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            New task
          </button>
        </div>
      </header>

      {storageError && (
        <div role="alert" className="mb-6 flex items-start gap-2 rounded border border-danger bg-danger-soft p-3 text-sm text-ink">
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          <p>
            <span className="font-semibold text-danger-text">Your latest changes aren't saved. </span>
            {storageError} They'll be lost if you close or reload this page. Free up space (for example, delete old
            tasks or long context) and try again.
          </p>
        </div>
      )}

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      <DrivingStrip members={team.members} tasks={projectTasks} onOpenTask={openModal} />

      <DueLegend />

      <Board tasks={projectTasks} members={team.members} onOpenTask={openModal} />

      {modal && (
        <TaskModal
          key={modal.task?.id ?? 'new'}
          task={modal.task}
          members={team.members}
          onSave={handleSave}
          onDelete={handleDelete}
          onHandOff={handleHandOff}
          onClose={closeModal}
          saveError={saveError}
        />
      )}

      {teamOpen && (
        <TeamPanel
          team={team}
          tasks={projectTasks}
          onAdd={handleAddMember}
          onRemove={handleRemoveMember}
          onClose={() => setTeamOpen(false)}
        />
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
