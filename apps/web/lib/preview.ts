import "server-only";

import { lookup as dnsLookup } from "node:dns/promises";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";

export type SitePreview = { ogImageUrl: string | null; faviconUrl: string | null };

function publicIPv4(address: string) {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [a, b, c] = parts as [number, number, number];
  return a > 0 && a < 224 && a !== 10 && a !== 127 &&
    !(a === 100 && b >= 64 && b <= 127) &&
    !(a === 169 && b === 254) && !(a === 172 && b >= 16 && b <= 31) &&
    !(a === 192 && (b === 0 || b === 168 || (b === 88 && c === 99))) &&
    !(a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) &&
    !(a === 203 && b === 0 && c === 113);
}

function publicSiteUrl(value: string, base?: string) {
  try {
    const url = new URL(value, base);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.port) return null;
    const host = url.hostname.toLowerCase();
    if (isIP(host) && (isIP(host) !== 4 || !publicIPv4(host))) return null;
    if (host === "localhost" || /\.(localhost|local|internal|test|invalid)$/.test(host)) return null;
    return url;
  } catch {
    return null;
  }
}

function decodeEntities(value: string) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (entity, code: string) => {
    const named: Record<string, string> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" };
    if (code.startsWith("#")) {
      const point = parseInt(code.slice(code[1]?.toLowerCase() === "x" ? 2 : 1), code[1]?.toLowerCase() === "x" ? 16 : 10);
      return point <= 0x10ffff ? String.fromCodePoint(point) : entity;
    }
    return named[code.toLowerCase()] ?? entity;
  });
}

function attributes(tag: string) {
  const values = new Map<string, string>();
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    values.set(match[1]!.toLowerCase(), decodeEntities(match[2] ?? match[3] ?? match[4] ?? ""));
  }
  return values;
}

export function parseSitePreview(html: string, pageUrl: string): SitePreview {
  const images = new Map<string, string>();
  let icon: string | null = null;
  for (const tag of html.match(/<(?:meta|link)\b[^>]*>/gi) ?? []) {
    const values = attributes(tag);
    const property = (values.get("property") ?? values.get("name") ?? "").toLowerCase();
    const rel = (values.get("rel") ?? "").toLowerCase();
    const imageKey = property || (values.get("itemprop") ?? "").toLowerCase();
    if (["og:image:secure_url", "og:image", "og:image:url", "twitter:image", "twitter:image:src", "image"].includes(imageKey)) {
      const candidate = publicSiteUrl(values.get("content") ?? "", pageUrl)?.href;
      if (candidate && !images.has(imageKey)) images.set(imageKey, candidate);
    }
    if (/\bimage_src\b/.test(rel)) {
      const candidate = publicSiteUrl(values.get("href") ?? "", pageUrl)?.href;
      if (candidate) images.set("image_src", candidate);
    }
    if (!icon && /\bicon\b/.test(rel)) {
      icon = publicSiteUrl(values.get("href") ?? "", pageUrl)?.href ?? null;
    }
  }
  let image = ["og:image:secure_url", "og:image", "og:image:url", "twitter:image", "twitter:image:src", "image", "image_src"]
    .map((key) => images.get(key)).find(Boolean) ?? null;
  if (!image) {
    for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
      const values = attributes(tag);
      const width = Number.parseInt(values.get("width") ?? "", 10);
      const height = Number.parseInt(values.get("height") ?? "", 10);
      if (!Number.isFinite(width) || !Number.isFinite(height) || width < 200 || height < 120) continue;
      image = publicSiteUrl(values.get("src") ?? values.get("data-src") ?? "", pageUrl)?.href ?? null;
      if (image) break;
    }
  }
  return { ogImageUrl: image, faviconUrl: icon };
}

export async function fetchSitePreview(value: string, redirects = 0): Promise<SitePreview> {
  const url = publicSiteUrl(value);
  if (!url) return { ogImageUrl: null, faviconUrl: null };

  return new Promise((resolve) => {
    const deadline = setTimeout(() => {
      request.destroy(new Error("Preview timed out"));
      finish({ ogImageUrl: null, faviconUrl: null });
    }, 4500);
    const finish = (preview: SitePreview) => { clearTimeout(deadline); resolve(preview); };
    const request = (url.protocol === "https:" ? httpsRequest : httpRequest)(url, {
      method: "GET",
      timeout: 4000,
      headers: { Accept: "text/html", "User-Agent": "StarboardBookmarkPreview/1.0" },
      lookup(hostname, _options, callback) {
        dnsLookup(hostname, { family: 4, all: true }).then((addresses) => {
          const address = addresses.find((entry) => publicIPv4(entry.address));
          if (!address) callback(new Error("No public address available"), "", 4);
          else if (_options.all) {
            const allCallback = callback as (error: Error | null, addresses: { address: string; family: 4 }[]) => void;
            allCallback(null, [{ address: address.address, family: 4 }]);
          } else callback(null, address.address, 4);
        }).catch((error) => callback(error, "", 4));
      },
    }, (response) => {
      if (response.statusCode && [301, 302, 303, 307, 308].includes(response.statusCode) && response.headers.location && redirects < 3) {
        response.resume();
        const destination = publicSiteUrl(response.headers.location, url.href);
        if (destination) void fetchSitePreview(destination.href, redirects + 1).then(finish);
        else finish({ ogImageUrl: null, faviconUrl: null });
        return;
      }
      if (response.statusCode !== 200 || !response.headers["content-type"]?.includes("text/html")) {
        response.resume();
        finish({ ogImageUrl: null, faviconUrl: null });
        return;
      }
      const chunks: Buffer[] = [];
      let length = 0;
      response.on("data", (chunk: Buffer) => {
        length += chunk.length;
        if (length > 524_288) {
          chunks.push(chunk.subarray(0, Math.max(0, 524_288 - (length - chunk.length))));
          finish(parseSitePreview(Buffer.concat(chunks).toString("utf8"), url.href));
          response.destroy();
          return;
        }
        chunks.push(chunk);
      });
      response.on("end", () => finish(parseSitePreview(Buffer.concat(chunks).toString("utf8"), url.href)));
      response.on("error", () => finish({ ogImageUrl: null, faviconUrl: null }));
    });
    request.on("timeout", () => request.destroy());
    request.on("error", () => finish({ ogImageUrl: null, faviconUrl: null }));
    request.end();
  });
}
