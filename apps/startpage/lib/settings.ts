import type { AppConfig } from "../src/types";
import { getTheme, THEMES } from './themes';

export const DEFAULT_GRADIENT_BACKGROUND = "radial-gradient(ellipse at top, var(--color-ctp-mantle), var(--color-ctp-base))";

export const DEFAULT_CONFIG: AppConfig = {
  theme: 'mocha',
  customBackgroundEnabled: false,
  uploadedImages: [],
  backgroundBlur: 0,
  backgroundOpacity: 100,
  showClock: true,
  showGreeting: true,
  showBookmarks: true,
  bookmarkLayout: "cards",
  bookmarkColumns: 4,
  folderNavigation: "bottom",
  bgType: "gradient",
  bgValue: DEFAULT_GRADIENT_BACKGROUND,
};

export function getToggleLabel(key: string) {
  return key
    .replace("show", "")
    .replaceAll(/([A-Z])/g, " $1")
    .trim();
}

export function getSolidBackground(color: string) {
  return { backgroundColor: color };
}

export function getImageBackground(url: string) {
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}

export function getGradientBackground(value: string) {
  return {
    backgroundImage: value.includes("gradient") ? value : DEFAULT_GRADIENT_BACKGROUND,
  };
}

export function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'].includes(file.type)) {
      reject(new Error('Please choose a JPG, PNG, WebP, GIF or AVIF image.'));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      reject(new Error('Please choose an image smaller than 2 MB.'));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read image file."));
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error("Unable to read image file."));
    };
    reader.readAsDataURL(file);
  });
}

type UpdateConfig = (key: keyof AppConfig, value: AppConfig[keyof AppConfig]) => void;

export function applySolidBackground(updateConfig: UpdateConfig, color: string) {
  updateConfig("bgType", "solid");
  updateConfig("bgValue", color);
}

export function applyImageBackground(updateConfig: UpdateConfig, value: string) {
  updateConfig("customBackgroundEnabled", true);
  updateConfig("bgType", "image");
  updateConfig("bgValue", value);
}

export function applyGradientBackground(updateConfig: UpdateConfig) {
  updateConfig("bgType", "gradient");
  updateConfig("bgValue", DEFAULT_GRADIENT_BACKGROUND);
}

export function loadConfig(): AppConfig {
  const saved = localStorage.getItem("startpage-config");
  if (!saved) return DEFAULT_CONFIG;

  const parsed = JSON.parse(saved) as Partial<AppConfig>;
  if (!parsed || typeof parsed !== "object") {
    return DEFAULT_CONFIG;
  }

  return {
    theme: THEMES.find((theme) => theme.id === parsed.theme)?.id ?? 'mocha',
    backgroundBlur: typeof parsed.backgroundBlur === 'number' && Number.isFinite(parsed.backgroundBlur)
      ? Math.min(32, Math.max(0, parsed.backgroundBlur)) : 0,
    backgroundOpacity: typeof parsed.backgroundOpacity === 'number' && Number.isFinite(parsed.backgroundOpacity)
      ? Math.min(100, Math.max(0, parsed.backgroundOpacity)) : 100,
    customBackgroundEnabled: parsed.customBackgroundEnabled ?? parsed.bgType === 'image',
    uploadedImages: [...new Set([
      ...(Array.isArray(parsed.uploadedImages) ? parsed.uploadedImages.filter((image): image is string => typeof image === 'string' && image.length > 0) : []),
      ...(parsed.bgType === 'image' && parsed.bgValue ? [parsed.bgValue] : []),
    ])],
    showClock: parsed.showClock ?? DEFAULT_CONFIG.showClock,
    showGreeting: parsed.showGreeting ?? DEFAULT_CONFIG.showGreeting,
    showBookmarks: parsed.showBookmarks ?? DEFAULT_CONFIG.showBookmarks,
    bookmarkLayout: parsed.bookmarkLayout === "list" ? "list" : "cards",
    bookmarkColumns:
      parsed.bookmarkColumns === 2 || parsed.bookmarkColumns === 3 || parsed.bookmarkColumns === 4
        ? parsed.bookmarkColumns
        : DEFAULT_CONFIG.bookmarkColumns,
    folderNavigation: parsed.folderNavigation === "sidebar" ? "sidebar" : "bottom",
    bgType: parsed.bgType === 'image' ? 'image' : DEFAULT_CONFIG.bgType,
    bgValue: parsed.bgType === 'image' ? parsed.bgValue ?? '' : DEFAULT_CONFIG.bgValue,
  };
}

export function saveConfig(config: AppConfig) {
  localStorage.setItem("startpage-config", JSON.stringify(config));
}

export function getBackgroundStyle(config: AppConfig) {
  if (!config.customBackgroundEnabled || config.bgType !== 'image' || !config.bgValue) {
    return { backgroundColor: getTheme(config.theme).base };
  }
  return {
      backgroundColor: getTheme(config.theme).base,
      backgroundImage: `url(${config.bgValue})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
  };
}

export function updateConfigValue(
  config: AppConfig,
  key: keyof AppConfig,
  value: AppConfig[keyof AppConfig],
) {
  return { ...config, [key]: value } as AppConfig;
}
