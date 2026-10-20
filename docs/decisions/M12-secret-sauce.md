# M12 – Secret sauce

**Tag:** `secret-sauce`

## What was built

### Insights view (secret sauce)

- **A Board / Insights switch in the header** (two toggle buttons with `aria-pressed`) swaps the board for an **Insights** page. Every number is worked out live from this team's own logged tasks in `src/data/insights.js`, and the page says "Based on this team's own logged tasks". Recharts 2.15.4 draws the charts. Insights is lazy-loaded, so Recharts (389 kB, 109 kB gzipped) is only downloaded when the view is first opened, and the board's bundle stays the size it was.
- **1. Progress:** a bar chart of tasks per status (To Do, In Progress, Review, Done) with the count on each bar, a large "% complete" figure (Done ÷ all tasks) with a meter, and a **Team member** select: Whole team, each member, or Unassigned.
- **2. AI tool performance:** one horizontal stacked bar per AI tool (`contextTool`) showing Worked / Partial / Failed, with each tool's success rate on the right-hand axis. Success rate = Worked ÷ (Worked + Partial + Failed). "Not tried yet" tasks don't count; they appear in the table.
- **3. Best / lowest AI:** two cards naming the tools with the highest and lowest success rate, for example "Claude, 71% success · worked on 5 of 7 tasks". Only tools with at least 3 tasks marked Worked, Partial or Failed are ranked. "Other" is a mix of tools, so it is never ranked. If no tool qualifies, or only one does (for the lowest card), the card says **"Not enough data yet"** and why. A caption lists the tools that weren't ranked, e.g. "Replit (1 of 3)".
- **4. Suggested AI on the task modal:** a note above the AI tool field, e.g. "Suggested AI tool for bugs: Claude. Claude worked on 4 of 5 bug tasks (80%). Based on this team's history, not a general ranking."
  - It picks the tool with the best success rate on past tasks of the same type (feature or bug), using the same 3-task rule. On a tie, the tool with more tasks wins.
  - It updates when the Type toggle changes, and the task being edited doesn't count towards its own suggestion.
  - A **Use {tool}** button fills in the AI tool select and moves focus to it, after which the note shows "Selected".
  - With too little history it says "No suggested AI tool for features yet." and explains the minimum.
- **Accessibility:**
  - Every chart has a written text summary with all its numbers. The summary is also the chart's accessible description (`role="img"` + `aria-describedby`). The Progress summary is an `aria-live` region, so changing the member is announced.
  - Every chart has a **View as table** button that swaps the chart for a data table with a caption and row/column headers.
  - Outcome colours are paired with patterns and labels: Worked is solid, Partial is striped and Failed is dotted. A labelled legend sits above the chart, and the same pattern swatches appear in the tooltip and the table headers.
  - All controls are keyboard reachable with the `brand` focus ring. Chart animation is off with reduced motion.
- **Dark mode:** chart colours come from the theme tokens for the current theme, so bars, patterns, axis text and grid lines switch with the toggle.
- **Demo data as the default seed:**
  - The seed (`src/data/seed.js`) has **6 team members**, each with an avatar colour (teal, magenta, lime, cyan, orchid, olive), and **30 tasks**: 7 To Do, 7 In Progress, 6 Review, 10 Done; 19 features and 11 bugs.
  - Due dates are relative to today, so the board always has 5 overdue, 7 due soon, 7 calm, 10 done and 1 with no due date.
  - Every AI tool is used, and outcomes are varied: 13 Worked, 6 Partial, 6 Failed and 4 Not tried. One task has no tool yet.
  - Tasks have realistic vibecoding titles, descriptions and Markdown Context (Background / Constraints / Tried so far / Pick up), plus AI problems on every Partial and Failed task.
  - The outcomes are chosen so Insights tells a story: Claude has the best rate (71%) and worked on 4 of 5 bug tasks, Cursor is best for features (3 of 4), Gemini is lowest (25%), and Replit and Other are "not ranked".
  - **It loads automatically whenever localStorage is empty**, for example for a first-time visitor or an assessor opening the deployed link. Each storage key (`vibetracker.teams`, `.projects`, `.tasks`, `.anchors`) uses the seed as its `useLocalStorage` default and saves it straight away. After that, the user's own changes are saved as normal.
  - **Saved data is never wiped or replaced.** If a key already has data, even an empty task list after the user deleted everything, that data is used and the seed is ignored. There is no button to load or reset demo data.
