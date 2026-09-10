import { ImageResponse } from "next/og";
import { STORE } from "@/lib/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "#0a0a0a",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: -2,
          }}
        >
          {STORE.name}
        </div>
        <div style={{ fontSize: 32, color: "#a3a3a3", marginTop: 20 }}>
          Belleza · Salud y cuidado personal · Ropa mujer
        </div>
      </div>
    ),
    size
  );
}
