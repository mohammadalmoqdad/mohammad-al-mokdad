import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          color: "#f1f1f1",
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: -1,
          border: "1px solid #a0a0a0",
        }}
      >
        MA
      </div>
    ),
    size,
  );
}
