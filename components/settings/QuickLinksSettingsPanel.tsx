import { Globe, Pencil, Trash2, Plus, X } from 'lucide-react';
import type { FormEvent } from 'react';

type LinkItem = {
  id: string;
  name: string;
  url: string;
};

type QuickLinksSettingsPanelProps = Readonly<{
  quickLinks: LinkItem[];
  newLink: { name: string; url: string };
  onNewLinkChange: (next: { name: string; url: string }) => void;
  onAdd: (e: FormEvent) => void;
  editingId: string | null;
  editForm: { name: string; url: string };
  onEditFormChange: (next: { name: string; url: string }) => void;
  onStartEditing: (link: LinkItem) => void;
  onUpdate: (e: FormEvent) => void;
  onCancelEditing: () => void;
  onRemoveQuickLink: (id: string) => void;
}>;

export default function QuickLinksSettingsPanel({
  quickLinks,
  newLink,
  onNewLinkChange,
  onAdd,
  editingId,
  editForm,
  onEditFormChange,
  onStartEditing,
  onUpdate,
  onCancelEditing,
  onRemoveQuickLink,
}: QuickLinksSettingsPanelProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <section>
        <h3 className="text-[10px] font-bold text-ctp-overlay1 uppercase tracking-[0.2em] mb-4">Manage Quick Links</h3>
        <form onSubmit={onAdd} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Name"
            value={newLink.name}
            onChange={(e) => onNewLinkChange({ ...newLink, name: e.target.value })}
            className="flex-[2] bg-ctp-surface0/30 border border-ctp-surface1/30 px-4 py-2 text-xs text-ctp-text focus:outline-none focus:border-ctp-mauve transition-all"
          />
          <input
            type="text"
            placeholder="URL (https://...)"
            value={newLink.url}
            onChange={(e) => onNewLinkChange({ ...newLink, url: e.target.value })}
            className="flex-[3] bg-ctp-surface0/30 border border-ctp-surface1/30 px-4 py-2 text-xs text-ctp-text focus:outline-none focus:border-ctp-mauve transition-all"
          />
          <button type="submit" className="p-2 bg-ctp-mauve text-ctp-base hover:scale-105 active:scale-95 transition-all shadow-lg shadow-ctp-mauve/20">
            <Plus className="w-5 h-5" />
          </button>
        </form>

        <div className="grid grid-cols-1 gap-2">
          {quickLinks.map((link) => (
            <div key={link.id} className="flex items-center justify-between p-3 bg-ctp-surface0/20 border border-ctp-surface1/20 group hover:border-ctp-surface1/50 transition-all">
              {editingId === link.id ? (
                <form onSubmit={onUpdate} className="flex flex-1 gap-2 items-center">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => onEditFormChange({ ...editForm, name: e.target.value })}
                    className="flex-[2] bg-ctp-surface0/50 border border-ctp-mauve/30 px-3 py-1 text-xs text-ctp-text focus:outline-none"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={editForm.url}
                    onChange={(e) => onEditFormChange({ ...editForm, url: e.target.value })}
                    className="flex-[3] bg-ctp-surface0/50 border border-ctp-mauve/30 px-3 py-1 text-xs text-ctp-text focus:outline-none"
                  />
                  <button type="submit" className="text-ctp-green hover:scale-110 transition-transform">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button onClick={onCancelEditing} className="text-ctp-red hover:scale-110 transition-transform">
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <>
                  <div className="flex items-center space-x-3 truncate">
                    <Globe className="w-4 h-4 text-ctp-overlay1" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-ctp-text truncate">{link.name}</p>
                      <p className="text-[10px] text-ctp-overlay1 truncate">{link.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onStartEditing(link)} className="p-1.5 text-ctp-overlay1 hover:text-ctp-blue transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onRemoveQuickLink(link.id)} className="p-1.5 text-ctp-overlay1 hover:text-ctp-red transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {quickLinks.length === 0 && (
            <p className="text-center py-8 text-[10px] text-ctp-overlay1 uppercase tracking-widest font-bold">
              No custom links added
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
