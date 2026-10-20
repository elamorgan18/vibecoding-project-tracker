# CLAUDE.md — Project rules

These rules override the hackathon starter docs (`PRD.md`, `README.md`) wherever they conflict.

## Product

- Kanban project tracker for vibecoding projects.
- Stack: React + Vite + Tailwind. Deployed to Vercel later.
- Users: junior and more experienced developers working in teams who build software with AI tools.
- Board columns are the four `STAGES` in `src/App.jsx` (To Do, In Progress, Review, Done).

## Context

- Built solo by one developer. Milestone M2 (PRD review) is skipped.
- Team members in the app are **mock data** representing the product's target users, not real collaborators.

## Data model

- A **team** has members. Each member has: name, email, GitHub username. Members can be added to a team.
- For now: **one team, one project**. Shape the data so multiple projects per team can be added later (e.g. tasks belong to a project via a `projectId`, projects belong to a team via a `teamId`).
- Each **task** stores its AI context:
  - prompt / context given to the AI
  - AI tool used
  - outcome
  - problems hit with the AI
- This extends the starter `Task` model in `PRD.md` §5 (which only has `context`, `contextTool`, `contextUpdatedAt`). `Task.assignee` refers to a team member, not the PRD's fixed three teammate names.
- Persistence: **localStorage** for now, via the `useLocalStorage` hook in `src/App.jsx`.

## Auth

- Login is a later extra, not part of the core build.
- If login is added, it **must** include a guest/demo mode so an assessor can use the app without registering.

## Git

- **Never run `git commit`, `git push` or `git tag`.** The developer handles all commits, pushes and tags.
- Remote: `origin` → https://github.com/elamorgan18/vibecoding-project-tracker.git

## Prompt log

After every request from the user, append an entry to `PROMPT_LOG.md` under a heading for the current milestone (e.g. `## M4 – data-model`). Each entry contains:

1. Date and time
2. The Claude model you are running (name and model ID)
3. The user's prompt, copied word for word
4. A one- or two-line summary of what changed and which files

Never edit or delete earlier entries. Only append.
