import { useId } from 'react';

/**
 * How each AI outcome is drawn in Insights (DESIGN.md §4). Colour is never
 * the only cue: each outcome also has its own fill pattern, and is always
 * labelled in the legend, tooltip, table and text summary.
 *   Worked  — solid `success`
 *   Partial — `due-warning` with diagonal stripes
 *   Failed  — `danger` with dots
 */
export const OUTCOME_STYLES = {
  worked: { token: 'success', pattern: 'solid' },
  partial: { token: 'due-warning', pattern: 'stripes' },
  failed: { token: 'danger', pattern: 'dots' },
};

/**
 * SVG <pattern>s for the three outcomes, to put inside an <svg>'s <defs>.
 * Fill a shape with `url(#${prefix}-${outcomeId})`. Pattern marks use the
 * card colour so they read in both themes.
 */
export function outcomePatterns(prefix, palette) {
  return Object.entries(OUTCOME_STYLES).map(([id, { token, pattern }]) => (
    <pattern key={id} id={`${prefix}-${id}`} width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill={palette[token]} />
      {pattern === 'stripes' && (
        <path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke={palette.card} strokeWidth="2" strokeOpacity="0.75" />
      )}
      {pattern === 'dots' && <circle cx="4" cy="4" r="1.6" fill={palette.card} fillOpacity="0.85" />}
    </pattern>
  ));
}

/** A small square in an outcome's colour and pattern, for legends and tables. */
export function OutcomeSwatch({ outcome, palette, size = 14 }) {
  const prefix = `swatch${useId().replace(/:/g, '')}`;
  return (
    <svg aria-hidden="true" width={size} height={size} className="shrink-0 rounded-sm">
      <defs>{outcomePatterns(prefix, palette)}</defs>
      <rect width={size} height={size} fill={`url(#${prefix}-${outcome})`} stroke={palette[OUTCOME_STYLES[outcome].token]} />
    </svg>
  );
}
