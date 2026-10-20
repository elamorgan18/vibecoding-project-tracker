/**
 * Mock data loaded on first visit (when localStorage is empty).
 *
 * The team members are fictional. They represent the product's target users
 * (junior and more experienced developers building with AI tools), not real
 * collaborators.
 */

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
    dueDate: '2026-10-24',
    createdDate: '2026-10-18',
  },
  {
    id: 'vt-2',
    projectId: 'project-1',
    title: 'Fix date picker timezone offset',
    description: 'Events created after 11pm show up on the next day.',
    type: 'bug',
    status: 'in-progress',
    assignee: 'member-3',
    dueDate: '2026-10-21',
    createdDate: '2026-10-19',
  },
  {
    id: 'vt-3',
    projectId: 'project-1',
    title: 'Generate RSVP confirmation email',
    description: 'Send a plain-text confirmation when someone RSVPs.',
    type: 'feature',
    status: 'review',
    assignee: 'member-2',
    dueDate: '2026-10-22',
    createdDate: '2026-10-15',
  },
  {
    id: 'vt-4',
    projectId: 'project-1',
    title: 'Scaffold event list page',
    description: 'Card grid of upcoming events with date and venue.',
    type: 'feature',
    status: 'done',
    assignee: 'member-1',
    dueDate: '2026-10-17',
    createdDate: '2026-10-12',
  },
];
