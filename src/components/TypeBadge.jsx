import { Bug, Sparkles } from 'lucide-react';

/**
 * Colour, icon and label for each task type (DESIGN.md §2.3).
 * Type is shown by a soft background tint + a thin border in the type colour,
 * always together with the icon and label. Icons use the base colour, labels
 * the AA-safe `-text` shade. Class strings are written out in full so
 * Tailwind can find them.
 */
export const TYPE_META = {
  feature: {
    label: 'Feature',
    Icon: Sparkles,
    tint: 'bg-feature-soft',
    card: 'bg-feature-soft border-feature',
    text: 'text-feature-text',
    icon: 'text-feature',
    selected: 'border-feature bg-feature-soft text-feature-text',
  },
  bug: {
    label: 'Bug',
    Icon: Bug,
    tint: 'bg-bug-soft',
    card: 'bg-bug-soft border-bug',
    text: 'text-bug-text',
    icon: 'text-bug',
    selected: 'border-bug bg-bug-soft text-bug-text',
  },
};

/**
 * Small pill with the type's icon and label, used on cards and in the modal.
 * It sits on a type-tinted surface, so the pill itself is white to stay
 * visible against the tint.
 */
export default function TypeBadge({ type }) {
  const { label, Icon, text, icon } = TYPE_META[type];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-xs font-medium ${text}`}>
      <Icon aria-hidden="true" className={`h-3.5 w-3.5 ${icon}`} />
      {label}
    </span>
  );
}
