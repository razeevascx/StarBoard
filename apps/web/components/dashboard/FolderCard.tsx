import type { CSSProperties } from "react";
import Link from "next/link";
import { Card } from "@/components/hangry-ui/components/card";
import styles from "./FolderCard.module.css";

const FLAP_PATH = "M0 25C0 11.1929 11.1929 0 25 0H136.084C143.044 0 149.689 2.90139 154.42 8.00608L178.08 33.5343C182.811 38.639 189.456 41.5404 196.416 41.5404H296C309.807 41.5404 321 52.7333 321 66.5404V216C321 229.807 309.807 241 296 241H25C11.1929 241 0 229.807 0 216V25Z";

type FolderCardProps = {
  href: string;
  name: string;
  description: string | null;
  bookmarkCount: number;
  color: string;
};

export function FolderCard({ href, name, description, bookmarkCount, color }: Readonly<FolderCardProps>) {
  return (
    <Card className="h-full max-w-none gap-0 p-0 transition-colors hover:[--surface-bottom:var(--color-ctp-surface0)] hover:[--surface-stroke-top:color-mix(in_srgb,var(--color-ctp-mauve)_60%,var(--border))]">
      <Link href={href} className={`${styles.link} group relative flex h-full min-w-0 flex-col items-center px-5 pb-6 pt-3 text-center`} style={{ "--folder-color": color } as CSSProperties}>
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.stage}>
            <div className={styles.back} />
            <svg className={styles.paper} width="164" height="214" viewBox="0 0 164 214" fill="none">
              <rect x="0.5" y="0.5" width="163" height="213" rx="19.5" fill="#f1f1f1" stroke="#e0e0e0" />
              <svg x="54" y="16" width="56" height="56" viewBox="0 0 64 64">
                <rect width="64" height="64" rx="16" fill="#1e1e2e" />
                <path d="M32 11c1.9 12.6 8.4 19.1 21 21-12.6 1.9-19.1 8.4-21 21-1.9-12.6-8.4-19.1-21-21 12.6-1.9 19.1-8.4 21-21Z" fill="#cba6f7" />
              </svg>
              <rect x="27" y="94" width="110" height="6" rx="3" fill="#d4d4d4" />
              <rect x="46" y="110" width="72" height="6" rx="3" fill="#d4d4d4" />
            </svg>
            <div className={styles.flap}>
              <div className={styles.glass} />
              <svg width="321" height="241" viewBox="0 0 321 241" fill="none">
                <path d={FLAP_PATH} fill="var(--folder-color)" fillOpacity="0.45" stroke="var(--folder-edge)" />
              </svg>
            </div>
          </div>
        </div>
        <h2 className="w-full wrap-break-word text-base font-semibold leading-snug text-ctp-text">{name}</h2>
        {description && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ctp-subtext0">{description}</p>}
        <p className="mt-auto pt-3 text-xs leading-normal text-ctp-subtext0">{bookmarkCount} {bookmarkCount === 1 ? "bookmark" : "bookmarks"}</p>
      </Link>
    </Card>
  );
}
