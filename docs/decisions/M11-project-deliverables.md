# M11 – Deliverable Anchor Board

**Tag:** `project-deliverables`

## What was built

- **A "Deliverables" section pinned above the board**, above the Team members strip. It has a heading and a summary line: "{n} of 4 linked. Paste each final link here as you produce it."
- **Four cards, in this order:** Presentation, Demo, Report, Documentation. Each card has:
  - **A label** (the card heading).
  - **A status indicator** in the top-right that always pairs an icon with text, so it doesn't rely on colour alone:
    - Empty: dashed circle + "No link yet" (`muted`).
    - Saved: solid green dot with a white check + "Linked" (`success-text`).
    - The status is an `aria-live="polite"` region, so screen readers announce the change.
  - **One URL input + Save button** while the slot is empty. Save works with the button or Enter.
- **Validation** (`parseLink()` in `src/data/anchors.js`), run on Save:
  - Empty field: "Paste a link first."
  - Not a web link: "Enter a full link, like https://example.com."
  - Only `http://` and `https://` links are accepted. `javascript:`, `mailto:`, `data:`, `ftp:` and similar are rejected, so a saved link is always safe to use as an `href`.
  - The host must contain a dot (so "hello" is rejected) and the text can't contain spaces.
  - A missing scheme is filled in: `docs.google.com/…` is saved as `https://docs.google.com/…`.
  - The error is 14 px (`text-sm`, line-height 1.4) under the field, with an `alert-circle` icon, a `danger` input border, `aria-invalid` and `aria-describedby`. It clears as soon as you type, and focus stays in the field.
- **Once saved**, the input is replaced by:
  - **The link**, shown short (no `https://`, no `www.`, no trailing slash) and truncated with "…" if long; the full URL is in its tooltip. It opens in a new tab (`target="_blank" rel="noopener noreferrer"`). It has an external-link icon, and its screen-reader name is "Open {label}: {link} (opens in a new tab)".
  - **Change**: brings back the input, filled with the current link. Cancel (or Escape) goes back without saving.
  - **Remove**: clears the link and the slot returns to "No link yet".
- **Focus management:** after Save or Cancel, focus moves to the link. After Change or Remove, focus moves to the input. Focus is never dropped to the page.
- **Persistence:** stored in localStorage under `vibetracker.anchors` through the existing `useLocalStorage` hook, so links survive reloads. A failed write shows the existing "Your latest changes aren't saved" banner.
- **Data model:** each anchor stores `{ id, projectId, label, url }`, where `id` is `presentation` / `demo` / `report` / `documentation` and `url` is `null` until saved. Anchors belong to a project via `projectId`, so more projects can be added later. `projectAnchors()` always returns all four slots in order, even if storage is missing some.
- **Responsive wrapping:** CSS grid with 1 column on phones, 2 from 640 px (`sm`) and 4 from 1024 px (`lg`). The cards are equal width with no horizontal scroll.
- **Tested** in headless Edge against the production build (36/36 checks passed):
  - The four cards render in order above the team strip and board, each with the empty status icon and text.
  - "hello", an empty field and `javascript:alert(1)` are rejected. The error is 14 px and wired to the input with `aria-invalid`/`aria-describedby`, and focus stays in the field.
  - A scheme-less link saves normalised to `https://`. The status changes to "Linked" with the check icon, focus moves to the link, and the summary count updates.
  - Clicking the link opens it in a new tab.
  - Links persist across a reload, stored with `projectId`.
  - Change (prefills + focuses), Escape (cancels, focus back to the link), saving a changed link, and Remove (clears, focuses the input, persists after reload).
  - No page overflow or clipped controls at 1440, 1280, 1024 (4 across), 768 (2 × 2), 390 and 320 px (stacked).
  - Existing tasks are untouched.
- `npm run build` passes.

## Components / files changed

