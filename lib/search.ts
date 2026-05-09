export const SEARCH_ENGINES = [
  { id: "google", name: "Google", url: "https://www.google.com/search?q=" },
  { id: "duckduckgo", name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  { id: "bing", name: "Bing", url: "https://www.bing.com/search?q=" },
] as const;

export type SearchEngineId = (typeof SEARCH_ENGINES)[number]["id"];

export function buildSearchUrl(engineId: SearchEngineId, query: string) {
  const engine = SEARCH_ENGINES.find((entry) => entry.id === engineId);
  return engine ? `${engine.url}${encodeURIComponent(query)}` : null;
}
