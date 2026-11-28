import { cn } from "../lib/cn";
import { Folder } from "lucide-react";
import { memo } from "react";
import { handleFaviconError, getFaviconUrl } from "../lib/favicon";
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
          : cn("grid w-full mx-auto items-center justify-center gap-2 rounded-xl p-2", cardGridColumns),
      )}
    >
      {links.map((app) => {
        const IconComponent = app.iconId ? ICON_MAP[app.iconId] : null;

        const className = cn(
          "group flex w-full min-w-0 items-center rounded-xl border-0 bg-(--card) p-4 leading-normal shadow-sm hover:bg-(--muted) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ctp-mauve motion-safe:transition-colors",
          "group-data-[custom-image=true]/page:bg-(--card)/60 group-data-[custom-image=true]/page:backdrop-blur-xl group-data-[custom-image=true]/page:hover:bg-(--muted)/70",
          isList ? "flex-row gap-4 text-left" : "min-h-36 flex-col justify-center gap-4",
        );
        const content = (
          <>
            <span
              aria-hidden="true"
              className={cn(
                "flex shrink-0 items-center justify-center motion-safe:transition-transform motion-safe:group-hover:scale-110",
                isList ? "size-8" : "size-14",
              )}
            >
              {app.isFolder ? (
                <Folder className={cn("text-ctp-mauve", isList ? "size-6" : "size-10")} />
              ) : IconComponent ? (
                <IconComponent className="size-full" />
              ) : (
                <img
                  src={getFaviconUrl(app.url ?? "")}
                  alt=""
                  className="size-full object-contain"
                  onError={handleFaviconError}
                />
              )}
            </span>
            <span
              title={app.name}
              className={cn(
                "min-w-0 max-w-full truncate font-bold tracking-widest text-ctp-subtext0",
                isList ? "text-xs" : "text-center text-[10px]",
              )}
            >
              {app.name}
            </span>
          </>
        );

        return app.isFolder ? (
          <button key={app.id} type="button" onClick={() => onFolderClick?.(app.id)} className={className}>
            {content}
          </button>
        ) : (
          <a key={app.id || app.name} href={app.url} className={className}>
            {content}
          </a>
        );
      })}
    </div>
  );
});

export default QuickLinks;
