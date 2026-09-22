import { ImageResponse } from "next/og";
import { getContent } from "@/content";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "·";
}

export async function monogram(size: number, rounded: boolean) {
  const { profile } = await getContent("en");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1b1f2e",
          borderRadius: rounded ? size * 0.22 : 0,
          color: "#fafaf8",
          fontSize: size * 0.5,
          fontWeight: 700,
          letterSpacing: -size * 0.02,
        }}
      >
        <div style={{ display: "flex", marginTop: -size * 0.06 }}>{initials(profile.name)}</div>
        <div style={{ display: "flex", width: size * 0.42, height: size * 0.07, borderRadius: size, background: "#26beba", marginTop: size * 0.02 }} />
      </div>
    ),
    { width: size, height: size },
  );
}
