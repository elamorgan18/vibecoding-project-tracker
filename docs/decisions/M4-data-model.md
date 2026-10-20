# M4 – Data model + board view

**Tag:** `data-model`

## What was built

- **Data model with three linked entities:** Team 1─* Project 1─* Task. There is one team and one project for now. Tasks point at a project (`projectId`) and projects point at a team (`teamId`), so more projects per team can be added later without reshaping stored data.
- **Member:** `{ id, name, email, githubUsername }`. Members are stored inside `Team.members`.
- **Task:** `{ id, projectId, title, description, type ('feature' | 'bug'), status ('todo' | 'in-progress' | 'review' | 'done'), assignee (Member.id or null), dueDate ('YYYY-MM-DD' or null), createdDate ('YYYY-MM-DD') }`.
- **Mock data (loaded when localStorage is empty):**
  - Team "Demo Team" with 3 fictional members:
    - Priya Shah (`priya-codes`)
    - Tom Okafor (`tokafor-dev`)
    - Sam Rivera (`samrivera`)
  - All member emails are `@example.com`.
  - Project "Campus Events App".
  - 4 tasks, one per column:
    - `vt-1` Add event search bar (feature, To Do, Priya)
    - `vt-2` Fix date picker timezone offset (bug, In Progress, Sam)
    - `vt-3` Generate RSVP confirmation email (feature, Review, Tom)
    - `vt-4` Scaffold event list page (feature, Done, Priya)
- **Persistence:** teams, projects and tasks are stored in localStorage under `vibetracker.teams`, `vibetracker.projects` and `vibetracker.tasks`.
- **Board:** a four-column Kanban (To Do, In Progress, Review, Done) filtered to the current project.
  - Each card shows the task ID, title and assignee (initials avatar + name, or "Unassigned").
  - Each column shows a task count.
  - Empty columns show "Nothing here. Enjoy the quiet."
- **Header:** brand-dot wordmark "Vibecoding Project Tracker" with "{team} · {project}" underneath. The product name is still `<TODO>` in DESIGN.md §6.
- **Not yet built:** AI context fields (M9), type badge (M6), due-date tint (M8), editing (M5).
- **Checked:** `npm run build` passes. The running Vite dev server (already on port 5173) compiled all new modules without errors. A server-side render check found 4 columns, 4 cards and all 3 member names, with no React warnings.

## Components / files changed

| File | Change |
|---|---|
| `src/data/model.js` | New. Team / Member / Project / Task typedefs, `STAGES` (moved from `App.jsx`), `TASK_TYPES`, `STORAGE_KEYS` |
| `src/data/seed.js` | New. `SEED_TEAMS`, `SEED_PROJECTS`, `SEED_TASKS` |
| `src/hooks/useLocalStorage.js` | New. `useLocalStorage` hook moved out of `App.jsx` (unchanged logic) |
| `src/components/Board.jsx` | New. Renders a `Column` per stage and builds a member lookup |
| `src/components/Column.jsx` | New. Column header, count, empty state, task list; Done accent |
| `src/components/TaskCard.jsx` | New. Card with ID, title, assignee |
| `src/App.jsx` | Rewritten. Loads data via `useLocalStorage`, picks the single project/team, renders header + `Board`. Removed the `TEAM` placeholder constant |
| `package.json` / `package-lock.json` | Added `lucide-react` `^0.460.0` |
| `CLAUDE.md` | Updated file paths for `STAGES` and `useLocalStorage` |

## Colours, fonts, icons & interactions used

**Colours (Tailwind tokens)**

| Element | Tokens |
|---|---|
| Page | `bg-surface`, `text-ink` |
| Wordmark dot | `bg-brand` |
| Header subtitle | `text-muted` on `surface` (4.55:1) |
| Column | `bg-muted-bg`, `rounded`, `border-t-4 border-transparent` |
| Done column | `border-success` top border + `text-success` check icon |
| Column title | `text-ink` on `muted-bg` (18.26:1) |
| Count pill | `bg-card text-ink-soft` (7.58:1) |
| Empty state | `border-dashed border-line`, `text-ink-soft` on `muted-bg` (6.92:1) |
| Card | `bg-card border-line rounded`, `hover:shadow-md` |
| Task ID / assignee name | `text-muted` on `card` (4.76:1) |
| Card title | `text-ink` |
| Avatar | `bg-brand-soft text-brand-hover` (6.16:1) |

**Fonts**

- Inter (`font-sans`) throughout.
- JetBrains Mono (`font-mono`) for the task ID.
- Sizes:
  - Page title: 24 px semibold
  - Column title: 16 px semibold uppercase
  - Card title: 14 px medium
  - Captions: 12 px

**Icons (lucide-react)**

- `Check` beside the "Done" column label.
- `UserRound` for unassigned tasks, beside the "Unassigned" label.
- Both are `aria-hidden` because a text label always accompanies them.
- The `success` check icon on `muted-bg` is 3.01:1, which just passes the 3:1 UI-graphic threshold.

**Interactions**

- Card shadow on hover only.
- No editing, drag or status change yet (M5).
- Layout is responsive: 1 column on small screens, 2 on medium, 4 on extra-large.

**Accessibility**

- Each column is a `<section>` labelled by its heading.
- Cards are `<article>` elements in a `<ul>`.
- The count pill includes screen-reader text " tasks".

## Screenshot

![M4 screenshot](../screenshots/M4.png)

Placeholder path: `docs/screenshots/M4.png`

## Why I chose this

[TO COMPLETE]

## Alternatives considered

[TO COMPLETE]

## UX principle / literature reference

[TO COMPLETE]

## Requirement IDs this maps to

[TO COMPLETE]
