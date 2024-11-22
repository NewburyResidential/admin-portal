
export function highlightText(text, highlight) {
  if (!highlight) return text;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return parts.map((part, i) => (
    <span
      key={i}
      style={{
        fontWeight: part.toLowerCase() === highlight.toLowerCase() ? 800 : 400,
      }}
    >
      {part}
    </span>
  ));
}