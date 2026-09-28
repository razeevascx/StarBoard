import { cn } from "../lib/cn";
import { Folder } from "lucide-react";
import { memo } from "react";
import { getFallbackFaviconUrl, getFaviconUrl } from "../lib/favicon";
import { ICON_MAP } from "../lib/quicklinks";

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
  layout?: "cards" | "list";
  columns?: 2 | 3 | 4;
}

const QuickLinks = memo(function QuickLinks({
  links = [],
  onFolderClick,
  layout = "cards",
  columns = 4,
}: QuickLinksProps) {
  const isList = layout === "list";
  const cardGridColumns = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns];

  return (
    <div
      className={cn(
        isList
          ? cn("grid w-full mx-auto items-start gap-2 p-6", cardGridColumns)
          : cn("grid w-full mx-auto items-center justify-center gap-5 p-10", cardGridColumns),
      )}
    >
      {links.map((app) => {
        const IconComponent = app.iconId ? ICON_MAP[app.iconId] : null;

        return app.isFolder ? (
          <button
            key={app.id}
            onClick={() => onFolderClick?.(app.id)}
            className={cn(
              isList
                ? "group flex items-center gap-4 px-4 py-5 text-left"
                : "group flex size-30 flex-col items-center justify-center p-6",
              "bg-ctp-surface0/20 backdrop-blur-md border border-ctp-surface1/40",
              "transition-all duration-500 hover:bg-ctp-surface0/40 hover:scale-110 hover:shadow-2xl hover:border-ctp-mauve/50",
            )}
            title={app.name}
          >
            <div className={cn("flex items-center justify-center text-ctp-mauve transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(203,166,247,0.4)]", isList ? "size-8" : "size-12")}>
              <Folder className={isList ? "size-6" : "w-10 h-10"} />
            </div>
            <span className={cn("font-bold tracking-[0.1em] text-ctp-subtext0 truncate", isList ? "text-xs" : "mt-3 max-w-25 text-center text-[10px]")}>
              {app.name}
            </span>
          </button>
        ) : (
          <a
            key={app.id || app.name}
            href={app.url}
            className={cn(
              isList
                ? "group flex items-center gap-4 px-4 py-5"
                : "group flex flex-col items-center justify-center p-6",
              "bg-ctp-surface0/20 backdrop-blur-md border border-ctp-surface1/40",
              "transition-all duration-500 hover:bg-ctp-surface0/40 hover:scale-110 hover:shadow-2xl hover:border-ctp-mauve/50",
            )}
            title={app.name}
          >
            <div className={cn("flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(203,166,247,0.4)]", isList ? "size-8" : "size-12")}>
              {IconComponent ? (
                <IconComponent className="w-full h-full" />
              ) : (
                <img
                  src={getFaviconUrl(app.url ?? "")}
                  alt=""
                  className="w-full h-full object-contain"
                  onError={(event) => {
                    event.currentTarget.src = getFallbackFaviconUrl(
                      app.url ?? "",
                    );
                  }}
                />
              )}
            </div>
            <span className={cn("font-bold tracking-[0.1em] text-ctp-subtext0 truncate", isList ? "text-xs" : "mt-3 max-w-25 text-center text-[10px]")}>
              {app.name}
            </span>
          </a>
        );
      })}
    </div>
  );
});

export default QuickLinks;
