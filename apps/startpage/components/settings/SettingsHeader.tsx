import { X } from 'lucide-react';
import { TabsList, TabsTrigger } from '../hangry-ui/components/tabs';

export type Tab = 'general' | 'links' | 'account' | 'about';

type SettingsHeaderProps = Readonly<{
  onClose: () => void;
}>;

const TAB_LABELS: Readonly<Record<Tab, string>> = {
  general: 'General',
  links: 'Quick Links',
  account: 'Account',
  about: 'About',
};

export default function SettingsHeader({ onClose }: SettingsHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-black text-ctp-text uppercase tracking-tighter">Settings</h2>
        <TabsList aria-label="Settings sections" className="max-w-full justify-start overflow-x-auto">
          {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
            <TabsTrigger key={tab} value={tab} className="shrink-0 flex-none px-3 py-1.5 text-[10px] font-black uppercase tracking-widest">
              {TAB_LABELS[tab]}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <button
        onClick={onClose}
        aria-label="Close settings"
        className="rounded-md p-2 hover:bg-ctp-surface0 transition-colors text-ctp-subtext0 hover:text-ctp-red shrink-0"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}
