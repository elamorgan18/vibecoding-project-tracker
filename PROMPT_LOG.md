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
