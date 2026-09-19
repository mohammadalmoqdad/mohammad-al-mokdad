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
          background: "#080b12",
          color: "#f4f6f8",
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: -1,
          border: "1px solid #4f8cff",
        }}
      >
        MA
      </div>
    ),
    size,
  );
}
