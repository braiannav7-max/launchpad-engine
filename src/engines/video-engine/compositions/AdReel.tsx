import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Series,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { VideoProps } from "../schema";
import { theme } from "../theme";
import { GradientBackground } from "../components/GradientBackground";
import { AnimatedWords, FloatingCover, Pill } from "../components/primitives";

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, 10, durationInFrames - 10, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill
      style={{
        opacity,
        alignItems: "center",
        justifyContent: "center",
        padding: "0 90px",
        textAlign: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Hook: React.FC<{ p: VideoProps }> = ({ p }) => (
  <Shell>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <Pill fontSize={30}>{p.brandName}</Pill>
      <AnimatedWords text={p.headline} fontSize={92} startFrame={6} style={{ justifyContent: "center" }} />
    </div>
  </Shell>
);

const Showcase: React.FC<{ p: VideoProps }> = ({ p }) => (
  <Shell>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 56 }}>
      <FloatingCover src={p.coverImage} title={p.title} width={420} />
      <AnimatedWords text={p.title} fontSize={72} style={{ justifyContent: "center" }} />
    </div>
  </Shell>
);

const QuickBenefits: React.FC<{ p: VideoProps }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Shell>
      <div style={{ display: "flex", flexDirection: "column", gap: 34, width: "100%" }}>
        {p.bullets.slice(0, 4).map((t, i) => {
          const s = spring({ frame: frame - (10 + i * 18), fps, config: { damping: 200 } });
          return (
            <div
              key={i}
              style={{
                opacity: s,
                transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px)`,
                padding: "34px 40px",
                borderRadius: 28,
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.12)",
                display: "flex",
                alignItems: "center",
                gap: 28,
                textAlign: "left",
              }}
            >
              <span
                style={{
                  width: 64,
                  height: 64,
                  flex: "0 0 auto",
                  borderRadius: 18,
                  background: theme.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 34,
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: 42, color: theme.ink, fontWeight: 600 }}>{t}</span>
            </div>
          );
        })}
      </div>
    </Shell>
  );
};

const CTA: React.FC<{ p: VideoProps }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + Math.sin((frame / fps) * Math.PI * 2) * 0.03;
  const inP = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  return (
    <Shell>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
        {p.price ? (
          <div style={{ fontSize: 56, color: theme.inkSoft, fontWeight: 700 }}>
            Hoy <span style={{ color: theme.accent }}>{p.price}</span>
          </div>
        ) : null}
        <div
          style={{
            opacity: inP,
            transform: `scale(${pulse})`,
            padding: "40px 72px",
            borderRadius: 28,
            background: theme.gradientWarm,
            color: "#fff",
            fontSize: 60,
            fontWeight: 800,
            boxShadow: `0 30px 80px -18px ${theme.accentDeep}`,
          }}
        >
          {p.cta}
        </div>
        <div style={{ fontSize: 34, color: theme.muted, fontWeight: 500 }}>
          Link en la bio · Acceso inmediato
        </div>
      </div>
    </Shell>
  );
};

export const AdReel: React.FC<VideoProps> = (p) => {
  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, backgroundColor: theme.bg }}>
      <GradientBackground from={p.accentFrom} to={p.accentTo} amplitude={70} />
      <Series>
        <Series.Sequence durationInFrames={120}>
          <Hook p={p} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={150}>
          <Showcase p={p} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <QuickBenefits p={p} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={150}>
          <CTA p={p} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
