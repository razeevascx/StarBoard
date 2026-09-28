export interface AppConfig {
  showClock: boolean;
  showGreeting: boolean;
  showBookmarks: boolean;
  bookmarkLayout: "cards" | "list";
  bookmarkColumns: 2 | 3 | 4;
  folderNavigation: "bottom" | "sidebar";
  bgType: "gradient" | "solid" | "image";
  bgValue: string;
}