| File | Change |
|---|---|
| `src/data/anchors.js` | New. `ANCHOR_SLOTS`, `projectAnchors()`, `setAnchorUrl()`, `parseLink()` (validation + normalising), `displayLink()` |
| `src/components/AnchorBoard.jsx` | New. "Deliverables" section: heading, "{n} of 4 linked" summary, responsive grid of cards |
| `src/components/AnchorCard.jsx` | New. One slot: label, icon + text status, URL form with inline error, saved link with Change / Remove, focus management |
| `src/App.jsx` | `anchors` state via `useLocalStorage(STORAGE_KEYS.anchors, SEED_ANCHORS)`; `handleSaveAnchor()`; renders `AnchorBoard` above the Team members strip (replaces the `TODO M11` comments); anchor write errors feed the storage banner |
| `src/data/model.js` | `Anchor` typedef; `STORAGE_KEYS.anchors` (`vibetracker.anchors`) |
| `src/data/seed.js` | `SEED_ANCHORS`: the four slots for `project-1`, all `url: null` |
| `DESIGN.md` | §2.2 deliverable status description and §5 microcopy updated to "Linked" / "No link yet", plus the heading, summary and error messages |

## Colours, fonts, icons & interactions used

**Colours (Tailwind tokens)**

| Element | Tokens | Contrast |
|---|---|---|
| Card | `bg-card`, `border-line`, 6 px radius | — |
| "Linked" text | `text-success-text` (#15803D) on white | 5.02:1 ✅ |
| Linked dot | `bg-success` (#16A34A) with a white check | 3.30:1 (graphic, ≥ 3:1) ✅ |
| "No link yet" text + dashed circle | `text-muted` (#475569) on white | 7.58:1 ✅ |
| Saved link | `text-brand` (#2563EB), hover `text-brand-hover` (#1D4ED8) + underline | 5.17:1 / 6.70:1 ✅ |
| Change / Remove / Cancel | `text-ink-soft`, hover `text-ink` + underline | 7.58:1 ✅ |
| Save button | secondary: `border-line bg-card text-ink`, hover `bg-muted-bg` (only "New task" stays solid brand) | 18+:1 ✅ |
| Error | `text-danger-text` (#B91C1C), input `border-danger` | 6.47:1; border 4.83:1 ✅ |
| Focus | `ring-2 ring-brand` on the input, buttons and link | — |

**Fonts**

- Inter throughout.
- Section heading: `text-base` semibold uppercase, matching "Team members". Summary line: `text-sm` `muted`.
- Card label: `text-sm` semibold. Status: `text-xs` medium (compact metadata).
- Input: `text-base` (16 px, no iOS zoom on focus). Placeholder "https://…".
- Link, Save, Change, Remove: `text-sm` medium. Error: `text-sm` (14 px, line-height 1.4).

**Icons (lucide-react)**

- `CircleDashed`: empty status
- `Check` (in a solid green circle): linked status
- `ExternalLink`: before the saved link
- `AlertCircle`: validation error

All icons are `aria-hidden` next to visible text.

**Interactions & accessibility**

- Save with the button or Enter. Escape cancels a change.
- Validation runs on submit and clears on typing. The browser's own URL validation is off (`noValidate`) so the app's message shows. `type="url"` + `inputMode="url"` give a URL keyboard on phones.
- Each input has a hidden label ("{label} link"). Save / Change / Remove have hidden suffixes ("Save Presentation link"), so the four cards' controls are distinguishable for screen readers.
- The link opens in a new tab and says so to screen readers.
- Focus moves to the link after saving, and to the input after Change or Remove.

## Screenshot

![M11 screenshot](../screenshots/M11.png)

Placeholder path: `docs/screenshots/M11.png`

## Why I chose this

[TO COMPLETE]

## Alternatives considered

[TO COMPLETE]

## UX principle / literature reference

[TO COMPLETE]

## Requirement IDs this maps to

[TO COMPLETE]
