# M6 – Feature / bug styling

**Tag:** `tag-style`

## What was built

- **Shared `TypeBadge` component:** a small pill with the type's icon and text label, coloured from the type tokens.
  - Feature: violet pill, `Sparkles` icon, "Feature".
  - Bug: rose pill, `Bug` icon, "Bug".
  - The colour, icon and label for each type are defined once in `TYPE_META`. Cards and the modal both read from it, so a type looks the same everywhere.
- **Card:** the type badge sits in the **top-right corner** of every card, on the same row as the task ID. Following DESIGN.md §2.5, type shows only in the corner badge. The card's border and background are reserved for the due-date state (M8).
- **Modal:**
  - **Header badge:** the header shows the type badge next to "New task" / "Edit task". It updates live as the type changes.
  - **Type picker:** the old Type dropdown is now a two-option radio picker. Each option shows its icon and label. The selected option takes that type's border, soft background and text colour. The unselected one is neutral (`border-line`, `text-ink-soft`).
- **Data:** no changes. `Task.type` is still `'feature' | 'bug'`.
- **Tested** (31/31 checks passed in jsdom through the real UI):
  - Every card shows a badge matching its stored type (classes, icon and label).
  - The badge sits top-right in the card header row.
  - The new-task modal defaults to Feature.
  - Switching the picker updates the header badge and the option styling.
  - Changing a task's type in the modal updates its card badge.
  - The M5 create/edit/delete/reload checks still pass, with no React errors or warnings.
- `npm run build` passes, and the type classes are present in the built CSS. The dev server compiles `TypeBadge.jsx`.

### Update (2026-10-20 12:30): card background tint by type

- **Tinted cards:** each card's background is now its type's soft tint (`bg-feature-soft` #F5F3FF / `bg-bug-soft` #FFF1F2), with a thin 1px border in the base type colour (`border-feature` #7C3AED / `border-bug` #E11D48). Previously cards were white with a `line` border.
- **Corner badge:** the icon + "Feature"/"Bug" label stays in the top-right corner, so meaning never relies on colour alone. The badge pill is now white (`bg-card`) so it stays visible on the tinted card. Label `text-{type}-text`, icon `text-{type}`.
- **Modal header:** now tinted with the same soft colour, and it re-tints live when the type picker changes. The header has `rounded-t` to match the modal corners.
- **Caption contrast:** `muted` fails AA on both tints (4.34:1 / 4.33:1). The card task ID, assignee name, "Unassigned" icon and label, and the modal's ID/created line all switched from `text-muted` to `text-ink-soft` (6.91:1 / 6.90:1). The modal close button switched to `text-ink-soft`, `hover:bg-card`.
- **Re-checked contrast on both tints** (all pass AA):

  | Text | Feature tint | Bug tint |
  |---|---|---|
  | Card title (`ink`) | 18.24:1 | 18.21:1 |
  | Captions (`ink-soft`) | 6.91:1 | 6.90:1 |
  | Badge label on white pill | 7.10:1 | 6.29:1 |

  The avatar is unchanged: `brand-hover` on `brand-soft`, 6.16:1.
- **DESIGN.md updated:**
  - Type is now shown by card background tint + border + icon + label (§2.3, §2.5, §4).
  - Due-date state (M8) will be shown **only** by the card's left border and a due-date chip with icon and text, never the background (§2.4, §2.5).
  - §2.4's `-soft` tokens are now described as chip backgrounds.
  - New contrast rows in §2.6.
- **Tested** (35/35 checks passed in jsdom):
  - Every card has its own type tint and border (and not the other type's).
  - No `text-muted` remains on tinted cards.
  - The badge is a white pill with the type's label colour and icon.
  - The modal header is tinted `feature-soft` by default and switches to `bug-soft` when Bug is picked.
  - All earlier M5/M6 checks still pass, with no React warnings.

## Components / files changed

| File | Change |
|---|---|
| `src/components/TypeBadge.jsx` | New. `TYPE_META` (label, icon, badge / icon / selected class strings per type) and the `TypeBadge` pill. Update: added `tint` and `card` class strings; badge pill now white (`bg-card`) with `text` label colour |
| `src/components/TaskCard.jsx` | Header row is now `id` (left) + `TypeBadge` (right). Update: card uses `TYPE_META[type].card` (tint + type border) instead of `bg-card border-line`; captions `text-ink-soft` |
| `src/components/TaskModal.jsx` | `TypeBadge` beside the modal title; Type `<select>` replaced by an icon + label radio picker; removed local `TYPE_LABELS`. Update: header tinted with `TYPE_META[form.type].tint` + `rounded-t`; ID line and close button `text-ink-soft` |
| `DESIGN.md` | Update: §2.3, §2.4, §2.5, §2.6, §4 rewritten for type tint and the M8 left border + due-date chip |

## Colours, fonts, icons & interactions used

**Colours (Tailwind tokens)**

| Element | Feature | Bug | Contrast |
|---|---|---|---|
| Card background (update) | `bg-feature-soft` #F5F3FF | `bg-bug-soft` #FFF1F2 | — |
| Card border (update) | `border-feature` #7C3AED | `border-bug` #E11D48 | 5.20:1 / 4.29:1 vs column `muted-bg` ✅ |
| Card title (update) | `text-ink` | `text-ink` | 18.24:1 / 18.21:1 ✅ |
| Card ID / assignee (update) | `text-ink-soft` | `text-ink-soft` | 6.91:1 / 6.90:1 ✅ (`muted` would be 4.34 / 4.33 ❌) |
| Modal header background (update) | `bg-feature-soft` | `bg-bug-soft` | — |
| Badge background | `bg-card` (white pill; was `-soft` before the update) | `bg-card` | — |
| Badge label | `text-feature-text` #6D28D9 | `text-bug-text` #BE123C | 7.10:1 / 6.29:1 on white pill ✅ |
| Badge icon | `text-feature` #7C3AED | `text-bug` #E11D48 | 5.70:1 / 4.70:1 on white pill (UI-graphic minimum 3:1) ✅ |
| Picker, selected | `border-feature bg-feature-soft text-feature-text` | `border-bug bg-bug-soft text-bug-text` | as above |
| Picker, unselected | `border-line text-ink-soft`, `hover:bg-muted-bg` | same | 7.58:1 on card ✅ |
| Picker focus | `focus-within:ring-2 ring-brand` | same | — |

**Fonts**

- Inter.
- Badge: 12 px medium. Picker options: 14 px medium.

**Icons (lucide-react)**

- `Sparkles` (feature) and `Bug` (bug).
- Badge icons are 14 px; picker icons are 16 px.
- All are `aria-hidden`, and the visible label always accompanies them, so type is never shown by colour alone.

**Interactions & accessibility**

- **Badge shape:** a rounded-full pill.
- **Picker markup:** a `<fieldset>` with `<legend>Type</legend>`. Each option is a native radio input, visually hidden with `sr-only` but still focusable and selectable with the arrow keys. Each is wrapped in its own `<label>`.
- **Live update:** the header badge reflects the picker as you change it, before saving. After the update, the header tint does too.
- **Card hover and focus:** cards keep their hover shadow and `focus-within` brand ring on top of the type tint.

## Screenshot

![M6 screenshot](../screenshots/M6.png)

Placeholder path: `docs/screenshots/M6.png`

## Why I chose this

[TO COMPLETE]

## Alternatives considered

[TO COMPLETE]

## UX principle / literature reference

[TO COMPLETE]

## Requirement IDs this maps to

[TO COMPLETE]
