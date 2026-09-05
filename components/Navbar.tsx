<<<<<<< HEAD
import { GitHubDark } from '@ridemountainpig/svgl-react';
=======
>>>>>>> master
import { Settings} from 'lucide-react';
import { cn } from '../lib/cn';
import { memo } from 'react';
import Box from './Box';
<<<<<<< HEAD
=======
import { ICON_MAP } from '../lib/quicklinks';
import type { LinkItem } from '../lib/quicklinks';
import { getFaviconUrl, getFallbackFaviconUrl } from '../lib/favicon';
>>>>>>> master

interface NavbarProps {
  className?: string;
  onSettingsClick?: () => void;
  onHomeClick?: () => void;
<<<<<<< HEAD
=======
  quickLinks?: LinkItem[];
>>>>>>> master
}

const Navbar = memo(function Navbar({
  className,
  onSettingsClick,
  onHomeClick,
<<<<<<< HEAD
=======
  quickLinks = [],
>>>>>>> master
}: Readonly<NavbarProps>) {
  return (
    <nav
      className={cn(
<<<<<<< HEAD
        "fixed top-0 left-0 w-full h-16 z-50 px-8 flex items-center justify-between",
        "bg-ctp-mantle/30 backdrop-blur-xl border-b border-ctp-surface1/30",
=======
        "fixed top-0 left-0 w-full h-16 z-50 px-8 flex items-center justify-between g-ctp-mantle/30 backdrop-blur-xl ",
>>>>>>> master
        className,
      )}
    >
      <Box className="flex items-center justify-between w-full">
<<<<<<< HEAD
      <div className="flex items-center space-x-6 group cursor-default max-w-[85%] overflow-x-auto custom-scrollbar">
        <button
          onClick={onHomeClick}
          className="flex items-center space-x-3 group/brand transition-all hover:opacity-80 shrink-0"
        >
          <div className="size-10 p-1.5  bg-ctp-mauve/20 border border-ctp-mauve/30 text-ctp-mauve group-hover/brand:bg-ctp-mauve group-hover/brand:text-ctp-base transition-all duration-500">
            <img src="favicon.svg" alt="start page logo" className="w-full h-full" />
          </div>

        </button>
      </div>

      <div className="flex items-center space-x-6 shrink-0">
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
=======
        <div className="flex items-center space-x-6 group cursor-default max-w-[85%] overflow-x-auto custom-scrollbar">
          <button
            onClick={onHomeClick}
            className="flex items-center space-x-3 group/brand transition-all hover:opacity-80 shrink-0"
          >
            <div className="size-10 p-1.5  bg-ctp-mauve/20 border border-ctp-mauve/30 text-ctp-mauve group-hover/brand:bg-ctp-mauve group-hover/brand:text-ctp-base transition-all duration-500">
              <img
                src="favicon.svg"
                alt="start page logo"
                className="w-full h-full"
              />
            </div>
          </button>
        </div>

        <div className="flex items-center space-x-6 shrink-0">
          {quickLinks.map((link) => {
            const Icon = link.iconId ? ICON_MAP[link.iconId] : null;
            return (
              <a
                key={link.id}
                href={link.url}
                rel="noreferrer noopener"
                className={cn(
                  "flex items-center space-x-2 px-2 py-1 rounded transition-colors text-ctp-subtext0 hover:text-ctp-mauve hover:bg-ctp-surface0/10",
                )}
                title={link.name}
              >
                <div className="w-5 h-5 shrink-0">
                  {Icon ? (
                    <Icon className="w-full h-full" />
                  ) : (
                    <img
                      src={getFaviconUrl(link.url ?? "")}
                      onError={(e) =>
                        (e.currentTarget.src = getFallbackFaviconUrl(
                          link.url ?? "",
                        ))
                      }
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <span className="hidden lg:inline text-sm font-medium">
                  {link.name}
                </span>
              </a>
            );
          })}
          <button
            onClick={onSettingsClick}
            className="text-ctp-subtext0 hover:text-ctp-blue transition-colors duration-300"
            title="Settings"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
>>>>>>> master
      </Box>
    </nav>
  );
});

export default Navbar;
