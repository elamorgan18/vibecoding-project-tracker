/**
 * Data model for the tracker.
 *
 * Shape: Team 1─* Project 1─* Task. There is one team and one project for now,
 * but tasks point at a project and projects point at a team, so more of each
 * can be added later without reshaping stored data.
 */

/**
 * @typedef {Object} Member
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} githubUsername
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
};
