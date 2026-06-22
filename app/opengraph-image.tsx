import { ImageResponse } from "next/og";
import { MATCHES, nextMatch } from "@/lib/data";

// Route segment config
export const runtime = "nodejs";
export const alt = "Atlas Hub — Morocco at the World Cup 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function fmtDate(iso: string) {
  // Format in the venue's time zone so the date is correct regardless of
  // where the image is rendered (build server, edge, etc.).
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  }).format(new Date(iso));
}

export default async function OgImage() {
  const match = nextMatch() ?? MATCHES[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #00451f 0%, #006233 55%, #00451f 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
          padding: "60px 70px",
          position: "relative",
        }}
      >
        {/* gold glow accent */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(224,180,58,0.35), rgba(224,180,58,0) 70%)",
            display: "flex",
          }}
        />

        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#C1272D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
            }}
          >
            ⭐
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
              Atlas Hub
            </div>
            <div
              style={{
                fontSize: 20,
                opacity: 0.8,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Morocco · World Cup 2026
            </div>
          </div>
        </div>

        {/* Match centerpiece */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 50,
            marginTop: 70,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ fontSize: 150, lineHeight: 1 }}>🇲🇦</div>
            <div style={{ fontSize: 38, fontWeight: 800 }}>Morocco</div>
          </div>

          <div
            style={{
              fontSize: 44,
              fontWeight: 800,
              opacity: 0.65,
              background: "rgba(0,0,0,0.22)",
              padding: "10px 24px",
              borderRadius: 16,
              display: "flex",
            }}
          >
            VS
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ fontSize: 150, lineHeight: 1 }}>{match.opponentFlag}</div>
            <div style={{ fontSize: 38, fontWeight: 800 }}>{match.opponent}</div>
          </div>
        </div>

        {/* Match meta */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginTop: 44,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              background: "#E0B43A",
              color: "#3a2c00",
              padding: "8px 20px",
              borderRadius: 12,
              display: "flex",
            }}
          >
            {match.group}
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              background: "rgba(255,255,255,0.12)",
              padding: "8px 20px",
              borderRadius: 12,
              display: "flex",
            }}
          >
            📅 {fmtDate(match.kickoff)}
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              background: "rgba(255,255,255,0.12)",
              padding: "8px 20px",
              borderRadius: 12,
              display: "flex",
            }}
          >
            🏟️ {match.cityLabel}
          </div>
        </div>

        {/* Value prop footer */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 27,
            fontWeight: 600,
            opacity: 0.95,
          }}
        >
          🎟️ Ticket alerts · 🕌 Halal &amp; mosques · 🚇 Stadium transport — free
        </div>
      </div>
    ),
    { ...size }
  );
}
