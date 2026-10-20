/**
 * Copy text to the clipboard exactly as given (line breaks, indentation and
 * all). Uses the async Clipboard API, falling back to a hidden textarea +
 * execCommand for browsers or non-secure pages without it. Throws on failure.
 */
export async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const ok = typeof document.execCommand === 'function' && document.execCommand('copy');
  textarea.remove();
  if (!ok) throw new Error('Copy is not supported in this browser.');
}
