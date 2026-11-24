import { siteOrigin } from "@/lib/site";

/** The public origin used for canonical URLs and crawler files. */
export function getSiteUrl(): URL {
  const value = process.env.SITE_URL?.trim();
  if (!value) return new URL(siteOrigin);

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("SITE_URL must be an absolute http:// or https:// URL.");
  }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("SITE_URL must be an absolute http:// or https:// URL without credentials.");
  }
  return new URL(url.origin);
}
