/**
 * Demo data, used as the default for each storage key that is empty
 * (useLocalStorage's initial value): a first-time visitor, or an assessor
 * opening the deployed link, sees a full board. Data that is already saved
 * is never replaced; from then on the user's own changes are saved as normal.
 *
 * The team members are fictional. They represent the product's target users
 * (junior and more experienced developers building with AI tools), not real
 * collaborators.
 *
 * 14 tasks, 3–4 per column, 4 members. Dates are relative to the moment the
 * data is created, so the board always has tasks in every due state
 * (DESIGN.md §2.4): overdue, due soon (warning), calm, done, and one with no
 * due date. The dates are saved on the first visit and don't move after
 * that, so open tasks are due a week or more out; only two are overdue from
 * the start, and one per team is "Due in 2 days" (the warning state).
 *
 * The AI outcomes are chosen so every part of Insights (M12) has something
 * to say (success rate = Worked ÷ Worked + Partial + Failed):
 *   - Claude: 4 of 5 worked (80%), the best. 3 of its 4 bug tasks worked,
 *     so it is the suggested tool for bugs.
 *   - Cursor: 3 of 4 worked (75%), all features, so it is the suggested
 *     tool for features.
 *   - Gemini: 1 of 3 worked (33%), the lowest.
 *   - Lovable: 1 task, too few to rank ("Not enough data yet").
 * Claude and Cursor each have 4+ tasks of their type, so the suggestion
 * still shows when one of those tasks is open (it doesn't count itself).
 *
 * A second, smaller team (Studio Team · Study Buddy Chatbot: 3 members,
 * 5 tasks) gives the header's team switcher something to switch to.
 */

import { ANCHOR_SLOTS } from './anchors.js';
import { addDays, todayISO } from './dates.js';
import { nextTaskId } from './tasks.js';

/** A Markdown briefing in the same shape as CONTEXT_TEMPLATE (context.js). */
function briefing({ background, constraints, tried, pickUp }) {
  return [
    `## Background\n${background}`,
    `## Constraints\n${constraints}`,
    `## Tried so far\n${tried}`,
    `## Pick up\n${pickUp}`,
  ].join('\n\n') + '\n';
}

// Example AI context so the M9 Context section shows Markdown at its best.
const TIMEZONE_CONTEXT = `## Background
Users in UTC+1 who create an event after 11pm see it on the **next day**
in the event list. The picker returns a local \`Date\`; we store it with
\`toISOString()\`, which converts to UTC.

## Constraints
- Keep storing dates as \`YYYY-MM-DD\` strings (other code relies on it).
- No new date library: the bundle budget is tight.

## Tried so far
1. Asked Claude to "fix the timezone bug". It suggested \`moment-timezone\`,
   which breaks the no-new-library rule.
2. Second attempt: format the local date by hand:

   \`\`\`js
   const pad = (n) => String(n).padStart(2, '0');
   const iso = \`\${d.getFullYear()}-\${pad(d.getMonth() + 1)}-\${pad(d.getDate())}\`;
   \`\`\`

   Works for creating events, but editing still shifts the date.

## Pick up
- [ ] Find where the edit form parses the stored string back into a \`Date\`
- [ ] Add a test for 23:30 local time
`;

const MEMBERS = [
  { id: 'member-1', name: 'Priya Shah', email: 'priya.shah@example.com', githubUsername: 'priya-codes', avatarColor: 'teal' },
  { id: 'member-2', name: 'Tom Okafor', email: 'tom.okafor@example.com', githubUsername: 'tokafor-dev', avatarColor: 'magenta' },
  { id: 'member-3', name: 'Sam Rivera', email: 'sam.rivera@example.com', githubUsername: 'samrivera', avatarColor: 'lime' },
  { id: 'member-4', name: 'Aisha Bello', email: 'aisha.bello@example.com', githubUsername: 'aishab', avatarColor: 'cyan' },
];

/**
 * Rows: [id, title, description, type, status, assignee, due (days from
 * today, or null), created (days ago), AI tool, outcome, context, AI
 * problems, context updated (hours ago)].
 */
