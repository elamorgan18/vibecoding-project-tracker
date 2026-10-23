import { useEffect, useRef, useState } from 'react';
import { ArrowRightLeft, ChevronDown } from 'lucide-react';
import Avatar from './Avatar.jsx';

/**
 * "Hand off to…" picker: a button that opens a listbox of members, each
 * shown with their coloured avatar and name (a native <select> can't show
 * avatars). Keyboard: Enter / Space / ArrowDown opens; ArrowUp / ArrowDown /
 * Home / End move; Enter / Space picks; Escape closes the menu only; Tab
 * closes it and moves on.
 */
export default function HandOffMenu({ members, onSelect, describedBy }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const disabled = members.length === 0;

  useEffect(() => {
    if (!open) return undefined;
    listRef.current?.focus();
    function onPointerDown(e) {
      if (!listRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function openMenu(index = 0) {
    setActive(index);
    setOpen(true);
  }

  function close({ refocus = true } = {}) {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  }

  function choose(member) {
    close();
    onSelect(member.id);
  }

  function onButtonKeyDown(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      openMenu(e.key === 'ArrowUp' ? members.length - 1 : 0);
    }
  }

  function onListKeyDown(e) {
    const last = members.length - 1;
    const moves = { ArrowDown: Math.min(active + 1, last), ArrowUp: Math.max(active - 1, 0), Home: 0, End: last };
    if (e.key in moves) {
      e.preventDefault();
      setActive(moves[e.key]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(members[active]);
    } else if (e.key === 'Escape') {
      // Stop here so the surrounding dialog doesn't close too.
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === 'Tab') {
      close({ refocus: false });
    }
  }

  return (
    <div className="relative sm:w-64">
      <button
        ref={buttonRef}
        id="task-handoff"
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="task-handoff-list"
        aria-describedby={describedBy}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onButtonKeyDown}
        className="flex w-full items-center gap-2 rounded border border-line bg-card px-3 py-2 text-left text-base text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand disabled:cursor-not-allowed disabled:bg-muted-bg disabled:text-ink-soft"
      >
        <ArrowRightLeft aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-soft" />
        <span className="flex-1">{disabled ? 'No one to hand off to' : 'Hand off to…'}</span>
        <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-soft" />
      </button>

      {open && (
        <ul
          ref={listRef}
          id="task-handoff-list"
          role="listbox"
          tabIndex={-1}
          aria-label="Hand off to"
          aria-activedescendant={`handoff-option-${members[active].id}`}
          onKeyDown={onListKeyDown}
          className="absolute right-0 z-20 mt-1 max-h-64 w-full min-w-[14rem] overflow-y-auto rounded border border-line bg-card py-1 shadow-lg focus:outline-none"
        >
          {members.map((member, index) => (
            <li
              key={member.id}
              id={`handoff-option-${member.id}`}
              role="option"
              aria-selected={index === active}
              data-member-id={member.id}
              onMouseEnter={() => setActive(index)}
              onClick={() => choose(member)}
              className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-base text-ink ${
                index === active ? 'bg-muted-bg' : ''
              }`}
            >
              <Avatar member={member} />
              <span className="truncate">{member.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
