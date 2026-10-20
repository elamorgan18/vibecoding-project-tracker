# M7 – Owner indicator + handoff

**Tag:** `task-owner`

## What was built

- **Owner avatar on every card:** a 32 px initials avatar sits along the bottom of each card, next to the owner's name in `ink` medium (previously 24 px with a caption-style name). Unassigned tasks show a dashed placeholder avatar with a user icon and "Unassigned".
- **"Hand off to…" in the task modal (edit mode):**
  - **Owner section:** a new Owner section at the top of the form shows the current owner's avatar and name.
  - **Hand-off dropdown:** next to it, "Hand off to…" lists every **other** team member. Picking someone reassigns the task **immediately**: it's saved to localStorage straight away and the Owner section updates. The dropdown then resets.
  - **Toast:** a success toast confirms the hand-off: "Handed to {name}. It's on their board now."
  - **Disabled state:** if there's nobody else on the team, the dropdown is disabled with "No one to hand off to".
  - **Create mode:** keeps the plain Assignee dropdown.
- **Toasts:** a success toast (bottom-right; bottom-centre on small screens) with a check icon and text. It fades in over 200 ms, auto-dismisses after 4 s, and can be dismissed with the ✕ button. It's announced through an always-present `role="status"` / `aria-live="polite"` region. Used for hand-off, add member and remove member.
- **"Who's driving what" strip:** sits above the board. It shows one card per team member with their avatar, name, and the tasks they have **In Progress** ("Driving 1 task" plus the task ID and title, or "Nothing in progress"). Each task in the strip is a button that opens that task's modal. The strip scrolls sideways when there are more members than fit.
- **Team panel:** opened from a new "Team" button (with member count) in the header.
  - **View:** each member's avatar, name, email, `@githubUsername` and number of assigned tasks.
  - **Add:** a form for name, email and GitHub username, with inline validation:
    - Name required.
    - Email must be valid and not already used on the team (case-insensitive).
    - GitHub username: letters, numbers and single hyphens, up to 39 characters. A leading `@` is stripped.
    - Focus moves to the first invalid field. After a successful add, the form clears and focus returns to Name.
    - New members get IDs like `member-4`.
  - **Remove:** an inline danger confirmation: "Remove {name} from the team? Their {n} tasks will become unassigned." with "Keep" / "Remove member". Removing a member sets their tasks' `assignee` to `null`.
  - **Where new members appear:** in the create-task Assignee dropdown, the "Hand off to…" dropdown and the driving strip, straight away.
- **Persistence:** member changes save to `vibetracker.teams` and assignee changes to `vibetracker.tasks` in localStorage.
- **Shared components:**
  - **`Dialog`:** the task modal's focus trap / Escape / backdrop / focus-return logic moved into a shared `Dialog` component, used by both the task modal and the Team panel.
  - **`FormField`:** form fields share a `FormField` component with the standard danger error style.
- **Tested** (71/71 checks passed in jsdom through the real UI). New M7 checks:
  - Card avatar initials and size; placeholder avatar for unassigned.
  - Strip contents per member.
  - "Hand off to…" lists only other members. Hand-off updates the modal, card, strip and localStorage, and shows the toast.
  - The hand-off persists after Cancel.
  - Toast dismiss and 4 s auto-dismiss.
  - Team panel listing.
  - Add validation: empty, invalid email, duplicate email.
  - Successful add (ID `member-4`, `@` stripped, toast, header count); the new member appears in the strip, Assignee and Hand off dropdowns.
  - Remove confirm / Keep / Remove; tasks become unassigned.
  - Escape closes the panel.
  - Everything persists after a remount.
  - All M5/M6 checks still pass, with no React warnings.
- `npm run build` passes, and the Vite dev server on port 5173 serves and compiles all new modules.

### Bug fix (2026-10-20 12:43): card focus / selected ring

- **Bug:** when a card was clicked or keyboard-focused, it showed a purple-looking border whatever its type.
- **Cause:** the card's focus ring (`focus-within:ring-2 ring-brand`, blue `#2563EB`) had no offset, so it was drawn directly against the card's 1px type border. Brand blue vs the violet `feature` / rose `bug` border is only 1.10:1, so the two read as one thick purple edge.
- **Fix:**
  - **Offset:** the ring now has a 2px offset filled with the column background (`focus-within:ring-offset-2 focus-within:ring-offset-muted-bg`). There is a visible gap between the type border and the ring, so the ring sits **outside** the card.
  - **Type colouring unchanged:** the border, tint and badge are the same whether the card is focused or not.
  - **Every card the same:** the ring classes are one `FOCUS_RING` constant in `TaskCard.jsx`, applied to every card.
  - **When it shows:** whenever the card's title button has focus. That covers keyboard Tab, and the card that was clicked, because focus returns to its button when the modal closes.
- **Visibility (WCAG 2.4.7 Focus Visible):** a 2px brand ring is 4.72:1 against the column's `muted-bg` gap, above the 3:1 non-text contrast minimum (1.4.11).
- **Tested** (75/75 checks passed in jsdom):
  - Every card has the same four focus-ring classes.
  - No focus class uses a feature/bug colour or changes the border.
  - The type border and tint classes are unchanged alongside the ring.
  - Focusing a card's title button puts the card into `:focus-within`.
  - The built CSS contains the offset rules (`--tw-ring-offset-width: 2px`, `--tw-ring-offset-color: #F1F5F9`).

## Components / files changed

