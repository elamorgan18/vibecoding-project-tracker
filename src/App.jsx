import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Plus, Users } from 'lucide-react';
import { can, currentUser, DEMO_ACCOUNTS, ROLES, withDemoAccounts } from './data/auth.js';
import { buildBriefing } from './data/briefing.js';
import { nextId } from './data/ids.js';
import { hasFilters, matchesFilters, NO_FILTERS } from './data/filters.js';
import { contextChanged, contextValues, NEW_TASK_CONTEXT } from './data/context.js';
import { STAGES, STORAGE_KEYS } from './data/model.js';
import { SEED_TEAMS, SEED_PROJECTS, SEED_TASKS, SEED_ANCHORS, withSecondTeam } from './data/seed.js';
import { projectAnchors, setAnchorUrl } from './data/anchors.js';
import { todayISO } from './data/dates.js';
import { moveTask, nextTaskId, reassignTask, removeTask, unassignMember, upsertTask } from './data/tasks.js';
import { addMember, removeMember, withTeamAvatarColors } from './data/team.js';
import { useLocalStorage, writeStorage } from './hooks/useLocalStorage.js';
import { useTheme } from './hooks/useTheme.js';
import { copyText } from './utils/clipboard.js';
import AnchorBoard from './components/AnchorBoard.jsx';
import AuthScreen from './components/AuthScreen.jsx';
import Board from './components/Board.jsx';
import TeamMembersStrip from './components/TeamMembersStrip.jsx';
import FilterBar from './components/FilterBar.jsx';
import TaskModal from './components/TaskModal.jsx';
import TeamPanel from './components/TeamPanel.jsx';
import TeamSwitcher from './components/TeamSwitcher.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import ViewSwitch from './components/ViewSwitch.jsx';
import Toast from './components/Toast.jsx';
import UserMenu from './components/UserMenu.jsx';

// Loaded on first open, so Recharts isn't in the board's bundle.
const Insights = lazy(() => import('./components/insights/Insights.jsx'));

/**
 * Vibecoding Project Tracker.
 *
 *   src/data/model.js           Team / Project / Task typedefs, STAGES, storage keys
 *   src/data/seed.js            demo team, project and tasks, loaded when localStorage is empty
 *   src/data/tasks.js, team.js, anchors.js  pure update helpers
 *   src/hooks/useLocalStorage.js
 *   src/theme/tokens.js         light + dark colour tokens (read by tailwind.config.js)
 *   src/hooks/useTheme.js       light / dark mode (ThemeToggle in the header)
 *   src/data/filters.js         board filter matching (FilterBar)
 *   src/data/insights.js        Insights view stats + suggested AI tool (M12)
 *   src/data/auth.js            mock login: accounts, roles, permissions (AuthScreen, UserMenu)
 *   src/components/             TeamSwitcher, AnchorBoard → AnchorCard, TeamMembersStrip, FilterBar, Board → Column → TaskCard,
 *                               TaskModal, TeamPanel, Toast (+ shared Dialog,
 *                               FormField, Avatar, TypeBadge), ViewSwitch,
 *                               insights/ (Insights → Progress, Tool, BestWorst)
 *
 * Search for `TODO M<n>` to find the hook for each remaining milestone.
 */
