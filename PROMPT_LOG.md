# Prompt Log

## Setup

### 2026-10-20 10:52 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
Read this repo: the PRD, DESIGN.md, tailwind.config.js, the Task data model and the localStorage helper. Run `git remote -v` and confirm which repo this pushes to.

Then create CLAUDE.md in the root with these project rules:
- Kanban project tracker for vibecoding projects. React + Vite + Tailwind, deployed to Vercel later.
- I am building this solo. M2 (PRD review) is skipped. Team members in the app are mock data representing the product's target users, not real collaborators.
- Users are junior and more experienced developers working in teams who build software with AI tools.
- A team has members (name, email, GitHub username). Members can be added to a team.
- For now: one team, one project. Shape the data so multiple projects per team can be added later.
- Each task stores its AI context: prompt/context, AI tool used, outcome, and problems hit with the AI.
- Login is a later extra. If added, it must include a guest/demo mode so an assessor can use the app without registering.
- Data persists in localStorage for now.
- Never run git commit, git push or git tag. I handle all commits myself.
- PROMPT LOG: After every request I make, append an entry to PROMPT_LOG.md under a heading for the current milestone (e.g. "## M4 – data-model"), containing: date and time, the Claude model you are running (name and model ID), my prompt copied word for word, and a one or two line summary of what you changed and which files. Never edit or delete earlier entries. Log this first prompt under "## Setup".

Don't change app code yet.
````

**Summary:** Read the repo and confirmed the push remote. Created `CLAUDE.md` (project rules) and `PROMPT_LOG.md` (this log). No app code changed.

### 2026-10-20 11:04 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
git add .
git commit -m "setup: CLAUDE.md and prompt log"
git push
````

**Summary:** Did not run the commands, because `CLAUDE.md` says never to run git commit/push. Suggested running them with the `!` prefix instead. Only `PROMPT_LOG.md` changed (this entry).

## M1 – git-linked

### 2026-10-20 11:12 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
M1: Add a section to README.md saying this is my project repo, and an "AI tools used" section stating that it was built with Claude Code, including the exact Claude model name and model ID you are running. Add a rule to CLAUDE.md: if the model changes in a later session, update that README section to list every model used.
````

**Summary:** Added "About this repo" and "AI tools used" sections (Claude Opus 5.5, `claude-opus-5-5`) to `README.md`. Added a rule to `CLAUDE.md` that keeps the model list current across sessions.

## M3 – design-done

### 2026-10-20 11:35 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
M3: Update DESIGN.md with these choices. Mood: "A calm, focused workspace that stays quiet by default and only gets loud when something needs your attention." Colours: brand #4F46E5 (hover #4338CA), surface #F8FAFC, card #FFFFFF, line #E2E8F0, ink #0F172A, muted #64748B, feature #0D9488, bug #E11D48, due calm #0EA5E9, due warning #D97706, due overdue #DC2626, due done #94A3B8, each with a light "soft" tint for backgrounds. Feature/bug is shown through the corner badge and icon; due-date state through the card's left border and background tint, so the two never clash. Every colour is paired with an icon or label, never colour alone. Fonts: Inter for headings and body, JetBrains Mono for task IDs and the Context field (load from Google Fonts). Write 3–4 sentences of component principles and microcopy lines to match. Add all colours and fonts to tailwind.config.js as named tokens, and check text/background pairs meet WCAG AA contrast.
````

**Summary:** Filled in `DESIGN.md` (mood, palette with soft tints, AA contrast table, typography, component principles, microcopy). Added AA-safe `-text` shades and `ink-soft` for colours that failed as text. Added all colour and font tokens to `tailwind.config.js`, loaded Inter and JetBrains Mono in `index.html`, and set Inter as the body font in `src/index.css`.

### 2026-10-20 11:38 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
Fill in DESIGN.md §6 product name: "[your name]". §1 visual references: [e.g. Linear, Trello, GitHub Projects], chosen for [one line on why]. Use the product name in the app header too.
````

