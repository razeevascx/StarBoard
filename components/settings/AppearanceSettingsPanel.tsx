import { Palette, Image as ImageIcon, Upload, Plus } from 'lucide-react';
import type { AppConfig } from '../../src/types';
import { cn } from '../../lib/cn';
import type { ChangeEvent, RefObject } from 'react';

type AppearanceSettingsPanelProps = Readonly<{
  config: AppConfig;
  fileInputRef: RefObject<HTMLInputElement | null>;
  tempBgUrl: string;
  onTempBgUrlChange: (value: string) => void;
  onUploadClick: () => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onApplyUrl: () => void;
  onSetSolidColor: (color: string) => void;
  onResetGradient: () => void;
}>;

const SOLID_COLORS = ['#1e1e2e', '#11111b', '#181825', '#313244', '#45475a', '#f5c2e7', '#cba6f7', '#f38ba8', '#fab387', '#a6e3a1', '#94e2d5', '#89dceb', '#89b4fa', '#b4befe'];

export default function AppearanceSettingsPanel({
  config,
  fileInputRef,
  tempBgUrl,
  onTempBgUrlChange,
  onUploadClick,
  onFileChange,
  onApplyUrl,
  onSetSolidColor,
  onResetGradient,
}: AppearanceSettingsPanelProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <section>
        <h3 className="text-[10px] font-bold text-ctp-overlay1 uppercase tracking-[0.2em] mb-4">Background Style</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={onResetGradient}
              className={cn(
                "flex-1 py-3 text-[10px] font-black uppercase tracking-widest border transition-all",
                config.bgType === 'gradient' ? "bg-ctp-mauve text-ctp-base border-ctp-mauve" : "bg-ctp-surface0/30 border-ctp-surface1/30 text-ctp-subtext1 hover:bg-ctp-surface0/50",
              )}
            >
              Default Gradient
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Palette className="w-3 h-3 text-ctp-mauve" />
              <span className="text-[10px] font-bold text-ctp-subtext0 uppercase tracking-wider">Solid Colors</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SOLID_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => onSetSolidColor(color)}
                  className={cn(
                    "w-8 h-8 border-2 transition-all hover:scale-110",
                    config.bgType === 'solid' && config.bgValue === color ? "border-ctp-mauve scale-110" : "border-transparent",
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              <div className="relative w-8 h-8 border-2 border-dashed border-ctp-surface2 hover:border-ctp-mauve transition-all flex items-center justify-center cursor-pointer overflow-hidden">
                <input
                  type="color"
                  className="absolute inset-0 opacity-0 cursor-pointer scale-150"
                  onChange={(e) => onSetSolidColor(e.target.value)}
                />
                <Plus className="w-4 h-4 text-ctp-overlay1" />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-ctp-surface1/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-3 h-3 text-ctp-mauve" />
                <span className="text-[10px] font-bold text-ctp-subtext0 uppercase tracking-wider">Background Image</span>
              </div>

              <button
                onClick={onUploadClick}
                className="flex items-center space-x-2 px-3 py-1.5 bg-ctp-surface0/50 hover:bg-ctp-mauve hover:text-ctp-base border border-ctp-surface1/30 transition-all text-[9px] font-black uppercase tracking-widest"
              >
                <Upload className="w-3 h-3" />
                <span>Upload File</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Or paste image URL (https://...)"
                value={tempBgUrl}
                onChange={(e) => onTempBgUrlChange(e.target.value)}
                className="flex-1 bg-ctp-surface0/30 border border-ctp-surface1/30 px-4 py-2 text-xs text-ctp-text focus:outline-none focus:border-ctp-mauve transition-all"
              />
              <button
                onClick={onApplyUrl}
                className="px-6 py-2 bg-ctp-mauve text-ctp-base font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-ctp-mauve/20"
              >
                Apply URL
              </button>
            </div>
            {config.bgType === 'image' && (
              <p className="text-[9px] text-ctp-overlay1 italic truncate">
                Current: {config.bgValue.startsWith('data:') ? 'Local Image (Base64)' : `${config.bgValue.substring(0, 50)}...`}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
