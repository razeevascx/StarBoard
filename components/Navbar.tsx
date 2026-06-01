import { GitHubDark } from '@ridemountainpig/svgl-react';
import { Settings} from 'lucide-react';
import { cn } from '../lib/cn';
import { memo } from 'react';
import Box from './Box';

interface NavbarProps {
  className?: string;
  onSettingsClick?: () => void;
  onHomeClick?: () => void;
}

const Navbar = memo(function Navbar({
  className,
  onSettingsClick,
  onHomeClick,
}: Readonly<NavbarProps>) {
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full h-16 z-50 px-8 flex items-center justify-between",
        "bg-ctp-mantle/30 backdrop-blur-xl border-b border-ctp-surface1/30",
        className,
      )}
    >
      <Box className="flex items-center justify-between w-full">
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
      </Box>
    </nav>
  );
});

export default Navbar;
