/** Next readable ID for a prefix, e.g. 'member-4' when the highest existing one is 'member-3'. */
export function nextId(items, prefix) {
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  const max = items.reduce((highest, item) => {
    const match = pattern.exec(item.id);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return `${prefix}-${max + 1}`;
}
