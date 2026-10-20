# M3 – Design system + voice

**Tag:** `design-done`

## What was built

- A filled-in `DESIGN.md` covering mood, colour palette, contrast check, typography, component principles and microcopy.
- Mood line: "A calm, focused workspace that stays quiet by default and only gets loud when something needs your attention."
- A palette of brand and neutral colours, task-type colours and due-date colours. Each colour has a soft background tint.
- Darker AA-safe `-text` shades for the colours that failed WCAG AA as text, plus `ink-soft` for captions on tinted backgrounds.
- A WCAG 2.1 AA contrast table listing approved text/background pairs and pairs to avoid (DESIGN.md §2.5).
- Every colour and font added to `tailwind.config.js` as a named token. Fonts load from Google Fonts.
- Still open in `DESIGN.md`: visual references (§1) and product name (§6).

### Update (2026-10-20 11:47): feature blue + success / danger tokens

- Feature colour changed from teal `#0D9488` (soft `#F0FDFA`, text `#0F766E`) to blue `#2563EB` (soft `#EFF6FF`, text `#1D4ED8`). Feature (blue) vs bug (rose) is no longer a red/green pair.
- Added `success` tokens (`#16A34A`, soft `#F0FDF4`, text `#15803D`) for confirmation toasts, the filled deliverable dot and the Done column accent. Always shown with a check icon and text.
- Added `danger` tokens (`#DC2626`, hover `#B91C1C`, soft `#FEF2F2`, text `#B91C1C`) for the delete button, form errors and the overdue state. Always shown with a trash or alert icon and text.
- `due-overdue` is now defined as the same object as `danger` in `tailwind.config.js` (values unchanged).
- Re-checked WCAG AA for all text/background pairs (DESIGN.md §2.6). The new failures are white on `success` (3.30:1) and `success` as text (3.30 / 3.15:1). Coloured text uses `success-text` (4.79:1 or better) instead. `danger` on its soft tint is 4.41:1, so it uses `danger-text` (5.91:1). `muted` also fails on `feature-soft` (4.37:1), so captions on all tints use `ink-soft`.
- New microcopy: form error "Give this task a title."; deliverable slot "Added" / "Not added yet".

### Update (2026-10-20 11:54): tweakcn base palette

