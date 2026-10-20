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
 * Dates are relative to the moment the data is created, so the board always
 * has tasks in every due state (DESIGN.md §2.4): overdue, due soon (warning),
 * calm, done, and one with no due date.
 *
 * The AI outcomes are chosen so Insights (M12) has something to say:
 *   - Claude has the best success rate (5 of 7) and worked on 4 of 5 bug tasks.
 *   - Cursor worked on 3 of 4 feature tasks, the best for features.
 *   - Gemini has the lowest success rate (1 of 4).
 *   - Replit and Other have too few tasks to rank ("Not enough data yet").
 */

import { ANCHOR_SLOTS } from './anchors.js';
import { addDays, todayISO } from './dates.js';

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
const VT2_CONTEXT = `## Background
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
  { id: 'member-5', name: 'Jonas Weber', email: 'jonas.weber@example.com', githubUsername: 'jweber-builds', avatarColor: 'orchid' },
  { id: 'member-6', name: 'Mei Lin', email: 'mei.lin@example.com', githubUsername: 'meilin-ux', avatarColor: 'olive' },
];

/**
 * Rows: [id, title, description, type, status, assignee, due (days from
 * today, or null), created (days ago), AI tool, outcome, context, AI
 * problems, context updated (hours ago)].
 */
function taskRows() {
  return [
    // ── To Do ──────────────────────────────────────────────────────────────
    ['vt-1', 'Add event search bar', 'Filter the event list by title and venue as you type.',
      'feature', 'todo', 'member-1', 4, 2, 'Cursor', 'not-tried',
      briefing({
        background: 'The event list has 200+ events and no way to find one. Students search by name or by building.',
        constraints: '- Client-side only for now (the list is already loaded).\n- Debounce input so we don\'t re-render on every key.',
        tried: 'Nothing yet. Plan: ask Cursor to add a `useDebouncedValue` hook and filter in `EventList.jsx`.',
        pickUp: '- [ ] Match on title **and** venue, case-insensitive\n- [ ] Empty state: "No events match"',
      }), '', 20],
    ['vt-5', 'Add "Add to calendar" export', 'Download an .ics file for any event so it lands in Google or Outlook Calendar.',
      'feature', 'todo', 'member-4', 6, 1, 'Claude', 'not-tried',
      briefing({
        background: 'Most RSVP-ers forget the date. An .ics download is the simplest cross-calendar option.',
        constraints: '- No calendar API keys.\n- Must handle the event\'s timezone correctly (see vt-2).',
        tried: 'Not started. Will give Claude the `Event` type and ask for a pure `toICS(event)` function with tests.',
        pickUp: '- [ ] Escape commas and newlines in descriptions (RFC 5545)',
      }), '', 10],
    ['vt-6', 'Dark mode for event pages', 'Follow the system theme on the public event pages.',
      'feature', 'todo', 'member-6', 1, 3, 'Lovable', 'not-tried',
      briefing({
        background: 'Feedback from the beta: event pages are blinding at night.',
        constraints: '- Tailwind `dark:` classes only, no second stylesheet.\n- Keep brand colours AA in both themes.',
        tried: 'Not started. Lovable generated the original pages, so it may be quickest to ask it to add dark variants.',
        pickUp: '- [ ] Check the venue map tiles in dark mode',
      }), '', 30],
    ['vt-7', 'Fix map pin not loading on Safari', 'Venue map shows a grey box on iOS Safari.',
      'bug', 'todo', 'member-5', -1, 4, 'Gemini', 'not-tried',
      briefing({
        background: 'Reported by two users on iPhone. Chrome and Firefox are fine.',
        constraints: '- Keep Leaflet; we can\'t switch map libraries this sprint.',
        tried: 'Reproduced in Safari Technology Preview. Console shows a blocked mixed-content tile request.',
        pickUp: '- [ ] Ask Gemini whether the tile URL needs `https://` explicitly\n- [ ] Test on a real iPhone',
      }), '', 50],
    ['vt-8', 'Accessibility audit of RSVP form', 'Run axe and a keyboard pass over the RSVP flow before launch.',
      'feature', 'todo', null, null, 1, null, 'not-tried', '', '', null],
    ['vt-9', 'RSVP button can be double-submitted', 'Clicking RSVP twice quickly creates two bookings.',
      'bug', 'todo', 'member-2', 2, 5, 'ChatGPT', 'failed',
      briefing({
        background: 'Found in the Supabase table: 14 duplicate RSVPs this week.',
        constraints: '- Fix on the server too (a unique constraint), not just by disabling the button.',
        tried: 'ChatGPT suggested a `useRef` lock in the click handler. It doesn\'t help when two tabs are open.',
        pickUp: '- [ ] Add `unique (event_id, user_id)` to `rsvps`\n- [ ] Handle the 409 in the UI',
      }),
      'Kept answering with client-only fixes even after I said the duplicates come from two tabs. Invented a Supabase option (`upsertOnce`) that doesn\'t exist.',
      28],
    ['vt-10', 'Organiser dashboard skeleton', 'Page for organisers listing their events with RSVP counts.',
      'feature', 'todo', 'member-3', 9, 6, 'Gemini', 'failed',
      briefing({
        background: 'Organisers currently ask us for RSVP numbers on Slack.',
        constraints: '- Reuse the existing `Card` and `Table` components.\n- Only show events the logged-in user created.',
        tried: 'Asked Gemini for a dashboard page. The code used a component library we don\'t have and didn\'t build.',
        pickUp: '- [ ] Start again with our own components; paste `Card.jsx` into the prompt',
      }),
      'Imported `@shadcn/ui` components that aren\'t installed, then "fixed" the build by deleting the imports and the page with them.',
      70],

    // ── In Progress ────────────────────────────────────────────────────────
    ['vt-2', 'Fix date picker timezone offset', 'Events created after 11pm show up on the next day.',
      'bug', 'in-progress', 'member-3', 0, 1, 'Claude', 'partial', VT2_CONTEXT,
      'First answer added a new dependency (moment-timezone) despite the "no new library" constraint. ' +
        'The second answer only fixed the create path; it missed that the edit form re-parses the date with new Date(string), which is read as UTC.',
      3],
    ['vt-11', 'Image upload for event banners', 'Let organisers upload a banner image, resized to 1200×630.',
      'feature', 'in-progress', 'member-1', 1, 4, 'Cursor', 'partial',
      briefing({
        background: 'Events without images get far fewer RSVPs.',
        constraints: '- Supabase Storage, public bucket.\n- Max 2 MB; resize in the browser before upload.',
        tried: 'Cursor wrote the upload component and the canvas resize. The resize works; the progress bar never moves.',
        pickUp: '- [ ] Progress needs XHR `upload.onprogress`, `fetch` can\'t report it',
      }),
      'Claimed the Supabase JS client reports upload progress. It doesn\'t, so the progress bar code is dead.',
      5],
    ['vt-12', 'Push notifications for event reminders', 'Remind people an hour before an event they RSVPed to.',
      'feature', 'in-progress', 'member-4', -2, 9, 'Gemini', 'failed',
      briefing({
        background: 'Top request in the student survey.',
        constraints: '- Web Push only (no native app).\n- Must work without the tab open.',
        tried: 'Gemini generated a service worker and VAPID setup. Subscriptions save, but no notification ever arrives.',
        pickUp: '- [ ] Check the push payload is encrypted\n- [ ] Look at a known-good example instead of generating from scratch',
      }),
      'Mixed up Firebase Cloud Messaging and plain Web Push in the same file. Suggested `Notification.schedule()`, which isn\'t a real API.',
      40],
    ['vt-13', 'Fix duplicate events after sync', 'Pull-to-refresh sometimes shows every event twice.',
      'bug', 'in-progress', 'member-5', 3, 3, 'Claude', 'worked',
      briefing({
        background: 'Happens when a refresh starts before the previous one finishes.',
        constraints: '- Keep the optimistic list; don\'t clear it on refresh.',
        tried: 'Claude spotted the race: two fetches both append. Suggested an `AbortController` per refresh and merging by id. Fix works locally.',
        pickUp: '- [ ] Write the regression test Claude outlined\n- [ ] Open the PR',
      }), '', 8],
    ['vt-14', 'Venue capacity warnings', 'Show "Almost full" when an event is at 90% capacity.',
      'feature', 'in-progress', 'member-6', 5, 4, 'Lovable', 'partial',
      briefing({
        background: 'Organisers want urgency messaging on popular events.',
        constraints: '- Capacity is optional; no badge when it\'s not set.',
        tried: 'Lovable added the badge, but it calculates from the cached count, so it lags behind real RSVPs.',
        pickUp: '- [ ] Read the live count from the `rsvp_counts` view',
      }),
      'Rewrote the whole event card to add one badge and dropped our hover styles.',
      22],
    ['vt-15', 'Search results flicker on typing', 'The list blinks empty between keystrokes.',
      'bug', 'in-progress', 'member-2', -1, 3, 'Other', 'partial',
      briefing({
        background: 'Follow-up from the search spike. Tried GitHub Copilot inline suggestions for this one.',
        constraints: '- Keep showing the previous results until new ones are ready.',
        tried: 'Copilot suggested `useDeferredValue`. Flicker is gone on desktop but still visible on slow phones.',
        pickUp: '- [ ] Profile on a throttled CPU',
      }),
      'Suggestions only looked at the current file, so it kept proposing a loading state we already render in the parent.',
      12],
    ['vt-16', 'Waitlist when an event is full', 'Offer a waitlist place and auto-promote when someone cancels.',
      'feature', 'in-progress', 'member-2', 2, 5, 'ChatGPT', 'partial',
      briefing({
        background: 'Popular society events sell out in minutes.',
        constraints: '- Promotion must be first-come-first-served.\n- Email the promoted person (reuse vt-3).',
        tried: 'ChatGPT designed the table and the promote function. The SQL works; the trigger fires twice on bulk cancels.',
        pickUp: '- [ ] Move promotion into one transaction',
      }),
      'The trigger it wrote used `FOR EACH ROW` where it needed `FOR EACH STATEMENT`, and it was confident it was right.',
      16],

    // ── Review ─────────────────────────────────────────────────────────────
    ['vt-3', 'Generate RSVP confirmation email', 'Send a plain-text confirmation when someone RSVPs.',
      'feature', 'review', 'member-2', -2, 5, 'ChatGPT', 'worked',
      `## Background
RSVP confirmations should go out as plain text (no HTML templates yet).

## Tried so far
ChatGPT generated the email builder and a unit test in one go.

## Pick up
Waiting on review: check the subject line wording.
`, '', 26],
    ['vt-17', 'Login redirect loop on expired session', 'Users with an expired token bounce between /login and /events.',
      'bug', 'review', 'member-1', 0, 2, 'Claude', 'worked',
      briefing({
        background: 'Supabase refreshes the token after our route guard has already redirected.',
        constraints: '- Don\'t block the first paint on a network call.',
        tried: 'Gave Claude the guard and the auth listener. It suggested waiting for `INITIAL_SESSION` before deciding. Loop is gone.',
        pickUp: '- [ ] Reviewer: check the loading spinner timing',
      }), '', 6],
    ['vt-18', 'Event detail page', 'Full page per event with description, map and RSVP button.',
      'feature', 'review', 'member-3', 4, 6, 'Cursor', 'worked',
      briefing({
        background: 'Cards link nowhere yet.',
        constraints: '- Route `/events/:id`; reuse `MapPreview` and `RsvpButton`.',
        tried: 'Cursor built the page in one pass from the component list, including a 404 state.',
        pickUp: '- [ ] Review copy with Mei',
      }), '', 18],
    ['vt-19', 'Recurring events', 'Weekly society meetups without creating each one by hand.',
      'feature', 'review', 'member-5', -3, 10, 'Gemini', 'failed',
      briefing({
        background: 'Societies create the same event 12 times a term.',
        constraints: '- Store a rule, expand to dates on read.\n- Respect term dates (no meetups in reading week).',
        tried: 'Gemini\'s RRULE parser failed on half our test cases. I wrote the expansion by hand; it\'s in review now.',
        pickUp: '- [ ] Reviewer: check the reading-week skip',
      }),
      'Generated an RRULE parser that silently ignored `UNTIL`, so recurring events never ended. Tests it wrote passed because they never used `UNTIL`.',
      34],
    ['vt-20', 'Export attendee list as CSV', 'Organisers can download names and emails of everyone who RSVPed.',
      'feature', 'review', 'member-4', 1, 3, 'Claude', 'partial',
      briefing({
        background: 'Needed for room bookings and fire safety lists.',
        constraints: '- Only the event\'s organiser can export.\n- Excel must open it with accents intact.',
        tried: 'Claude wrote the export and the permission check. Accented names were garbled in Excel until I added a BOM by hand.',
        pickUp: '- [ ] Reviewer: test with "José" and "Zoë"',
      }),
      'Didn\'t know Excel needs a UTF-8 BOM, and its first fix escaped the accents instead.',
      9],
    ['vt-21', 'Emoji in event titles break the card layout', 'Titles with emoji overflow and get cut mid-character.',
      'bug', 'review', 'member-6', 7, 4, 'Cursor', 'failed',
      briefing({
        background: 'Societies love emoji. 🎉 breaks our title truncation.',
        constraints: '- Keep two-line clamping.',
        tried: 'Cursor\'s fix sliced the string by length, which splits emoji. I switched to CSS `line-clamp` instead.',
        pickUp: '- [ ] Reviewer: try flags and skin-tone emoji',
      }),
      'Kept truncating with `title.slice(0, 40)`, which cuts multi-code-point emoji in half, even after I explained why.',
      14],

    // ── Done ───────────────────────────────────────────────────────────────
    ['vt-4', 'Scaffold event list page', 'Card grid of upcoming events with date and venue.',
      'feature', 'done', 'member-1', -3, 8, 'Lovable', 'worked',
      briefing({
        background: 'First screen of the app.',
        constraints: '- Responsive grid, 1–3 columns.',
        tried: 'Lovable generated the grid and cards from a one-paragraph prompt. Exported to GitHub and tidied the class names.',
        pickUp: 'Done.',
      }), '', 160],
    ['vt-22', 'Set up Supabase auth', 'University email sign-in with magic links.',
      'feature', 'done', 'member-3', -6, 12, 'Cursor', 'worked',
      briefing({
        background: 'Only students and staff should be able to RSVP.',
        constraints: '- Restrict to `@uni.ac.uk` addresses.',
        tried: 'Cursor wired up the client, the auth context and the domain check with the docs open in a tab.',
        pickUp: 'Done.',
      }), '', 240],
    ['vt-23', 'Fix footer overlapping content on mobile', 'The fixed footer hides the last event card on small screens.',
      'bug', 'done', 'member-6', -4, 6, 'Claude', 'worked',
      briefing({
        background: 'Reported on Android Chrome.',
        constraints: '- Keep the footer visible.',
        tried: 'Claude explained the fixed-position overlap and suggested bottom padding using `env(safe-area-inset-bottom)`.',
        pickUp: 'Done.',
      }), '', 110],
    ['vt-24', 'Category filter chips', 'Filter events by Sport, Music, Academic and Social.',
      'feature', 'done', 'member-4', -5, 9, 'Cursor', 'worked',
      briefing({
        background: 'Second most-requested feature after search.',
        constraints: '- Multi-select; selection kept in the URL.',
        tried: 'Cursor generated the chips and the URL sync in one go.',
        pickUp: 'Done.',
      }), '', 130],
    ['vt-25', 'Seed script for sample events', 'Fill a fresh database with 50 realistic events.',
      'feature', 'done', 'member-5', -8, 14, 'ChatGPT', 'worked',
      briefing({
        background: 'New contributors start with an empty app.',
        constraints: '- Node script, no extra dependencies.',
        tried: 'ChatGPT wrote the script and the sample data (venues on campus, realistic times).',
        pickUp: 'Done.',
      }), '', 300],
    ['vt-26', 'Fix 500 error on empty RSVP note', 'Submitting an RSVP with an empty note crashes the API.',
      'bug', 'done', 'member-2', -2, 4, 'Claude', 'worked',
      briefing({
        background: 'Found in the error logs.',
        constraints: '- Note stays optional.',
        tried: 'Pasted the stack trace into Claude; it found the `.trim()` on `undefined` and added a test.',
        pickUp: 'Done.',
      }), '', 60],
    ['vt-27', 'Landing page hero', 'Headline, short pitch and a "Browse events" button.',
      'feature', 'done', 'member-6', -10, 15, 'Replit', 'worked',
      briefing({
        background: 'Needed for the society fair demo.',
        constraints: '- Use the brand colours from the design file.',
        tried: 'Replit Agent built and hosted a preview in minutes. Copied the component into our repo.',
        pickUp: 'Done.',
      }), '', 350],
    ['vt-28', 'Event share links with previews', 'Open Graph tags so links show the banner in WhatsApp and Slack.',
      'feature', 'done', 'member-1', -7, 11, 'Claude', 'worked',
      briefing({
        background: 'Societies share events in group chats.',
        constraints: '- Static site; tags must be in the HTML, not added by JS.',
        tried: 'Claude suggested a Vercel edge function that injects the tags per event. Works in WhatsApp and Slack.',
        pickUp: 'Done.',
      }), '', 200],
    ['vt-29', 'Wrong time in reminder emails', 'Reminder emails show times in UTC instead of UK time.',
      'bug', 'done', 'member-4', -3, 7, 'Gemini', 'worked',
      briefing({
        background: 'Every reminder was an hour off during BST.',
        constraints: '- Format on the server with `Intl`, no date library.',
        tried: 'Gemini pointed at the missing `timeZone: \'Europe/London\'` option. One-line fix.',
        pickUp: 'Done.',
      }), '', 90],
    ['vt-30', 'Profile avatars broken after upload', 'New avatars show a broken image until a hard refresh.',
      'bug', 'done', 'member-5', -1, 5, 'Lovable', 'failed',
      briefing({
        background: 'The CDN caches the old file at the same URL.',
        constraints: '- Keep one file per user.',
        tried: 'Lovable\'s fix added a random query string on every render, which broke caching completely. Fixed by hand with a version number.',
        pickUp: 'Done.',
      }),
      'Its fix re-downloaded every avatar on every render. When asked about caching it removed the image component altogether.',
      45],
  ];
}

/**
 * The demo data, with dates relative to now.
 * @returns {{ teams: import('./model.js').Team[], projects: import('./model.js').Project[],
 *   tasks: import('./model.js').Task[], anchors: import('./model.js').Anchor[] }}
 */
function createDemoData() {
  const today = todayISO();
  const hoursAgo = (h) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

  const tasks = taskRows().map(
    ([id, title, description, type, status, assignee, due, createdDaysAgo, tool, outcome, context, problems, updated]) => ({
      id,
      projectId: 'project-1',
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

  return {
    teams: [{ id: 'team-1', name: 'Demo Team', members: MEMBERS.map((m) => ({ ...m })) }],
    projects: [{ id: 'project-1', teamId: 'team-1', name: 'Campus Events App' }],
    tasks,
    anchors: emptyAnchors('project-1'),
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
