import type { ThemeId } from '../lib/themes';

export interface AppConfig {
  theme: ThemeId;
  customBackgroundEnabled: boolean;
  uploadedImages: string[];
  backgroundBlur: number;
  backgroundOpacity: number;
  showClock: boolean;
  showGreeting: boolean;
  showBookmarks: boolean;
  bookmarkLayout: "cards" | "list";
  bookmarkColumns: 2 | 3 | 4;
  folderNavigation: "bottom" | "sidebar";
  bgType: "gradient" | "solid" | "image";
  bgValue: string;
}
