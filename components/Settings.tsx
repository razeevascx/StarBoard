import { useState, type FormEvent, memo } from "react";

import type { AppConfig } from "../src/types";
import SettingsHeader from "./settings/SettingsHeader";
import GeneralSettingsPanel from "./settings/GeneralSettingsPanel";
import QuickLinksSettingsPanel from "./settings/QuickLinksSettingsPanel";
import About from "./settings/About";

interface LinkItem {
  id: string;
  name: string;
  url: string;
}

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  updateConfig: (
    key: keyof AppConfig,
    value: AppConfig[keyof AppConfig],
  ) => void;
  hasPermission: {
    bookmarks: boolean;
  };
  onTogglePermission: (perm: "bookmarks", enabled: boolean) => void;
  quickLinks: LinkItem[];
  onAddQuickLink: (name: string, url: string) => void;
  onRemoveQuickLink: (id: string) => void;
  onUpdateQuickLink: (id: string, name: string, url: string) => void;
}

const Settings = memo(function Settings({
  isOpen,
  onClose,
  config,
  updateConfig,
  hasPermission,
  onTogglePermission,
  quickLinks,
  onAddQuickLink,
  onRemoveQuickLink,
  onUpdateQuickLink,
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState<"general" | "links" | "about">(
    "general",
  );
  const [newLink, setNewLink] = useState({ name: "", url: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", url: "" });

  if (!isOpen) return null;

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newLink.name || !newLink.url) return;

    onAddQuickLink(newLink.name, newLink.url);
    setNewLink({ name: "", url: "" });
  };

  const startEditing = (link: LinkItem) => {
    setEditingId(link.id);
    setEditForm({ name: link.name, url: link.url });
  };

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    if (!editingId || !editForm.name || !editForm.url) return;

    onUpdateQuickLink(editingId, editForm.name, editForm.url);
    setEditingId(null);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "general":
        return (
          <GeneralSettingsPanel
            config={config}
            hasPermission={hasPermission}
            onToggleConfig={updateConfig}
            onTogglePermission={onTogglePermission}
          />
        );
      case "about":
        return <About />;
      case "links":
        return (
          <QuickLinksSettingsPanel
            quickLinks={quickLinks}
            newLink={newLink}
            onNewLinkChange={setNewLink}
            onAdd={handleAdd}
            editingId={editingId}
            editForm={editForm}
            onEditFormChange={setEditForm}
            onStartEditing={startEditing}
            onUpdate={handleUpdate}
            onCancelEditing={() => setEditingId(null)}
            onRemoveQuickLink={onRemoveQuickLink}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close Settings"
        className="absolute inset-0 bg-ctp-crust/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-ctp-mantle/80 backdrop-blur-2xl border border-ctp-surface1/50 shadow-2xl p-8 flex flex-col max-h-[85vh] animate-in zoom-in-95 fade-in duration-300">
        <SettingsHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
});

export default Settings;
