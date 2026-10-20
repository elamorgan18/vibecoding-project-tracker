/**
 * Avatar colours (DESIGN.md §2.7). Each member stores one of these keys as
 * `avatarColor`, chosen once when they join, so it never changes on reload
 * or when someone else is removed.
 *
 * The order is the assignment order. Consecutive entries are far apart on
 * the colour wheel, so the first few members look clearly different.
 */
export const AVATAR_COLORS = ['teal', 'magenta', 'lime', 'cyan', 'orchid', 'olive', 'aqua', 'gold'];

/**
 * The colour for a new member: the first palette colour nobody on the team
 * uses yet. With more than 8 members it cycles: the least-used colour, ties
 * broken by palette order.
 */
export function nextAvatarColor(members) {
  const counts = Object.fromEntries(AVATAR_COLORS.map((c) => [c, 0]));
  for (const m of members) if (m.avatarColor in counts) counts[m.avatarColor] += 1;
  const fewest = Math.min(...Object.values(counts));
  return AVATAR_COLORS.find((c) => counts[c] === fewest);
}

/**
 * Give a colour to any member saved before avatar colours existed, in team
 * order, without touching members who already have one. Returns the same
 * array if nothing needed changing.
 */
export function withAvatarColors(members) {
  if (members.every((m) => AVATAR_COLORS.includes(m.avatarColor))) return members;
  const done = members.filter((m) => AVATAR_COLORS.includes(m.avatarColor));
  return members.map((m) => {
    if (AVATAR_COLORS.includes(m.avatarColor)) return m;
    const colored = { ...m, avatarColor: nextAvatarColor(done) };
    done.push(colored);
    return colored;
  });
}
