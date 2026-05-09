import { cn } from '../lib/cn';

interface LinkItem {
  id: string;
  name: string;
  url: string;
}

interface QuickLinksProps {
  links?: LinkItem[];
}

export default function QuickLinks({ links = [] }: QuickLinksProps) {
  const getFaviconUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      // Use Google's favicon service as a universal cross-browser solution
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`;
    } catch {
      return null;
    }
  };

  return (
    <div className="grid grid-cols-4 md:grid-cols-7 gap-6 mt-12 p-10 bg-ctp-surface0/10 backdrop-blur-xl border border-ctp-surface1/30 shadow-2xl transition-all duration-500 hover:bg-ctp-surface0/20 w-full mx-auto items-center justify-center rounded-[2rem]">
      {links.map((app) => (
        <a
          key={app.id || app.name}
          href={app.url}
          className={cn(
            "group flex flex-col items-center justify-center p-6 rounded-3xl",
            "bg-ctp-surface0/20 backdrop-blur-md border border-ctp-surface1/40",
            "transition-all duration-500 hover:bg-ctp-surface0/40 hover:scale-110 hover:shadow-2xl hover:border-ctp-mauve/50",
          )}
          title={app.name}
        >
          <div className="size-12 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(203,166,247,0.4)]">
              <img 
                src={getFaviconUrl(app.url) || ''} 
                alt=""
                className="w-full h-full object-contain"
                onError={(event) => {
                  event.currentTarget.src = 'https://www.google.com/s2/favicons?domain=example.com&sz=64'; // generic fallback
                }}
              />
          </div>
          <span className="text-[10px] font-bold mt-3 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-[0.2em] text-ctp-subtext0 truncate max-w-[100px] text-center">
            {app.name}
          </span>
        </a>
      ))}
    </div>
  );
}
