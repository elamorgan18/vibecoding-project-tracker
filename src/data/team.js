/** Pure helpers for changing a team's members. */

import { nextId } from './ids.js';

function updateMembers(teams, teamId, update) {
  return teams.map((t) => (t.id === teamId ? { ...t, members: update(t.members) } : t));
}

/** Add a member to a team. Returns the new teams array and the created member. */
export function addMember(teams, teamId, values) {
  const team = teams.find((t) => t.id === teamId);
  const member = { id: nextId(team.members, 'member'), ...values };
  return { teams: updateMembers(teams, teamId, (members) => [...members, member]), member };
}

export function removeMember(teams, teamId, memberId) {
  return updateMembers(teams, teamId, (members) => members.filter((m) => m.id !== memberId));
}