function taskRows() {
  return [
    // ── To Do ──────────────────────────────────────────────────────────────
    ['vt-1', 'Organiser dashboard skeleton', 'Page for organisers listing their events with RSVP counts.',
      'feature', 'todo', 'member-3', 14, 6, 'Gemini', 'failed',
      briefing({
        background: 'Organisers currently ask us for RSVP numbers on Slack.',
        constraints: '- Reuse the existing `Card` and `Table` components.\n- Only show events the logged-in user created.',
        tried: 'Asked Gemini for a dashboard page. The code used a component library we don\'t have and didn\'t build.',
        pickUp: '- [ ] Start again with our own components; paste `Card.jsx` into the prompt',
      }),
      'Imported `@shadcn/ui` components that aren\'t installed, then "fixed" the build by deleting the imports and the page with them.',
      70],
    ['vt-2', 'Venue capacity warnings', 'Show "Almost full" when an event is at 90% capacity.',
      'feature', 'todo', 'member-2', 12, 4, 'Lovable', 'partial',
      briefing({
        background: 'Organisers want urgency messaging on popular events.',
        constraints: '- Capacity is optional; no badge when it\'s not set.',
        tried: 'Lovable added the badge, but it calculates from the cached count, so it lags behind real RSVPs. Moved back to To Do to redo it.',
        pickUp: '- [ ] Read the live count from the `rsvp_counts` view',
      }),
      'Rewrote the whole event card to add one badge and dropped our hover styles.',
      22],
    ['vt-3', 'Accessibility audit of RSVP form', 'Run axe and a keyboard pass over the RSVP flow before launch.',
      'feature', 'todo', null, null, 1, null, 'not-tried', '', '', null],

    // ── In Progress ────────────────────────────────────────────────────────
    ['vt-4', 'Fix date picker timezone offset', 'Events created after 11pm show up on the next day.',
      'bug', 'in-progress', 'member-3', 2, 1, 'Claude', 'partial', TIMEZONE_CONTEXT,
      'First answer added a new dependency (moment-timezone) despite the "no new library" constraint. ' +
        'The second answer only fixed the create path; it missed that the edit form re-parses the date with new Date(string), which is read as UTC.',
      3],
    ['vt-5', 'Image upload for event banners', 'Let organisers upload a banner image, resized to 1200×630.',
      'feature', 'in-progress', 'member-1', 7, 4, 'Cursor', 'partial',
      briefing({
        background: 'Events without images get far fewer RSVPs.',
        constraints: '- Supabase Storage, public bucket.\n- Max 2 MB; resize in the browser before upload.',
        tried: 'Cursor wrote the upload component and the canvas resize. The resize works; the progress bar never moves.',
        pickUp: '- [ ] Progress needs XHR `upload.onprogress`, `fetch` can\'t report it',
      }),
      'Claimed the Supabase JS client reports upload progress. It doesn\'t, so the progress bar code is dead.',
      5],
    ['vt-6', 'Push notifications for event reminders', 'Remind people an hour before an event they RSVPed to.',
      'feature', 'in-progress', 'member-4', -2, 9, 'Gemini', 'failed',
      briefing({
        background: 'Top request in the student survey.',
        constraints: '- Web Push only (no native app).\n- Must work without the tab open.',
        tried: 'Gemini generated a service worker and VAPID setup. Subscriptions save, but no notification ever arrives.',
        pickUp: '- [ ] Check the push payload is encrypted\n- [ ] Look at a known-good example instead of generating from scratch',
      }),
      'Mixed up Firebase Cloud Messaging and plain Web Push in the same file. Suggested `Notification.schedule()`, which isn\'t a real API.',
      40],
    ['vt-7', 'Wrong time in reminder emails', 'Reminder emails show times in UTC instead of UK time.',
      'bug', 'in-progress', 'member-2', -1, 3, 'Gemini', 'worked',
      briefing({
        background: 'Every reminder is an hour off during BST.',
        constraints: '- Format on the server with `Intl`, no date library.',
        tried: 'Gemini pointed at the missing `timeZone: \'Europe/London\'` option. One-line fix; works locally.',
        pickUp: '- [ ] Check a reminder sent across the October clock change\n- [ ] Open the PR',
      }), '', 12],

    // ── Review ─────────────────────────────────────────────────────────────
    ['vt-8', 'Login redirect loop on expired session', 'Users with an expired token bounce between /login and /events.',
      'bug', 'review', 'member-1', 8, 2, 'Claude', 'worked',
      briefing({
        background: 'Supabase refreshes the token after our route guard has already redirected.',
        constraints: '- Don\'t block the first paint on a network call.',
        tried: 'Gave Claude the guard and the auth listener. It suggested waiting for `INITIAL_SESSION` before deciding. Loop is gone.',
        pickUp: '- [ ] Reviewer: check the loading spinner timing',
      }), '', 6],
    ['vt-9', 'Event detail page', 'Full page per event with description, map and RSVP button.',
      'feature', 'review', 'member-3', 10, 6, 'Cursor', 'worked',
      briefing({
        background: 'Cards link nowhere yet.',
        constraints: '- Route `/events/:id`; reuse `MapPreview` and `RsvpButton`.',
        tried: 'Cursor built the page in one pass from the component list, including a 404 state.',
        pickUp: '- [ ] Review copy with Tom',
      }), '', 18],
    ['vt-10', 'Export attendee list as CSV', 'Organisers can download names and emails of everyone who RSVPed.',
      'feature', 'review', 'member-1', 11, 3, 'Claude', 'worked',
      briefing({
        background: 'Needed for room bookings and fire safety lists.',
        constraints: '- Only the event\'s organiser can export.\n- Excel must open it with accents intact.',
        tried: 'Claude wrote the export, the permission check and a UTF-8 BOM so Excel keeps accented names.',
        pickUp: '- [ ] Reviewer: test with "José" and "Zoë"',
      }), '', 9],

    // ── Done ───────────────────────────────────────────────────────────────
    ['vt-11', 'Fix footer overlapping content on mobile', 'The fixed footer hides the last event card on small screens.',
      'bug', 'done', 'member-4', -4, 6, 'Claude', 'worked',
      briefing({
        background: 'Reported on Android Chrome.',
        constraints: '- Keep the footer visible.',
        tried: 'Claude explained the fixed-position overlap and suggested bottom padding using `env(safe-area-inset-bottom)`.',
        pickUp: 'Done.',
      }), '', 110],
    ['vt-12', 'Fix 500 error on empty RSVP note', 'Submitting an RSVP with an empty note crashes the API.',
      'bug', 'done', 'member-2', -2, 4, 'Claude', 'worked',
      briefing({
        background: 'Found in the error logs.',
        constraints: '- Note stays optional.',
        tried: 'Pasted the stack trace into Claude; it found the `.trim()` on `undefined` and added a test.',
        pickUp: 'Done.',
      }), '', 60],
    ['vt-13', 'Set up Supabase auth', 'University email sign-in with magic links.',
      'feature', 'done', 'member-3', -6, 12, 'Cursor', 'worked',
      briefing({
        background: 'Only students and staff should be able to RSVP.',
        constraints: '- Restrict to `@uni.ac.uk` addresses.',
        tried: 'Cursor wired up the client, the auth context and the domain check with the docs open in a tab.',
        pickUp: 'Done.',
      }), '', 240],
    ['vt-14', 'Category filter chips', 'Filter events by Sport, Music, Academic and Social.',
      'feature', 'done', 'member-4', -5, 9, 'Cursor', 'worked',
      briefing({
        background: 'Second most-requested feature after search.',
        constraints: '- Multi-select; selection kept in the URL.',
        tried: 'Cursor generated the chips and the URL sync in one go.',
        pickUp: 'Done.',
      }), '', 130],
  ];
}

