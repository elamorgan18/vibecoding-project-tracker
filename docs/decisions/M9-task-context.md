# M9 – AI context fields on the task modal

**Tag:** `context`

*(This file was renamed from the earlier `M9-context.md` template to `M9-task-context.md`, as requested in the M9 prompt.)*

## What was built

- **"AI context" section in the task modal**, below the main fields:
  - **Context:** a Markdown textarea.
    - Pre-filled for **new tasks** with the template `## Background` / `## Constraints` / `## Tried so far` / `## Pick up`.
    - Existing tasks with empty context get a **"Use template"** button.
  - **AI tool:** a dropdown saved as `contextTool`. Options: Claude, ChatGPT, Cursor, Lovable, Replit, Gemini, Other, plus "Choose a tool…" (saved as `null`).
  - **Outcome:** a dropdown saved as `aiOutcome`: Worked / Partial / Failed / Not tried yet (`worked` / `partial` / `failed` / `not-tried`). Defaults to Not tried yet.
  - **AI problems:** a textarea saved as `aiProblems`, for issues hit with the AI tool.
- **`contextUpdatedAt`:** an ISO timestamp, set on save whenever **any** context field (context, tool, outcome, problems) differs from what was saved before. Editing only non-context fields leaves it unchanged. A new task saved with the untouched template and defaults keeps it `null`.
  - The modal shows "Last updated {X ago}" (or "Not updated yet") next to the Context label, with " · unsaved changes" while there are unsaved context edits. The text refreshes every 30 s while the modal is open.
- **Context box requirements:**
  - **No length limit:** no `maxLength` on any field. A 300,000-character paste saves and reloads exactly.
  - **Exact text:** context and AI problems are stored **exactly** as typed or pasted, never trimmed or reformatted, so line breaks, tabs, indentation, trailing spaces, blank lines, Markdown and Unicode are kept.
  - **Monospace:** the box uses JetBrains Mono (`font-mono`), with spell-check off.
  - **Size:** the box grows with its content (minimum about 10 rows) up to `max-h-[70vh]`, then scrolls (`overflow-y-auto`). It can also be resized by hand (`resize-y`).
  - **Copy button:** copies exactly the box contents. It uses the Clipboard API, falling back to `execCommand('copy')`. The button shows "Copied!" with a check for 2 s, and a live region announces it. If copying fails, it shows "Couldn't copy. Select the text and copy it manually."
- **Stretch: live Markdown preview.**
  - **Toggle:** a "Preview" / "Hide preview" button (`aria-pressed`) shows a rendered pane beside the box on medium screens and wider, or below it on narrow ones. It updates live as you type.
  - **What renders:** GitHub-flavoured Markdown via `react-markdown` + `remark-gfm`, including headings, bold, lists, task-list checkboxes, fenced code, tables and links.
  - **Safety:** raw HTML is shown as text, never rendered, and `javascript:` links are stripped. Links open in a new tab with `rel="noopener noreferrer"`.
- **Storage-full handling:**
  - **Modal save:** the modal writes to localStorage **synchronously** on Save. If the browser's storage is full, the modal **stays open** with all the text intact and shows a danger alert: "Couldn't save. Your browser's storage for this site is full. Your text is still here: use **Copy** on the Context box to keep a copy, then free up space … and try again." Nothing is partly written, and the alert clears when the modal is reopened.
  - **Other saves:** `useLocalStorage` now reports write failures for other saves (hand-off, delete, team changes). The page shows a danger banner, "Your latest changes aren't saved. … They'll be lost if you close or reload this page." It clears on the next successful save.
- **Mock data:**
  - **`vt-2`** "Fix date picker timezone offset": a full Markdown context (Background / Constraints / Tried so far with a code block / Pick up checklist). Tool Claude, outcome Partial, AI problems filled in, updated 3 hours before first load.
  - **`vt-3`** "Generate RSVP confirmation email": a short context. Tool ChatGPT, outcome Worked, updated 26 hours before first load.
  - **Existing boards:** boards already in localStorage keep their old data. Clearing site storage loads the new seed.
- **Dialog:** the shared dialog now scrolls from the top when it's taller than the window (previously a tall dialog could be cut off at the top). The task modal is wider (`max-w-3xl`) to fit the context and preview.
- **Tested** (133/133 checks passed in jsdom through the real UI, including all M5–M8 checks):
  - **Loading:** seeded context loads exactly. The Context box is monospace, has no `maxlength`, is resizable and scrolls.
  - **Dropdowns and timestamp:** tool and outcome options and values are correct, and "Last updated 3 hours ago" shows.
  - **Preview:** headings, bold, code and checkboxes render; it updates live; there's no raw HTML or `javascript:` links; "unsaved changes" shows; it can be hidden; Cancel discards.
  - **Copy:** copies the exact text, shows "Copied!" (visible and announced), resets after 2 s, and shows the failure message.
  - **Paste:** a 300k-character paste with tabs, indentation, trailing spaces, fenced code, Unicode and blank lines saves and reopens byte-for-byte.
  - **AI problems:** not trimmed.
  - **`contextUpdatedAt`:** set on context and outcome edits, unchanged on title-only edits; "Last updated just now" after saving.
  - **New tasks:** template pre-filled with defaults; the untouched template keeps `null`; choosing a tool sets the timestamp; "Use template" works.
  - **Storage full in the modal:** a real 6,000,000-character paste over jsdom's 5,000,000-character quota shows the alert, keeps the modal and text, and leaves stored data unchanged. Saving works after shortening.
  - **Storage full elsewhere:** a simulated `QuotaExceededError` during hand-off shows the page banner, which clears after the next successful save.
  - No React warnings.
