import type { AppConfig } from '../../src/types';
import { cn } from '../../lib/cn';
import { getToggleLabel } from '../../lib/settings';
import { supportsBookmarks } from '../../lib/bookmark';
import { Grid2X2, List, PanelLeft, PanelTop } from 'lucide-react';
import { Card } from '../hangry-ui/components/card';

const optionCardClass = "max-w-none flex-row items-center justify-center gap-2 text-ctp-subtext1 aria-pressed:font-bold aria-pressed:text-ctp-base aria-pressed:[--surface-color:var(--color-ctp-mauve)] aria-pressed:[--surface-bottom:var(--color-ctp-mauve)]";

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
          {toggleEntries.map(([key, value]) => (
            <Card
              key={key}
              as="button"
              size="sm"
              aria-pressed={value}
              onClick={() => onToggleConfig(key, !value)}
              className="group max-w-none flex-row items-center justify-between gap-2"
            >
              <span className="text-left text-xs font-bold capitalize text-ctp-subtext1 group-hover:text-ctp-text">
                {getToggleLabel(key)}
              </span>
              <span aria-hidden="true" className={cn("flex h-5 w-8 shrink-0 items-center rounded-md px-1 transition-colors", value ? "bg-ctp-mauve" : "bg-ctp-surface1")}>
                <span className={cn("size-3 rounded-md bg-ctp-base shadow-sm transition-transform", value ? "translate-x-3" : "translate-x-0")} />
              </span>
            </Card>
          ))}
        </div>
      </section>

      <section className="pt-4 border-t border-ctp-surface1/30">
        <h3 className="text-[10px] font-bold text-ctp-overlay1 uppercase tracking-[0.2em] mb-4">Bookmark Layout</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'cards', label: 'Cards', Icon: Grid2X2 },
            { value: 'list', label: 'List', Icon: List },
          ].map(({ value, label, Icon }) => {
            const isActive = config.bookmarkLayout === value;

            return (
              <Card
                as="button"
                size="sm"
                key={value}
                onClick={() => onToggleConfig('bookmarkLayout', value as AppConfig['bookmarkLayout'])}
                aria-pressed={isActive}
                className={optionCardClass}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="pt-4 border-t border-ctp-surface1/30">
        <h3 className="text-[10px] font-bold text-ctp-overlay1 uppercase tracking-[0.2em] mb-4">Cards Per Row</h3>
        <div className="grid grid-cols-3 gap-3">
          {([2, 3, 4] as const).map((columns) => {
            const isActive = config.bookmarkColumns === columns;

            return (
              <Card
                as="button"
                size="sm"
                key={columns}
                onClick={() => onToggleConfig('bookmarkColumns', columns)}
                aria-pressed={isActive}
                className={optionCardClass}
              >
                <span className="text-xs font-bold">{columns}</span>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="pt-4 border-t border-ctp-surface1/30">
        <h3 className="text-[10px] font-bold text-ctp-overlay1 uppercase tracking-[0.2em] mb-4">Folder Navigation</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'bottom', label: 'Bottom Bar', Icon: PanelTop },
            { value: 'sidebar', label: 'Sidebar', Icon: PanelLeft },
          ].map(({ value, label, Icon }) => {
            const isActive = config.folderNavigation === value;

            return (
              <Card
                as="button"
                size="sm"
                key={value}
                onClick={() => onToggleConfig('folderNavigation', value as AppConfig['folderNavigation'])}
                aria-pressed={isActive}
                className={optionCardClass}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="pt-4 border-t border-ctp-surface1/30">
        <h3 className="text-[10px] font-bold text-ctp-overlay1 uppercase tracking-[0.2em] mb-4">Browser Permissions</h3>
        <div className="space-y-3">
          <Card size="sm" className={cn(
            "max-w-none flex-row items-center justify-between gap-3",
            !isBookmarkSupported && "opacity-50 grayscale cursor-not-allowed"
          )}>
            <div className="space-y-1">
              <span className="text-xs font-bold text-ctp-text">Browser Bookmarks</span>
              <p className="text-[10px] text-ctp-subtext0 uppercase tracking-wider">
                {isBookmarkSupported ? "Access your browser bookmarks" : "Not supported in this browser"}
              </p>
              {!hasPermission.bookmarks && config.showBookmarks && (
                <p className="text-[10px] text-ctp-subtext0">Using sample bookmarks because browser permission is not granted.</p>
              )}
            </div>
            {hasPermission.bookmarks ? (
              <button
                disabled={!isBookmarkSupported}
                onClick={() => onTogglePermission('bookmarks', false)}
                className="rounded-md px-4 py-2 bg-ctp-red/20 text-ctp-red text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-ctp-red/10 disabled:pointer-events-none"
              >
                Disable
              </button>
            ) : (
              <button
                disabled={!isBookmarkSupported}
                onClick={() => onTogglePermission('bookmarks', true)}
                className="rounded-md px-4 py-2 bg-ctp-mauve text-ctp-base text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-ctp-mauve/20 disabled:pointer-events-none"
              >
                Enable
              </button>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
