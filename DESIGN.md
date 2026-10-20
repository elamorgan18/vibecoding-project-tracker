# Vibecoding Project Tracker — Design

**Status:** M3 `design-done` · colours, radius and fonts are in `tailwind.config.js` as named tokens.

**Why this file exists.** This tracker should look like *my* tool, not a generic Kanban. Every build milestone references the tokens and rules below.

**Palette source.** The base palette (brand, neutrals, radius, fonts) is based on a blue/slate "Professional"-style community theme from [tweakcn.com/community](https://tweakcn.com/community). tweakcn exports Tailwind v4 `@theme` CSS. This project uses **Tailwind v3** (`tailwindcss ^3.4.13` in `package.json`), so the theme was translated into `tailwind.config.js` tokens instead of being pasted as CSS. The meaning tokens (task type, status, due state) are my own additions on top.

---

## 1. Mood / vibe

> A calm, focused workspace that stays quiet by default and only gets loud when something needs your attention.

In practice: a cool slate page, white cards, one blue brand colour, and no colour at all on a card unless it's telling you something. Warm colours (amber, red) are saved for deadlines and actions that need attention.

References:

- `<TODO>`
- `<TODO>`

Anti-references (what this is **not**):

- Busy, rainbow-tagged boards where every card shouts at once.

## 2. Color palette

Every hex below is a Tailwind token (see §2.6 for class names). Each meaning colour has a **soft** tint for backgrounds. Colours that are too light to pass WCAG AA as text also have a darker **text** shade.

### 2.1 Base tokens (from tweakcn)

| Token | Hex | Where it shows up |
|---|---|---|
| `brand` | `#2563EB` | Header accents, "+" button, focus rings, links |
| `brand-hover` | `#1D4ED8` | Hover / pressed state of brand buttons and links |
| `brand-soft` | `#EFF6FF` | Selected states, active filter chips (my addition, not part of the tweakcn theme) |
| `surface` | `#F8FAFC` | Page background |
| `card` | `#FFFFFF` | Card and modal background |
| `muted-bg` | `#F1F5F9` | Column backgrounds, chips, disabled inputs, secondary panels |
| `line` | `#E2E8F0` | Card borders, dividers, input borders |
| `ink` | `#020817` | Body text, card titles |
| `ink-soft` | `#475569` | Captions and dates **on `muted-bg` and tinted backgrounds** (my addition, see §2.5) |
| `muted` | `#475569` | Captions, dates, counts, placeholders. Darkened from `#64748B` in the typography fixes; now the same value as `ink-soft` and AA on every background (≥ 6.9:1) |

**Radius:** `0.375rem` (6 px). This is Tailwind's `rounded` (the default is overridden in config) and `rounded-md`. Use it for cards, buttons, inputs, badges and the modal.

### 2.2 Status: success & danger

| Token | Base (icon, fill, accent) | `-soft` (bg) | `-text` (label) | Icon (Lucide) | Used for |
|---|---|---|---|---|---|
| `success` | `#16A34A` | `#F0FDF4` | `#15803D` | `check` / `check-circle` | Confirmation toasts, filled deliverable dot, Done column accent |
| `danger` | `#DC2626` | `#FEF2F2` | `#B91C1C` | `trash-2` (delete) / `alert-circle` (errors) / `alert-triangle` (overdue) | Delete button, form errors, overdue state |

`danger-hover` (`#B91C1C`) is the hover / pressed state of the delete button.

How each one is shown. Every use always pairs the colour with an icon **and** text:

- **Confirmation toast:** `success-soft` background, `success` check icon, message in `success-text` or `ink`.
- **Linked deliverable (M11):** solid `success` dot with a white check and the label "Linked" in `success-text`. An empty slot is a dashed circle (`circle-dashed`) with "No link yet", both in `muted`.
- **Done column accent:** `success` top border on the Done column header, a check icon, and the "Done" label.
- **Delete button:** solid `danger` with white text and a `trash-2` icon ("Delete task"). Hover is `danger-hover`.
- **Form error:** `danger` input border, `alert-circle` icon, message in `danger-text` below the field.
- **Overdue card:** `due-overdue`, which shares the `danger` values (see §2.4).

### 2.3 Task type (M6 `tag-style`): card background tint + border + corner icon and label

| Token | Base (card border, icon) | `-soft` (card bg, modal header bg) | `-text` (badge label) | Icon (Lucide) | Label |
|---|---|---|---|---|---|
| `feature` | `#7C3AED` | `#F5F3FF` | `#6D28D9` | `sparkles` | "Feature" |
| `bug` | `#E11D48` | `#FFF1F2` | `#BE123C` | `bug` | "Bug" |

- **Card:** the whole card background is the type's `-soft` tint, with a thin (1px) border in the base type colour.
- **Corner badge:** the top-right corner always shows the type's icon and label ("Feature" / "Bug") in a white pill. Type never relies on colour alone.
- **Modal:** the modal header uses the same tint, plus the same badge.
- **Captions on tinted cards** (task ID, assignee) use `ink-soft` (6.91 / 6.90:1). Since `muted` was darkened to the same `#475569`, either token now passes AA on both tints (§2.6).

Feature is **violet** and bug is **rose**: not a red/green pair, and violet is clearly separate from the blue brand colour. `feature` already passes AA as text (5.20:1 on its tint). `feature-text` exists only to match the other badges.

### 2.4 Due-date state (M8 `due-tint`): left border + due-date chip

Due state is shown **only** by a thicker left border in the due colour and a due-date chip (icon + text). It **never** changes the card background, which belongs to the task type (§2.3). The left border replaces the type border on the left edge only; the other three sides keep the type colour.

| Token | Base (left border) | `-soft` (chip bg) | `-text` (chip label + icon) | Icon (Lucide) | When | Chip text |
|---|---|---|---|---|---|---|
| `due-calm` | `#0EA5E9` | `#F0F9FF` | `#0369A1` | `calendar` | More than 2 days away | "Due in 3 days" |
| `due-warning` | `#D97706` | `#FFFBEB` | `#B45309` | `clock` | Due today, tomorrow or in 2 days | "Due today" / "Due tomorrow" / "Due in 2 days" |
| `due-overdue` (= `danger`) | `#DC2626` | `#FEF2F2` | `#B91C1C` | `triangle-alert` | Past the due date | "Overdue by 1 day" / "Overdue by 2 days" |
| `due-done` | `#94A3B8` | `#F1F5F9` | `#475569` | `circle-check` | Status is Done (even if it was overdue) | "Done" |

Days are counted in whole calendar days from today (local time); due dates have no time of day. The warning band is "within 2 days" (`WARNING_WITHIN_DAYS` in `src/data/due.js`), so every date that isn't "more than 2 days away" gets attention. `due-done` overrides the date once a task's status is Done. The chip icon uses the `-text` shade, not the base colour, because base `due-calm` / `due-done` are under 3:1 on their own tints (2.60 / 2.34:1). A small legend above the board explains the four states. Tasks with no due date have no chip and no due border; they keep the type border on all sides. In `tailwind.config.js`, `due-overdue` is defined as the same object as `danger`, so the two can't drift apart.

### 2.5 How colour is used

- **Two card channels that never clash.**
  - **Task type** is shown by the card's **background tint** and thin border, backed up by the **corner icon + label**.
  - **Due state** (M8) is shown **only** by the card's **left border** and a **due-date chip** with icon and text. It never changes the background.
  - A card can be "bug + overdue": a rose card with a red left border and an "Overdue" chip. Each meaning is still carried by its own icon and text.
- **Success and danger mean one thing each.** Green only ever means "done / confirmed". Red (`danger`) only ever means "destructive, wrong or late".
- **Never colour alone.** Every coloured element is paired with an icon *and* a text label, so colour-blind users and grayscale screenshots lose nothing.
- **Text uses `-text` shades.** Base colours are for borders, icons and fills. Any coloured *text* uses the `-text` shade.
- **Captions on `muted-bg` and tints use `ink-soft`.** The old `muted` (`#64748B`) dropped below 4.5:1 there. `muted` is now `#475569` too, so this rule is kept for clarity rather than need.
- **No white text on `success`.** White on `#16A34A` is only 3.30:1, so success is never a solid button with white text. Use the soft toast style instead.

### 2.6 Contrast check (WCAG 2.1 AA)

AA requires 4.5:1 for normal text and 3:1 for large text (≥ 18.66 px bold / 24 px) and UI graphics. All ratios were calculated with the WCAG relative-luminance formula and re-checked after the tweakcn base palette update.

**Approved text / background pairs**

| Text | Background | Ratio | AA |
|---|---|---|---|
| `ink` #020817 | `card` #FFFFFF | 20.01 | ✅ |
| `ink` #020817 | `surface` #F8FAFC | 19.12 | ✅ |
| `ink` #020817 | `muted-bg` #F1F5F9 | 18.26 | ✅ |
| `ink` #020817 | any `-soft` tint | ≥ 18.2 | ✅ |
| `muted` #475569 | `card` #FFFFFF | 7.58 | ✅ |
| `muted` #475569 | `surface` #F8FAFC | 7.24 | ✅ |
| `muted` #475569 | `muted-bg` #F1F5F9 | 6.92 | ✅ |
| `muted` #475569 | any `-soft` tint (feature / bug / due / success / danger) | ≥ 6.90 | ✅ |
| `ink-soft` #475569 | `muted-bg` / any `-soft` tint | ≥ 6.9 | ✅ |
| white | `brand` #2563EB | 5.17 | ✅ |
| white | `brand-hover` #1D4ED8 | 6.70 | ✅ |
| `brand` #2563EB | `card` / `surface` / `muted-bg` / `brand-soft` | 5.17 / 4.94 / 4.72 / 4.75 | ✅ |
| `brand-hover` #1D4ED8 | `brand-soft` | 6.16 | ✅ |
| `feature` #7C3AED | `card` / `feature-soft` | 5.70 / 5.20 | ✅ |
| `feature-text` #6D28D9 | `feature-soft` / `card` | 6.48 / 7.10 | ✅ |
| `ink` #020817 (card title) | `feature-soft` / `bug-soft` (tinted cards) | 18.24 / 18.21 | ✅ |
| `ink-soft` #475569 (task ID, assignee) | `feature-soft` / `bug-soft` (tinted cards) | 6.91 / 6.90 | ✅ |
| white | `feature` #7C3AED | 5.70 | ✅ |
| `bug-text` #BE123C | `bug-soft` / `card` | 5.72 / 6.29 | ✅ |
| `success-text` #15803D | `success-soft` / `card` | 4.79 / 5.02 | ✅ |
| `danger-text` #B91C1C | `danger-soft` / `card` | 5.91 / 6.47 | ✅ |
| white | `danger` #DC2626 (delete button) | 4.83 | ✅ |
| white | `danger-hover` #B91C1C | 6.47 | ✅ |
| `due-calm-text` #0369A1 | `due-calm-soft` / `card` | 5.57 / 5.93 | ✅ |
| `due-warning-text` #B45309 | `due-warning-soft` / `card` | 4.84 / 5.02 | ✅ |
| `due-overdue-text` #B91C1C | `due-overdue-soft` / `card` | 5.91 / 6.47 | ✅ |
| `due-done-text` #475569 | `due-done-soft` / `card` | 6.92 / 7.58 | ✅ |

**Failing pairs: never use these for text** (these are why the `-text` shades and `ink-soft` exist)

| Text | Background | Ratio |
|---|---|---|
| *(old)* `muted` #64748B | `muted-bg` and the soft tints | 4.33–4.46 ❌ (fixed by darkening `muted` to #475569) |
| `success` #16A34A | `card` / `success-soft` | 3.30 / 3.15 ❌ |
| white | `success` #16A34A | 3.30 ❌ |
| `danger` #DC2626 | `danger-soft` | 4.41 ❌ |
| `bug` #E11D48 | `bug-soft` | 4.28 ❌ |
| `due-calm` #0EA5E9 | `card` | 2.77 ❌ |
| `due-warning` #D97706 | `card` | 3.19 ❌ |
| `due-done` #94A3B8 | `card` | 2.56 ❌ |

**Non-text graphics (3:1).** The type card borders pass against the column's `muted-bg`: `feature` 5.20:1, `bug` 4.29:1. The type icons pass on the white badge pill: `feature` 5.70:1, `bug` 4.70:1. The `success` dot and Done column accent pass at 3.30:1 on `card` and 3.15:1 on `surface`. `line` (1.23:1) and the `due-calm` / `due-warning` / `due-done` left borders are below 3:1 against the column's `muted-bg` (2.53 / 2.91 / 2.34:1; `due-overdue` is 4.41:1). That's acceptable because they're decorative: borders aren't the only way to identify a card, and due state is always repeated in the date label and icon. Input borders must still show a `brand` focus ring (5.17:1).

### 2.7 Avatar colours (team members)

Each team member has their own avatar colour: a soft background with dark initials. It is stored on the member as `avatarColor` when they're created, so it never changes after a reload or when someone else is removed. Tokens: `bg-avatar-{key}-bg` / `text-avatar-{key}-text`.

| Key (assignment order) | Background | Initials | Contrast | Hue (OKLCH) | Nearest semantic hue | Closest semantic tint (ΔE) |
|---|---|---|---|---|---|---|
| 1 `teal` | `#91E5CA` | `#084B3C` | 6.85:1 ✅ | 173° | success, 23° away | done-soft, 14.0 |
| 2 `magenta` | `#F8B1DD` | `#6A1952` | 6.58:1 ✅ | 342° | bug, 35° away | bug-soft, 15.6 |
| 3 `lime` | `#D7F5AB` | `#3A5006` | 7.53:1 ✅ | 126° | success, 24° away | success-soft, 10.0 |
| 4 `cyan` | `#8BD9EA` | `#074550` | 6.69:1 ✅ | 213° | due calm, 24° away | brand-soft, 14.8 |
| 5 `orchid` | `#F1D0FF` | `#602F72` | 7.08:1 ✅ | 316° | feature, 23° away | feature-soft, 9.0 |
| 6 `olive` | `#D9D27A` | `#443F03` | 6.87:1 ✅ | 104° | success, 46° away | warning-soft, 16.3 |
| 7 `aqua` | `#A3F6F6` | `#005354` | 7.22:1 ✅ | 196° | due calm, 41° away | brand-soft, 9.0 |
| 8 `gold` | `#FFDC9E` | `#5D4304` | 7.04:1 ✅ | 83° | warning, 25° away | warning-soft, 10.2 |

- **Why these hues.** The semantic colours sit at these OKLCH hues: red/rose 17–28°, amber 49–58°, green 150°, sky 237–243°, brand blue 263° and violet 293°. Done is a near-grey slate. The avatar hues fill the three gaps between them: yellow–lime, teal–cyan and orchid–magenta. Every avatar hue is **at least 22°** from every semantic hue.
- **Telling avatars apart.** Neighbouring hues alternate light and deep backgrounds, so even the closest pair of avatars is 6.4 ΔE apart (OKLab ×100). Every avatar background is at least 9.0 ΔE from every semantic tint.
- **Order.** Assignment order alternates across the wheel (teal → magenta → lime → cyan → …), so the first few members look most different.
- **Assignment.** A new member gets the first colour nobody on the team uses. Removing someone frees their colour for the *next* new member and changes no one else's. With more than 8 members the colours cycle: the least-used colour, ties in palette order.
- **Initials are always shown**, so identity never relies on colour alone. The member's name also appears next to every avatar.
- **Where it applies:** cards, the Team members strip, the Team panel, the modal Owner box and the "Hand off to…" menu. The unassigned avatar stays a dashed outline.

## 3. Typography

Loaded from Google Fonts in `index.html`.

| Role | Font | Token | Why |
|---|---|---|---|
| Heading | Inter (600 / 700) | `font-sans` | Neutral and highly legible at small sizes, so it stays quiet and lets the content lead. |
| Body | Inter (400 / 500) | `font-sans` | One family for the whole UI keeps the board calm and consistent. |
| Monospace (task IDs, Context field) | JetBrains Mono (400 / 500) | `font-mono` | Marks machine-ish content (IDs, prompts) as different from UI text, and keeps pasted prompts and code readable. |

Type scale (`fontSize` in `tailwind.config.js`). Sizes are in **rem**, so they follow the user's browser text size. Line-heights are **unitless**, so line spacing scales with the text when users enlarge it (WCAG 1.4.4 / 1.4.12):

| Token | Size | Line-height | Used for |
|---|---|---|---|
| `text-2xl` | 1.5rem (24 px) | 1.3 | Page title (semibold) |
| `text-lg` | 1.125rem (18 px) | 1.5 | Markdown preview h1 |
| `text-base` | **1rem (16 px)** | **1.5** | **All body / reading text:** inputs, selects, date fields, placeholders, type picker, description, Context box (JetBrains Mono), AI problems, Markdown preview body, delete / remove confirmations, save-failed alerts, storage banner, toasts. Also section and column headers (semibold uppercase) |
| `text-sm` | 0.875rem (14 px) | 1.4 | Card titles and names (medium), form labels, buttons, field error messages, copy-failed message, secondary text |
| `text-xs` | 0.75rem (12 px) | 1.4 | Compact metadata only: task IDs, count pills, type badges, due chips, avatar initials (§2.7), small captions. **Nothing is smaller than 12 px** |

Rules:

- **Body text is 16 px.** Anything a person reads as a sentence, or types into, is `text-base`. 16 px inputs also stop iOS Safari zooming in on focus.
- **Errors are 14 px** (`text-sm`, line-height 1.4) with an alert icon: big enough to notice, compact enough to sit under a field.
- **No px font sizes.** Use the tokens above. In Markdown, inline code is `0.9375em` (relative to its paragraph).
- **Captions** use `muted` / `ink-soft` (`#475569`, at least 6.9:1 on every background).

## 4. Component principles

Cards are tinted by type (`feature-soft` or `bug-soft`) with a 1px border in the type colour, the 6 px theme radius, a white icon + label badge in the top-right corner, and a soft shadow that only appears on hover. They gain a thicker coloured left border and a due-date chip only when their due date has something to say. Buttons are solid `brand` with white text, `rounded`, and generous padding; secondary actions are plain text links, so there is only ever one loud button on screen, and the only red button is "Delete task" with its trash icon. The modal is centred, `max-w-lg`, on a `ink` backdrop at 40% opacity, with the Context field set in JetBrains Mono so prompts read like the code they produce, and form errors appear inline under the field in `danger-text` with an alert icon. Columns sit on `muted-bg`. Empty columns use a dashed `line` border with a short `ink-soft` line of encouragement, and status changes go through either the dropdown in the modal or drag and drop between columns (M12). While a card is dragged, the card left behind fades to 40% opacity, a lifted copy with `shadow-xl` follows the pointer, and the column under it gets a 2px `brand` ring on `brand-soft`. The same move works from the keyboard (Space, arrow keys, Space) and by press-and-hold on touch screens.

## 5. Voice / microcopy

Calm, short, second person. No exclamation marks unless something is actually wrong.

| Where | Text |
|---|---|
| "+" button label | "+ New task" |
| Empty column placeholder | "Nothing here. Enjoy the quiet." |
| Empty column while a card is dragged over it (M12) | "Drop it here." |
| Drag and drop screen-reader announcements (M12) | "Picked up Task {id}, {title}, in {column}." / "Over {column}." / "Task {id}, {title}, moved to {column}." / "Move cancelled. Task {id}, {title}, stays in {column}." |
| Toast after "Copy Context" (M10, success) | "Copied to clipboard!" (copy failed, danger: "Couldn't copy. Your browser blocked the clipboard.") |
| Confirm-delete message (danger) | "Delete this task and its prompt history? This can't be undone." |
| Handoff toast (M7 `task-owner`, success) | "Handed to {name}. It's on their board now." |
| Form error: missing title (danger) | "Give this task a title." |
| Deliverable slot (M11): linked / empty | "Linked" / "No link yet" |
| Deliverables: heading / summary | "Deliverables" / "{n} of 4 linked. Paste each final link here as you produce it." |
| Deliverable link error: empty / not a link (danger) | "Paste a link first." / "Enter a full link, like https://example.com." |
| Hand-off dropdown placeholder (M7) | "Hand off to…" |
| Team members strip (M7): heading / empty member | "Team members" / "Nothing in progress" |
| Team panel: add / remove toasts (success) | "Added {name} to the team." / "Removed {name} from the team." |
| Team panel: remove confirm (danger) | "Remove {name} from the team? Their {n} tasks will become unassigned." |
| Context box (M9): copy button / confirmation | "Copy" / "Copied!" |
| Context box: timestamp | "Last updated {3 hours ago}" / "Not updated yet" (+ " · unsaved changes") |
| Context box: copy failed (danger) | "Couldn't copy. Select the text and copy it manually." |
| Save failed, storage full (danger) | "Couldn't save. Your browser's storage for this site is full. Your text is still here…" |
| Storage-full page banner (danger) | "Your latest changes aren't saved. …They'll be lost if you close or reload this page." |

## 6. Logo / wordmark

- **Product name:** `<TODO>`
- **Wordmark style:** The product name in Inter semibold, `ink`, with a small `brand` dot before it. No icon.

## 7. Out of scope (this hackathon)

- A dark mode toggle. Light mode only.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications and the M12 drag and drop motion (the lifted card's tilt and the drop animation), which are both turned off when the user asks for reduced motion.
- A custom icon set. Use [Lucide icons](https://lucide.dev) if needed.

---

*DESIGN.md version: hackathon-starter v1 · filled in for M3 · base palette from tweakcn.com/community (translated to Tailwind v3)*
