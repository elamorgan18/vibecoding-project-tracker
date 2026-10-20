// Status colours (DESIGN.md §2.2). `danger` is reused for the overdue due state.
const success = {
  DEFAULT: '#16A34A',
  soft: '#F0FDF4',
  text: '#15803D',
};

const danger = {
  DEFAULT: '#DC2626',
  hover: '#B91C1C',
  soft: '#FEF2F2',
  text: '#B91C1C',
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Design tokens from DESIGN.md §2. Base tokens are translated from a
      // tweakcn.com/community theme (Tailwind v4 @theme -> v3 config).
      // Meaning colours: base for borders, icons and fills; use the `-text`
      // shade for coloured text (WCAG AA, §2.6).
      colors: {
        brand: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          soft: '#EFF6FF',
        },
        surface: '#F8FAFC',
        card: '#FFFFFF',
        'muted-bg': '#F1F5F9',
        line: '#E2E8F0',
        ink: {
          DEFAULT: '#020817',
          soft: '#475569', // captions on muted-bg and tinted backgrounds
        },
        muted: '#64748B',

        // Status: confirmation toasts, deliverable dot, Done accent / delete, errors, overdue
        success,
        danger,

        // Task type (M6 tag-style): corner badge + icon
        feature: {
          DEFAULT: '#7C3AED',
          soft: '#F5F3FF',
          text: '#6D28D9',
        },
        bug: {
          DEFAULT: '#E11D48',
          soft: '#FFF1F2',
          text: '#BE123C',
        },

        // Due-date state (M8 due-tint): left border + background tint
        due: {
          calm: {
            DEFAULT: '#0EA5E9',
            soft: '#F0F9FF',
            text: '#0369A1',
          },
          warning: {
            DEFAULT: '#D97706',
            soft: '#FFFBEB',
            text: '#B45309',
          },
          overdue: danger,
          done: {
            DEFAULT: '#94A3B8',
            soft: '#F1F5F9',
            text: '#475569',
          },
        },
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
  plugins: [],
};
