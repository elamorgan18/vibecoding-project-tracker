import AnchorCard from './AnchorCard.jsx';

/** The four pinned deliverable links (Presentation, Demo, Report, Documentation). */
export default function AnchorBoard({ anchors, onSave }) {
  const linked = anchors.filter((a) => a.url).length;
  return (
    <section aria-labelledby="deliverables-heading" className="mb-6">
      <div className="mb-2 flex flex-wrap items-baseline gap-x-3">
        <h2 id="deliverables-heading" className="text-base font-semibold uppercase tracking-wide text-ink">
          Deliverables
        </h2>
        <p className="text-sm text-muted">
          {linked} of {anchors.length} linked. Paste each final link here as you produce it.
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {anchors.map((anchor) => (
          <AnchorCard key={anchor.id} anchor={anchor} onSave={(url) => onSave(anchor.id, url)} />
        ))}
      </ul>
    </section>
  );
}
