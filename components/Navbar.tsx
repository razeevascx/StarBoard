import { GitHubDark } from '@ridemountainpig/svgl-react';
import { Settings, LayoutGrid } from 'lucide-react';
import { cn } from '../lib/cn';
import { memo } from 'react';

interface FolderItem {
  id: string;
  title: string;
}

interface NavbarProps {
  className?: string;
  onSettingsClick?: () => void;
  onHomeClick?: () => void;
  showBookmarks?: boolean;
  folders?: FolderItem[];
  activeFolderId?: string | null;
  onFolderSelect?: (id: string) => void;
}

const Navbar = memo(function Navbar({
  className,
  onSettingsClick,
  onHomeClick,
  showBookmarks,
  folders = [],
  activeFolderId,
  onFolderSelect
}: Readonly<NavbarProps>) {
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full h-16 z-50 px-8 flex items-center justify-between",
        "bg-ctp-mantle/30 backdrop-blur-xl border-b border-ctp-surface1/30",
        className,
      )}
    >
      <div className="flex items-center space-x-6 group cursor-default max-w-[85%] overflow-x-auto custom-scrollbar">
        <button
          onClick={onHomeClick}
          className="flex items-center space-x-3 group/brand transition-all hover:opacity-80 flex-shrink-0"
        >
          <div className="w-8 h-8 p-1.5 rounded-lg bg-ctp-mauve/20 border border-ctp-mauve/30 text-ctp-mauve group-hover/brand:bg-ctp-mauve group-hover/brand:text-ctp-base transition-all duration-500">
            <LayoutGrid className="w-full h-full " />
          </div>
          <span className="font-black tracking-tighter text-lg text-ctp-text opacity-80 group-hover/brand:opacity-100 transition-opacity uppercase">
            New Tab
          </span>
        </button>
      </div>

      <div className="flex items-center space-x-6 shrink-0">
        {showBookmarks && folders.length > 0 && (
          <div className="flex items-center space-x-3 animate-in fade-in slide-in-from-left-4 duration-500 shrink-0">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 ml-2">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => onFolderSelect?.(folder.id)}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-1.5  border transition-all group/folder whitespace-nowrap",
                      activeFolderId === folder.id
                        ? "bg-ctp-mauve text-ctp-base border-ctp-mauve shadow-lg shadow-ctp-mauve/20"
                        : "bg-ctp-surface0/20 border-ctp-surface1/10 text-ctp-subtext1 hover:bg-ctp-surface0/50 hover:text-ctp-text hover:border-ctp-surface1/30",
                    )}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {folder.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="h-4 w-px bg-ctp-surface1/50 mr-4" />

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
});

export default Navbar;