- **Tested** in headless Edge against the production build:
  - First load with empty localStorage: the board shows the 30 demo tasks and 6 members, and the seed is written to localStorage. There is no "Demo data" button.
  - Saved data is kept after a reload, not replaced by the seed: a cut-down list of 5 tasks, an old 1-task list, and an empty list all stay as saved.
  - Insights summaries, best/lowest and the "not ranked" caption are correct. The member and Unassigned filters work. The tool chart uses the three patterns and the rate axis shows each rate. Both tables open with the right rows.
  - Modal suggestions: Cursor for features (3 of 4), Claude for bugs (4 of 5). Editing vt-26 gives "3 of 4" because it doesn't count itself. "Use Claude" sets and focuses the select.
  - With no tasks, Insights says "Not enough data yet" and "No AI tools logged yet".
  - No horizontal scroll at 390px.
  - axe-core (WCAG 2.1 A/AA): no violations on Insights (charts and tables) or the task modal, in light and dark mode.
- `npm run build` passes.

### Drag and drop (also built in M12)

- **Drag and drop between the four columns** (To Do, In Progress, Review, Done) using `@dnd-kit/core` 6.3.1 instead of raw HTML5 drag events, so it works with the keyboard, screen readers and touch screens.
- **Dropping a card in a column changes its status** and saves it to localStorage (`vibetracker.tasks`) through the existing `useLocalStorage` hook. The card goes to the bottom of its new column. Dropping it back in its own column, or outside any column, changes nothing. The status dropdown in the modal still works as before.
- **While dragging:**
  - The column under the card gets a 2px `brand` ring and a `brand-soft` background. An empty column's placeholder changes to "Drop it here." with a `brand` dashed border.
  - A lifted copy of the card follows the pointer in a `DragOverlay`, with `shadow-xl`, a faint `brand` ring, a 2° tilt and 103% scale. The card left in the column fades to 40% opacity.
  - The tilt, scale and drop animation are turned off when the user asks for reduced motion.
- **Mouse:** a drag starts only after the pointer moves 6px, so a normal click still opens the modal. The "Copy Context" button sits above the drag handle, so clicking it copies without starting a drag or opening the modal.
- **Touch:** press and hold a card for 250ms, then drag. A quick swipe still scrolls the page, and a tap still opens the modal.
- **Keyboard:** Tab to a card's title. Enter opens it, as before. Space picks it up. The arrow keys jump it to the next column (Right/Down) or previous column (Left/Up) in board order. Space drops it and Escape cancels. Focus returns to the card in its new column.
- **Screen readers:** the card's description says "Press Enter to open the task. To move it, press Space to pick it up, use the arrow keys to move between columns, then press Space to drop it or Escape to cancel." A live region announces:
  - "Picked up Task vt-2, Fix date picker timezone offset, in In Progress."
  - "Over Review." (only when the column changes)
  - "Task vt-2, Fix date picker timezone offset, moved to Done."
  - "Move cancelled. Task vt-3, Generate RSVP confirmation email, stays in Review."
- **Card states update after a move** because they are worked out from the task's status each render: moving a dated task to Done makes its due border and chip neutral ("Done"), and moving it out of Done brings back its warning/overdue/calm colour. The type tint and the owner's avatar colour don't change.
- **Tested** in headless Edge against the production build (36/36 checks passed):
  - Mouse drag To Do → Review: the Review column is highlighted and the others aren't, the lifted overlay and faded placeholder appear, the card moves, the status is saved to localStorage, and the modal doesn't open.
  - A click with a 3px wiggle still opens the modal and doesn't move the card. Copy Context shows its toast without opening the modal or moving anything.
  - Keyboard: Space, Right, Right, Space moves In Progress → Done with all four announcements, no modal, and focus back on the card. The due state turns neutral and the type tint and avatar colour stay the same. Escape cancels a move. Right from Done stays in Done. Enter still opens the modal. Done → Review brings back the warning due state.
  - Touch on a 390px phone layout: a tap opens the modal, and press-and-hold then drag moves a card to In Progress without opening the modal. The move survives a reload.
