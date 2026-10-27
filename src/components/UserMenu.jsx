import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Code2, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { ROLES } from '../data/auth.js';
import Avatar from './Avatar.jsx';

const ROLE_ICONS = { developer: Code2, lead: ShieldCheck, guest: UserRound };

/**
 * "Role: Team lead" pill: icon + words, so the role never relies on colour.
 * Same neutral style as the Team button's count pill.
 */
export function RoleBadge({ role }) {
  const Icon = ROLE_ICONS[role];
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted-bg px-2 py-0.5 text-xs font-medium text-ink-soft">
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      Role: {ROLES[role].label}
    </span>
  );
}

/**
 * Header user menu: avatar, name and role on the button; a profile popover
 * with name, email, role badge and "Log out". Disclosure pattern like the
 * filter menus: Escape, Tab-ing away or clicking outside closes it, and
 * Escape refocuses the button.
 */
export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const role = ROLES[user.role].label;

  useEffect(() => {
    if (!open) return undefined;
    function closeIfOutside(e) {
      if (!panelRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', closeIfOutside);
    return () => document.removeEventListener('mousedown', closeIfOutside);
  }, [open]);

  function onKeyDown(e) {
    if (e.key === 'Escape' && open) {
      e.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    }
  }

  return (
    <div
      className="relative"
      onKeyDown={onKeyDown}
      // Tabbing out of the button and popover closes it.
      onBlur={(e) => {
        if (open && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="user-menu-panel"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded border border-line bg-card py-1 pl-1 pr-2 text-left hover:bg-muted-bg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface"
      >
        <Avatar member={user.member} />
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-medium text-ink">{user.name}</span>
          <span className="text-xs text-ink-soft">
            <span className="sr-only">Role: </span>
            {role}
          </span>
        </span>
        <span className="sr-only">, account menu</span>
        <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-soft" />
      </button>

      {open && (
        <div
          ref={panelRef}
          id="user-menu-panel"
          className="absolute right-0 z-30 mt-1 w-72 max-w-[calc(100vw-3rem)] rounded border border-line bg-card p-4 shadow-lg"
        >
          <h2 className="sr-only">Your profile</h2>
          <div className="flex items-center gap-3">
            <Avatar member={user.member} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{user.name}</p>
              <p className="truncate text-xs text-ink-soft">{user.email ?? 'Not logged in to an account'}</p>
            </div>
          </div>
          <div className="mt-3">
            <RoleBadge role={user.role} />
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="mt-4 flex w-full items-center gap-1.5 rounded border border-line bg-card px-3 py-2 text-sm font-medium text-ink hover:bg-muted-bg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            <LogOut aria-hidden="true" className="h-4 w-4 text-ink-soft" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
