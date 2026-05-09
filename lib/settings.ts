import type { AppConfig } from "../src/types";

export const DEFAULT_GRADIENT_BACKGROUND = "radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))";

export const DEFAULT_CONFIG: AppConfig = {
  showClock: true,
  showCalendar: false,
  showGreeting: true,
  showBookmarks: false,
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
  updateConfig("bgType", "image");
  updateConfig("bgValue", value);
}

export function applyGradientBackground(updateConfig: UpdateConfig) {
  updateConfig("bgType", "gradient");
  updateConfig("bgValue", DEFAULT_GRADIENT_BACKGROUND);
}

export function loadConfig() {
  const saved = localStorage.getItem("startpage-config");
  if (!saved) return DEFAULT_CONFIG;

  return { ...DEFAULT_CONFIG, ...JSON.parse(saved) } as AppConfig;
}

export function saveConfig(config: AppConfig) {
  localStorage.setItem("startpage-config", JSON.stringify(config));
}

export function getBackgroundStyle(config: AppConfig) {
  if (config.bgType === "solid") {
    return { backgroundColor: config.bgValue };
  }

  if (config.bgType === "image") {
    return {
      backgroundImage: `url(${config.bgValue})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }

  return {
    backgroundImage: config.bgValue.includes("gradient") ? config.bgValue : DEFAULT_GRADIENT_BACKGROUND,
  };
}

export function updateConfigValue(
  config: AppConfig,
  key: keyof AppConfig,
  value: AppConfig[keyof AppConfig],
) {
  return { ...config, [key]: value } as AppConfig;
}
