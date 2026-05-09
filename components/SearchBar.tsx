import { useState } from 'react';
import { buildSearchUrl, SEARCH_ENGINES, type SearchEngineId } from '../lib/search';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [activeEngine, setActiveEngine] = useState<SearchEngineId>('google');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const searchUrl = buildSearchUrl(activeEngine, query);
    if (searchUrl) {
      globalThis.location.href = searchUrl;
    }
  };

  return (
    <div className="w-full px-4 py-8">
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search with intent..."
          autoFocus
          className="w-full py-5 px-8 pr-28 bg-ctp-mantle/50 backdrop-blur-xl border-2 border-ctp-surface1 text-ctp-text focus:outline-none focus:border-ctp-mauve focus:ring-4 focus:ring-ctp-mauve/20 transition-all shadow-2xl text-2xl placeholder-ctp-overlay0/50 font-medium"
        />
        <div className="absolute right-3 top-3 bottom-3 flex items-center space-x-1 bg-ctp-surface0/50  p-1 border border-ctp-surface1/50">
          {SEARCH_ENGINES.map((engine) => (
            <button
              key={engine.id}
              type="button"
              onClick={() => setActiveEngine(engine.id)}
              className={`p-4 text-sm font-bold transition-all duration-300 ${
                activeEngine === engine.id
                  ? 'bg-ctp-mauve text-ctp-base shadow-lg scale-105'
                  : 'text-ctp-subtext0 hover:bg-ctp-surface1 hover:text-ctp-text'
              }`}
            >
              {engine.name[0]}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