| File | Change |
|---|---|
| `src/components/Avatar.jsx` | New. Initials avatar (`sm` 24 px / `md` 32 px) and dashed unassigned placeholder; `initials()` helper |
| `src/components/Toast.jsx` | New. Success toast with live region, 4 s auto-dismiss, Dismiss button |
| `src/components/DrivingStrip.jsx` | New. "Who's driving what" strip |
| `src/components/TeamPanel.jsx` | New. Team dialog: member list, inline remove confirmation, add-member form with validation |
| `src/components/Dialog.jsx` | New. Shared modal shell (extracted from `TaskModal`) |
| `src/components/FormField.jsx` | New. Shared label + control + error, `inputClass`, `inputBorder()` |
| `src/data/ids.js` | New. `nextId(items, prefix)` |
| `src/data/team.js` | New. `addMember`, `removeMember` |
| `src/data/tasks.js` | `nextTaskId` now uses `nextId`; added `reassignTask`, `unassignMember` |
| `src/components/TaskModal.jsx` | Uses `Dialog` and `FormField`; edit mode shows Owner + "Hand off to…" instead of the Assignee dropdown; new `onHandOff` prop |
| `src/components/TaskCard.jsx` | Uses `Avatar` (32 px); owner name `text-sm font-medium text-ink`. Bug fix: focus ring moved into a shared `FOCUS_RING` constant with a 2px `muted-bg` offset |
| `src/App.jsx` | `setTeams`; Team button; `DrivingStrip`, `TeamPanel`, `Toast`; `handleHandOff`, `handleAddMember`, `handleRemoveMember`, `showToast` |
| `tailwind.config.js` | Added `toast-in` keyframes / `animate-toast-in` (200 ms) |
| `DESIGN.md` | §5 microcopy rows for hand-off, driving strip and Team panel |

## Colours, fonts, icons & interactions used

**Colours (Tailwind tokens)**

| Element | Tokens | Contrast |
|---|---|---|
| Avatar | `bg-brand-soft text-brand-hover`, `ring-2 ring-card` | 6.16:1 ✅ |
| Unassigned avatar | `border-dashed border-ink-soft bg-card text-ink-soft` | 7.58:1 ✅ |
| Card owner name | `text-ink` on type tint | ≥ 18.2:1 ✅ |
| Card focus / selected (bug fix) | `focus-within:ring-2 ring-brand ring-offset-2 ring-offset-muted-bg` | ring 4.72:1 vs `muted-bg` gap ✅ (was flush against the type border at 1.10:1) |
| Modal Owner box | `bg-surface border-line`; "Owner" `text-muted` | 4.55:1 ✅ |
| Hand-off select | `inputClass` + `border-line`, icon `text-ink-soft`; disabled `bg-muted-bg text-ink-soft` | 6.92:1 ✅ |
| Toast | `bg-success-soft border-success`, text `text-ink`, icon `text-success`, Dismiss `text-ink-soft` | 17.05:1 / icon 3.15:1 (graphic) / 7.24:1 ✅ |
| Driving strip cards | `bg-card border-line`; name `text-ink`; status / task ID `text-muted`; task links `text-ink`, `hover:text-brand-hover` | 4.76:1 muted ✅ |
| Team button | `bg-card border-line text-ink`, `hover:bg-muted-bg`; count pill `bg-muted-bg text-ink-soft` | 6.92:1 ✅ |
| Team panel text | name `text-ink`; email, GitHub, task count `text-muted` on `card` | 4.76:1 ✅ |
| "Remove" (row) | `text-danger-text`, `hover:bg-danger-soft`, `ring-danger` focus | 6.47:1 / 5.91:1 ✅ |
| Remove confirm | `bg-danger-soft`, text `text-ink`, icon `text-danger`; "Remove member" `bg-danger text-white`, `hover:bg-danger-hover` | 4.83:1 ✅ |
| Add member | `bg-brand text-white`, `hover:bg-brand-hover` | 5.17:1 ✅ |
| Form errors | `border-danger`, message `text-danger-text` + `AlertCircle` | 6.47:1 ✅ |

**Fonts**

- Inter throughout.
- JetBrains Mono for task IDs in the strip, `@githubUsername` in the Team panel, and the GitHub input.
- Strip heading: 16 px semibold uppercase. Names: 14 px medium. Captions: 12 px.

**Icons (lucide-react)**

All are `aria-hidden` and paired with visible text (or sr-only text for icon-only buttons):

- `Users`: Team button
- `UserPlus`: Add member
- `ArrowRightLeft`: Hand off dropdown
- `CircleCheck`: toast
- `X`: Dismiss / Close
- `Trash2`: Remove
- `AlertTriangle`: remove confirmation
- `AlertCircle`: field errors
- `UserRound`: unassigned avatar

**Interactions & accessibility**

- **Hand-off:** applies on selection (no Save needed) and stays applied even if the modal is then cancelled.
- **Toast:** fades in over 200 ms (`motion-reduce:animate-none`), lasts 4 s, and is announced politely.
- **Team panel focus:** opens with focus on the dialog. Escape or the backdrop closes it, and focus returns to the Team button.
- **Remove confirmation:** focus moves to "Keep", the safe default.
- **Remove buttons:** include the member's name as sr-only text ("Remove Priya Shah").
- **Avatars:** `aria-hidden` because the name is always shown next to them.
- **Driving strip:** task buttons open the task modal.

## Screenshot

![M7 screenshot](../screenshots/M7.png)

Placeholder path: `docs/screenshots/M7.png`

## Why I chose this

[TO COMPLETE]

## Alternatives considered

[TO COMPLETE]

## UX principle / literature reference

[TO COMPLETE]

## Requirement IDs this maps to

[TO COMPLETE]
