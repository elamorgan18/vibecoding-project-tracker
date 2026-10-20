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
