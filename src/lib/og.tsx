import { ImageResponse } from "next/og";
import { readMedia } from "@/lib/site/store";

export async function ogPhoto(): Promise<string | undefined> {
  const media = await readMedia("cv-photo");
  if (!media || !["image/jpeg", "image/png"].includes(media.type)) return undefined;
  return `data:${media.type};base64,${Buffer.from(media.body).toString("base64")}`;
}

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const INK = "#1b1f2e";
const ACCENT = "#1f8f88";
const MUTED = "#5b6472";

export function ogImage({ label, title, subtitle, footer, photo }: { label?: string; title: string; subtitle?: string; footer: string; photo?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#fcfcfa",
          color: INK,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", height: 8, width: 160, background: ACCENT, borderRadius: 8 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {label && (
            <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: ACCENT, fontWeight: 600 }}>{label}</div>
          )}
          <div style={{ display: "flex", fontSize: title.length > 60 ? 62 : 76, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1.5 }}>{title}</div>
          {subtitle && (
            <div style={{ display: "flex", fontSize: 30, lineHeight: 1.35, color: MUTED }}>{subtitle.length > 130 ? `${subtitle.slice(0, 129)}…` : subtitle}</div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26, color: MUTED }}>
          <div style={{ display: "flex" }}>{footer}</div>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" width={64} height={64} style={{ borderRadius: 64, objectFit: "cover" }} />
          ) : (
            <div style={{ display: "flex", width: 44, height: 44, borderRadius: 12, background: INK, color: "#fafaf8", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700 }}>
              {footer.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    ),
    ogSize,
  );
}
