<<<<<<< HEAD
import { cn } from '../lib/cn';
import { Folder } from 'lucide-react';
import { memo } from 'react';
import { getFallbackFaviconUrl, getFaviconUrl } from '../lib/favicon';
import { ICON_MAP } from '../lib/quicklinks';
=======
import { cn } from "../lib/cn";
import { Folder } from "lucide-react";
import { memo } from "react";
import { getFallbackFaviconUrl, getFaviconUrl } from "../lib/favicon";
import { ICON_MAP } from "../lib/quicklinks";
>>>>>>> master

interface LinkItem {
  id: string;
  name: string;
  url?: string;
  isFolder?: boolean;
  iconId?: string;
}

interface QuickLinksProps {
  links?: LinkItem[];
  onFolderClick?: (id: string) => void;
}

<<<<<<< HEAD
const QuickLinks = memo(function QuickLinks({ links = [], onFolderClick }: QuickLinksProps) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 gap-5 p-10 bg-ctp-surface0/10 backdrop-blur-xl border border-ctp-surface1/30 shadow-2xl transition-all duration-500 hover:bg-ctp-surface0/20 w-full mx-auto items-center justify-center ">
=======
const QuickLinks = memo(function QuickLinks({
  links = [],
  onFolderClick,
}: QuickLinksProps) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-5 gap-5 p-10 w-full mx-auto items-center justify-center ">
>>>>>>> master
      {links.map((app) => {
        const IconComponent = app.iconId ? ICON_MAP[app.iconId] : null;

        return app.isFolder ? (
          <button
            key={app.id}
            onClick={() => onFolderClick?.(app.id)}
            className={cn(
<<<<<<< HEAD
              "group flex flex-col items-center justify-center p-6  w-full",
=======
              "group flex flex-col items-center justify-center p-6  size-30",
>>>>>>> master
              "bg-ctp-surface0/20 backdrop-blur-md border border-ctp-surface1/40",
              "transition-all duration-500 hover:bg-ctp-surface0/40 hover:scale-110 hover:shadow-2xl hover:border-ctp-mauve/50",
            )}
            title={app.name}
          >
            <div className="size-12 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(203,166,247,0.4)] text-ctp-mauve">
              <Folder className="w-10 h-10" />
            </div>
            <span className="text-[10px] font-bold mt-3  uppercase tracking-[0.2em] text-ctp-subtext0 truncate max-w-25 text-center">
              {app.name}
            </span>
          </button>
        ) : (
          <a
            key={app.id || app.name}
            href={app.url}
            className={cn(
              "group flex flex-col items-center justify-center p-6 ",
              "bg-ctp-surface0/20 backdrop-blur-md border border-ctp-surface1/40",
              "transition-all duration-500 hover:bg-ctp-surface0/40 hover:scale-110 hover:shadow-2xl hover:border-ctp-mauve/50",
            )}
            title={app.name}
          >
            <div className="size-12 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(203,166,247,0.4)]">
              {IconComponent ? (
                <IconComponent className="w-full h-full" />
              ) : (
                <img
<<<<<<< HEAD
                  src={getFaviconUrl(app.url ?? '')}
                  alt=""
                  className="w-full h-full object-contain"
                  onError={(event) => {
                    event.currentTarget.src = getFallbackFaviconUrl(app.url ?? '');
=======
                  src={getFaviconUrl(app.url ?? "")}
                  alt=""
                  className="w-full h-full object-contain"
                  onError={(event) => {
                    event.currentTarget.src = getFallbackFaviconUrl(
                      app.url ?? "",
                    );
>>>>>>> master
                  }}
                />
              )}
            </div>
            <span className="text-[10px] font-bold mt-3  transition-opacity uppercase tracking-[0.2em] text-ctp-subtext0 truncate max-w-25 text-center">
              {app.name}
            </span>
          </a>
        );
      })}
    </div>
  );
});

export default QuickLinks;
