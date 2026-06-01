import type { AppConfig } from '../../src/types';
import { cn } from '../../lib/cn';
import { getToggleLabel } from '../../lib/settings';
import { supportsBookmarks } from '../../lib/bookmark';

type GeneralSettingsPanelProps = Readonly<{
  config: AppConfig;
  hasPermission: {
    bookmarks: boolean;
  };
  onToggleConfig: (key: keyof AppConfig, value: AppConfig[keyof AppConfig]) => void;
  onTogglePermission: (perm: 'bookmarks', enabled: boolean) => void;
}>;

export default function GeneralSettingsPanel({
  config,
  hasPermission,
  onToggleConfig,
  onTogglePermission,
}: GeneralSettingsPanelProps) {
  const toggleEntries = Object.entries(config).filter(([key]) => key.startsWith('show')) as Array<
    [keyof AppConfig, boolean]
  >;

  const isBookmarkSupported = supportsBookmarks();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
      <section>
        <h3 className="text-[10px] font-bold text-ctp-overlay1 uppercase tracking-[0.2em] mb-4">Toggle Components</h3>
        <div className="grid grid-cols-2 gap-3">
          {toggleEntries.map(([key, value]) => {
            // Allow toggling `showBookmarks` even when browser bookmark API isn't available
            // (we show sample bookmarks in that case). Only keep other toggles enabled.
            const isDisabled = false;
            return (
              <button
                key={key}
                disabled={isDisabled}
                onClick={() => onToggleConfig(key, !value)}
                className={cn(
                  "flex items-center justify-between p-4 bg-ctp-surface0/30 border border-ctp-surface1/30 transition-all group",
                  isDisabled ? "opacity-50 cursor-not-allowed grayscale" : "hover:bg-ctp-surface0/50"
                )}
                title={isDisabled ? "Bookmarks are not supported in this browser" : undefined}
              >
                <span className="text-xs font-bold text-ctp-subtext1 group-hover:text-ctp-text capitalize">
                  {getToggleLabel(key)}
                </span>
                <div className={cn("w-8 h-5 transition-colors flex items-center px-1", value ? "bg-ctp-mauve" : "bg-ctp-surface1")}>
                  <div className={cn("w-3 h-3 bg-ctp-base shadow-sm transition-transform", value ? "translate-x-3" : "translate-x-0")} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="pt-4 border-t border-ctp-surface1/30">
        <h3 className="text-[10px] font-bold text-ctp-overlay1 uppercase tracking-[0.2em] mb-4">Browser Permissions</h3>
        <div className="space-y-3">
          <div className={cn(
            "flex items-center justify-between p-4 bg-ctp-surface0/30 border border-ctp-surface1/30",
            !isBookmarkSupported && "opacity-50 grayscale cursor-not-allowed"
          )}>
            <div className="space-y-1">
              <span className="text-xs font-bold text-ctp-text">Browser Bookmarks</span>
              <p className="text-[10px] text-ctp-subtext0 uppercase tracking-wider">
                {isBookmarkSupported ? "Access your Chrome bookmarks" : "Not supported in this browser"}
              </p>
              {!hasPermission.bookmarks && config.showBookmarks && (
                <p className="text-[10px] text-ctp-subtext0">Using sample bookmarks because browser permission is not granted.</p>
              )}
            </div>
            {hasPermission.bookmarks ? (
              <button
                disabled={!isBookmarkSupported}
                onClick={() => onTogglePermission('bookmarks', false)}
                className="px-4 py-2 bg-ctp-red/20 text-ctp-red text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-ctp-red/10 disabled:pointer-events-none"
              >
                Disable
              </button>
            ) : (
              <button
                disabled={!isBookmarkSupported}
                onClick={() => onTogglePermission('bookmarks', true)}
                className="px-4 py-2 bg-ctp-mauve text-ctp-base text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-ctp-mauve/20 disabled:pointer-events-none"
              >
                Enable
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
