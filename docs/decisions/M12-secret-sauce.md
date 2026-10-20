# M12 – Secret sauce

**Tag:** `secret-sauce`

## What was built

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
