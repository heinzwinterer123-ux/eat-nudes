import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "NUDES™ — Nothing to Hide. Health bar in Barcelona and Madrid.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          padding: "0 80px",
        }}
      >
        {/* Top rule */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            right: 80,
            height: 1,
            background: "rgba(255,255,255,0.15)",
          }}
        />

        {/* Brand name */}
        <div
          style={{
            fontSize: 104,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: 28,
          }}
        >
          EAT.NUDES
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 30,
            fontWeight: 300,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 52,
          }}
        >
          Nothing to Hide.
        </div>

        {/* Location pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 999,
            padding: "10px 28px",
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            Barcelona · Madrid
          </span>
        </div>

        {/* Bottom rule */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 80,
            right: 80,
            height: 1,
            background: "rgba(255,255,255,0.15)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
