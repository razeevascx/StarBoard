export interface LinkItem {
  id: string;
  name: string;
  url: string;
}

export const POPULAR_APPS: LinkItem[] = [
  { id: "p1", name: "Gmail", url: "https://mail.google.com" },
  { id: "p2", name: "YouTube", url: "https://youtube.com" },
  { id: "p3", name: "GitHub", url: "https://github.com" },
  { id: "p4", name: "ChatGPT", url: "https://chat.openai.com" },
  { id: "p5", name: "WhatsApp", url: "https://web.whatsapp.com" },
  { id: "p6", name: "Netflix", url: "https://netflix.com" },
  { id: "p7", name: "Spotify", url: "https://spotify.com" },
];

export function loadQuickLinks() {
  const saved = localStorage.getItem("startpage-quick-links");
  return saved ? (JSON.parse(saved) as LinkItem[]) : POPULAR_APPS;
}

export function saveQuickLinks(quickLinks: LinkItem[]) {
  localStorage.setItem("startpage-quick-links", JSON.stringify(quickLinks));
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
