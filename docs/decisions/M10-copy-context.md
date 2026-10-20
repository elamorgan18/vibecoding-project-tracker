# M10 – "Copy Context" button

**Tag:** `copy-prompt`

*(This file was renamed from the earlier `M10-copy-prompt.md` template to `M10-copy-context.md`, as requested in the M10 prompt.)*

## What was built

**Already there from M9 (kept as is):**

- A **"Copy"** button on the Context box in the task modal. It copies **only the raw Context text**, exactly as typed, and shows "Copied!" on the button for 2 s.
- The `copyText()` clipboard helper (`src/utils/clipboard.js`): Clipboard API with an `execCommand` fallback.
- A success-only `Toast` component (from M7).

**What M10 added:**

- **"Copy Context" button on every card:**
  - **Placement:** bottom-right, next to the owner. Its accessible name includes the task title ("Copy Context: Fix date picker…").
  - **Doesn't open the modal:** the button is `relative z-10`, which lifts it above the card's full-card click target (the stretched title button). Clicking it copies without opening the modal. It's a separate keyboard tab stop.
- **"Copy Context" button in the task modal header**, next to Close.
  - **What it copies:** the **current form values**, so unsaved edits are included. It doesn't save them, and the modal stays open.
  - **Create mode:** works too; a blank title becomes "Untitled task".
- **Markdown briefing** (`buildBriefing()` in `src/data/briefing.js`), written to read naturally when pasted into an AI chat:
  1. An opening request: "I'd like your help with a task from our project tracker. Here's a briefing on where it stands."
  2. `# {title}`
  3. A bullet list: **Type**, **Status**, **AI tool used so far**, **Outcome so far**
  4. `## Description`
  5. `## Context`: the **full** Context, exactly as written (tabs, indentation, code fences and blank lines kept; only trailing newlines at the very end removed)
  6. `## Problems we hit with the AI`
  7. A closing request: "Please read this, ask me about anything that is unclear, then suggest the next step."
- **Empty fields are skipped:**
  - Description when blank.
  - Context when blank **or still just the untouched template**.
  - AI tool when not chosen.
  - AI problems when blank.
  - Type, status and outcome are always present ("Not tried yet" is a real value).
- **Toast:**
  - **Success:** "Copied to clipboard!" (success style, check icon).
  - **Failure:** the toast gained a `danger` tone, used for "Couldn't copy. Your browser blocked the clipboard." (triangle-alert icon).
- **Distinct names for the two modal copy buttons:** the M9 Context-box button's screen-reader label changed from "Copy context" to "Copy Context box text", so it's distinguishable from "Copy Context". Its visible label is still "Copy".
- **Example output** for the mock task `vt-2`:

  ````markdown
  I'd like your help with a task from our project tracker. Here's a briefing on where it stands.

  # Fix date picker timezone offset

  - **Type:** Bug
  - **Status:** In Progress
  - **AI tool used so far:** Claude
  - **Outcome so far:** Partial

  ## Description

  Events created after 11pm show up on the next day.

  ## Context

  ## Background
  Users in UTC+1 who create an event after 11pm see it on the **next day** …
  (full context, including the fenced code block and the Pick up checklist)

  ## Problems we hit with the AI

  First answer added a new dependency (moment-timezone) despite the "no new library" constraint. …

  Please read this, ask me about anything that is unclear, then suggest the next step.
  ````

- **Tested** (154/154 checks passed in jsdom through the real UI, including all M5–M9 checks). New M10 checks:
  - Every card has the button, layered above the click target.
  - A card click copies **without opening the modal**, and the clipboard equals `buildBriefing(task)`.
  - The "Copied to clipboard!" success toast shows.
  - The opening and closing requests are present.
  - Title, type, status, description, context, tool, outcome and problems are present, with indentation kept.
  - A tricky full Context (tabs, code fences, blank lines, Unicode) is included byte-for-byte.
  - Empty description, template-only context, no tool and no problems are skipped; the other fields remain.
  - The modal button copies unsaved form values, stays open, doesn't save, and shows the toast.
  - Create mode gives "Untitled task".
  - A copy failure gives a danger toast.
  - The M9 Context-box Copy still copies only the raw text.
- `npm run build` passes.

## Components / files changed

| File | Change |
|---|---|
| `src/data/briefing.js` | New. `buildBriefing(task)` Markdown briefing; skips empty fields; treats template-only context as empty |
| `src/components/CopyContextButton.jsx` | New. Shared "Copy Context" button (`relative z-10`, `ClipboardCopy` icon, sr-only task title) |
| `src/components/TaskCard.jsx` | Bottom row is now owner (left) + `CopyContextButton` (right); new `onCopyContext` prop |
| `src/components/Column.jsx`, `src/components/Board.jsx` | Pass `onCopyContext` through |
| `src/components/TaskModal.jsx` | `CopyContextButton` in the header, copying `{ ...task, ...form }`; new `onCopyContext` prop |
| `src/components/Toast.jsx` | Added `tone` (`success` default, `danger`) with matching icon and colours |
| `src/App.jsx` | `handleCopyContext(task)` (copy briefing, then success or danger toast); `showToast(message, tone)` |
| `src/components/ContextSection.jsx` | M9 Copy button's sr-only label is now " Context box text" (no behaviour change) |
| `DESIGN.md` | §5 copy-toast microcopy is now "Copied to clipboard!" plus the failure message |
| `docs/decisions/M10-copy-prompt.md` → `M10-copy-context.md` | Renamed |

## Colours, fonts, icons & interactions used

**Colours (Tailwind tokens)**

| Element | Tokens | Contrast |
|---|---|---|
| Copy Context button | `border-line bg-card text-ink-soft`, `hover:bg-muted-bg hover:text-ink`, focus `ring-2 ring-brand` | 7.58:1 on white button ✅ |
| Success toast | `bg-success-soft border-success`, text `ink`, icon `text-success` | 17.05:1; icon 3.15:1 (graphic) ✅ |
| Danger toast | `bg-danger-soft border-danger`, text `ink`, icon `text-danger` | 18.29:1; icon 4.41:1 ✅ |

On tinted cards the button keeps a white background, so it stands out against both type tints.

**Fonts**

- Inter. The button label is 12 px medium.
- The copied briefing is plain Markdown text, so no fonts are involved.

**Icons (lucide-react)**

- `ClipboardCopy` (Copy Context)
- `CircleCheck` (success toast)
- `TriangleAlert` (danger toast)

All are `aria-hidden` next to visible text.

**Interactions & accessibility**

- **Card:** one click copies with no modal. The card's focus ring still shows while the button is focused.
- **Modal:** copies current edits without saving.
- **Toast:** a polite live region announces it. It auto-dismisses after 4 s and has a Dismiss button.
- **Screen-reader names:** card buttons include the task title, and the two modal copy buttons have distinct names.

## Screenshot

![M10 screenshot](../screenshots/M10.png)

Placeholder path: `docs/screenshots/M10.png`

## Why I chose this

[TO COMPLETE]

## Alternatives considered

[TO COMPLETE]

## UX principle / literature reference

[TO COMPLETE]

## Requirement IDs this maps to

[TO COMPLETE]
