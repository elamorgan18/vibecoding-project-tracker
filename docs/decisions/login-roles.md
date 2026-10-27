# Extra – Mock login, sign-up and roles

**Tag:** none (extra after M13)

## What was built

- **Login screen** (shown when no one is logged in): Email and Password fields, a "Log in" button and a "Sign up" link. **Sign-up screen**: Name, Email, Password and Role (Developer or Team lead), a "Create account" button and a "Log in" link. Same wordmark, card, inputs and buttons as the board, in light and dark mode, with the theme toggle top right.
- **Demo panel** directly under the login form: the heading "Trying the prototype? Use a demo account", the Developer (`dev@demo.com` / `demo123`) and Team lead (`lead@demo.com` / `demo123`) logins as selectable monospace text, and "Team leads can also manage team members and deliverable links." Each account has a "Use this account" button that fills in the fields without submitting and moves focus to "Log in". A "Continue as guest" button goes straight into the app as "Guest (demo)".
- **Demo accounts** are created automatically if they're missing and are linked to two existing mock members of Demo Team: Developer → **Sam Rivera** (`member-3`) and Team lead → **Priya Shah** (`member-1`). No tasks, members or deliverables were changed or reseeded. There is no "Load demo data" or "Reset" button.
- **Roles and permissions** (`can()` in `src/data/auth.js`):
  - Developer: create, edit and move tasks and edit AI context (delete and hand off stay available, as part of editing tasks).
  - Team lead: also add and remove team members and edit deliverable links.
  - Guest (demo): everything, so an assessor can test the whole board.
  - For a Developer, the Team panel shows the member list without Remove buttons or the add form, with "Only team leads can add or remove members." Deliverable cards show the link (or "A team lead adds this link.") without the URL field or Change / Remove, and the summary says "Only team leads can edit deliverable links."
- **Accounts linked to team members:** a new sign-up adds a matching new member (name, email, next avatar colour, empty GitHub username) to Demo Team. Nothing else changes. The Team panel leaves out the "· @username" part when a member has no GitHub username.
- **User menu** as the last item in the header: avatar, name and role on the button. It opens a profile popover with name, sign-in email, a "Role: …" badge (icon + words) and "Log out".
- **Session:** saved in localStorage (`vibetracker.session`), so the user stays logged in across reloads until they log out. Logging out closes any open dialog, clears the filters and shows the login screen. The wordmark still goes to the board when logged in.
- **Validation:** the email must look valid; the password must be at least 6 characters (sign-up) or not empty (login); an email can't be registered twice (case-insensitive). A wrong email or password shows "Email or password is incorrect."
- **Passwords** are never stored as plain text. They are hashed with the Web Crypto API (SHA-256 of `email:password`) and stored in `vibetracker.accounts`. A code comment in `auth.js` says a real product would use a backend with proper authentication, as in the C4 container diagram.
- **Accessibility:**
  - Every input has a visible `<label>` and the right `autocomplete`: `email`, `current-password`, `new-password`, `name`.
  - Errors are shown as text under the field, linked with `aria-describedby` and `aria-invalid="true"`. On submit, focus moves to the first field with an error, and a summary ("There are 2 problems: …") is announced through the app's existing `aria-live` region.
  - The show/hide password button has `aria-label="Show password"` and `aria-pressed`.
  - The demo buttons are named "Use this account: Developer demo account" / "…: Team lead demo account" (the name starts with the visible text). Filling in announces "Developer demo details filled in."
  - The login page has one `h1`, a page title ("Log in – Vibecoding Project Tracker" / "Sign up – …") and `lang="en"`. Focus goes to the card's `h1` when the screen opens or switches mode. After logging in, focus goes to the board's `h1` and "Logged in as {name}, {role}." is announced.
  - Everything works by keyboard, with the `brand` focus ring. Enter submits. The user menu closes on Escape (focus returns to the button), on Tab-ing away or on clicking outside.
  - Roles are always shown as words with an icon, never by colour alone. Contrast meets WCAG AA in both themes. The lowest new pairing is `brand` text on `brand-soft`: 4.75:1 light, 4.52:1 dark.
- **Tested** in headless Edge against the production build: 63 checks pass, covering both demo logins, the wrong password message, empty and duplicate sign-up errors, sign-up creating a member, the guest label, staying logged in after a reload, logout, the permission differences, focus moves and live-region text, and tasks and deliverables unchanged in storage. axe-core (WCAG 2.x A/AA + best practice) reports no violations on the login screen (light, dark, with errors), the sign-up screen with errors (dark), or the board with the user menu open (Developer light, Team lead dark). The only console error is a 404 for `/favicon.ico`, which happened before this change too. `npm run build` passes.

## Components / files changed

- `src/data/auth.js` (new): roles, permissions (`can`), demo accounts, SHA-256 hashing, validation, `currentUser()`
- `src/components/AuthScreen.jsx` (new): login and sign-up screens, password toggle, demo panel
- `src/components/UserMenu.jsx` (new): header user menu, profile popover, `RoleBadge`
- `src/App.jsx`: accounts and session state, login gate, login / sign-up / guest / logout handlers, focus on the board heading, user menu in the header, role props for Team panel and deliverables
- `src/data/model.js`: `vibetracker.accounts` and `vibetracker.session` storage keys
- `src/components/TeamPanel.jsx`: `canManage` prop; GitHub username only shown when set
- `src/components/AnchorBoard.jsx`, `src/components/AnchorCard.jsx`: `canEdit` prop
- `src/components/FormField.jsx`: optional `alertError={false}`, so the login forms announce errors through the live region instead of `role="alert"`
- `README.md` ("Demo accounts", live demo note), `PRD.md` (§12 note, §14 FR-AUTH), `DESIGN.md` (§4, §5), `PROMPT_LOG.md`

## Colours, fonts, icons & interactions used

- **Colours (existing tokens only):** `surface` page, `card` panel with `line` border; solid `brand` buttons with `on-accent` text; demo panel `brand-soft` with a `brand/40` border and a `brand/30` divider; role badge `muted-bg` + `ink-soft`; errors `danger` border and `danger-text` with an alert icon; `brand` text buttons for "Sign up", "Log in" and "Continue as guest".
- **Fonts:** Inter for all text; JetBrains Mono for the demo emails and passwords. Card heading `text-lg` semibold, wordmark `text-2xl` semibold.
- **Icons (Lucide):** `LogIn`, `UserPlus`, `Eye` / `EyeOff`, `Info` (demo panel), `AlertCircle` (errors), `Code2` (Developer), `ShieldCheck` (Team lead), `UserRound` (Guest), `ChevronDown` and `LogOut` (user menu), `Lock` (Team panel note).
- **Interactions:** Enter submits. "Use this account" fills the fields and focuses "Log in". The eye button toggles password visibility. Sign up / Log in links swap the card and focus its heading. The user menu is a disclosure popover. Log out returns to the login screen.

## Screenshot

![Login screenshot](../screenshots/login-roles.png)

Placeholder path: `docs/screenshots/login-roles.png`

## Why I chose this

[TO COMPLETE]

## Alternatives considered

[TO COMPLETE]

## UX principle / literature reference

[TO COMPLETE]

## Requirement IDs this maps to

[TO COMPLETE]
