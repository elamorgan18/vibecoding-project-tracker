import { useState } from 'react';
import { Plus } from 'lucide-react';
import { STORAGE_KEYS } from './data/model.js';
import { SEED_TEAMS, SEED_PROJECTS, SEED_TASKS } from './data/seed.js';
import { nextTaskId, removeTask, todayISO, upsertTask } from './data/tasks.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import Board from './components/Board.jsx';
import TaskModal from './components/TaskModal.jsx';

/**
 * Vibecoding Project Tracker.
 *
 *   src/data/model.js           Team / Project / Task typedefs, STAGES, storage keys
 *   src/data/seed.js            mock team, project and tasks for first load
 *   src/data/tasks.js           create / update / delete helpers
 *   src/hooks/useLocalStorage.js
 *   src/components/             Board → Column → TaskCard, TaskModal
 *
 * Search for `TODO M<n>` to find the hook for each remaining milestone.
 */
export default function App() {
  const [teams] = useLocalStorage(STORAGE_KEYS.teams, SEED_TEAMS);
  const [projects] = useLocalStorage(STORAGE_KEYS.projects, SEED_PROJECTS);
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.tasks, SEED_TASKS);

  // null = closed, { task: null } = create, { task } = edit.
  const [modal, setModal] = useState(null);

  // One team, one project for now. A project switcher can replace this later.
  const project = projects[0];
  const team = teams.find((t) => t.id === project.teamId);
  const projectTasks = tasks.filter((task) => task.projectId === project.id);

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

  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  return (
    <div className="min-h-screen bg-surface p-6 font-sans text-ink">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-ink">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-brand" />
            Vibecoding Project Tracker
          </h1>
          <p className="mt-1 text-sm text-muted">
            {team.name} · {project.name}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ task: null })}
          className="flex items-center gap-1.5 rounded bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          New task
        </button>
      </header>

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      <Board tasks={projectTasks} members={team.members} onOpenTask={(task) => setModal({ task })} />

      {modal && (
        <TaskModal
          key={modal.task?.id ?? 'new'}
          task={modal.task}
          members={team.members}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
