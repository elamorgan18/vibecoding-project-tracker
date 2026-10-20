import { STORAGE_KEYS } from './data/model.js';
import { SEED_TEAMS, SEED_PROJECTS, SEED_TASKS } from './data/seed.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import Board from './components/Board.jsx';

/**
 * Vibecoding Project Tracker.
 *
 *   src/data/model.js           Team / Project / Task typedefs, STAGES, storage keys
 *   src/data/seed.js            mock team, project and tasks for first load
 *   src/hooks/useLocalStorage.js
 *   src/components/             Board → Column → TaskCard
 *
 * Search for `TODO M<n>` to find the hook for each remaining milestone.
 */
export default function App() {
  const [teams] = useLocalStorage(STORAGE_KEYS.teams, SEED_TEAMS);
  const [projects] = useLocalStorage(STORAGE_KEYS.projects, SEED_PROJECTS);
  const [tasks] = useLocalStorage(STORAGE_KEYS.tasks, SEED_TASKS);

  // One team, one project for now. A project switcher can replace this later.
  const project = projects[0];
  const team = teams.find((t) => t.id === project.teamId);
  const projectTasks = tasks.filter((task) => task.projectId === project.id);

  // TODO M5 crud-modal:
  //   const [editing, setEditing] = useState(null);
  //
  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  return (
    <div className="min-h-screen bg-surface p-6 font-sans text-ink">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-ink">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-brand" />
            Vibecoding Project Tracker
          </h1>
          <p className="mt-1 text-sm text-muted">
            {team.name} · {project.name}
          </p>
        </div>
      </header>

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      {/* TODO M5 crud-modal: "+ New task" button, and click a card to edit it. */}
      <Board tasks={projectTasks} members={team.members} />
    </div>
  );
}
