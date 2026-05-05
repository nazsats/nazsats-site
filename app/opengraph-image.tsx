import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nazsats - AI & Blockchain Innovation Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 90,
            fontWeight: 800,
            letterSpacing: "-2px",
            marginBottom: "20px",
          }}
        >
          Nazsats
        </div>
        <div
          style={{
            fontSize: 34,
            opacity: 0.9,
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          AI &amp; Blockchain Innovation Platform
        </div>
        <div
          style={{
            marginTop: "40px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "999px",
            padding: "12px 32px",
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          Coming Soon
        </div>
      </div>
    ),
    { ...size }
  );
}