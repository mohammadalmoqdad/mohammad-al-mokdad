import { ImageResponse } from "next/og";
import { portfolio } from "@/data/portfolio";

export const alt = portfolio.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#070A0F",
          color: "#f4f6f8",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 64,
            height: 64,
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #4F7CFF",
            fontSize: 22,
            letterSpacing: -1,
          }}
        >
          MA
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, color: "#4F7CFF", letterSpacing: 4 }}>
            SOFTWARE ENGINEER
          </div>
          <div
            style={{
              fontSize: 72,
              lineHeight: 0.95,
              letterSpacing: -3,
              marginTop: 16,
            }}
          >
            Mohammad Almokdad
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#A6B0BE",
              marginTop: 24,
              maxWidth: 860,
            }}
          >
            I build products beyond the interface.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
