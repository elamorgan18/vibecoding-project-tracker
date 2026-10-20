import { useEffect, useState } from 'react';
import { AlertTriangle, Plus, Users } from 'lucide-react';
import { buildBriefing } from './data/briefing.js';
import { hasFilters, matchesFilters, NO_FILTERS } from './data/filters.js';
import { contextChanged, contextValues, NEW_TASK_CONTEXT } from './data/context.js';
import { STORAGE_KEYS } from './data/model.js';
import { SEED_TEAMS, SEED_PROJECTS, SEED_TASKS, SEED_ANCHORS } from './data/seed.js';
import { projectAnchors, setAnchorUrl } from './data/anchors.js';
import { todayISO } from './data/dates.js';
import { moveTask, nextTaskId, reassignTask, removeTask, unassignMember, upsertTask } from './data/tasks.js';
import { addMember, removeMember, withTeamAvatarColors } from './data/team.js';
import { useLocalStorage, writeStorage } from './hooks/useLocalStorage.js';
import { useTheme } from './hooks/useTheme.js';
import { copyText } from './utils/clipboard.js';
import AnchorBoard from './components/AnchorBoard.jsx';
import Board from './components/Board.jsx';
import TeamMembersStrip from './components/TeamMembersStrip.jsx';
import DueLegend from './components/DueLegend.jsx';
import FilterBar from './components/FilterBar.jsx';
import TaskModal from './components/TaskModal.jsx';
import TeamPanel from './components/TeamPanel.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import Toast from './components/Toast.jsx';

/**
 * Vibecoding Project Tracker.
 *
 *   src/data/model.js           Team / Project / Task typedefs, STAGES, storage keys
 *   src/data/seed.js            mock team, project and tasks for first load
 *   src/data/tasks.js, team.js, anchors.js  pure update helpers
 *   src/hooks/useLocalStorage.js
 *   src/theme/tokens.js         light + dark colour tokens (read by tailwind.config.js)
 *   src/hooks/useTheme.js       light / dark mode (ThemeToggle in the header)
 *   src/data/filters.js         board filter matching (FilterBar)
 *   src/components/             AnchorBoard → AnchorCard, TeamMembersStrip, FilterBar, Board → Column → TaskCard,
 *                               TaskModal, TeamPanel, Toast (+ shared Dialog,
 *                               FormField, Avatar, TypeBadge)
 *
 * Search for `TODO M<n>` to find the hook for each remaining milestone.
 */
export default function App() {
  const [teams, setTeams, teamsError] = useLocalStorage(STORAGE_KEYS.teams, SEED_TEAMS);
  const [projects] = useLocalStorage(STORAGE_KEYS.projects, SEED_PROJECTS);
  const [tasks, setTasks, tasksError] = useLocalStorage(STORAGE_KEYS.tasks, SEED_TASKS);
  const [anchors, setAnchors, anchorsError] = useLocalStorage(STORAGE_KEYS.anchors, SEED_ANCHORS);
  const storageError = tasksError ?? teamsError ?? anchorsError;
  const [isDark, toggleTheme] = useTheme();

  // Members saved before avatar colours existed get one (once, then stored).
  useEffect(() => {
    const colored = withTeamAvatarColors(teams);
    if (colored !== teams) setTeams(colored);
  }, [teams]);

  // null = closed, { task: null } = create, { task } = edit.
  const [modal, setModal] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [teamOpen, setTeamOpen] = useState(false);
  const [toast, setToast] = useState(null);
  // Board filters (FilterBar). Kept for this visit only, not saved.
  const [filters, setFilters] = useState(NO_FILTERS);

  // One team, one project for now. A project switcher can replace this later.
  const project = projects[0];
  const team = teams.find((t) => t.id === project.teamId);
  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const visibleTasks = projectTasks.filter((task) => matchesFilters(task, filters));

  function showToast(message, tone = 'success') {
    setToast({ id: Date.now(), message, tone });
  }

  async function handleCopyContext(task) {
    try {
      await copyText(buildBriefing(task));
      showToast('Copied to clipboard!');
    } catch {
      showToast("Couldn't copy. Your browser blocked the clipboard.", 'danger');
    }
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

  function handleMoveTask(taskId, status) {
    setTasks((all) => moveTask(all, taskId, status));
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
    setFilters((f) => ({ ...f, members: f.members.filter((id) => id !== memberId) }));
    showToast(`Removed ${member.name} from the team.`);
  }

  function handleSaveAnchor(anchorId, url) {
    setAnchors((all) => setAnchorUrl(all, project.id, anchorId, url));
  }

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
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
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
            className="flex items-center gap-1.5 rounded bg-brand px-4 py-2 text-sm font-medium text-on-accent hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            New task
          </button>
        </div>
      </header>

      {storageError && (
        <div role="alert" className="mb-6 flex items-start gap-2 rounded border border-danger bg-danger-soft p-3 text-base text-ink">
          <AlertTriangle aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-danger" />
          <p>
            <span className="font-semibold text-danger-text">Your latest changes aren't saved. </span>
            {storageError} They'll be lost if you close or reload this page. Free up space (for example, delete old
            tasks or long context) and try again.
          </p>
        </div>
      )}

      <AnchorBoard anchors={projectAnchors(anchors, project.id)} onSave={handleSaveAnchor} />

      <TeamMembersStrip members={team.members} tasks={projectTasks} onOpenTask={openModal} />

      <DueLegend />

      <FilterBar
        filters={filters}
        onChange={setFilters}
        members={team.members}
        shownCount={visibleTasks.length}
        totalCount={projectTasks.length}
      />

      <Board
        tasks={visibleTasks}
        isFiltered={hasFilters(filters)}
        members={team.members}
        onOpenTask={openModal}
        onCopyContext={handleCopyContext}
        onMoveTask={handleMoveTask}
      />

      {modal && (
        <TaskModal
          key={modal.task?.id ?? 'new'}
          task={modal.task}
          members={team.members}
          onSave={handleSave}
          onDelete={handleDelete}
          onHandOff={handleHandOff}
          onCopyContext={handleCopyContext}
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
