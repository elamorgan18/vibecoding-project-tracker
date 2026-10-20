import { Moon, Sun } from 'lucide-react';

/**
 * Header button that switches between light and dark mode.
 * The icon shows the mode you'll switch to (moon in light mode, sun in dark
 * mode), the label says so in words, and `aria-pressed` reports whether dark
 * mode is on.
 */
export default function ThemeToggle({ isDark, onToggle }) {
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label={label}
      title={label}
      className="rounded border border-line bg-card p-2 text-ink-soft hover:bg-muted-bg hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface"
    >
      <Icon aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}
