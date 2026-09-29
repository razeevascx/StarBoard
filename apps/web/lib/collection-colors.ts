export const COLLECTION_COLORS = [
  { name: "Mauve", value: "#cba6f7" },
  { name: "Blue", value: "#89b4fa" },
  { name: "Green", value: "#a6e3a1" },
  { name: "Peach", value: "#fab387" },
] as const;

export function validCollectionColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}

export function collectionColor(id: string, saved: string | null) {
  if (saved && validCollectionColor(saved)) return saved;
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return COLLECTION_COLORS[Math.abs(hash) % COLLECTION_COLORS.length]!.value;
}
