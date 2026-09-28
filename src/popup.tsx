import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExternalLink } from 'lucide-react';
import './index.css';

function ExtensionPopup() {
  return (
    <main className="w-80 overflow-hidden bg-ctp-base text-ctp-text">
      <div className="border-b border-ctp-surface1/30 bg-ctp-mantle/70 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <img src="favicon.svg" alt="Starboard" className="size-10" />
          <div>
            <h1 className="text-base font-black tracking-tight">Starboard</h1>
            <p className="text-xs text-ctp-subtext0">Your calm command center</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <a
          href="index.html"
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 bg-ctp-mauve px-4 py-3 text-xs font-black tracking-wide text-ctp-base transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-ctp-mauve/30"
        >
          Open Starboard
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExtensionPopup />
  </StrictMode>,
);
