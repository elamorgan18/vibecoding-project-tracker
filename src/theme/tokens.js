/**
 * Colour tokens for light and dark mode (DESIGN.md §2).
 *
 * The single source of truth for every colour in the app. `tailwind.config.js`
 * turns each key into a CSS variable (`--c-<key>`, set on `:root` for light
 * and on `.dark` for dark) and each Tailwind colour reads its variable, so
 * classes like `bg-card` or `ring-brand/30` switch theme on their own.
 *
 * Both themes have the same keys and meanings. Dark-mode rules:
 *   - Base colours (borders, icons, fills) are lighter, so they still reach
 *     3:1 on the dark card and column backgrounds.
 *   - `-soft` tints are the base colour mixed into the dark card, so tinted
 *     cards and chips stay dark and readable.
 *   - `-text` shades are pale, for AA text on those tints.
 *   - Avatar backgrounds are the light pastels dimmed (lower lightness,
 *     slightly less chroma) so they don't glare; initials stay the same.
 *   - `on-accent` is the text/icon colour on solid brand, danger and success
 *     fills: white in light mode, near-black in dark mode, where the fills
 *     are too light for white text.
 */
export const THEMES = {
  light: {
    surface: '#F8FAFC',
    card: '#FFFFFF',
    'muted-bg': '#F1F5F9',
    line: '#E2E8F0',
    ink: '#020817',
    'ink-soft': '#475569',
    muted: '#475569',
    scrim: '#020817',

    brand: '#2563EB',
    'brand-hover': '#1D4ED8',
    'brand-soft': '#EFF6FF',
    'on-accent': '#FFFFFF',

    success: '#16A34A',
    'success-soft': '#F0FDF4',
    'success-text': '#15803D',
    danger: '#DC2626',
    'danger-hover': '#B91C1C',
    'danger-soft': '#FEF2F2',
    'danger-text': '#B91C1C',

    feature: '#7C3AED',
    'feature-soft': '#F5F3FF',
    'feature-text': '#6D28D9',
    bug: '#E11D48',
    'bug-soft': '#FFF1F2',
    'bug-text': '#BE123C',

    'due-calm': '#0EA5E9',
    'due-calm-soft': '#F0F9FF',
    'due-calm-text': '#0369A1',
    'due-warning': '#D97706',
    'due-warning-soft': '#FFFBEB',
    'due-warning-text': '#B45309',
    'due-done': '#94A3B8',
    'due-done-soft': '#F1F5F9',
    'due-done-text': '#475569',

    'avatar-teal-bg': '#91E5CA',
    'avatar-teal-text': '#084B3C',
    'avatar-magenta-bg': '#F8B1DD',
    'avatar-magenta-text': '#6A1952',
    'avatar-lime-bg': '#D7F5AB',
    'avatar-lime-text': '#3A5006',
    'avatar-cyan-bg': '#8BD9EA',
    'avatar-cyan-text': '#074550',
    'avatar-orchid-bg': '#F1D0FF',
    'avatar-orchid-text': '#602F72',
    'avatar-olive-bg': '#D9D27A',
    'avatar-olive-text': '#443F03',
    'avatar-aqua-bg': '#A3F6F6',
    'avatar-aqua-text': '#005354',
    'avatar-gold-bg': '#FFDC9E',
    'avatar-gold-text': '#5D4304',
  },

  dark: {
    surface: '#020817',
    card: '#1E293B',
    'muted-bg': '#0F172A',
    line: '#334155',
    ink: '#F8FAFC',
    'ink-soft': '#CBD5E1',
    muted: '#CBD5E1',
    scrim: '#000000',

    brand: '#60A5FA',
    'brand-hover': '#93C5FD',
    'brand-soft': '#1E3A5F',
    'on-accent': '#020817',

    success: '#4ADE80',
    'success-soft': '#1A3D33',
    'success-text': '#86EFAC',
    danger: '#F87171',
    'danger-hover': '#FCA5A5',
    'danger-soft': '#45293A',
    'danger-text': '#FCA5A5',

    feature: '#A78BFA',
    'feature-soft': '#2E2F5A',
    'feature-text': '#C4B5FD',
    bug: '#FB7185',
    'bug-soft': '#45283F',
    'bug-text': '#FDA4AF',

    'due-calm': '#38BDF8',
    'due-calm-soft': '#1A3E5A',
    'due-calm-text': '#7DD3FC',
    'due-warning': '#FBBF24',
    'due-warning-soft': '#463C33',
    'due-warning-text': '#FCD34D',
    'due-done': '#64748B',
    'due-done-soft': '#334155',
    'due-done-text': '#CBD5E1',

    'avatar-teal-bg': '#82CCB4',
    'avatar-teal-text': '#084B3C',
    'avatar-magenta-bg': '#DC9EC4',
    'avatar-magenta-text': '#6A1952',
    'avatar-lime-bg': '#C2DD9B',
    'avatar-lime-text': '#3A5006',
    'avatar-cyan-bg': '#7DC1D0',
    'avatar-cyan-text': '#074550',
    'avatar-orchid-bg': '#D8BBE4',
    'avatar-orchid-text': '#602F72',
    'avatar-olive-bg': '#C1BB6E',
    'avatar-olive-text': '#443F03',
    'avatar-aqua-bg': '#94DDDD',
    'avatar-aqua-text': '#005354',
    'avatar-gold-bg': '#E5C68F',
    'avatar-gold-text': '#5D4304',
  },
};

/** '#2563EB' -> '37 99 235', the form Tailwind's `<alpha-value>` needs. */
export function hexToChannels(hex) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}
