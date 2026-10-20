# M8 – Due-date urgency

**Tag:** `due-tint`

## What was built

- **Automatic due state:** each task's state is worked out from its existing `dueDate` and `status`. There are no new fields. It's calculated in `dueState()` (`src/data/due.js`) using whole local calendar days from today:

  | State | Rule | Chip text |
  |---|---|---|
  | `calm` | due more than 2 days away | "Due in 3 days", "Due in 5 days" … |
  | `warning` | due today, tomorrow or in 2 days (`WARNING_WITHIN_DAYS = 2`) | "Due today", "Due tomorrow", "Due in 2 days" |
  | `overdue` | due date in the past | "Overdue by 1 day", "Overdue by 2 days" … |
  | `done` | status is Done, whatever the date (even if overdue) | "Done" |
  | none | no due date | no chip, no due border |

- **How it's shown on the card:** a **4px left border** in the due colour, plus a **due-date chip** (icon + text) under the title. The card background is **not** changed; it stays the feature/bug type tint. The type border stays on the other three sides.
- **Legend:** a "Due dates" legend above the board shows each state's chip with a one-line explanation:
  - "More than 2 days away"
  - "Due within 2 days"
  - "Past the due date"
  - "Finished, even if it was late"
- **Modal preview:** the edit/create modal shows a live preview of the chip under the Due date field. It updates as the date or status changes and disappears when the date is cleared.
- **Mock data:** seed task dates are now **relative to the day the data is first loaded**, so all four states are always visible on a fresh board:
  - `vt-1` calm (due in 4 days)
  - `vt-2` warning (due today)
  - `vt-3` overdue (2 days late)
  - `vt-4` done (was due 3 days ago, shown as "Done")

  Created dates are also relative. Statuses, types and assignees are unchanged. Boards already saved in localStorage keep their old fixed dates; clearing the site's localStorage reloads the new seed.
- **Date helpers:** `todayISO` moved to a new `src/data/dates.js`, with new `addDays` and `daysBetween`.
- **Tested** (97/97 checks passed in jsdom through the real UI, plus unit checks):
  - `dueState` boundaries: 5 / 3 days calm; 2 / 1 / 0 days warning; −1 / −2 overdue; singular/plural labels.
  - Done is neutral even when overdue or in the future; no due date gives no state.
  - `addDays` across month boundaries.
  - Each seeded card has the right chip text, icon, chip colours and left border.
  - No card has a due background, and every card keeps its type tint.
  - The chip carries a `<time datetime>`.
  - The legend has all four states with icons.
  - The modal preview updates for date and status changes and is removed when there's no date; cancelling doesn't save.
  - All M5–M7 checks still pass, with no React warnings.
- **Build:** `npm run build` passes. In the built CSS, `border-l-due-*` rules come after `border-feature` / `border-bug`, so the due colour wins on the left edge. The dev server compiles the new modules.

## Components / files changed

| File | Change |
|---|---|
| `src/data/due.js` | New. `dueState(task, today)` and `WARNING_WITHIN_DAYS` |
| `src/data/dates.js` | New. `todayISO` (moved from `tasks.js`), `addDays`, `daysBetween` |
| `src/components/DueChip.jsx` | New. `DUE_META` (icon, chip classes, left-border classes, legend text per state) and the `DueChip` pill |
| `src/components/DueLegend.jsx` | New. "Due dates" legend |
| `src/components/TaskCard.jsx` | Adds the due left border and the `DueChip` row under the title |
| `src/components/TaskModal.jsx` | Live due chip preview under the Due date field |
| `src/App.jsx` | Renders `DueLegend` above the board; imports `todayISO` from `dates.js` |
| `src/data/tasks.js` | `todayISO` removed (now in `dates.js`) |
| `src/data/seed.js` | Due and created dates relative to today, so all four states show |
| `DESIGN.md` | §2.4 table: icons, rules, chip text, `-text` icon colour, legend; §2.6 left-border contrast values |

## Colours, fonts, icons & interactions used

**Colours (Tailwind tokens)**

| State | Left border | Chip | Chip text + icon contrast | Left border vs column `muted-bg` |
|---|---|---|---|---|
| calm | `border-l-4 border-l-due-calm` #0EA5E9 | `bg-due-calm-soft text-due-calm-text` | 5.57:1 ✅ | 2.53:1 (decorative) |
| warning | `border-l-4 border-l-due-warning` #D97706 | `bg-due-warning-soft text-due-warning-text` | 4.84:1 ✅ | 2.91:1 (decorative) |
| overdue | `border-l-4 border-l-due-overdue` #DC2626 (= `danger`) | `bg-due-overdue-soft text-due-overdue-text` | 5.91:1 ✅ | 4.41:1 ✅ |
| done | `border-l-4 border-l-due-done` #94A3B8 | `bg-due-done-soft text-due-done-text` | 6.92:1 ✅ | 2.34:1 (decorative) |

- **Chip icons:** use the `-text` shade (inherited from the chip), because base `due-calm` / `due-done` are below 3:1 on their tints (2.60 / 2.34:1).
- **Left borders:** the calm, warning and done left borders are decorative: the chip always repeats the state in text and icon.
- **Background:** card background is unchanged (type tint).
- **Legend:** heading `text-ink`, descriptions `text-muted` on `surface` (4.55:1 ✅).

**Fonts**

- Inter.
- Chip: 12 px medium.
- Legend: heading 14 px medium; descriptions 12 px.

**Icons (lucide-react)**

- `Calendar` (calm), `Clock` (warning), `TriangleAlert` (overdue), `CircleCheck` (done).
- All are `aria-hidden` and always next to the chip text.

**Interactions & accessibility**

- **No input needed:** urgency updates automatically on render from today's date.
- **Machine-readable date:** chip text is wrapped in `<time datetime="YYYY-MM-DD">`.
- **Legend markup:** a labelled `<section>` with a list.
- **Modal preview:** shows the chip the card will get before saving.
- **Two channels:** type (background tint + border + corner badge) and due state (left border + chip) never share a channel.

## Screenshot

![M8 screenshot](../screenshots/M8.png)

Placeholder path: `docs/screenshots/M8.png`

## Why I chose this

[TO COMPLETE]

## Alternatives considered

[TO COMPLETE]

## UX principle / literature reference

[TO COMPLETE]

## Requirement IDs this maps to

[TO COMPLETE]
