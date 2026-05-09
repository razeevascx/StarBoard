const normalizeUrl = (url: string) =>
  new URL(url.startsWith("http") ? url : `https://${url}`);

// Defined BEFORE getFaviconUrl so the const reference is valid
export const getFallbackFaviconUrl = (url: string, size = 32) => {
  try {
    const urlObj = normalizeUrl(url); // reuse shared helper
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=${size}`;
  } catch {
    return `https://www.google.com/s2/favicons?domain=google.com&sz=${size}`;
  }
};

export const getFaviconUrl = (url: string, size = 32) => {
  try {
    const urlObj = normalizeUrl(url);

    // Check for Chrome Extension context
    if (globalThis.chrome?.runtime?.id) {
      // removed redundant globalThis.window check
      try {
        return `chrome-extension://${globalThis.chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(urlObj.href)}&size=${size}`;
      } catch {
        // Fall through to Google favicon
      }
    }

    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=${size}`;
  } catch {
    return getFallbackFaviconUrl(url, size); // now safe to call
  }
};
