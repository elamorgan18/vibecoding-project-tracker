/**
 * Mock data loaded on first visit (when localStorage is empty).
 *
 * The team members are fictional. They represent the product's target users
 * (junior and more experienced developers building with AI tools), not real
 * collaborators.
 *
 * Task dates are relative to the day the data is first loaded, so the board
 * always opens with one task in each due state (DESIGN.md §2.4):
 *   vt-1 calm (due in 4 days), vt-2 warning (due today),
 *   vt-3 overdue (2 days late), vt-4 done (was due 3 days ago).
 */

import { addDays, todayISO } from './dates.js';

const today = todayISO();

/** @type {import('./model.js').Team[]} */
export const SEED_TEAMS = [
  {
    id: 'team-1',
    name: 'Demo Team',
    members: [
      { id: 'member-1', name: 'Priya Shah', email: 'priya.shah@example.com', githubUsername: 'priya-codes' },
      { id: 'member-2', name: 'Tom Okafor', email: 'tom.okafor@example.com', githubUsername: 'tokafor-dev' },
      { id: 'member-3', name: 'Sam Rivera', email: 'sam.rivera@example.com', githubUsername: 'samrivera' },
    ],
  },
];

/** @type {import('./model.js').Project[]} */
export const SEED_PROJECTS = [
  { id: 'project-1', teamId: 'team-1', name: 'Campus Events App' },
];

/** @type {import('./model.js').Task[]} */
export const SEED_TASKS = [
  {
    id: 'vt-1',
    projectId: 'project-1',
    title: 'Add event search bar',
    description: 'Filter the event list by title and venue as you type.',
    type: 'feature',
    status: 'todo',
    assignee: 'member-1',
    dueDate: addDays(today, 4),
    createdDate: addDays(today, -2),
  },
  {
    id: 'vt-2',
    projectId: 'project-1',
    title: 'Fix date picker timezone offset',
    description: 'Events created after 11pm show up on the next day.',
    type: 'bug',
    status: 'in-progress',
    assignee: 'member-3',
    dueDate: today,
    createdDate: addDays(today, -1),
  },
  {
    id: 'vt-3',
    projectId: 'project-1',
    title: 'Generate RSVP confirmation email',
    description: 'Send a plain-text confirmation when someone RSVPs.',
    type: 'feature',
    status: 'review',
    assignee: 'member-2',
    dueDate: addDays(today, -2),
    createdDate: addDays(today, -5),
  },
  {
    id: 'vt-4',
    projectId: 'project-1',
    title: 'Scaffold event list page',
    description: 'Card grid of upcoming events with date and venue.',
    type: 'feature',
    status: 'done',
    assignee: 'member-1',
    dueDate: addDays(today, -3),
    createdDate: addDays(today, -8),
  },
];
