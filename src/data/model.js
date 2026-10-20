/**
 * Data model for the tracker.
 *
 * Shape: Team 1─* Project 1─* Task (and Project 1─4 Anchor). There is one team and one project for now,
 * but tasks point at a project and projects point at a team, so more of each
 * can be added later without reshaping stored data.
 */

/**
 * @typedef {Object} Member
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} githubUsername
 * @property {'teal'|'magenta'|'lime'|'cyan'|'orchid'|'olive'|'aqua'|'gold'} avatarColor
 *   set once when the member is created (see avatarColors.js)
 */

/**
 * @typedef {Object} Team
 * @property {string} id
 * @property {string} name
 * @property {Member[]} members
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} teamId     Team.id
 * @property {string} name
 */

/**
 * One of four pinned deliverable links per project (M11), shown above the board.
 * @typedef {Object} Anchor
 * @property {'presentation'|'demo'|'report'|'documentation'} id   unique within a project
 * @property {string} projectId     Project.id
 * @property {string} label         human-readable, e.g. 'Presentation'
 * @property {string|null} url      an http(s) link, or null until one is saved
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} projectId               Project.id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string|null} assignee           Member.id
 * @property {string|null} dueDate            ISO 'YYYY-MM-DD'
 * @property {string} createdDate             ISO 'YYYY-MM-DD'
 *
 * AI context (M9). Older tasks may not have these; read them through
 * `contextValues()` in context.js, which fills in defaults.
 * @property {string} [context]                Markdown briefing, stored exactly as typed/pasted
 * @property {string|null} [contextTool]      'Claude' | 'ChatGPT' | 'Cursor' | 'Lovable' | 'Replit' | 'Gemini' | 'Other'
 * @property {'worked'|'partial'|'failed'|'not-tried'} [aiOutcome]
 * @property {string} [aiProblems]             problems hit with the AI tool
 * @property {string|null} [contextUpdatedAt]  ISO timestamp, set when any context field changes
 */

// The four columns of the board, in render order.
// Use these IDs everywhere — do not invent new ones.
export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

export const TASK_TYPES = ['feature', 'bug'];

export const STORAGE_KEYS = {
  teams: 'vibetracker.teams',
  projects: 'vibetracker.projects',
  tasks: 'vibetracker.tasks',
  anchors: 'vibetracker.anchors',
  // 'light' | 'dark' once the user picks one; null = follow the system.
  // index.html reads this key too, to set the theme before the first paint.
  theme: 'vibetracker.theme',
};
