/** Pure helpers for changing a team's members. */

import { nextAvatarColor, withAvatarColors } from './avatarColors.js';
import { nextId } from './ids.js';

function updateMembers(teams, teamId, update) {
  return teams.map((t) => (t.id === teamId ? { ...t, members: update(t.members) } : t));
}

/**
 * Add a member to a team, giving them the next unused avatar colour.
 * The ID is unique across all teams, since tasks point at members by ID.
 * Returns the new teams array and the created member.
 */
export function addMember(teams, teamId, values) {
  const team = teams.find((t) => t.id === teamId);
  const id = nextId(teams.flatMap((t) => t.members), 'member');
  const member = { id, ...values, avatarColor: nextAvatarColor(team.members) };
  return { teams: updateMembers(teams, teamId, (members) => [...members, member]), member };
}

/** Removing a member never changes anyone else's stored avatar colour. */
export function removeMember(teams, teamId, memberId) {
  return updateMembers(teams, teamId, (members) => members.filter((m) => m.id !== memberId));
}

/** Teams with avatar colours filled in for members saved before colours existed. */
export function withTeamAvatarColors(teams) {
  let changed = false;
  const next = teams.map((t) => {
    const members = withAvatarColors(t.members);
    if (members === t.members) return t;
    changed = true;
    return { ...t, members };
  });
  return changed ? next : teams;
}
