import { GitHubDark } from '@ridemountainpig/svgl-react';
import { Settings, LayoutGrid, Bookmark } from 'lucide-react';
import { cn } from '../lib/cn';

interface BookmarkItem {
  id: string;
  title: string;
  url?: string;
}

interface NavbarProps {
  className?: string;
  onSettingsClick?: () => void;
  showBookmarks?: boolean;
  syncBrowserBookmarks?: boolean;
  browserBookmarks?: BookmarkItem[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const CATEGORIES = ['General', 'Dev', 'Social', 'Media'];

export default function Navbar({ 
  className, 
  onSettingsClick, 
  showBookmarks, 
  syncBrowserBookmarks,
  browserBookmarks = [],
  activeCategory, 
  onCategoryChange 
}: Readonly<NavbarProps>) {
  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full h-16 z-50 px-8 flex items-center justify-between",
      "bg-ctp-mantle/30 backdrop-blur-xl border-b border-ctp-surface1/30",
      className
    )}>
      <div className="flex items-center space-x-8 group cursor-default">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 p-1.5 rounded-lg bg-ctp-mauve/20 border border-ctp-mauve/30 text-ctp-mauve group-hover:bg-ctp-mauve group-hover:text-ctp-base transition-all duration-500">
            <LayoutGrid className="w-full h-full " />
          </div>
          <span className="font-black tracking-tighter text-lg text-ctp-text opacity-80 group-hover:opacity-100 transition-opacity uppercase">
            New Tab
          </span>
        </div>

        {showBookmarks && (
          <div className="flex items-center space-x-1 bg-ctp-surface0/30 p-1 rounded-xl border border-ctp-surface1/20">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange?.(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  activeCategory === cat
                    ? "bg-ctp-mauve text-ctp-base shadow-lg"
                    : "text-ctp-subtext0 hover:bg-ctp-surface0 hover:text-ctp-text"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {syncBrowserBookmarks && browserBookmarks.length > 0 && (
          <div className="flex items-center space-x-4 ml-4 px-4 border-l border-ctp-surface1/30 max-w-md overflow-hidden">
            {browserBookmarks.slice(0, 5).map((bm) => (
              <a
                key={bm.id}
                href={bm.url}
                className="flex items-center space-x-2 text-[10px] font-bold text-ctp-subtext0 hover:text-ctp-mauve transition-all truncate"
                title={bm.title}
              >
                <Bookmark className="w-3 h-3" />
                <span className="truncate max-w-[80px]">{bm.title}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ctp-subtext0 hover:text-ctp-mauve transition-colors duration-300"
          title="GitHub"
        >
          <GitHubDark className="w-6 h-6 fill-current" />
        </a>
        <button
          onClick={onSettingsClick}
          className="text-ctp-subtext0 hover:text-ctp-blue transition-colors duration-300"
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>

      </div>
    </nav>
  );
}