**Summary:** No changes. The prompt still had its template placeholders, so I asked for the real product name, references and reason. Only `PROMPT_LOG.md` changed (this entry).

### 2026-10-20 11:44 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
Create a folder docs/decisions/ with one markdown file per milestone (M3-design.md, M4-data-model.md, M5-crud-modal.md … M13-pitch-ready.md). Add a rule to CLAUDE.md: after each milestone, fill in the factual sections of that milestone's file: what was built, components/files changed, colours/fonts/icons/interactions used, and a placeholder screenshot path (docs/screenshots/M#.png). Leave these sections empty with "[TO COMPLETE]" for me to write myself, and never fill them in: Why I chose this, Alternatives considered, UX principle / literature reference, Requirement IDs this maps to. Fill in M3-design.md's factual sections now from DESIGN.md.
````

**Summary:** Created `docs/decisions/` with M3–M13 decision files (the four "[TO COMPLETE]" sections left for the developer). Filled in the factual sections of `M3-design.md` from `DESIGN.md`, and added the decision-log rule to `CLAUDE.md`.

### 2026-10-20 11:47 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
Update the design: feature colour becomes blue #2563EB (soft #EFF6FF) so feature vs bug is not a red/green pair. Add success #16A34A (soft #F0FDF4) and danger #DC2626 (soft #FEF2F2) tokens. Use success for confirmation toasts, the filled deliverable dot, and the Done column accent, always with a check icon and text. Use danger for the delete button, form errors and overdue state, always with a trash or alert icon and text. Update DESIGN.md and tailwind.config.js, and re-check WCAG AA contrast for all text/background pairs. Record the change in docs/decisions/M3-design.md (factual sections only).
````

**Summary:** Changed feature to blue and added `success` and `danger` tokens (with `-text` shades and `danger-hover`; `due-overdue` now reuses `danger`) in `tailwind.config.js` and `DESIGN.md`. Re-checked the WCAG AA contrast table, and recorded the update in the factual sections of `docs/decisions/M3-design.md`.

### 2026-10-20 11:54 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
I'm basing the base palette on a tweakcn community theme (blue/slate "Professional"-style theme from tweakcn.com/community). First check package.json for the Tailwind version. Do NOT paste the v4 @theme CSS if the project uses Tailwind v3; translate it into tailwind.config.js tokens instead.

Base tokens: brand #2563EB (hover #1D4ED8), surface #F8FAFC, card #FFFFFF, muted-bg #F1F5F9, line #E2E8F0, ink #020817, muted #64748B. Radius 0.375rem. Fonts Inter (sans) and JetBrains Mono (mono).

Meaning tokens: feature #7C3AED (soft #F5F3FF), bug #E11D48 (soft #FFF1F2), success #16A34A (soft #F0FDF4), danger #DC2626 (soft #FEF2F2), due calm #0EA5E9, due warning #D97706, due overdue #DC2626, due done #94A3B8, each with a soft tint.

Keep the rule that every colour is paired with an icon and label. Re-check WCAG AA contrast for all text/background pairs and list any that fail. Update DESIGN.md (note tweakcn.com/community as the palette source) and record the factual changes in docs/decisions/M3-design.md.
````

