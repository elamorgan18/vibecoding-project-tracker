import plugin from 'tailwindcss/plugin';
import { THEMES, hexToChannels } from './src/theme/tokens.js';

// Every colour is a CSS variable (values in src/theme/tokens.js), so one class
// such as `bg-card` works in both themes. `<alpha-value>` keeps opacity
// modifiers like `ring-brand/30` working.
const v = (key) => `rgb(var(--c-${key}) / <alpha-value>)`;

// Status colours (DESIGN.md §2.2). `danger` is reused for the overdue due state.
const success = {
  DEFAULT: v('success'),
  soft: v('success-soft'),
  text: v('success-text'),
};

const danger = {
  DEFAULT: v('danger'),
  hover: v('danger-hover'),
  soft: v('danger-soft'),
  text: v('danger-text'),
};

const avatar = (key) => ({ bg: v(`avatar-${key}-bg`), text: v(`avatar-${key}-text`) });

// The CSS variables: light on :root, dark on .dark (DESIGN.md §2.8).
const cssVars = (theme) =>
  Object.fromEntries(Object.entries(theme).map(([key, hex]) => [`--c-${key}`, hexToChannels(hex)]));

const themeVariables = plugin(({ addBase }) => {
  addBase({
    ':root': { ...cssVars(THEMES.light), colorScheme: 'light' },
    // `color-scheme` makes native controls (select menus, scrollbars, date
    // pickers) follow the theme.
    '.dark': { ...cssVars(THEMES.dark), colorScheme: 'dark' },
  });
});

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // Dark mode follows a `dark` class on <html>, set from the saved choice or
  // the system preference (index.html, useTheme.js).
  darkMode: 'class',
  theme: {
    extend: {
      // Design tokens from DESIGN.md §2. Base tokens are translated from a
      // tweakcn.com/community theme (Tailwind v4 @theme -> v3 config).
      // Meaning colours: base for borders, icons and fills; use the `-text`
      // shade for coloured text (WCAG AA, §2.6).
      colors: {
        brand: {
          DEFAULT: v('brand'),
          hover: v('brand-hover'),
          soft: v('brand-soft'),
        },
        surface: v('surface'),
        card: v('card'),
        'muted-bg': v('muted-bg'),
        line: v('line'),
        ink: {
          DEFAULT: v('ink'),
          soft: v('ink-soft'), // captions on muted-bg and tinted backgrounds
        },
        // Darkened from #64748B (4.55:1 on surface) for contrast margin; now the
        // same value as ink-soft (≥ 6.9:1 on every background it sits on).
        muted: v('muted'),
        // Modal backdrop (used at 40% / 60% opacity).
        scrim: v('scrim'),
        // Text and icons on solid brand / danger / success fills: white in
        // light mode, near-black in dark mode where those fills are light.
        'on-accent': v('on-accent'),

        // Status: confirmation toasts, deliverable dot, Done accent / delete, errors, overdue
        success,
        danger,

        // Avatar colours (DESIGN.md §2.7): soft background + dark initials.
        // Hues sit ≥ 22° (OKLCH) from every semantic hue; initials ≥ 6.5:1
        // (≥ 5.1:1 on the dimmed dark-mode backgrounds).
        avatar: {
          teal: avatar('teal'),
          magenta: avatar('magenta'),
          lime: avatar('lime'),
          cyan: avatar('cyan'),
          orchid: avatar('orchid'),
          olive: avatar('olive'),
          aqua: avatar('aqua'),
          gold: avatar('gold'),
        },

        // Task type (M6 tag-style): corner badge + icon
        feature: {
          DEFAULT: v('feature'),
          soft: v('feature-soft'),
          text: v('feature-text'),
        },
        bug: {
          DEFAULT: v('bug'),
          soft: v('bug-soft'),
          text: v('bug-text'),
        },

        // Due-date state (M8 due-tint): left border + background tint
        due: {
          calm: {
            DEFAULT: v('due-calm'),
            soft: v('due-calm-soft'),
            text: v('due-calm-text'),
          },
          warning: {
            DEFAULT: v('due-warning'),
            soft: v('due-warning-soft'),
            text: v('due-warning-text'),
          },
          overdue: danger,
          done: {
            DEFAULT: v('due-done'),
            soft: v('due-done-soft'),
            text: v('due-done-text'),
          },
        },
      },
      // `ring-offset-2` with no colour leaves a gap in the card colour (white
      // in light mode, as before) instead of Tailwind's fixed white.
      ringOffsetColor: {
        DEFAULT: 'rgb(var(--c-card))',
      },
      // Type scale (DESIGN.md §3). Sizes in rem; line-heights unitless so they
      // scale with the text when users enlarge it (Tailwind's defaults are rem).
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.4' }], //   12px compact metadata
        sm: ['0.875rem', { lineHeight: '1.4' }], //  14px card titles, names, labels, errors
        base: ['1rem', { lineHeight: '1.5' }], //    16px body / reading text, inputs
        lg: ['1.125rem', { lineHeight: '1.5' }], //  18px Markdown h1
        '2xl': ['1.5rem', { lineHeight: '1.3' }], // 24px page title
      },
      // 200 ms fade-in for toasts (DESIGN.md §7).
      keyframes: {
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'toast-in': 'toast-in 200ms ease-out',
      },
      // tweakcn --radius: 0.375rem. `rounded` and `rounded-md` both use it.
      borderRadius: {
        DEFAULT: '0.375rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [themeVariables],
};