- `npm run build` passes.

## Components / files changed

### Insights view

| File | Change |
|---|---|
| `package.json`, `package-lock.json` | Added `recharts` (^2.15.4) |
| `src/data/insights.js` | New. `tasksForMember`, `progressStats`, `toolStats`, `rankableTools`, `bestAndWorst`, `suggestTool`; `MIN_TASKS_FOR_RANKING = 3`, `TRIED_OUTCOMES` |
| `src/components/insights/Insights.jsx` | New. The Insights page: intro, layout, theme palette, reduced-motion check |
| `src/components/insights/ProgressInsight.jsx` | New. Member select, % complete meter, tasks-per-status bar chart, summary, table |
| `src/components/insights/ToolInsight.jsx` | New. Outcome legend, stacked bar chart per tool with rate axis, tooltip, summary, table |
| `src/components/insights/BestWorstInsight.jsx` | New. Best / lowest success rate cards, "Not enough data yet", not-ranked caption |
| `src/components/insights/ChartCard.jsx` | New. Shared chart panel: title, summary (accessible description), "View as table" / "View as chart" toggle; shared table classes |
| `src/components/insights/ChartTooltip.jsx` | New. Themed Recharts tooltip |
| `src/components/insights/outcomeStyles.jsx` | New. Outcome colour + pattern map, SVG `<pattern>` defs, `OutcomeSwatch` |
| `src/components/ViewSwitch.jsx` | New. Board / Insights toggle buttons |
| `src/components/ContextSection.jsx` | New `ToolSuggestion` note above the AI tool field, with "Use {tool}"; select `aria-describedby` it |
| `src/components/TaskModal.jsx` | Takes `tasks`; works out `suggestTool(tasks, form.type, task.id)` and passes it to `ContextSection` |
| `src/data/seed.js` | Rewritten: 6 members, 1 project, 30 tasks and empty deliverables, with dates relative to the first load; exported as `SEED_TEAMS`, `SEED_PROJECTS`, `SEED_TASKS`, `SEED_ANCHORS`, the defaults for empty storage keys |
| `src/App.jsx` | `view` state + `ViewSwitch`; lazy-loaded `Insights` with `Suspense`; passes `tasks` to `TaskModal` |
| `DESIGN.md` | §4 Insights view and suggested AI tool; §5 new microcopy; §7 Insights bar animation |

### Drag and drop

| File | Change |
|---|---|
| `package.json`, `package-lock.json` | Added `@dnd-kit/core` (^6.3.1) |
| `src/components/Board.jsx` | `DndContext` with mouse (6px distance), touch (250ms hold) and keyboard sensors; keyboard coordinate getter that jumps between columns; pointer-then-overlap collision detection; screen-reader instructions and announcements; `DragOverlay` with the lifted card; no drop animation with reduced motion; ignores the click at the end of a drag |
| `src/components/Column.jsx` | Each column is a `useDroppable` target with the over highlight and "Drop it here." placeholder; new `DraggableTaskCard` wraps `TaskCard` with `useDraggable` |
| `src/components/TaskCard.jsx` | Takes `cardRef`, `dragHandle`, `isDragging`, `isOverlay`; the title button is the drag handle (`cursor-grab`, `touch-manipulation`); faded placeholder and lifted overlay styles |
| `src/data/tasks.js` | New `moveTask(tasks, id, status)` |
| `src/App.jsx` | `handleMoveTask()` passed to `Board` as `onMoveTask` |
| `DESIGN.md` | §4 describes drag and drop instead of "no drag-and-drop"; §5 adds the "Drop it here." text and the announcements; §7 allows the drag motion (off with reduced motion) |

