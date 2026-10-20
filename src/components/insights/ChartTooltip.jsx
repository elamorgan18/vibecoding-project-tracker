/**
 * Recharts tooltip in the app's card style (theme tokens, so it follows
 * light / dark mode). `render(row)` returns the content for the hovered row.
 */
export default function ChartTooltip({ active, payload, render }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-line bg-card px-3 py-2 text-xs text-ink shadow-lg">
      {render(payload[0].payload)}
    </div>
  );
}