- Base palette now comes from a blue/slate "Professional"-style community theme on [tweakcn.com/community](https://tweakcn.com/community). `package.json` uses Tailwind `^3.4.13` (v3), so the theme's v4 `@theme` CSS was not pasted. It was translated into `tailwind.config.js` tokens.
- Brand changed from indigo `#4F46E5` / hover `#4338CA` / soft `#EEF2FF` to blue `#2563EB` / hover `#1D4ED8` / soft `#EFF6FF`. The soft tint wasn't specified by the theme; `#EFF6FF` (Tailwind blue-50) was added to match.
- `ink` changed from `#0F172A` to `#020817`, and `src/index.css` body text colour was updated to match.
- New `muted-bg` token `#F1F5F9` for column backgrounds, chips, disabled inputs and secondary panels.
- Unchanged: `surface` `#F8FAFC`, `card` `#FFFFFF`, `line` `#E2E8F0`, `muted` `#64748B`, `ink-soft` `#475569`.
- Radius set to `0.375rem` via `borderRadius.DEFAULT`, so `rounded` and `rounded-md` both use it.
- Fonts unchanged: Inter (`font-sans`) and JetBrains Mono (`font-mono`).
- Feature changed from blue `#2563EB` (soft `#EFF6FF`, text `#1D4ED8`) to violet `#7C3AED` (soft `#F5F3FF`, text `#6D28D9`), so it no longer matches the new brand blue.
- Unchanged: bug, success, danger (and `due-overdue` = `danger`), and the due calm / warning / done tokens.
- Re-checked WCAG AA for all text/background pairs (DESIGN.md §2.6). New failure: `muted` on `muted-bg` (4.34:1), so captions on `muted-bg` use `ink-soft` (6.92:1). Violet `feature` passes as text (5.70:1 on `card`, 5.20:1 on `feature-soft`), and white on `feature` passes (5.70:1). `brand` passes on every neutral background (4.72:1 or better), and white on `brand` passes (5.17:1).
- Failing pairs still listed in DESIGN.md: `muted` on `muted-bg` and on the feature / bug / due-calm / due-done / due-overdue tints; `success` as text and white on `success`; `danger` on `danger-soft`; `bug` on `bug-soft`; `due-calm`, `due-warning` and `due-done` as text on `card`.

### Update (2026-10-20 13:45): typography accessibility fixes

These changes follow the typography audit of the same day.

- **Body / reading text: 14 px → 16 px (`text-base`, 1rem, line-height 1.5).** Applies to:
  - all inputs, selects, date fields and placeholders (via the shared `inputClass`), plus the Type picker so it matches the Status select's height;
  - the description textarea and the AI problems textarea;
  - the **Context textarea** (JetBrains Mono, 13 px / `leading-relaxed` → 16 px / 1.5);
  - the Markdown preview body (14 px / 1.625 → 16 px / 1.5; preview h1 16 → 18 px, h2 14 → 16 px; inline code `0.8125rem` → `0.9375em`) and its "Nothing to preview yet." line;
  - delete-task and remove-member confirmations, the save-failed alert, the storage-full banner, and toasts.

  Alert icons moved from `mt-0.5` to `mt-1` to line up with the taller line.
- **Field errors and the copy-failed message: 12 px → 14 px** (`text-sm`, 0.875rem, line-height 1.4). The error icon grew from 14 px to 16 px and is top-aligned for messages that wrap.
- **`muted` token darkened from `#64748B` to `#475569`** (the same value as `ink-soft`). Re-checked contrast:

  | Background | Before | After |
  |---|---|---|
  | `card` | 4.76:1 | 7.58:1 |
  | `surface` | 4.55:1 | 7.24:1 |
  | `muted-bg` | 4.34:1 ❌ | 6.92:1 |
  | feature / bug / due / danger tints | 4.33–4.46:1 ❌ | ≥ 6.90:1 |

  Every `muted` text pair now passes AA, including placeholders.
- **Unitless line-heights.** `tailwind.config.js` now overrides `fontSize`:

  | Token | Size | Line-height |
  |---|---|---|
  | `xs` | 0.75rem | 1.4 |
  | `sm` | 0.875rem | 1.4 |
  | `base` | 1rem | 1.5 |
  | `lg` | 1.125rem | 1.5 |
  | `2xl` | 1.5rem | 1.3 |

  Tailwind's defaults were rem-based (e.g. `text-xs` was 0.75rem on a fixed 1rem line, i.e. 1.33). The built CSS now has no rem or px line-heights.
- **Removed the unused small avatar size** (`h-6 w-6 text-[11px]`) from `Avatar.jsx`. The avatar is now always 32 px with 12 px (0.75rem) initials. There are no px font sizes left in `src/`.
- **Unchanged by design:** 12 px compact metadata (task IDs, count pills, type badges, due chips, avatar initials, small captions) and 14 px card titles, names, labels and buttons.
- **Small layout tweak:** in the modal header, "created {date}" is kept on one line (`whitespace-nowrap`). At phone width it previously broke inside the date.
- **DESIGN.md updated:**
  - §2.1 `muted` hex and description.
  - §2.5 caption notes.
  - §2.6 contrast rows for the new `muted` (old failing row marked as fixed).
  - §3 rewritten as a type-scale table (token, rem / px, unitless line-height, usage) with rules: body 16 px, errors 14 px, no px sizes, nothing under 12 px.
- **Layout checked in a real browser:** a production build (`vite preview`) was driven in headless Microsoft Edge at 1440×900, 1280×800 and 390×844, checking the board, task modal (with preview, empty-title error and delete confirmation), toast and Team panel.
  - No horizontal page overflow and no clipped text at any size.
  - The modal fits the viewport (768 px wide on desktop, 358 px on phone).
  - Measured sizes: inputs, selects, date, description, Context (JetBrains Mono) and AI problems are 16px / 24px; preview body 16px / 24px; confirmation 16px / 24px; toast 16px / 24px; field error 14px / 19.6px; card title and labels 14px / 19.6px; task ID and due chip 12px / 16.8px.
  - Both web fonts loaded.
  - The only console error was a 404 for `/favicon.ico`; the project has no favicon.
- **Tested:** 155/155 jsdom checks still pass, and `npm run build` passes.

## Components / files changed

| File | Change |
|---|---|
| `DESIGN.md` | Filled in §1–§5 and the §6 wordmark style. Update: new §2.2 status section, feature colour changed, contrast table re-checked (now §2.6), principles and microcopy extended |
| `tailwind.config.js` | Added colour tokens and `font-sans` / `font-mono`. Update: `feature` changed, `success` and `danger` added, `due.overdue` reuses `danger`. Update 2: tweakcn base palette (brand, ink, `muted-bg`), violet `feature`, `borderRadius.DEFAULT` |
| `index.html` | Added Google Fonts links for Inter and JetBrains Mono |
| `tailwind.config.js` (typography fixes) | `muted` → `#475569`; `fontSize` override with unitless line-heights (xs/sm 1.4, base/lg 1.5, 2xl 1.3) |
| `src/components/FormField.jsx` | `inputClass` `text-sm` → `text-base`; error message `text-xs` → `text-sm`, 16 px icon |
| `src/components/ContextSection.jsx` | Context textarea `text-[0.8125rem] leading-relaxed` → `text-base` (mono); copy status `text-xs` → `text-sm` |
| `src/components/MarkdownPreview.jsx` | Body `text-sm leading-relaxed` → `text-base`; h1 `text-lg`, h2 `text-base`; inline code `0.9375em`; empty line `text-base` |
| `src/components/TaskModal.jsx` | Delete confirmation and save-failed alert `text-base`; Type picker `text-base`; "created {date}" `whitespace-nowrap` |
| `src/components/TeamPanel.jsx` | Remove confirmation `text-base` |
| `src/components/Toast.jsx`, `src/App.jsx` | Toast and storage banner `text-base`; alert icons `mt-1` |
| `src/components/Avatar.jsx` | Removed unused `sm` size (`text-[11px]`) and the `size` prop |
| `src/index.css` | Body font changed to Inter first; comments renamed to token names. Update 2: body text colour set to new `ink` `#020817` |

No React components were changed.

## Colours, fonts, icons & interactions used

**Base tokens (current; source: tweakcn.com/community)**

| Token | Hex |
|---|---|
| `brand` / `brand-hover` / `brand-soft` | `#2563EB` / `#1D4ED8` / `#EFF6FF` |
| `surface` | `#F8FAFC` |
| `card` | `#FFFFFF` |
| `muted-bg` | `#F1F5F9` |
| `line` | `#E2E8F0` |
| `ink` / `ink-soft` | `#020817` / `#475569` |
| `muted` | `#64748B` |
| Radius | `0.375rem` (`rounded`, `rounded-md`) |

**Status**

| Token | Base | `-soft` | `-text` | Icon | Used for |
|---|---|---|---|---|---|
| `success` | `#16A34A` | `#F0FDF4` | `#15803D` | `check` / `check-circle` | Confirmation toasts, filled deliverable dot, Done column accent |
| `danger` (hover `#B91C1C`) | `#DC2626` | `#FEF2F2` | `#B91C1C` | `trash-2` / `alert-circle` / `alert-triangle` | Delete button, form errors, overdue state |

**Task type (corner badge + icon)**

| Token | Base | `-soft` | `-text` | Icon | Label |
|---|---|---|---|---|---|
| `feature` | `#7C3AED` | `#F5F3FF` | `#6D28D9` | `sparkles` | "Feature" |
| `bug` | `#E11D48` | `#FFF1F2` | `#BE123C` | `bug` | "Bug" |

**Due-date state (left border + background tint)**

| Token | Base | `-soft` | `-text` | Icon | Label |
|---|---|---|---|---|---|
| `due-calm` | `#0EA5E9` | `#F0F9FF` | `#0369A1` | `calendar` | "Due {date}" |
| `due-warning` | `#D97706` | `#FFFBEB` | `#B45309` | `clock` | "Due soon" |
| `due-overdue` (= `danger`) | `#DC2626` | `#FEF2F2` | `#B91C1C` | `alert-triangle` | "Overdue" |
| `due-done` | `#94A3B8` | `#F1F5F9` | `#475569` | `check-circle` | "Done" |

**Colour rules**

- Task type appears only in the corner badge. Due state appears only in the left border and background tint.
- Every colour is paired with an icon and a text label.
- Coloured text uses the `-text` shades.
- Captions on `muted-bg` and soft tints use `ink-soft`, not `muted`.
- Success only means done or confirmed. Danger only means destructive, wrong or late.
- No white text on a solid `success` fill.

**Fonts**

- Inter 400/500/600/700 (`font-sans`) for headings and body.
- JetBrains Mono 400/500 (`font-mono`) for task IDs and the Context field.

**Type sizes**

- Page title: 24 px semibold
- Section header: 16 px semibold uppercase
- Card title: 14 px medium
- Body: 14 px regular
- Caption: 12 px regular

**Icons:** Lucide.

**Interactions (specified for later milestones)**

- Card shadow on hover only.
- `brand` focus ring on inputs.
- Status changes through a dropdown (no drag-and-drop).
- Centred `max-w-lg` modal on an `ink` 40% backdrop.
- 200 ms fade on toasts.
- Columns on `muted-bg`; dashed-border empty columns.
- 6 px radius (`rounded`) on cards, buttons, inputs, badges and the modal.
- Success toasts on `success-soft` with a check icon.
- Delete button in solid `danger` with a trash icon, hovering to `danger-hover`.
- Inline form errors with a `danger` border, alert icon and `danger-text` message.
- Done column header with a `success` top border and check icon.
- Deliverable slots show a filled `success` dot with a check and "Added", or a dashed circle with "Not added yet".

**Microcopy**

| Where | Text |
|---|---|
| "+" button | "+ New task" |
| Empty column | "Nothing here. Enjoy the quiet." |
| Copy toast | "Context copied. Paste it into your AI tool." |
| Delete confirm | "Delete this task and its prompt history? This can't be undone." |
| Handoff toast | "Handed to {name}. It's on their board now." |
| Form error (missing title) | "Give this task a title." |
| Deliverable slot | "Added" / "Not added yet" |

## Screenshot

![M3 screenshot](../screenshots/M3.png)

Placeholder path: `docs/screenshots/M3.png`

## Why I chose this

[TO COMPLETE]

## Alternatives considered

[TO COMPLETE]

## UX principle / literature reference

[TO COMPLETE]

## Requirement IDs this maps to

[TO COMPLETE]
