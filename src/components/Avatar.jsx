import { UserRound } from 'lucide-react';
import { AVATAR_COLORS } from '../data/avatarColors.js';

export function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// 32px circle, 12px (0.75rem) initials.
const SIZE = 'h-8 w-8 text-xs';

// Full class strings so Tailwind can find them (DESIGN.md §2.7).
const COLOR_CLASSES = {
  teal: 'bg-avatar-teal-bg text-avatar-teal-text',
  magenta: 'bg-avatar-magenta-bg text-avatar-magenta-text',
  lime: 'bg-avatar-lime-bg text-avatar-lime-text',
  cyan: 'bg-avatar-cyan-bg text-avatar-cyan-text',
  orchid: 'bg-avatar-orchid-bg text-avatar-orchid-text',
  olive: 'bg-avatar-olive-bg text-avatar-olive-text',
  aqua: 'bg-avatar-aqua-bg text-avatar-aqua-text',
  gold: 'bg-avatar-gold-bg text-avatar-gold-text',
};

// Members should always have a stored colour; this only guards bad data.
function colorFor(member) {
  if (COLOR_CLASSES[member.avatarColor]) return member.avatarColor;
  const hash = [...member.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/**
 * Initials avatar in the member's own colour, or a dashed placeholder when
 * unassigned. The initials are always shown, so identity never relies on
 * colour alone. Decorative (aria-hidden): the member's name is always shown
 * next to it.
 */
export default function Avatar({ member }) {
  if (!member) {
    return (
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-full border border-dashed border-ink-soft bg-card text-ink-soft ${SIZE}`}
      >
        <UserRound className="h-1/2 w-1/2" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      data-avatar-color={colorFor(member)}
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ring-2 ring-card ${SIZE} ${COLOR_CLASSES[colorFor(member)]}`}
    >
      {initials(member.name)}
    </span>
  );
}
