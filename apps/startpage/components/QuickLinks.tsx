import { cn } from "../lib/cn";
import { Folder } from "lucide-react";
import { memo } from "react";
import { handleFaviconError, getFaviconUrl } from "../lib/favicon";
import { ICON_MAP } from "../lib/quicklinks";
import { Card } from "./hangry-ui/components/card";

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

        const className = cn(
          "group min-w-0 max-w-none items-center leading-normal hover:[--surface-stroke-top:var(--color-ctp-mauve)]",
          isList ? "flex-row gap-4 text-left" : "min-h-30 justify-center gap-3",
        );
        const content = (
          <>
            <span
              aria-hidden="true"
              className={cn(
                "flex shrink-0 items-center justify-center motion-safe:transition-transform motion-safe:group-hover:scale-110",
                isList ? "size-8" : "size-12",
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
                "min-w-0 max-w-full truncate font-bold tracking-[0.1em] text-ctp-subtext0",
                isList ? "text-xs" : "text-center text-[10px]",
              )}
            >
              {app.name}
            </span>
          </>
        );

        return app.isFolder ? (
          <Card key={app.id} as="button" size="sm" onClick={() => onFolderClick?.(app.id)} className={className}>
            {content}
          </Card>
        ) : (
          <Card key={app.id || app.name} as="a" size="sm" href={app.url} className={className}>
            {content}
          </Card>
        );
      })}
    </div>
  );
});

export default QuickLinks;
