/** Deliverable anchors (M11): four pinned link slots per project. */

// The four slots, in render order. Use these IDs everywhere.
export const ANCHOR_SLOTS = [
  { id: 'presentation', label: 'Presentation' },
  { id: 'demo', label: 'Demo' },
  { id: 'report', label: 'Report' },
  { id: 'documentation', label: 'Documentation' },
];

/** All four anchors for a project, in slot order, with `url: null` for any never saved. */
export function projectAnchors(anchors, projectId) {
  return ANCHOR_SLOTS.map((slot) => {
    const saved = anchors.find((a) => a.projectId === projectId && a.id === slot.id);
    return { ...slot, projectId, url: saved?.url ?? null };
  });
}

/** Set (or clear, with `null`) one anchor's link, adding the anchor if it isn't stored yet. */
export function setAnchorUrl(anchors, projectId, id, url) {
  const exists = anchors.some((a) => a.projectId === projectId && a.id === id);
  if (!exists) {
    const slot = ANCHOR_SLOTS.find((s) => s.id === id);
    return [...anchors, { id, projectId, label: slot.label, url }];
  }
  return anchors.map((a) => (a.projectId === projectId && a.id === id ? { ...a, url } : a));
}

const INVALID = 'Enter a full link, like https://example.com.';

/**
 * Check what someone typed is a web link. Returns { url } (normalised) or
 * { error } with a message to show under the field. A missing scheme is
 * filled in ("docs.google.com/…" → "https://docs.google.com/…"); only http(s)
 * links are accepted, so a stored link is always safe to use as an href.
 */
export function parseLink(input) {
  const text = input.trim();
  if (!text) return { error: 'Paste a link first.' };
  if (/\s/.test(text)) return { error: INVALID };

  const hasScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(text);
  // "mailto:…", "javascript:…" etc. (but not "example.com:8080", a host and port).
  if (!hasScheme && /^[a-z][a-z\d+.-]*:(?!\d)/i.test(text)) return { error: INVALID };
  let url;
  try {
    url = new URL(hasScheme ? text : `https://${text}`);
  } catch {
    return { error: INVALID };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return { error: INVALID };
  // A real site name has a dot in it ("example.com"), which rules out "hello" → https://hello/.
  if (!url.hostname.includes('.') || url.hostname.startsWith('.') || url.hostname.endsWith('.')) {
    return { error: INVALID };
  }
  return { url: url.href };
}

/** A short form of a link for display: no scheme, no "www.", no trailing slash. */
export function displayLink(url) {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
}
