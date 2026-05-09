
const FALLBACK_FAVICON_URL = '/favicon.svg';

const normalizeUrl = (url: string) => new URL(url.startsWith('http') ? url : `https://${url}`);

const getGoogleFaviconUrl = (hostname: string, size = 32) =>
  `https://www.google.com/s2/favicons?domain=${hostname}&sz=${size}`;

export const getFallbackFaviconUrl = () => FALLBACK_FAVICON_URL;

export const getFaviconUrl = (url: string, size = 32) => {
  try {
    const urlObj = normalizeUrl(url);

    if (globalThis.window?.chrome?.runtime?.id) {
      return `chrome-extension://${globalThis.window.chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(urlObj.href)}&size=${size}`;
    }

    return getGoogleFaviconUrl(urlObj.hostname, size);
  } catch {
    return getFallbackFaviconUrl();
  }
};
