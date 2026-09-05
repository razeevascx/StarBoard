import { Gmail, YouTube, GitHubDark, XDark, ClaudeAI, Gemini } from "@ridemountainpig/svgl-react";

type SvgIcon = typeof Gmail;

export interface LinkItem {
  id: string;
  name: string;
  url: string;
  isFolder?: boolean;
  iconId?: string;
}

export const ICON_MAP: Record<string, SvgIcon> = {
  gmail: Gmail,
  youtube: YouTube,
  github: GitHubDark,
  x: XDark,
  claude: ClaudeAI,
  gemini: Gemini,
};

export const POPULAR_APPS: LinkItem[] = [
  // Google Suite
  { id: "p1", name: "Gmail", url: "https://gmail.com", iconId: "gmail" },
  { id: "p2", name: "YouTube", url: "https://youtube.com", iconId: "youtube" },

  // Development
  { id: "d1", name: "GitHub", url: "https://github.com", iconId: "github" },

  // Social Media
  { id: "s1", name: "X", url: "https://x.com", iconId: "x" },

  // AI Tools
  { id: "a1", name: "Claude", url: "https://claude.ai", iconId: "claude" },
  { id: "a3", name: "Gemini", url: "https://gemini.google.com", iconId: "gemini" },
];

export function loadQuickLinks() {
  const saved = globalThis.localStorage?.getItem("startpage-quick-links");
  return saved ? (JSON.parse(saved) as LinkItem[]) : POPULAR_APPS;
}

export function saveQuickLinks(quickLinks: LinkItem[]) {
  globalThis.localStorage?.setItem("startpage-quick-links", JSON.stringify(quickLinks));
}

export function addQuickLink(quickLinks: LinkItem[], name: string, url: string) {
  return [...quickLinks, { id: crypto.randomUUID(), name, url }];
}

export function removeQuickLink(quickLinks: LinkItem[], id: string) {
  return quickLinks.filter((link) => link.id !== id);
}

export function updateQuickLink(quickLinks: LinkItem[], id: string, name: string, url: string) {
  return quickLinks.map((link) => (link.id === id ? { ...link, name, url } : link));
}
