import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { STORAGE_KEYS } from './data/model.js';
import { SEED_TEAMS, SEED_PROJECTS, SEED_TASKS } from './data/seed.js';
import { todayISO } from './data/dates.js';
import { nextTaskId, reassignTask, removeTask, unassignMember, upsertTask } from './data/tasks.js';
import { addMember, removeMember } from './data/team.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
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
  const [teams, setTeams] = useLocalStorage(STORAGE_KEYS.teams, SEED_TEAMS);
  const [projects] = useLocalStorage(STORAGE_KEYS.projects, SEED_PROJECTS);
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.tasks, SEED_TASKS);

  // null = closed, { task: null } = create, { task } = edit.
  const [modal, setModal] = useState(null);
  const [teamOpen, setTeamOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // One team, one project for now. A project switcher can replace this later.
  const project = projects[0];
  const team = teams.find((t) => t.id === project.teamId);
  const projectTasks = tasks.filter((task) => task.projectId === project.id);

  function showToast(message) {
    setToast({ id: Date.now(), message });
  }

  function handleSave(values) {
    const existing = modal.task;
    const task = existing
      ? { ...existing, ...values }
      : { ...values, id: nextTaskId(tasks), projectId: project.id, createdDate: todayISO() };
    setTasks((all) => upsertTask(all, task));
    setModal(null);
  }

  function handleDelete(id) {
    setTasks((all) => removeTask(all, id));
    setModal(null);
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
            onClick={() => setModal({ task: null })}
            className="flex items-center gap-1.5 rounded bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            New task
          </button>
        </div>
      </header>

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      <DrivingStrip members={team.members} tasks={projectTasks} onOpenTask={(task) => setModal({ task })} />

      <DueLegend />

      <Board tasks={projectTasks} members={team.members} onOpenTask={(task) => setModal({ task })} />

      {modal && (
        <TaskModal
          key={modal.task?.id ?? 'new'}
          task={modal.task}
          members={team.members}
          onSave={handleSave}
          onDelete={handleDelete}
          onHandOff={handleHandOff}
          onClose={() => setModal(null)}
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
