import type { Dispatch, SetStateAction } from "react";

declare const browser: typeof chrome | undefined;

interface BraveNavigator extends Navigator {
  brave?: {
    isBrave?: () => boolean | Promise<boolean>;
  };
}

export interface PermissionState {
  bookmarks: boolean;
}

const userAgent = typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";
const vendor = typeof navigator !== "undefined" ? navigator.vendor : "";
const platform = typeof navigator !== "undefined" ? navigator.platform : "";
const braveNavigator = typeof navigator !== "undefined" ? (navigator as BraveNavigator) : undefined;
const chromeGlobal = typeof window !== "undefined" ? window.chrome : undefined;

export const isFirefox = typeof browser !== "undefined" && userAgent.includes("firefox");
export const isFirefoxAll = userAgent.includes("firefox");
export const isChromiumBased =
  !!chromeGlobal &&
  ("webstore" in chromeGlobal || "runtime" in chromeGlobal) &&
  !isFirefox;
export const isEdge = /Edg/.test(typeof navigator !== "undefined" ? navigator.userAgent : "");
export const isBrave = !!braveNavigator?.brave?.isBrave?.();
export const isOpera = /OPR/.test(typeof navigator !== "undefined" ? navigator.userAgent : "");
export const isChrome =
  (/Chrome|CriOS/.test(typeof navigator !== "undefined" ? navigator.userAgent : "")) &&
  /Google Inc/.test(vendor) &&
  !isEdge &&
  !isBrave &&
  !isOpera;
export const isSafari =
  /Safari/.test(typeof navigator !== "undefined" ? navigator.userAgent : "") &&
  !isChromiumBased &&
  /Apple Computer/.test(vendor);
export const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(platform);
export const isDesktop = !/Android|iPhone|iPad|iPod/.test(userAgent);

export function checkPermissions(setHasPermission: Dispatch<SetStateAction<PermissionState>>) {
  if (typeof chrome === "undefined" || !chrome.permissions) return;

  chrome.permissions.contains({ permissions: ["bookmarks"] }, (result) => {
    setHasPermission((prev) => ({ ...prev, bookmarks: result }));
  });
}

export function requestPermission(
  perm: "bookmarks",
  onGranted: () => void,
  onPermissionStateChange: (perm: "bookmarks") => void,
  onDenied?: () => void,
) {
  if (typeof chrome === "undefined" || !chrome.permissions) {
    onDenied?.();
    return;
  }

  chrome.permissions.request({ permissions: [perm] }, (granted) => {
    if (granted) {
      onPermissionStateChange(perm);
      onGranted();
    } else {
      onDenied?.();
    }
  });
}

export function removePermission(
  perm: "bookmarks",
  onRevoked: () => void,
  onPermissionStateChange: (perm: "bookmarks") => void,
) {
  if (typeof chrome === "undefined" || !chrome.permissions) return;

  chrome.permissions.remove({ permissions: [perm] }, (removed) => {
    if (removed) {
      onPermissionStateChange(perm);
      onRevoked();
    }
  });
}
