export const SEARCH_ENGINES = [
  { id: "google", name: "Google", url: "https://www.google.com/search?q=" },
  { id: "duckduckgo", name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  { id: "bing", name: "Bing", url: "https://www.bing.com/search?q=" },
  { id: "brave", name: "Brave", url: "https://search.brave.com/search?q=" },
  { id: "ecosia", name: "Ecosia", url: "https://www.ecosia.org/search?q=" },
] as const;

export type SearchEngineId = (typeof SEARCH_ENGINES)[number]["id"];

export const DEFAULT_SEARCH_ENGINE = SEARCH_ENGINES[0];

export function buildSearchUrl(
  engineId: SearchEngineId,
  query: string,
): string {
  // Non-null assertion is safe: SearchEngineId is derived from SEARCH_ENGINES itself
const engine = SEARCH_ENGINES.find((entry) => entry.id === engineId);
  if (!engine) {
    throw new Error(`Search engine not found: ${engineId}`);
  }
  return `${engine.url}${encodeURIComponent(query)}`;
}
