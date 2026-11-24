import { GitHubDark } from '@ridemountainpig/svgl-react';
import { PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react';
import { cn } from '../lib/cn';
import { memo } from 'react';
import Box from './Box';
import { ICON_MAP } from '../lib/quicklinks';
import type { LinkItem } from '../lib/quicklinks';
import { getFaviconUrl, handleFaviconError } from '../lib/favicon';

interface NavbarProps {
  className?: string;
  showSidebarToggle?: boolean;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  onSettingsClick?: () => void;
  onHomeClick?: () => void;
  quickLinks?: LinkItem[];
}

const Navbar = memo(function Navbar({
  className,
  showSidebarToggle,
  sidebarOpen,
  onSidebarToggle,
  onSettingsClick,
  onHomeClick,
  quickLinks = [],
}: Readonly<NavbarProps>) {
  return (
    <>
    <nav
      className={cn(
        "fixed top-0 left-0 w-full h-16 z-50 px-8 flex items-center justify-between bg-ctp-mantle/30 backdrop-blur-xl ",
        className,
      )}
    >
      <Box className="flex w-full items-center justify-between">
        <button
        id="bookmark-sidebar-toggle"
        type="button"
        onClick={showSidebarToggle ? onSidebarToggle : onHomeClick}
        aria-label={showSidebarToggle ? (sidebarOpen ? 'Close bookmark sidebar' : 'Open bookmark sidebar') : 'Starboard home'}
        aria-expanded={showSidebarToggle ? sidebarOpen : undefined}
        aria-controls={showSidebarToggle ? 'bookmark-sidebar' : undefined}
        title={showSidebarToggle ? (sidebarOpen ? 'Close bookmark sidebar' : 'Open bookmark sidebar') : 'Starboard home'}
        className="group/brand relative flex size-10 shrink-0 items-center justify-center rounded-md text-ctp-mauve hover:bg-ctp-surface0 focus-visible:outline-2 focus-visible:outline-ctp-mauve"
      >
        <img src="favicon.svg" alt="" className={cn('size-9', showSidebarToggle && 'group-hover/brand:opacity-0 group-focus-visible/brand:opacity-0')} />
        {showSidebarToggle && (sidebarOpen
          ? <PanelLeftClose aria-hidden="true" className="absolute size-5 opacity-0 group-hover/brand:opacity-100 group-focus-visible/brand:opacity-100" />
          : <PanelLeftOpen aria-hidden="true" className="absolute size-5 opacity-0 group-hover/brand:opacity-100 group-focus-visible/brand:opacity-100" />)}
      </button>
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
                      onError={handleFaviconError}
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
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer noopener"
            className="text-ctp-subtext0 hover:text-ctp-mauve transition-colors duration-300"
            title="GitHub"
            aria-label="Open GitHub"
          >
            <GitHubDark className="w-6 h-6 fill-current" />
          </a>
          <button
            onClick={onSettingsClick}
            className="text-ctp-subtext0 hover:text-ctp-blue transition-colors duration-300"
            title="Settings"
            aria-label="Open settings"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </Box>
    </nav>
    </>
  );
});

export default Navbar;