- `npm run build` passes. The JS bundle grew from about 160 kB to 349 kB (108 kB gzipped), mostly from the Markdown libraries.

## Components / files changed

| File | Change |
|---|---|
| `src/components/ContextSection.jsx` | New. AI context section: Context box (auto-grow, resize, scroll, monospace), Use template, Preview toggle, Copy + "Copied!", AI tool, Outcome, AI problems, "Last updated X ago" |
| `src/components/MarkdownPreview.jsx` | New. Safe Markdown rendering (`react-markdown` + `remark-gfm`) styled with Tailwind arbitrary variants |
| `src/data/context.js` | New. `AI_TOOLS`, `AI_OUTCOMES`, `CONTEXT_TEMPLATE`, `NEW_TASK_CONTEXT`, `contextValues()`, `contextChanged()` |
| `src/utils/clipboard.js` | New. `copyText()` with Clipboard API + fallback |
| `src/data/dates.js` | Added `timeAgo()` (Intl.RelativeTimeFormat) |
| `src/hooks/useLocalStorage.js` | Added `writeStorage()` returning `{ ok, error }` with a quota-aware message; hook now returns a third value, the last write error |
| `src/components/TaskModal.jsx` | Form includes context fields; renders `ContextSection`; `saveError` alert; `max-w-3xl` |
| `src/components/Dialog.jsx` | Inner `min-h-full` wrapper so tall dialogs scroll instead of being cut off |
| `src/components/FormField.jsx` | `placeholder:text-muted` on inputs (AA-safe placeholder colour) |
| `src/App.jsx` | `handleSave` sets `contextUpdatedAt` and writes synchronously (keeps the modal open on failure); `openModal` / `closeModal`; storage-error page banner |
| `src/data/model.js` | Task typedef documents `context`, `contextTool`, `aiOutcome`, `aiProblems`, `contextUpdatedAt` |
| `src/data/seed.js` | Context for `vt-2` (full) and `vt-3` (short) |
| `package.json` / `package-lock.json` | Added `react-markdown` `^9.0.1`, `remark-gfm` `^4.0.0` |
| `DESIGN.md` | §5 microcopy rows for Copy, timestamp, copy failure and storage errors |
| `docs/decisions/M9-context.md` → `M9-task-context.md` | Renamed |

## Colours, fonts, icons & interactions used

**Colours (Tailwind tokens)**

| Element | Tokens | Contrast |
|---|---|---|
| Section heading / labels | `text-ink` | 20.01:1 ✅ |
| Hint, "Last updated…", placeholder | `text-muted` on `card` | 4.76:1 ✅ |
| " · unsaved changes" | `text-ink-soft` | 7.58:1 ✅ |
| Small buttons (Use template / Preview / Copy) | `border-line bg-card text-ink-soft`, `hover:bg-muted-bg hover:text-ink`, `ring-brand` focus | 7.58:1 ✅ |
| "Copied!" check icon | `text-success` on `card` | 3.30:1 (graphic) ✅ |
| Context box | `inputClass` + `border-line`, `font-mono` | `ink` 20.01:1 ✅ |
| Preview pane | `bg-surface border-line`; text `ink`; links `text-brand-hover`; quotes `text-ink-soft`; code `bg-muted-bg` | ≥ 6.4:1 ✅ |
| Copy failed | `text-danger-text` | 6.47:1 ✅ |
| Save-failed alert / storage banner | `bg-danger-soft border-danger`, text `ink`, heading `text-danger-text`, icon `text-danger` | 5.91:1 ✅ |

**Fonts**

- **JetBrains Mono** (`font-mono`, 13 px, relaxed line height) for the Context box, as DESIGN.md §3 specifies.
- **Inter** for everything else.
- **Sizes:** section heading 14 px semibold uppercase; small buttons and captions 12 px.

**Icons (lucide-react)**

- `Copy` / `Check` ("Copy" / "Copied!")
- `Eye` / `EyeOff` (Preview / Hide preview)
- `FileText` (Use template)
- `AlertTriangle` (save error, storage banner)

All are `aria-hidden` next to visible text.

**Interactions & accessibility**

- **Markup:** the section is a labelled `<section>`. The Context box is `aria-describedby` both the "Last updated" text and the copy status.
- **Announcements:** copy results go through a polite live region. Save failures use `role="alert"`.
- **Keyboard:** Tab in the Context box moves focus, as normal for a textarea, so keyboard users don't get trapped.
- **Auto-grow vs resize:** the box re-fits on every change and when the preview is toggled. A manual resize lasts until the next edit.

## Screenshot

![M9 screenshot](../screenshots/M9.png)

Placeholder path: `docs/screenshots/M9.png`

## Why I chose this

[TO COMPLETE]

## Alternatives considered

[TO COMPLETE]

## UX principle / literature reference

[TO COMPLETE]

## Requirement IDs this maps to

[TO COMPLETE]
