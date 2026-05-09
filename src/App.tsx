import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Greeting from '../components/Greeting';
import Clock from '../components/Clock';
import Calendar from '../components/Calendar';
import SearchBar from '../components/SearchBar';
import QuickLinks from '../components/QuickLinks';

import Box from '../components/Box';
import Settings from '../components/Settings';

interface AppConfig {
  showClock: boolean;
  showCalendar: boolean;
  showGreeting: boolean;
  showBookmarks: boolean;
  syncBrowserBookmarks: boolean;
}

interface LinkItem {
  id: string;
  name: string;
  url: string;
}

const DEFAULT_CONFIG: AppConfig = {
  showClock: true,
  showCalendar: false,
  showGreeting: true,
  showBookmarks: true,
  syncBrowserBookmarks: false,
};

const INITIAL_LINKS: Record<string, LinkItem[]> = {
  General: [
    { id: '1', name: 'Gmail', url: 'https://mail.google.com' },
    { id: '2', name: 'ChatGPT', url: 'https://chat.openai.com' },
    { id: '3', name: 'Notion', url: 'https://notion.so' },
  ],
  Dev: [
    { id: '4', name: 'GitHub', url: 'https://github.com' },
    { id: '5', name: 'Vercel', url: 'https://vercel.com' },
    { id: '6', name: 'Tailwind', url: 'https://tailwindcss.com' },
    { id: '7', name: 'Figma', url: 'https://figma.com' },
  ],
  Social: [
    { id: '8', name: 'Reddit', url: 'https://reddit.com' },
    { id: '9', name: 'Twitter', url: 'https://twitter.com' },
    { id: '10', name: 'Instagram', url: 'https://instagram.com' },
    { id: '11', name: 'Discord', url: 'https://discord.com' },
    { id: '12', name: 'LinkedIn', url: 'https://linkedin.com' },
  ],
  Media: [
    { id: '13', name: 'YouTube', url: 'https://youtube.com' },
    { id: '14', name: 'Spotify', url: 'https://spotify.com' },
  ],
};

declare global {
  const browser: typeof chrome | undefined;
}

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('General');
  const [browserBookmarks, setBrowserBookmarks] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);
  const [customLinks, setCustomLinks] = useState<Record<string, LinkItem[]>>(() => {
    const saved = localStorage.getItem('startpage-links');
    return saved ? JSON.parse(saved) : INITIAL_LINKS;
  });
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('startpage-config');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
    return DEFAULT_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('startpage-config', JSON.stringify(config));
    localStorage.setItem('startpage-links', JSON.stringify(customLinks));
    
    const browserApi = typeof chrome !== 'undefined' ? chrome : (typeof browser !== 'undefined' ? browser : null);

    if (config.syncBrowserBookmarks && browserApi && browserApi.bookmarks) {
      browserApi.bookmarks.getTree((tree: chrome.bookmarks.BookmarkTreeNode[]) => {
        const bookmarksBar = tree[0]?.children?.find((child) => 
          child.title.toLowerCase().includes('bar') || child.id === '1' || child.title.toLowerCase().includes('bookmarks')
        );
        setBrowserBookmarks(bookmarksBar?.children || []);
      });
    }
  }, [config, customLinks]);

  const updateConfig = (key: string, value: boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const addLink = (category: string, name: string, url: string) => {
    const newLink = { id: crypto.randomUUID(), name, url };
    setCustomLinks(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), newLink]
    }));
  };

  const removeLink = (category: string, id: string) => {
    setCustomLinks((prev) => ({
      ...prev,
      [category]: prev[category].filter(l => l.id !== id)
    }));
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ctp-mantle via-ctp-base to-ctp-base text-ctp-text selection:bg-ctp-mauve/30 overflow-x-hidden pt-16">
      <Navbar 
        onSettingsClick={() => setIsSettingsOpen(true)} 
        showBookmarks={config.showBookmarks}
        syncBrowserBookmarks={config.syncBrowserBookmarks}
        browserBookmarks={browserBookmarks}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        updateConfig={updateConfig}
        customLinks={customLinks}
        onAddLink={addLink}
        onRemoveLink={removeLink}
      />

      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ctp-mauve/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-ctp-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <Box className="min-h-screen flex flex-col items-center justify-center p-8 relative z-10 space-y-10">
        {config.showGreeting && <Greeting />}

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full">
          {config.showClock && <Clock />}
          {config.showCalendar && <Calendar />}
        </div>

        <SearchBar />

        <QuickLinks links={customLinks[activeCategory] || []} />
      </Box>

      <footer className="fixed bottom-6 w-full text-center text-ctp-overlay0 text-[10px] font-bold tracking-[0.3em] uppercase opacity-30 hover:opacity-100 transition-opacity cursor-default">
        Engineered for Focus &bull; Catppuccin v1.0
      </footer>
    </main>
  );
}
