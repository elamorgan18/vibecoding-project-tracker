import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
import { DUE_FILTERS, NO_FILTERS, UNASSIGNED, hasFilters, toggleValue } from '../data/filters.js';
import Avatar from './Avatar.jsx';

const FOCUS = 'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-card';

/**
 * Filter bar above the board: a "Team member" and a "Due date" menu, the
 * active filters as removable chips, "Clear filters", and a result count in
 * an aria-live region so screen readers hear it change.
 *
 * Each menu is a disclosure button (aria-expanded) opening a fieldset of
 * native checkboxes: Tab moves through them, Space ticks, Escape closes and
 * returns focus to the button. Removing a chip moves focus to the next chip
 * (or the "Team member" button when none are left), so focus is never lost.
 */
export default function FilterBar({ filters, onChange, members, shownCount, totalCount }) {
  const memberButton = useRef(null);
  const chipRefs = useRef([]);
  // Index of the chip to focus after one is removed (null = don't move focus).
  const [focusChip, setFocusChip] = useState(null);

  const memberOptions = [
    ...members.map((m) => ({ id: m.id, label: m.name, member: m })),
    { id: UNASSIGNED, label: 'Unassigned', member: null },
  ];

  const chips = [
    ...filters.members.map((id) => ({
      group: 'members',
      id,
      groupLabel: 'Member',
      label: memberOptions.find((o) => o.id === id)?.label ?? id,
    })),
    ...filters.due.map((id) => ({
      group: 'due',
      id,
      groupLabel: 'Due',
      label: DUE_FILTERS.find((o) => o.id === id).label,
    })),
  ];

  useEffect(() => {
    if (focusChip === null) return;
    const target = chips.length > 0 ? chipRefs.current[Math.min(focusChip, chips.length - 1)] : memberButton.current;
    target?.focus();
    setFocusChip(null);
  }, [focusChip, chips.length]);

  function removeChip(chip, index) {
    onChange({ ...filters, [chip.group]: filters[chip.group].filter((v) => v !== chip.id) });
    setFocusChip(index);
  }

  function clearAll() {
    onChange(NO_FILTERS);
    memberButton.current?.focus();
  }

  const active = hasFilters(filters);

  return (
    <section aria-labelledby="filter-heading" className="mb-4 rounded border border-line bg-card p-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 id="filter-heading" className="flex items-center gap-1.5 text-sm font-medium text-ink">
          <Filter aria-hidden="true" className="h-4 w-4 text-ink-soft" />
          Filter tasks
        </h2>

        <FilterMenu
          label="Team member"
          buttonRef={memberButton}
          options={memberOptions}
          selected={filters.members}
          onToggle={(id) => onChange({ ...filters, members: toggleValue(filters.members, id) })}
          renderOption={(option) => (
            <>
              <Avatar member={option.member} />
              <span className={option.member ? 'text-ink' : 'text-ink-soft'}>{option.label}</span>
            </>
          )}
        />

        <FilterMenu
          label="Due date"
          options={DUE_FILTERS}
          selected={filters.due}
          onToggle={(id) => onChange({ ...filters, due: toggleValue(filters.due, id) })}
          renderOption={(option) => <span className="text-ink">{option.label}</span>}
        />

        <p role="status" aria-live="polite" className="ml-auto text-sm text-ink-soft">
          {active ? `Showing ${shownCount} of ${totalCount} tasks` : `Showing all ${totalCount} tasks`}
        </p>
      </div>

      {active && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
          <ul aria-label="Active filters" className="flex flex-wrap items-center gap-2">
            {chips.map((chip, index) => (
              <li key={`${chip.group}-${chip.id}`}>
                <button
                  type="button"
                  ref={(el) => (chipRefs.current[index] = el)}
                  onClick={() => removeChip(chip, index)}
                  aria-label={`Remove filter ${chip.groupLabel}: ${chip.label}`}
                  className={`flex items-center gap-1 rounded-full border border-brand bg-brand-soft py-0.5 pl-2.5 pr-1.5 text-xs font-medium text-ink hover:bg-muted-bg ${FOCUS}`}
                >
                  <span className="text-ink-soft">{chip.groupLabel}:</span>
                  {chip.label}
                  <X aria-hidden="true" className="h-3.5 w-3.5 text-ink-soft" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={clearAll}
            className={`rounded px-2 py-0.5 text-sm font-medium text-brand hover:text-brand-hover hover:underline ${FOCUS}`}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}

/** A button that opens a popover of checkboxes (one filter group). */
function FilterMenu({ label, options, selected, onToggle, renderOption, buttonRef }) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef(null);
  const ownButton = useRef(null);
  const button = buttonRef ?? ownButton;
  const panelId = useId();

  // Close when the user clicks or tabs outside the menu.
  useEffect(() => {
    if (!open) return undefined;
    const closeIfOutside = (event) => {
      if (!wrapper.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', closeIfOutside);
    document.addEventListener('focusin', closeIfOutside);
    return () => {
      document.removeEventListener('mousedown', closeIfOutside);
      document.removeEventListener('focusin', closeIfOutside);
    };
  }, [open]);

  function handleKeyDown(event) {
    if (event.key === 'Escape' && open) {
      event.stopPropagation();
      setOpen(false);
      button.current.focus();
    }
  }

  return (
    <div ref={wrapper} className="relative" onKeyDown={handleKeyDown}>
      <button
        type="button"
        ref={button}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded border px-3 py-1.5 text-sm font-medium text-ink hover:bg-muted-bg ${
          selected.length > 0 ? 'border-brand bg-brand-soft' : 'border-line bg-card'
        } ${FOCUS}`}
      >
        {label}
        {selected.length > 0 && (
          <span className="rounded-full bg-brand px-1.5 text-xs text-on-accent">
            {selected.length}
            <span className="sr-only"> selected</span>
          </span>
        )}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 text-ink-soft motion-safe:transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute left-0 top-full z-30 mt-1 w-64 rounded border border-line bg-card p-2 shadow-lg"
      >
        <fieldset>
          <legend className="sr-only">{label}</legend>
          <ul className="flex flex-col">
            {options.map((option) => (
              <li key={option.id}>
                <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted-bg focus-within:bg-muted-bg">
                  <input
                    type="checkbox"
                    checked={selected.includes(option.id)}
                    onChange={() => onToggle(option.id)}
                    className="h-4 w-4 shrink-0 accent-brand focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-card"
                  />
                  {renderOption(option)}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      </div>
    </div>
  );
}
