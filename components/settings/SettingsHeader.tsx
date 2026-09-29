import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

export type Tab = 'general' | 'links' | 'account' | 'about';

type SettingsHeaderProps = Readonly<{
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onClose: () => void;
}>;

const TAB_LABELS: Readonly<Record<Tab, string>> = {
  general: 'General',
  links: 'Quick Links',
  account: 'Account',
  about: 'About',
};

export default function SettingsHeader({ activeTab, onTabChange, onClose }: SettingsHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-black text-ctp-text uppercase tracking-tighter">Settings</h2>
        <div className="flex max-w-full overflow-x-auto bg-ctp-surface0/50 p-1">
          {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === tab ? "bg-ctp-mauve text-ctp-base" : "text-ctp-subtext0 hover:text-ctp-text",
              )}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={onClose}
        aria-label="Close settings"
        className="p-2 hover:bg-ctp-surface0 transition-colors text-ctp-subtext0 hover:text-ctp-red shrink-0"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}
