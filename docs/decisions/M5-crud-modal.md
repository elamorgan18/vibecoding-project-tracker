# M5 – Add / edit / delete modal

**Tag:** `crud-modal`

## What was built

- **"+ New task" button** in the header. It opens the task modal in create mode.
- **Card click** opens the same modal in edit mode, pre-filled with the task's current values. The card title is a button stretched over the whole card, so clicking anywhere on the card works, and the card is reachable by keyboard.
- **Modal fields (every task field):**
  - Title (required)
  - Description
  - Type dropdown (Feature / Bug)
  - Status dropdown (To Do / In Progress / Review / Done)
  - Assignee dropdown (Unassigned + the team's members)
  - Due date (date picker)
- **Fields set automatically:**
  - `id`: next readable ID, e.g. `vt-5`
  - `projectId`: the current project
  - `createdDate`: today's local date
  - In edit mode, `id` and `createdDate` are shown read-only under the modal title (`vt-5 · created 2026-10-20`).
- **Validation:** saving with an empty or whitespace-only title is blocked. It shows "Give this task a title." with an alert icon, marks the field `aria-invalid` and moves focus back to it.
- **Delete (edit mode only):** "Delete task" swaps the footer for an inline confirmation: "Delete this task and its prompt history? This can't be undone." The options are "Keep it" and "Delete task".
- **Closing without saving:** Cancel, the ✕ button, Escape, or clicking the backdrop.
- **Status** changes only through the dropdown. There is no drag-and-drop.
- **Persistence:** every create, edit and delete updates the `vibetracker.tasks` key in localStorage through the existing `useLocalStorage` hook, so changes survive closing and reopening the browser.
- **Tested** (23/23 checks passed). The real app was rendered in a jsdom browser environment and driven through the UI. The test harness lived in the scratchpad and wasn't added to the project. The checks covered:
  - Create with all fields; empty-title error
  - Edit pre-fill and save (no duplicates, `createdDate` kept)
  - Escape doesn't save
  - Delete confirmation and "Keep it"
  - Delete removes the task from localStorage
  - A full remount from localStorage ("reload") keeps edits and deletions
  - No React errors or warnings
- `npm run build` passes, and the Vite dev server on port 5173 compiles all modules.

## Components / files changed

| File | Change |
|---|---|
| `src/components/TaskModal.jsx` | New. Create/edit modal: form, validation, inline delete confirmation, focus handling |
| `src/data/tasks.js` | New. `todayISO`, `nextTaskId`, `upsertTask`, `removeTask` helpers |
| `src/App.jsx` | Added modal state, `handleSave` / `handleDelete`, "+ New task" button; renders `TaskModal` |
| `src/components/TaskCard.jsx` | Title is now a full-card click target button; `onOpen` prop; focus ring on the card |
| `src/components/Column.jsx` | Passes `onOpenTask` through to cards |
| `src/components/Board.jsx` | Passes `onOpenTask` through to columns |

## Colours, fonts, icons & interactions used

**Colours (Tailwind tokens)**

| Element | Tokens | Contrast |
|---|---|---|
| "+ New task" / "Create task" / "Save changes" | `bg-brand text-white`, `hover:bg-brand-hover`, `rounded` | 5.17:1 / 6.70:1 |
| Backdrop | `bg-ink/40` | — |
| Modal | `bg-card border-line rounded shadow-xl`, `max-w-lg` | — |
| Modal title / labels / input text | `text-ink` | 20.01:1 |
| ID + created date | `font-mono text-muted` | 4.76:1 |
| Inputs | `border-line`, `rounded`; focus: `border-brand ring-2 ring-brand` | — |
| Title error | `border-danger` on the input, message `text-danger-text` | 6.47:1 |
| "Delete task" | `bg-danger text-white`, `hover:bg-danger-hover`, `ring-danger` focus | 4.83:1 / 6.47:1 |
| Delete confirmation panel | `bg-danger-soft`, message `text-ink`, icon `text-danger` | 18.29:1 |
| "Cancel" / "Keep it" | `text-ink-soft`, `hover:text-ink` (plain text buttons) | 7.58:1 on card |
| Close ✕ | `text-muted`, `hover:bg-muted-bg hover:text-ink` | — |
| Card focus | `focus-within:ring-2 ring-brand` | — |

**Fonts**

- Inter for UI text.
- JetBrains Mono for the task ID / created date line.
- Sizes:
  - Modal title: 16 px semibold
  - Labels and inputs: 14 px
  - Error and meta text: 12 px

**Icons (lucide-react)**

All are `aria-hidden`, and each sits next to a text label:

- `Plus` ("New task")
- `X` (sr-only "Close")
- `AlertCircle` (form error)
- `Trash2` ("Delete task")
- `AlertTriangle` (delete confirmation)

**Interactions & accessibility**

- **Dialog:** the modal is `role="dialog"` with `aria-modal="true"` and is labelled by its heading.
- **Focus on open:** the title field gets focus.
- **Keyboard:** Tab and Shift+Tab are trapped inside the dialog. Escape closes it.
- **Focus on close:** focus returns to the button or card that opened the modal.
- **Delete confirmation:** focus moves to "Keep it", so the safe option is the default.
- **Backdrop:** clicking it closes the modal.
- **Card hover:** cards keep their shadow on hover.

## Screenshot

![M5 screenshot](../screenshots/M5.png)

Placeholder path: `docs/screenshots/M5.png`

## Why I chose this

[TO COMPLETE]

## Alternatives considered

[TO COMPLETE]

## UX principle / literature reference

[TO COMPLETE]

## Requirement IDs this maps to

[TO COMPLETE]
