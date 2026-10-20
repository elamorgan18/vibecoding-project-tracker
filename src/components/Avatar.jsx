import { UserRound } from 'lucide-react';

export function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const SIZES = {
  sm: 'h-6 w-6 text-[11px]',
  md: 'h-8 w-8 text-xs',
};

/**
 * Initials avatar for a member, or a dashed placeholder when unassigned.
 * Decorative (aria-hidden): the member's name is always shown next to it.
 */
export default function Avatar({ member, size = 'md' }) {
  if (!member) {
    return (
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-full border border-dashed border-ink-soft bg-card text-ink-soft ${SIZES[size]}`}
      >
        <UserRound className="h-1/2 w-1/2" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand-hover ring-2 ring-card ${SIZES[size]}`}
    >
      {initials(member.name)}
    </span>
  );
}
