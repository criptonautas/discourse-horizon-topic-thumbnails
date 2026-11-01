// `thumbnails` is Discourse's topic.thumbnails array. Index 0 is the original
// upload; the rest are the sizes declared in about.json.
//
// The generated sizes go in a srcset, so a list doesn't download every original
// upload. The original stays as the largest candidate, for screens that need more
// pixels, and as the src while the resizes are still being generated. The sizes
// have to be declared in about.json or Discourse doesn't serialize
// `topic.thumbnails` at all.
export function pickThumbnail(thumbnails) {
  const original = thumbnails?.[0];

  if (!original?.url) {
    return null;
  }

  const byWidth = new Map(
    thumbnails
      .filter((thumbnail) => thumbnail?.url && thumbnail.width)
      .sort((a, b) => a.width - b.width)
      .map((thumbnail) => [thumbnail.width, thumbnail.url])
  );

  return {
    src: original.url,
    // A single candidate gives the browser no choice, so leave it to `src`.
    srcset:
      byWidth.size > 1
        ? [...byWidth].map(([width, url]) => `${url} ${width}w`).join(", ")
        : null,
    width: original.width,
    height: original.height,
  };
}

// Theme list settings arrive as a "1|2|3" string.
export function parseCategoryIds(value) {
  return (value ?? "")
    .split("|")
    .filter(Boolean)
    .map((id) => parseInt(id, 10));
}

// List-level scoping, same semantics as the official Topic List Thumbnails
// component: an empty allow-list means every list, otherwise only lists being
// viewed *within* one of the chosen categories. Subcategories are not implied.
export function enabledForCategory(categoryId, allowed) {
  if (!allowed.length) {
    return true;
  }
  return allowed.includes(categoryId);
}