export default function App() {
  const [teams, setTeams, teamsError] = useLocalStorage(STORAGE_KEYS.teams, SEED_TEAMS);
  const [projects, setProjects] = useLocalStorage(STORAGE_KEYS.projects, SEED_PROJECTS);
  const [tasks, setTasks, tasksError] = useLocalStorage(STORAGE_KEYS.tasks, SEED_TASKS);
  const [anchors, setAnchors, anchorsError] = useLocalStorage(STORAGE_KEYS.anchors, SEED_ANCHORS);
  const storageError = tasksError ?? teamsError ?? anchorsError;
  const [isDark, toggleTheme] = useTheme();
  const [currentTeamId, setCurrentTeamId] = useLocalStorage(STORAGE_KEYS.currentTeam, null);
  // Mock login (auth.js). The session stays saved until the user logs out.
  const [accounts, setAccounts] = useLocalStorage(STORAGE_KEYS.accounts, DEMO_ACCOUNTS);
  const [session, setSession] = useLocalStorage(STORAGE_KEYS.session, null);
  const user = currentUser(session, accounts, teams);
  // After logging in, focus goes to the board's heading (the h1).
  const boardHeadingRef = useRef(null);
  const focusBoardHeading = useRef(false);

  // The two demo accounts are always there, even if accounts were saved without them.
  useEffect(() => {
    const withDemo = withDemoAccounts(accounts);
    if (withDemo !== accounts) setAccounts(withDemo);
  }, []);

  // Data saved before the second sample team existed gets it added (once).
  useEffect(() => {
    const added = withSecondTeam({ teams, projects, tasks });
    if (!added) return;
    setTeams(added.teams);
    setProjects(added.projects);
    setTasks(added.tasks);
  }, []);

  // Members saved before avatar colours existed get one (once, then stored).
  useEffect(() => {
    const colored = withTeamAvatarColors(teams);
    if (colored !== teams) setTeams(colored);
  }, [teams]);

  // null = closed, { task: null } = create, { task } = edit.
  const [modal, setModal] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [teamOpen, setTeamOpen] = useState(false);
  // 'board' | 'insights' (ViewSwitch in the header). For this visit only.
  const [view, setView] = useState('board');
  const [toast, setToast] = useState(null);
  // Screen-reader-only announcement for changes that have no visible toast
  // (task saved, created, moved, deleted).
  const [announcement, setAnnouncement] = useState(null);
  // Board filters (FilterBar). Kept for this visit only, not saved.
  const [filters, setFilters] = useState(NO_FILTERS);

  // One project per team for now: the team switcher in the header picks the
  // team, and the board shows that team's first project.
  const teamOptions = teams
    .map((t) => ({ team: t, project: projects.find((p) => p.teamId === t.id) }))
    .filter((o) => o.project);
  const { team, project } = teamOptions.find((o) => o.team.id === currentTeamId) ?? teamOptions[0];

  // The login screen sets its own title.
  useEffect(() => {
    if (!user) return;
    document.title = `${view === 'insights' ? 'Insights' : 'Board'} – ${team.name} – Vibecoding Project Tracker`;
  }, [view, team.name, Boolean(user)]);

  useEffect(() => {
    if (!user || !focusBoardHeading.current) return;
    focusBoardHeading.current = false;
    boardHeadingRef.current?.focus();
  }, [session]);

  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const visibleTasks = projectTasks.filter((task) => matchesFilters(task, filters));

  function showToast(message, tone = 'success') {
    setToast({ id: Date.now(), message, tone });
  }

  function announce(message) {
    setAnnouncement({ id: Date.now(), message });
  }

  // The title / logo in the header: back to the board, closing any dialog first.
  function goToBoard() {
    closeModal();
    setTeamOpen(false);
    setView('board');
  }

  function switchTeam(teamId) {
    const next = teams.find((t) => t.id === teamId);
    setCurrentTeamId(teamId);
    // Member filters belong to the old team.
    setFilters(NO_FILTERS);
    announce(`Switched to ${next.name}`);
  }

  function startSession(nextSession, message) {
    focusBoardHeading.current = true;
    setView('board');
    setSession(nextSession);
    announce(message);
  }

  function handleLogin(account) {
    const name = currentUser({ accountId: account.id }, accounts, teams).name;
    startSession({ accountId: account.id }, `Logged in as ${name}, ${ROLES[account.role].label}.`);
  }

  function handleGuest() {
    startSession({ guest: true }, `Continuing as ${ROLES.guest.label}.`);
  }

  // A new account gets a matching new member in the first (demo) team.
  // Nothing else changes. Sign-up has no GitHub field, so that stays empty.
  function handleSignUp({ name, email, role, passwordHash }) {
    const memberTeam = teams[0];
    const result = addMember(teams, memberTeam.id, { name, email, githubUsername: '' });
    const account = { id: nextId(accounts, 'account'), email, passwordHash, role, memberId: result.member.id, name };
    setTeams(result.teams);
    setAccounts((all) => [...all, account]);
    setCurrentTeamId(memberTeam.id);
    startSession({ accountId: account.id }, `Account created. Logged in as ${name}, ${ROLES[role].label}.`);
  }

  function handleLogout() {
    closeModal();
    setTeamOpen(false);
    setFilters(NO_FILTERS);
    setSession(null);
    announce('Logged out.');
  }

  function skipToMain(e) {
    e.preventDefault();
    document.getElementById('main')?.focus();
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

    const stage = STAGES.find((s) => s.id === task.status).label;
    if (!existing) announce(`Created task: ${task.title}, in ${stage}.`);
    else if (existing.status !== task.status) announce(`Saved task: ${task.title}. Moved to ${stage}.`);
    else announce(`Saved task: ${task.title}.`);
  }

  function handleDelete(id) {
    const task = tasks.find((t) => t.id === id);
    setTasks((all) => removeTask(all, id));
    closeModal();
    announce(`Deleted task: ${task.title}.`);
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
      {user ? (
        <>
          {/* Off-screen until focused (the first Tab on the page). */}
          <a
            href="#main"
            onClick={skipToMain}
            className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-2 focus:z-[70] focus:rounded focus:border focus:border-line focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {view === 'insights' ? 'Skip to insights' : 'Skip to board'}
          </a>

          <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 ref={boardHeadingRef} tabIndex={-1} className="flex text-2xl font-semibold text-ink focus:outline-none">
                <button
                  type="button"
                  onClick={goToBoard}
                  aria-label="Vibecoding Project Tracker – go to board"
                  className="flex cursor-pointer items-center gap-2 rounded text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-brand" />
                  Vibecoding Project Tracker
                </button>
              </h1>
              <TeamSwitcher options={teamOptions} currentTeamId={team.id} onSelect={switchTeam} />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <nav aria-label="Views">
                <ViewSwitch view={view} onChange={setView} />
              </nav>
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
              <UserMenu user={user} onLogout={handleLogout} />
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

          <main id="main" tabIndex={-1} className="focus:outline-none">
            {view === 'insights' ? (
              <Suspense fallback={<p className="text-sm text-muted">Loading insights…</p>}>
                <Insights key={project.id} tasks={projectTasks} members={team.members} projectName={project.name} isDark={isDark} />
              </Suspense>
            ) : (
              <>
                <AnchorBoard
                  key={project.id}
                  anchors={projectAnchors(anchors, project.id)}
                  canEdit={can(user.role, 'editDeliverables')}
                  onSave={handleSaveAnchor}
                />

                <TeamMembersStrip members={team.members} tasks={projectTasks} onOpenTask={openModal} />

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
              </>
            )}
          </main>

          {modal && (
            <TaskModal
              key={modal.task?.id ?? 'new'}
              task={modal.task}
              tasks={projectTasks}
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
              canManage={can(user.role, 'manageMembers')}
              onAdd={handleAddMember}
              onRemove={handleRemoveMember}
              onClose={() => setTeamOpen(false)}
            />
          )}
        </>
      ) : (
        <AuthScreen
          accounts={accounts}
          onLogin={handleLogin}
          onSignUp={handleSignUp}
          onGuest={handleGuest}
          announce={announce}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <p role="status" aria-live="polite" className="sr-only">
        {/* A new key each time, so the same message is announced again. */}
        {announcement && <span key={announcement.id}>{announcement.message}</span>}
      </p>
    </div>
  );
}
