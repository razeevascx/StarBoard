import { ImageResponse } from "next/og";

export const alt = "Starboard — Your calm browser start page";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", flexDirection: "column", justifyContent: "space-between", background: "#1e1e2e", color: "#cdd6f4", padding: "72px 84px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 30, fontWeight: 700, color: "#cba6f7" }}>
        <span style={{ display: "flex", width: 52, height: 52, alignItems: "center", justifyContent: "center", background: "#cba6f7" }}>
          <span style={{ display: "flex", width: 24, height: 24, transform: "rotate(45deg)", background: "#1e1e2e" }} />
        </span>
        Starboard
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -3, lineHeight: 1.06 }}>A calmer place to start.</div>
        <div style={{ fontSize: 30, color: "#a6adc8" }}>Bookmarks, quick links, and your next tab in one place.</div>
      </div>
      <div style={{ display: "flex", width: "100%", height: 8, background: "#cba6f7" }} />
    </div>,
    size,
  );
}
