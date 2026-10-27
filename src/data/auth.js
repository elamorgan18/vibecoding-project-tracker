/**
 * Mock login, sign-up and roles (prototype only).
 *
 * Accounts live in localStorage next to the other vibetracker.* keys. There
 * is no backend and no real security: anyone with the browser can read or
 * change them. A real product would sign users in through a backend with
 * proper authentication (an auth service issuing sessions or tokens, with
 * passwords hashed server-side using a slow, salted algorithm), as in our C4
 * container diagram. Hashing here only avoids storing passwords as plain text.
 */

/**
 * @typedef {Object} Account
 * @property {string} id
 * @property {string} email          sign-in email, stored lower-case
 * @property {string} passwordHash   SHA-256 of `${email}:${password}`, hex
 * @property {'developer'|'lead'} role
 * @property {string} memberId       Member.id this account is linked to
 * @property {string} name           the member's name when the account was made,
 *                                   shown if that member is later removed
 */

/**
 * Who is using the app: { accountId } or { guest: true }; null = logged out.
 * @typedef {{ accountId: string } | { guest: true } | null} Session
 */

import { nextId } from './ids.js';

export const ROLES = {
  developer: { label: 'Developer' },
  lead: { label: 'Team lead' },
  guest: { label: 'Guest (demo)' },
};

// What each role can do beyond creating, editing and moving tasks (which every
// role can). The guest can do everything, so an assessor can test the whole board.
const PERMISSIONS = {
  developer: { manageMembers: false, editDeliverables: false },
  lead: { manageMembers: true, editDeliverables: true },
  guest: { manageMembers: true, editDeliverables: true },
};

/** @param {'manageMembers'|'editDeliverables'} action */
export function can(role, action) {
  return Boolean(PERMISSIONS[role]?.[action]);
}

export const DEMO_PASSWORD = 'demo123';

// Linked to two of the existing demo members (seed.js), which aren't changed.
// Hashes are of `${email}:demo123`, precomputed so the accounts can be created
// without waiting for Web Crypto.
export const DEMO_ACCOUNTS = [
  {
    id: 'account-1',
    email: 'dev@demo.com',
    passwordHash: '8afb9c03aa4e4eb65635ee6bc3d75661e163613b481542a32d0ddb45a964e1f2',
    role: 'developer',
    memberId: 'member-3',
    name: 'Sam Rivera',
  },
  {
    id: 'account-2',
    email: 'lead@demo.com',
    passwordHash: '2fea0609ef961e372e54c61a410009729900dce0bfbc546885d45030c531f994',
    role: 'lead',
    memberId: 'member-1',
    name: 'Priya Shah',
  },
];

/** Accounts with any missing demo account added back. Same array if none were missing. */
export function withDemoAccounts(accounts) {
  const missing = DEMO_ACCOUNTS.filter((demo) => !accounts.some((a) => a.email === demo.email));
  if (missing.length === 0) return accounts;
  return missing.reduce(
    (all, demo) => [...all, all.some((a) => a.id === demo.id) ? { ...demo, id: nextId(all, 'account') } : demo],
    accounts,
  );
}

export const normalizeEmail = (email) => email.trim().toLowerCase();

/**
 * SHA-256 (Web Crypto) of the email and password, as hex. The email acts as a
 * simple salt so two accounts with the same password get different hashes.
 * Throws where Web Crypto isn't available (pages not served over https or
 * localhost).
 */
export async function hashPassword(email, password) {
  const bytes = new TextEncoder().encode(`${normalizeEmail(email)}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD = 6;

export function validateLogin({ email, password }) {
  const errors = {};
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email, like name@example.com.';
  if (!password) errors.password = 'Enter your password.';
  return errors;
}

export function validateSignUp({ name, email, password }, accounts) {
  const errors = {};
  if (!name.trim()) errors.name = 'Enter your name.';
  if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Enter a valid email, like name@example.com.';
  } else if (accounts.some((a) => a.email === normalizeEmail(email))) {
    errors.email = 'An account with this email already exists. Log in instead.';
  }
  if (password.length < MIN_PASSWORD) errors.password = `Use at least ${MIN_PASSWORD} characters.`;
  return errors;
}

/** The account matching these details, or null. */
export async function findAccount(accounts, email, password) {
  const account = accounts.find((a) => a.email === normalizeEmail(email));
  if (!account) return null;
  return account.passwordHash === (await hashPassword(email, password)) ? account : null;
}

/**
 * The signed-in user for the header and permission checks, or null when
 * logged out (or the session's account no longer exists).
 * `member` is the linked team member, or a stand-in if they were removed.
 */
export function currentUser(session, accounts, teams) {
  if (!session) return null;
  if (session.guest) return { role: 'guest', name: 'Guest', email: null, member: null };
  const account = accounts.find((a) => a.id === session.accountId);
  if (!account) return null;
  const member = teams.flatMap((t) => t.members).find((m) => m.id === account.memberId) ?? {
    id: account.memberId,
    name: account.name,
  };
  return { role: account.role, name: member.name, email: account.email, member };
}
