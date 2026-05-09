import { X, Plus, Trash2, Globe } from 'lucide-react';
import { cn } from '../lib/cn';
import { useState, type FormEvent } from 'react';

interface LinkItem {
  id: string;
  name: string;
  url: string;
}

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  config: {
    showClock: boolean;
    showCalendar: boolean;
    showGreeting: boolean;
    showBookmarks: boolean;
    syncBrowserBookmarks: boolean;
  };
  updateConfig: (key: string, value: boolean) => void;
  customLinks: Record<string, LinkItem[]>;
  onAddLink: (category: string, name: string, url: string) => void;
  onRemoveLink: (category: string, id: string) => void;
}

const CATEGORIES = ['General', 'Dev', 'Social', 'Media'];

export default function Settings({ 
  isOpen, 
  onClose, 
  config, 
  updateConfig,
  customLinks,
  onAddLink,
  onRemoveLink
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'links'>('general');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [newLink, setNewLink] = useState({ name: '', url: '' });

  if (!isOpen) return null;

  const handleAddLink = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newLink.name && newLink.url) {
      onAddLink(selectedCategory, newLink.name, newLink.url);
      setNewLink({ name: '', url: '' });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ctp-crust/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-2xl bg-ctp-mantle/80 backdrop-blur-2xl rounded-[2.5rem] border border-ctp-surface1/50 shadow-2xl p-8 flex flex-col max-h-[85vh]",
        "animate-in zoom-in-95 fade-in duration-300"
      )}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-black text-ctp-text uppercase tracking-tighter">Settings</h2>
            <div className="flex bg-ctp-surface0/50 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('general')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === 'general' ? "bg-ctp-mauve text-ctp-base" : "text-ctp-subtext0 hover:text-ctp-text"
                )}
              >
                General
              </button>
              <button 
                onClick={() => setActiveTab('links')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === 'links' ? "bg-ctp-mauve text-ctp-base" : "text-ctp-subtext0 hover:text-ctp-text"
                )}
              >
                Links
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-ctp-surface0 transition-colors text-ctp-subtext0 hover:text-ctp-red"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
          {activeTab === 'general' ? (
            <div className="space-y-6">
              <section>
                <h3 className="text-[10px] font-bold text-ctp-overlay1 uppercase tracking-[0.2em] mb-4">Toggle Components</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(config).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => updateConfig(key, !value)}
                      className="flex items-center justify-between p-4 rounded-2xl bg-ctp-surface0/30 border border-ctp-surface1/30 hover:bg-ctp-surface0/50 transition-all group"
                    >
                      <span className="text-xs font-bold text-ctp-subtext1 group-hover:text-ctp-text capitalize">
                        {key.replace('show', '').replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className={cn(
                        "w-8 h-5 rounded-full transition-colors flex items-center px-1",
                        value ? "bg-ctp-mauve" : "bg-ctp-surface1"
                      )}>
                        <div className={cn(
                          "w-3 h-3 rounded-full bg-ctp-base shadow-sm transition-transform",
                          value ? "translate-x-3" : "translate-x-0"
                        )} />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {config.syncBrowserBookmarks && (
                <section className="pt-4 border-t border-ctp-surface1/30">
                  <h3 className="text-[10px] font-bold text-ctp-overlay1 uppercase tracking-[0.2em] mb-4">Chrome Bookmarks</h3>
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium leading-relaxed">
                    Browser bookmarks are fetched directly from your Chrome profile. This extension does not store your browser data.
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <section>
                <h3 className="text-[10px] font-bold text-ctp-overlay1 uppercase tracking-[0.2em] mb-4">Manage Quick Links</h3>
                <div className="flex space-x-2 mb-6 p-1 bg-ctp-surface0/50 rounded-xl">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        selectedCategory === cat ? "bg-ctp-surface1 text-ctp-text shadow-sm" : "text-ctp-overlay1 hover:text-ctp-subtext1"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleAddLink} className="flex gap-2 mb-6">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    value={newLink.name}
                    onChange={e => setNewLink(prev => ({ ...prev, name: e.target.value }))}
                    className="flex-[2] bg-ctp-surface0/30 border border-ctp-surface1/30 rounded-xl px-4 py-2 text-xs text-ctp-text focus:outline-none focus:border-ctp-mauve transition-all"
                  />
                  <input 
                    type="text" 
                    placeholder="URL (https://...)" 
                    value={newLink.url}
                    onChange={e => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                    className="flex-[3] bg-ctp-surface0/30 border border-ctp-surface1/30 rounded-xl px-4 py-2 text-xs text-ctp-text focus:outline-none focus:border-ctp-mauve transition-all"
                  />
                  <button 
                    type="submit"
                    className="p-2 bg-ctp-mauve text-ctp-base rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-ctp-mauve/20"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </form>

                <div className="grid grid-cols-1 gap-2">
                  {(customLinks[selectedCategory] || []).map(link => (
                    <div key={link.id} className="flex items-center justify-between p-3 rounded-xl bg-ctp-surface0/20 border border-ctp-surface1/20 group hover:border-ctp-surface1/50 transition-all">
                      <div className="flex items-center space-x-3 truncate">
                        <Globe className="w-4 h-4 text-ctp-overlay1" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-ctp-text truncate">{link.name}</p>
                          <p className="text-[10px] text-ctp-overlay1 truncate">{link.url}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => onRemoveLink(selectedCategory, link.id)}
                        className="p-1.5 text-ctp-overlay1 hover:text-ctp-red transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(customLinks[selectedCategory] || []).length === 0 && (
                    <p className="text-center py-8 text-[10px] text-ctp-overlay1 uppercase tracking-widest font-bold">No links in this category</p>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-4 rounded-2xl bg-ctp-mauve text-ctp-base font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-ctp-mauve/20"
        >
          Close Settings
        </button>
      </div>
    </div>
  );
}