**Summary:** Confirmed Tailwind v3 and translated the tweakcn base palette into `tailwind.config.js` (blue brand, `ink` #020817, new `muted-bg`, radius 0.375rem, violet `feature`). Set the body colour in `src/index.css`. Re-checked WCAG AA and updated `DESIGN.md` (tweakcn noted as source, failing pairs listed), and recorded the factual changes in `docs/decisions/M3-design.md`.

## M4 – data-model

### 2026-10-20 11:57 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
M4: Task fields: id, title, description, type (feature/bug), status, assignee, dueDate, createdDate. Create a team with 3 mock members (name, email, githubUsername); assignee references a member. Render a four-column Kanban (To Do, In Progress, Review, Done) using our Tailwind tokens, with 4 mock tasks across columns. Each card shows at least title and assignee. Run the dev server and fix any errors. Fill in the factual sections of docs/decisions/M4-data-model.md.
````

**Summary:** Added the Team/Project/Task model (`src/data/model.js`), mock data (`src/data/seed.js`) and the moved `src/hooks/useLocalStorage.js`. Added the board components (`Board`, `Column`, `TaskCard`), rewrote `src/App.jsx` and added `lucide-react`. Verified with build, the running dev server and a render check, then filled in `docs/decisions/M4-data-model.md` and updated file paths in `CLAUDE.md`.

## M5 – crud-modal

### 2026-10-20 12:17 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
M5: Add a "+" button that opens a modal with every task field. Clicking a card opens the same modal in edit mode, pre-filled. Add a Delete button. Status is a dropdown in the modal (no drag-and-drop yet). Persist everything to localStorage so it survives closing and reopening the browser. Test create, edit, delete and reload. Fill in the factual sections of docs/decisions/M5-crud-modal.md.
````

**Summary:** Added `src/components/TaskModal.jsx` (create/edit form, title validation, inline delete confirmation, focus handling) and `src/data/tasks.js` (ID/date/upsert/remove helpers). Wired it into `src/App.jsx`, made cards clickable (`TaskCard.jsx`, `Column.jsx`, `Board.jsx`), tested create/edit/delete/reload in jsdom (23/23 passed), and filled in `docs/decisions/M5-crud-modal.md`.

## M6 – tag-style

### 2026-10-20 12:26 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
M6: Feature tasks use one accent colour and bug tasks another (from our tokens), each with a small icon in the card corner. Apply the same colour and icon wherever a task appears, including the modal. Fill in the factual sections of docs/decisions/M6-tag-style.md.
````

**Summary:** Added `src/components/TypeBadge.jsx` (shared colour + icon + label per type). Placed it in the card's top-right corner (`TaskCard.jsx`), and in the modal header and a new icon radio type picker (`TaskModal.jsx`). Tested in jsdom (31/31 passed) and filled in `docs/decisions/M6-tag-style.md`.

### 2026-10-20 12:30 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
Update M6: give each card a soft background tint by type: feature cards use the feature soft colour, bug cards use the bug soft colour, with a thin border in the stronger type colour. Keep the icon and "Feature"/"Bug" label in the corner so meaning never relies on colour alone. Apply the same tint in the modal header. Check that card text still meets WCAG AA contrast on both tints. Update DESIGN.md: type is shown by card background tint + icon + label; due-date state (M8) will be shown only by the card's left border and a due-date chip with icon and text, not the background. Record the change in docs/decisions/M6-tag-style.md (factual sections only).
````

**Summary:** Cards and the modal header are now tinted by type with a thin type-colour border, and the corner badge is a white pill (`TypeBadge.jsx`, `TaskCard.jsx`, `TaskModal.jsx`). Captions switched from `muted` (fails AA on tints) to `ink-soft`. Updated `DESIGN.md` §2.3–2.6 and §4 (type = tint + icon + label; M8 due = left border + chip), tested in jsdom (35/35 passed), and recorded the update in `docs/decisions/M6-tag-style.md`.

## M7 – task-owner

### 2026-10-20 12:37 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
M7: Show the assignee's initials/avatar prominently on each card. Add a "Hand off to…" dropdown in the modal that reassigns the task, with a visual confirmation (e.g. toast). Add a strip at the top showing what each team member is currently driving. Also add a Team screen or panel where I can add a new member (name, email, GitHub username), view members, and remove one; new members appear in the assignee dropdowns. Persist to localStorage. Fill in the factual sections of docs/decisions/M7-task-owner.md.
````

**Summary:** Added `Avatar`, `Toast`, `DrivingStrip`, `TeamPanel`, the shared `Dialog`/`FormField` components, and `src/data/ids.js` / `team.js`. Updated `TaskModal` (Owner + "Hand off to…"), `TaskCard`, `App.jsx`, `src/data/tasks.js`, `tailwind.config.js` (toast animation) and the `DESIGN.md` microcopy. Tested in jsdom (71/71 passed) and filled in `docs/decisions/M7-task-owner.md`.

### 2026-10-20 12:43 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
Bug fix (M7): when a card is clicked or focused it gets a purple border regardless of type. Change the selected/focused state to use a brand-colour ring (not the feature or bug colour) with a small offset, so it sits outside the card's own type border and doesn't change the card's type colouring. Keep it clearly visible for keyboard focus (WCAG 2.4.7). Apply the same selected style to every card. Note the fix in docs/decisions/M7-task-owner.md (factual sections only).
````

**Summary:** The cause was the blue focus ring sitting flush against the violet/rose type border (1.10:1), so the two blended into a purple edge. In `src/components/TaskCard.jsx` I added a shared `FOCUS_RING` with a 2px `muted-bg` offset so the brand ring sits outside the type border on every card. Tested in jsdom (75/75 passed) and noted the fix in `docs/decisions/M7-task-owner.md`.

## M8 – due-tint

### 2026-10-20 12:47 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
M8: Show due-date urgency automatically using the card's LEFT BORDER and a small due-date chip, NOT the card background (the background is reserved for feature/bug type). Use our due-date tokens: more than 2 days away = calm, under 24 hours = warning, past due = overdue, Done = neutral (even if it was overdue). The chip shows an icon plus text, e.g. "Due in 3 days", "Due today", "Overdue by 2 days", "Done". Add a small legend explaining the four states. No new fields. Make sure some mock tasks fall into each state so all four are visible. Fill in the factual sections of docs/decisions/M8-due-tint.md.
````

**Summary:** Added `src/data/due.js` (`dueState`; 0–2 days = warning), `src/data/dates.js`, `DueChip.jsx` and `DueLegend.jsx`. Cards get a due left border and chip (`TaskCard.jsx`), the modal previews the chip (`TaskModal.jsx`), and `App.jsx` shows the legend. Seed dates are relative to today so all four states show (`seed.js`). Updated `DESIGN.md` §2.4/§2.6, tested in jsdom (97/97 passed), and filled in `docs/decisions/M8-due-tint.md`.

## M9 – context

### 2026-10-20 13:24 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
M9: Add a "Context" section to the task modal: a Markdown textarea pre-filled for new tasks with a template (Background / Constraints / Tried so far / Pick up). Below it, an "AI tool" dropdown (Claude, ChatGPT, Cursor, Lovable, Replit, Gemini, Other) saved as contextTool. Also add an "Outcome" dropdown (Worked / Partial / Failed / Not tried yet) and an "AI problems" textarea for issues hit with the AI tool. Save a contextUpdatedAt timestamp whenever context is edited and show "last updated X ago" near the field. Use the monospace font for the context textarea. Stretch: a live Markdown preview pane.

Context box requirements: no character or word limit (no maxLength). Pasting large blocks of text must keep line breaks, indentation and Markdown exactly as pasted. The textarea should be resizable and grow with its content, with scrolling for very long text. Add a small "Copy" button on the context box that copies exactly what's in the box to the clipboard, with a "Copied!" confirmation. If saving fails because browser storage is full, show a clear error message instead of silently losing the text.

Fill in at least one mock task's context so it's visible. Fill in the factual sections of docs/decisions/M9-task-context.md.
````

**Summary:** Added `ContextSection.jsx`, `MarkdownPreview.jsx` (`react-markdown` + `remark-gfm`), `src/data/context.js` and `src/utils/clipboard.js`. Added `timeAgo` to `dates.js`, and made `useLocalStorage.js` report write errors. Updated `TaskModal.jsx`, `App.jsx` (`contextUpdatedAt`, synchronous save with storage-full alert, page banner), `Dialog.jsx`, `FormField.jsx`, `model.js`, `seed.js` (context for vt-2 / vt-3) and the `DESIGN.md` microcopy. Renamed `docs/decisions/M9-context.md` to `M9-task-context.md` and filled it in. Tested in jsdom (133/133 passed).

## M10 – copy-prompt

### 2026-10-20 13:33 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
M10: A copy button may already exist from M9. Check the current implementation against these requirements and only change what's missing: a "Copy Context" button on every card AND in the modal; it copies a Markdown block with title, type, status, description, full Context, AI tool, outcome and AI problems (skipping empty fields); formatted as a natural briefing for an AI chat; shows a "Copied to clipboard!" toast; clicking it on a card doesn't open the modal. Tell me what was already there and what you changed. Fill in the factual sections of docs/decisions/M10-copy-context.md.
````

**Summary:** Kept M9's raw-text Copy button and clipboard helper. Added `src/data/briefing.js` (`buildBriefing`) and `CopyContextButton.jsx`, placed on every card above the click target (`TaskCard`/`Column`/`Board`) and in the modal header (`TaskModal`). Added a danger tone to `Toast.jsx` and `handleCopyContext` with a "Copied to clipboard!" toast in `App.jsx`. Updated the `DESIGN.md` microcopy and renamed `docs/decisions/M10-copy-prompt.md` to `M10-copy-context.md` and filled it in. Tested in jsdom (154/154 passed).

## M7 – task-owner (update)

### 2026-10-20 13:38 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
Rename the "Who's driving what" strip to "Team members". Update the heading text, any aria-labels, and any references in DESIGN.md microcopy so the wording is consistent everywhere. Don't change how the strip works. Note the change in docs/decisions/M7-task-owner.md (factual sections only).
````

**Summary:** Changed the strip heading to "Team members" and its `aria-labelledby` id to `team-members-heading`. Renamed `src/components/DrivingStrip.jsx` to `TeamMembersStrip.jsx` and updated `src/App.jsx`. Updated the `DESIGN.md` §5 microcopy row and noted the rename in `docs/decisions/M7-task-owner.md`. Behaviour unchanged; tested in jsdom (155/155 passed).

## Accessibility audit – typography

### 2026-10-20 13:40 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
Accessibility audit of typography. Don't change anything yet; report back in a table: every text style used (headings, card title, card meta, badges, chips, toasts, modal labels, context textarea, legend), its font, size in px and rem, weight and line-height, and the contrast ratio of its text colour against the background it appears on (including the feature/bug tints and due chips). Flag anything under 16px for body text, under 12px for any text, fixed px font sizes instead of rem, line-height under 1.4 for body text, and contrast under 4.5:1 (or 3:1 for large text). Then suggest fixes.
````

**Summary:** Audit only; no app or design files changed. Inventoried every text style in `src/components/*.jsx`, `src/App.jsx`, `src/index.css` and `tailwind.config.js` and computed WCAG contrast for each pair. Reported findings and suggested fixes in the chat. Only `PROMPT_LOG.md` changed (this entry).

### 2026-10-20 13:45 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
Apply typography fixes from the audit:
1. Body/reading text to 16px (1rem) with line-height 1.5: all inputs, selects, date fields, placeholders, description, Context textarea (JetBrains Mono, 1rem), AI problems textarea, Markdown preview body, delete/remove confirmations, save-failed alerts and toasts.
2. Field error messages and the copy-failed message to 14px (0.875rem) with line-height 1.4.
3. Darken the muted text token to #475569 and re-check all muted-text contrast pairs.
4. Use unitless line-heights (1.5 body, 1.4 small text) instead of rem-based line-heights, so spacing scales when users enlarge text.
5. Remove the unused text-[11px] avatar size from Avatar.jsx.
Keep 12px for compact metadata (IDs, count pills, badges, due chips) and 14px for card titles and names.
Update DESIGN.md §3 to match (body text 16px), check the board and modal still lay out well, and record the changes in docs/decisions/M3-design.md (factual sections only).
````

**Summary:** Changed `tailwind.config.js` (`muted` #475569; `fontSize` with unitless line-heights). Body text is now 16px in `FormField.jsx` (inputs), `ContextSection.jsx`, `MarkdownPreview.jsx`, `TaskModal.jsx`, `TeamPanel.jsx`, `Toast.jsx` and `App.jsx`, and errors are 14px. Removed the 11px avatar size (`Avatar.jsx`). Updated `DESIGN.md` §2.1/§2.5/§2.6/§3. Checked layout in headless Edge at 1440/1280/390 px (no overflow or clipping), ran jsdom (155/155 passed), and recorded the changes in `docs/decisions/M3-design.md`.

## M7 – task-owner (update: avatar colours)

### 2026-10-20 13:53 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
Give each team member a distinct avatar colour. Create a fixed palette of 8 avatar colour pairs (soft background + dark text for the initials), choosing hues that are clearly different from each other and do NOT overlap with our semantic colours (feature, bug, due-date states, success, danger, brand/selection ring). Store the colour on the member when they're created (assign the next unused colour, cycling if there are more than 8), so each person keeps the same colour after reloads, and removing a member doesn't change anyone else's colour. Give existing mock members colours too. Use the member's colour everywhere their avatar appears: cards, Team members strip, team panel, modal owner box and hand-off dropdown. Keep initials always visible so identity never relies on colour alone. Check every pair meets WCAG AA contrast (4.5:1) and list the ratios. Add the avatar palette to DESIGN.md and tailwind.config.js, and record the change in docs/decisions/M7-task-owner.md (factual sections only).
````

**Summary:** Chose 8 OKLCH-spaced avatar colour pairs (contrast 6.58–7.53:1, at least 22° from semantic hues) and added them to `tailwind.config.js` and `DESIGN.md` §2.7. Added `src/data/avatarColors.js` (next-unused / cycling assignment) and `Member.avatarColor` stored on create (`team.js`), with seed colours and an on-load fill-in for older members (`App.jsx`). `Avatar.jsx` uses the member colour, and the new `HandOffMenu.jsx` listbox replaces the native select so options can show avatars. Tested in jsdom (174/174 passed) and headless Edge screenshots, and recorded the change in `docs/decisions/M7-task-owner.md`.

### 2026-10-20 14:04 (GMT+1)

**Model:** Claude Opus 5.5 (`claude-opus-5-5`)

**Prompt:**

````
Bug: all member avatars render white instead of their assigned colours. Check two likely causes and fix both:
1. Tailwind purging dynamic class names: if avatar classes are built with template strings (e.g. `bg-${color}`), Tailwind won't generate them. Use a lookup of complete, literal class names, or apply the colours with inline styles from the palette hex values.
2. Old localStorage data: members saved before this change have no colour. Add a migration on load that assigns a colour to any member missing one (in order, using the same next-unused logic) and saves it back, without touching other data.
Tell me which cause it was. Then confirm the colours appear on cards, the Team members strip, the team panel and the modal.
````

**Summary:** No code changes. Neither cause applied: `Avatar.jsx` already uses literal class names, and `App.jsx`/`team.js` already migrate members without a colour. The real cause was two Vite dev servers (ports 5173/5174) started before the avatar colours were added to `tailwind.config.js`; they kept serving CSS with no `bg-avatar-*` classes. A fresh dev server serves all 8 classes. A headless Edge test with colourless old data showed correct colours on cards, the Team members strip, the team panel and the modal, and confirmed tasks/projects were unchanged.
