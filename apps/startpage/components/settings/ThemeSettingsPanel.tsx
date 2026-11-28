import { useState } from 'react';
import { Ellipsis, Plus, Trash2 } from 'lucide-react';
import type { AppConfig } from '../../src/types';
import { applyImageBackground, readImageFile, saveConfig } from '../../lib/settings';
import { THEMES } from '../../lib/themes';

type ThemeSettingsPanelProps = {
  config: AppConfig;
  updateConfig: (key: keyof AppConfig, value: AppConfig[keyof AppConfig]) => void;
};

const controlClass = 'rounded-md border border-ctp-surface1 bg-ctp-base px-4 py-2 text-sm text-ctp-text focus-visible:outline-2 focus-visible:outline-ctp-mauve';

export default function ThemeSettingsPanel({ config, updateConfig }: ThemeSettingsPanelProps) {
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const customEnabled = config.customBackgroundEnabled;
  const blurPercent = Math.round(config.backgroundBlur / 32 * 100);

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-ctp-text">Themes</h3>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map((theme) => (
            <button
              key={theme.name}
              type="button"
              disabled={uploading}
              aria-pressed={!customEnabled && config.theme === theme.id}
              onClick={() => {
                updateConfig('theme', theme.id);
                updateConfig('customBackgroundEnabled', false);
              }}
              className={`${controlClass} flex flex-col gap-2 text-left aria-pressed:border-ctp-mauve aria-pressed:outline-2 aria-pressed:outline-ctp-mauve`}
            >
              <span aria-hidden="true" className="flex h-14 w-full items-center gap-2 rounded-sm px-3" style={{ background: theme.base }}>
                <span className="size-5 rounded-full" style={{ background: theme.accent }} />
                <span className="h-2 flex-1 rounded-full" style={{ background: theme.text }} />
              </span>
              {theme.name}
            </button>
          ))}
        </div>
      </section>
      <section className="space-y-3">
        <div id="custom-background-controls" className="space-y-3">
        <h3 className="text-sm font-bold text-ctp-text">Uploaded images</h3>
        <div className="grid grid-cols-3 gap-3">
        <label className="flex aspect-video min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-ctp-surface1 bg-ctp-base p-2 text-xs font-bold text-ctp-text hover:border-ctp-mauve hover:bg-ctp-surface0 focus-within:outline-2 focus-within:outline-ctp-mauve has-disabled:cursor-wait has-disabled:opacity-50">
        <Plus className="size-7 text-ctp-mauve" aria-hidden="true" />
        <span>{uploading ? 'Uploading image…' : 'Upload image'}</span>
        <input
          id="theme-image-upload"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          disabled={uploading}
          aria-describedby="theme-upload-status"
          className="sr-only"
          onChange={async (event) => {
            const files = Array.from(event.currentTarget.files ?? []);
            event.currentTarget.value = '';
            if (files.length === 0) return;
            setUploadError('');
            setUploading(true);
            try {
              const images = await Promise.all(files.map(readImageFile));
              const uploadedImages = [...new Set([...config.uploadedImages, ...images])];
              const image = images[images.length - 1];
              saveConfig({ ...config, uploadedImages, customBackgroundEnabled: true, bgType: 'image', bgValue: image });
              updateConfig('uploadedImages', uploadedImages);
              applyImageBackground(updateConfig, image);
            } catch (error) {
              setUploadError(error instanceof DOMException && error.name === 'QuotaExceededError'
                ? 'Not enough storage. Please choose a smaller image.'
                : error instanceof Error ? error.message : 'Unable to upload image.');
            } finally {
              setUploading(false);
            }
          }}
        />
        </label>
              {config.uploadedImages.map((image, index) => (
                <div
                  key={image}
                  className="relative min-w-0"
                  onContextMenu={(event) => {
                    if (uploading) return;
                    event.preventDefault();
                    const menu = event.currentTarget.querySelector('details');
                    if (menu) {
                      menu.open = true;
                      menu.querySelector('button')?.focus();
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'F10' && event.shiftKey) {
                      event.preventDefault();
                      const menu = event.currentTarget.querySelector('details');
                      if (menu && !uploading) {
                        menu.open = true;
                        menu.querySelector('button')?.focus();
                      }
                    }
                  }}
                >
                <button
                  type="button"
                  disabled={uploading}
                  aria-label={`Use uploaded image ${index + 1}`}
                  aria-pressed={customEnabled && config.bgType === 'image' && config.bgValue === image}
                  onClick={() => {
                    updateConfig('customBackgroundEnabled', true);
                    applyImageBackground(updateConfig, image);
                  }}
                  className="w-full rounded-md border-2 border-transparent p-1 aria-pressed:border-ctp-mauve focus-visible:outline-2 focus-visible:outline-ctp-mauve"
                >
                  <img src={image} alt={`Uploaded background ${index + 1}`} className="aspect-video w-full rounded-sm object-cover" />
                </button>
                <details
                  className="absolute top-1 right-1 z-10"
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      event.preventDefault();
                      event.currentTarget.open = false;
                      event.currentTarget.querySelector('summary')?.focus();
                    }
                  }}
                >
                <summary aria-label={`Options for uploaded image ${index + 1}`} className="flex size-9 cursor-pointer list-none items-center justify-center rounded-md bg-ctp-crust/90 text-ctp-text focus-visible:outline-2 focus-visible:outline-ctp-mauve [&::-webkit-details-marker]:hidden">
                  <Ellipsis className="size-4" aria-hidden="true" />
                </summary>

                <button
                  type="button"
                  disabled={uploading}
                  aria-label={`Delete uploaded image ${index + 1}`}
                  onClick={() => {
                    setUploadError('');
                    updateConfig('uploadedImages', config.uploadedImages.filter((uploaded) => uploaded !== image));
                    if (config.bgType === 'image' && config.bgValue === image) {
                      updateConfig('bgValue', '');
                      updateConfig('customBackgroundEnabled', false);
                    }
                  }}
                  className="absolute top-full right-0 mt-1 flex min-h-11 items-center gap-2 rounded-md border border-ctp-surface1 bg-ctp-mantle px-4 text-sm text-ctp-red shadow-lg focus-visible:outline-2 focus-visible:outline-ctp-mauve disabled:opacity-50"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Delete
                </button>
                </details>
                </div>
              ))}
        </div>
        <p id="theme-upload-status" role="status" className="text-xs text-ctp-subtext1">{uploading ? 'Loading image…' : uploadError}</p>
        {[
          { id: 'background-blur', label: 'Blur strength', value: blurPercent },
          { id: 'background-opacity', label: 'Image opacity', value: config.backgroundOpacity },
        ].map((control) => (
          <div key={control.id} className="space-y-2">
            <label htmlFor={control.id} className="text-sm text-ctp-text">{control.label}</label>
            <div className="relative isolate overflow-hidden rounded-lg bg-ctp-surface0">
              <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 -z-10 bg-ctp-mauve/25" style={{ width: `${control.value}%` }} />
              <input
                id={control.id}
                type="range"
                min="0"
                max="100"
                step="1"
                value={control.value}
                aria-valuetext={`${control.value}%`}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  if (control.id === 'background-blur') updateConfig('backgroundBlur', value / 100 * 32);
                  else updateConfig('backgroundOpacity', value);
                }}
                className="background-adjustment-slider relative block w-full focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ctp-mauve"
              />
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-bold text-ctp-text">{control.value}%</span>
            </div>
          </div>
        ))}
        </div>
      </section>
    </div>
  );
}