// Second sample team, so the header's team switcher has somewhere to go.
// Member IDs start at 101 so they can't clash with members already added to
// the first team in someone's saved data.
const SECOND_TEAM = { id: 'team-2', name: 'Studio Team' };
const SECOND_PROJECT = { id: 'project-2', teamId: 'team-2', name: 'Study Buddy Chatbot' };

const SECOND_MEMBERS = [
  { id: 'member-101', name: 'Mei Chen', email: 'mei.chen@example.com', githubUsername: 'meichen-dev', avatarColor: 'orchid' },
  { id: 'member-102', name: 'Leo Martins', email: 'leo.martins@example.com', githubUsername: 'leomartins', avatarColor: 'gold' },
  { id: 'member-103', name: 'Jordan Hughes', email: 'jordan.hughes@example.com', githubUsername: 'jhughes-codes', avatarColor: 'aqua' },
];

/** Rows for the second project, in the same shape as taskRows() but without IDs. */
function secondTaskRows() {
  return [
    ['Upload lecture slides as PDF', 'Students upload slides so the chatbot can answer questions about them.',
      'feature', 'todo', 'member-102', 12, 2, 'Claude', 'not-tried', '', '', null],
    ['Chat history disappears on refresh', 'Reloading the page clears the whole conversation.',
      'bug', 'in-progress', 'member-101', 2, 3, 'ChatGPT', 'partial',
      briefing({
        background: 'Messages only live in React state.',
        constraints: '- Keep history on the device; no account needed.',
        tried: 'ChatGPT suggested saving to localStorage. History now survives a refresh, but long chats hit the storage limit.',
        pickUp: '- [ ] Keep only the last 50 messages',
      }),
      'Saved every message, including base64 images, so storage filled up after a few long chats.',
      8],
    ['Quiz me mode', 'Turn the uploaded notes into five multiple-choice questions.',
      'feature', 'review', 'member-103', 9, 6, 'Claude', 'worked',
      briefing({
        background: 'Most-requested feature in the pilot.',
        constraints: '- Questions must quote the notes they come from.',
        tried: 'Claude wrote the prompt and a JSON schema for the questions; every answer now cites its source line.',
        pickUp: '- [ ] Reviewer: try it with a short set of notes',
      }), '', 20],
    ['Markdown not rendered in replies', 'Bot replies show raw asterisks and hashes.',
      'bug', 'done', 'member-102', -3, 7, 'Cursor', 'worked',
      briefing({
        background: 'Replies are plain text in a `<p>`.',
        constraints: '- No raw HTML from the model.',
        tried: 'Cursor added `react-markdown` with HTML turned off.',
        pickUp: 'Done.',
      }), '', 70],
    ['Set up the chat UI', 'Message list, input box and a typing indicator.',
      'feature', 'done', 'member-101', -6, 10, 'Lovable', 'worked',
      briefing({
        background: 'First screen of the app.',
        constraints: '- Keyboard-only users can send with Enter.',
        tried: 'Lovable generated the layout; we kept it as is.',
        pickUp: 'Done.',
      }), '', 200],
  ];
}

