const FALLBACK_FAVICON = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#cba6f7" stroke-width="2"><circle cx="16" cy="16" r="12"/><ellipse cx="16" cy="16" rx="5" ry="12"/><path d="M4 16h24"/></svg>')}`;

export function handleFaviconError({ currentTarget }: { currentTarget: HTMLImageElement }) {
  if (currentTarget.src !== FALLBACK_FAVICON) currentTarget.src = FALLBACK_FAVICON;
}

export const getFaviconUrl = (url: string, size = 32) => {
  try {
    const { hostname } = new URL(url.startsWith("http") ? url : `https://${url}`);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=${size}`;
  } catch {
    return FALLBACK_FAVICON;
  }
};

export const getBestFaviconUrl = (url: string, size = 128) => getFaviconUrl(url, size);