## Colours, fonts, icons & interactions used

### Insights view

**Colours (Tailwind tokens / `src/theme/tokens.js`)**

| Element | Tokens |
|---|---|
| View switch, current view | `bg-brand-soft`, `text-ink`, icon `text-brand`; others `text-ink-soft`, hover `bg-muted-bg` |
| Chart panels, best/lowest cards | `bg-card`, `border-line` |
| Progress bars | `brand` (#2563EB light / #60A5FA dark); Done bar `success` (#16A34A / #4ADE80) |
| % complete meter | `bg-success` on `bg-muted-bg` |
| Outcome: Worked | solid `success` |
| Outcome: Partial | `due-warning` (#D97706 / #FBBF24) with diagonal stripes in `card` at 75% |
| Outcome: Failed | `danger` (#DC2626 / #F87171) with dots in `card` at 85% |
| Chart axis text / grid / hover band | `ink` and `ink-soft` / `line` / `muted-bg` |
| Best / lowest icons | `text-success` / `text-danger` |
| Suggested AI note | `bg-brand-soft`, `border-brand/40`, `Lightbulb` in `text-brand`; "Selected" in `text-success-text` |

**Fonts:** Inter throughout. Card and chart titles `text-base` semibold; % complete and best/lowest tool names `text-2xl` semibold; summaries `text-sm` `ink-soft`; chart ticks 12px; table numbers `tabular-nums`.

**Icons (Lucide):** `SquareKanban` (Board), `BarChart3` (Insights / View as chart), `Table` (View as table), `TrendingUp` (best), `TrendingDown` (lowest), `Lightbulb` (suggested tool), `Check` (Selected).

**Interactions**

| Input | Interaction |
|---|---|
| View switch | Click / Enter / Space; `aria-pressed` on the current view |
| Progress member select | Native select; summary updates and is announced (`aria-live="polite"`) |
| View as table / View as chart | Swaps the chart and the table in place; `aria-controls` the chart body |
| Chart hover | Recharts tooltip with labels and pattern swatches (mouse only; the summary and table carry the same data) |
| Use {tool} | Sets the AI tool select and focuses it |
| Motion | Recharts bars grow in; turned off with `prefers-reduced-motion: reduce` |

### Drag and drop

**Colours (Tailwind tokens)**

| Element | Tokens |
|---|---|
| Column being dragged over | `ring-2 ring-brand` (#2563EB) + `bg-brand-soft` (#EFF6FF), replacing `bg-muted-bg` |
| Empty column placeholder while dragged over | `border-brand` dashed border, `text-ink-soft` |
| Lifted (dragged) card | Its usual type tint and due border, plus `shadow-xl`, `ring-1 ring-brand/30` |
| Card left in the column | Its usual styles at `opacity-40` |

**Fonts:** no change. The placeholder text is `text-xs` (12px) Inter, as before.

**Icons:** no new icons.

**Interactions**

| Input | Interaction |
|---|---|
| Mouse | Drag after 6px of movement; `cursor-grab` on cards, `cursor-grabbing` on the lifted card; a shorter movement is a click and opens the modal |
| Touch | Press and hold 250ms (8px tolerance), then drag; swipe scrolls; tap opens the modal |
| Keyboard | Enter opens; Space picks up; ←/↑ previous column, →/↓ next column; Space drops; Escape cancels; focus returns to the card |
| Screen reader | Instructions on each card via `aria-describedby`; live-region announcements on pick up, column change, drop and cancel; `aria-roledescription="draggable task"` |
| Motion | 2° tilt and 103% scale on the lifted card (`motion-safe:` only); default dnd-kit drop animation, turned off with `prefers-reduced-motion: reduce`; column highlight uses `transition-colors` |

## Screenshot

![M12 screenshot](../screenshots/M12.png)

Placeholder path: `docs/screenshots/M12.png`

## Why I chose this

[TO COMPLETE]

## Alternatives considered

[TO COMPLETE]

## UX principle / literature reference

[TO COMPLETE]

## Requirement IDs this maps to

[TO COMPLETE]