/** Turn task rows (without the leading ID) into tasks for a project, numbered from `firstId`. */
function toTasks(rows, projectId, firstId) {
  const today = todayISO();
  const hoursAgo = (h) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
  return rows.map(
    ([title, description, type, status, assignee, due, createdDaysAgo, tool, outcome, context, problems, updated], i) => ({
      id: `vt-${firstId + i}`,
      projectId,
      title,
      description,
      type,
      status,
      assignee,
      dueDate: due == null ? null : addDays(today, due),
      createdDate: addDays(today, -createdDaysAgo),
      context,
      contextTool: tool,
      aiOutcome: outcome,
      aiProblems: problems,
      contextUpdatedAt: updated == null ? null : hoursAgo(updated),
    }),
  );
}

/**
 * The demo data, with dates relative to now.
 * @returns {{ teams: import('./model.js').Team[], projects: import('./model.js').Project[],
 *   tasks: import('./model.js').Task[], anchors: import('./model.js').Anchor[] }}
 */
function createDemoData() {
  const firstRows = taskRows().map(([, ...row]) => row);
  const tasks = toTasks(firstRows, 'project-1', 1);

  return {
    teams: [
      { id: 'team-1', name: 'Demo Team', members: MEMBERS.map((m) => ({ ...m })) },
      { ...SECOND_TEAM, members: SECOND_MEMBERS.map((m) => ({ ...m })) },
    ],
    projects: [{ id: 'project-1', teamId: 'team-1', name: 'Campus Events App' }, { ...SECOND_PROJECT }],
    tasks: [...tasks, ...toTasks(secondTaskRows(), SECOND_PROJECT.id, tasks.length + 1)],
    anchors: emptyAnchors('project-1'),
  };
}

/**
 * Saved data from before the second sample team existed, with that team, its
 * project and its tasks added. Nothing already saved is changed; new task IDs
 * carry on from the highest saved one. Returns null when there's nothing to add.
 */
export function withSecondTeam({ teams, projects, tasks }) {
  const addTeam = !teams.some((t) => t.id === SECOND_TEAM.id);
  const addProject = !projects.some((p) => p.id === SECOND_PROJECT.id);
  if (!addTeam && !addProject) return null;
  return {
    teams: addTeam ? [...teams, { ...SECOND_TEAM, members: SECOND_MEMBERS.map((m) => ({ ...m })) }] : teams,
    projects: addProject ? [...projects, { ...SECOND_PROJECT }] : projects,
    tasks: addProject
      ? [...tasks, ...toTasks(secondTaskRows(), SECOND_PROJECT.id, Number(nextTaskId(tasks).slice(3)))]
      : tasks,
  };
}

/** The four deliverable slots for a project, all empty. */
function emptyAnchors(projectId) {
  return ANCHOR_SLOTS.map((slot) => ({ ...slot, projectId, url: null }));
}

// Defaults for empty storage keys (first visit).
const FIRST_LOAD = createDemoData();
export const SEED_TEAMS = FIRST_LOAD.teams;
export const SEED_PROJECTS = FIRST_LOAD.projects;
export const SEED_TASKS = FIRST_LOAD.tasks;
export const SEED_ANCHORS = FIRST_LOAD.anchors;
