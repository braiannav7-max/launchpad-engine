import React from "react";
import {
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";

const TAU = Math.PI * 2;

/** Revelado de texto palabra por palabra con resorte (para VSL/Reel). */
export const AnimatedWords: React.FC<{
  text: string;
  startFrame?: number;
  fontSize: number;
  color?: string;
  weight?: number;
  lineHeight?: number;
  staggerFrames?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  startFrame = 0,
  fontSize,
  color = theme.white,
  weight = 800,
  lineHeight = 1.08,
  staggerFrames = 3,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: `0 ${fontSize * 0.26}px`,
        fontSize,
        fontWeight: weight,
        lineHeight,
        letterSpacing: "-0.02em",
        color,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const delay = startFrame + i * staggerFrames;
        const p = spring({
          frame: frame - delay,
          fps,
          config: { damping: 200, mass: 0.7 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Fila de bullet con check, entrada con resorte. */
export const Bullet: React.FC<{
  text: string;
  delay: number;
  fontSize: number;
  accent: string;
}> = ({ text, delay, fontSize, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: fontSize * 0.7,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [40, 0])}px)`,
      }}
    >
      <span
        style={{
          flex: "0 0 auto",
          width: fontSize * 1.5,
          height: fontSize * 1.5,
          borderRadius: "50%",
          background: theme.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 ${fontSize}px ${accent}55`,
        }}
      >
        <svg
          width={fontSize}
          height={fontSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span style={{ fontSize, color: theme.ink, fontWeight: 600 }}>{text}</span>
    </div>
  );
};

/**
 * Portada del ebook flotando. El movimiento es periódico (seno sobre el período)
 * para que sea apto para loops perfectos.
 */
export const FloatingCover: React.FC<{
  src?: string;
  title: string;
  width: number;
  periodInFrames?: number;
  tilt?: number;
}> = ({ src, title, width, periodInFrames, tilt = -4 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const period = periodInFrames ?? durationInFrames;
  const a = ((frame % period) / period) * TAU;
  const floatY = Math.sin(a) * 14;
  const rot = tilt + Math.sin(a) * 1.5;
  const height = width * 1.4;

  return (
    <div
      style={{
        width,
        height,
        transform: `translateY(${floatY}px) rotate(${rot}deg)`,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow:
          "0 50px 90px -30px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.08)",
        background: theme.gradient,
      }}
    >
      {src ? (
        <Img
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: width * 0.12,
            textAlign: "center",
            color: "#fff",
            fontSize: width * 0.1,
            fontWeight: 800,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
};

/** Píldora de marca / eyebrow. */
export const Pill: React.FC<{
  children: React.ReactNode;
  fontSize: number;
  opacity?: number;
}> = ({ children, fontSize, opacity = 1 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: fontSize * 0.5,
      padding: `${fontSize * 0.5}px ${fontSize}px`,
      borderRadius: 999,
      background: "rgba(255,255,255,.07)",
      border: "1px solid rgba(255,255,255,.14)",
      fontSize,
      color: theme.inkSoft,
      fontWeight: 600,
      opacity,
      backdropFilter: "blur(8px)",
    }}
  >
    {children}
  </div>
);
