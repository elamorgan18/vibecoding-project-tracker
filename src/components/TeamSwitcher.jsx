import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

/**
 * Team / project switcher under the app title. Same pattern as HandOffMenu:
 * a button that opens a listbox. Keyboard: Enter / Space / ArrowDown opens;
 * ArrowUp / ArrowDown / Home / End move; only Enter (or a click) switches
 * team; Escape closes; Tab closes and moves on.
 *
 * `options` is [{ team, project }], one per team, with that team's project.
 */
export default function TeamSwitcher({ options, currentTeamId, onSelect }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const currentIndex = Math.max(
    options.findIndex((o) => o.team.id === currentTeamId),
    0,
  );
  const current = options[currentIndex];
  const label = `${current.team.name} · ${current.project.name}`;

  useEffect(() => {
    if (!open) return undefined;
    listRef.current?.focus();
    function onPointerDown(e) {
      if (!listRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function openMenu(index = currentIndex) {
    setActive(index);
    setOpen(true);
  }

  function close({ refocus = true } = {}) {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  }

  function choose(option) {
    close();
    if (option.team.id !== current.team.id) onSelect(option.team.id);
  }

  function onButtonKeyDown(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      openMenu();
    }
  }

  function onListKeyDown(e) {
    const last = options.length - 1;
    const moves = { ArrowDown: Math.min(active + 1, last), ArrowUp: Math.max(active - 1, 0), Home: 0, End: last };
    if (e.key in moves) {
      e.preventDefault();
      setActive(moves[e.key]);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(options[active]);
    } else if (e.key === ' ') {
      // Moving through teams never switches; only Enter does.
      e.preventDefault();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === 'Tab') {
      close({ refocus: false });
    }
  }

  return (
    // mt-0.5 / -mb-0.5 keep the text where the old subtitle line was, with a
    // 24px-tall target.
    <div className="relative -mb-0.5 mt-0.5">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="team-switcher-list"
        aria-label={`Current team: ${label}, change team`}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onButtonKeyDown}
        className="-ml-1 flex min-h-[24px] min-w-[24px] items-center gap-1 rounded px-1 text-left text-sm text-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {label}
        <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0" />
      </button>

      {open && (
        <ul
          ref={listRef}
          id="team-switcher-list"
          role="listbox"
          tabIndex={-1}
          aria-label="Teams"
          aria-activedescendant={`team-option-${options[active].team.id}`}
          onKeyDown={onListKeyDown}
          className="absolute left-0 z-30 mt-1 max-h-64 w-max min-w-[16rem] max-w-[calc(100vw-3rem)] overflow-y-auto rounded border border-line bg-card py-1 shadow-lg focus:outline-none"
        >
          {options.map((option, index) => {
            const isCurrent = option.team.id === current.team.id;
            return (
              <li
                key={option.team.id}
                id={`team-option-${option.team.id}`}
                role="option"
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(option)}
                className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-base text-ink ${
                  index === active ? 'bg-muted-bg' : ''
                }`}
              >
                <Check aria-hidden="true" className={`h-4 w-4 shrink-0 text-brand ${isCurrent ? '' : 'invisible'}`} />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">
                    {option.team.name}
                    {isCurrent && <span className="sr-only"> (current team)</span>}
                  </span>
                  <span className="truncate text-sm text-muted">{option.project.name}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
