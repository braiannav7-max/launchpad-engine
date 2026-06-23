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
import {
  AnimatedWords,
  Bullet,
  FloatingCover,
  Pill,
} from "../components/primitives";

const SceneShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Fade in/out de cada escena para transiciones limpias.
  const opacity = interpolate(
    frame,
    [0, 14, durationInFrames - 14, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill
      style={{
        opacity,
        alignItems: "center",
        justifyContent: "center",
        padding: "0 9%",
        textAlign: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ─── Escenas ────────────────────────────────────────────────────────────

const Hook: React.FC<{ p: VideoProps }> = ({ p }) => (
  <SceneShell>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
      <Pill fontSize={26}>
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: theme.accent,
            boxShadow: `0 0 14px ${theme.accent}`,
          }}
        />
        {p.brandName}
      </Pill>
      <AnimatedWords
        text={p.headline}
        fontSize={96}
        startFrame={8}
        style={{ justifyContent: "center", maxWidth: 1400 }}
      />
    </div>
  </SceneShell>
);

const Problem: React.FC<{ p: VideoProps }> = ({ p }) => {
  const pains = p.painPoints.length ? p.painPoints : p.bullets;
  return (
    <SceneShell>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <AnimatedWords text="¿Te suena familiar?" fontSize={72} color={theme.accent} />
        <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "flex-start" }}>
          {pains.slice(0, 4).map((t, i) => (
            <PainRow key={i} text={t} delay={20 + i * 16} />
          ))}
        </div>
      </div>
    </SceneShell>
  );
};

const PainRow: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: s,
        transform: `translateX(${interpolate(s, [0, 1], [-40, 0])}px)`,
      }}
    >
      <span
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#f54900,#b91c1c)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 26,
          fontWeight: 800,
          flex: "0 0 auto",
        }}
      >
        ✕
      </span>
      <span style={{ fontSize: 44, color: theme.ink, fontWeight: 600 }}>{text}</span>
    </div>
  );
};

const Solution: React.FC<{ p: VideoProps }> = ({ p }) => (
  <SceneShell>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        gap: 80,
        alignItems: "center",
        maxWidth: 1500,
      }}
    >
      <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 28 }}>
        <Pill fontSize={24}>La solución</Pill>
        <AnimatedWords text={p.title} fontSize={84} style={{ justifyContent: "flex-start" }} />
        <div style={{ fontSize: 38, color: theme.inkSoft, lineHeight: 1.4, fontWeight: 500 }}>
          {p.subheadline}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <FloatingCover src={p.coverImage} title={p.title} width={360} />
      </div>
    </div>
  </SceneShell>
);

const Benefits: React.FC<{ p: VideoProps }> = ({ p }) => (
  <SceneShell>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
      <AnimatedWords text="Esto es lo que vas a lograr" fontSize={68} />
      <div style={{ display: "flex", flexDirection: "column", gap: 30, alignItems: "flex-start" }}>
        {p.bullets.slice(0, 5).map((t, i) => (
          <Bullet key={i} text={t} delay={18 + i * 14} fontSize={44} accent={p.accentTo} />
        ))}
      </div>
    </div>
  </SceneShell>
);

const Offer: React.FC<{ p: VideoProps }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + Math.sin((frame / fps) * Math.PI * 2 * 0.8) * 0.025;
  const ctaIn = spring({ frame: frame - 30, fps, config: { damping: 200 } });
  return (
    <SceneShell>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <AnimatedWords text={p.headline} fontSize={72} style={{ justifyContent: "center", maxWidth: 1300 }} />
        {p.price ? (
          <div style={{ fontSize: 52, color: theme.inkSoft, fontWeight: 700 }}>
            Hoy por <span style={{ color: theme.accent }}>{p.price}</span>
          </div>
        ) : null}
        <div
          style={{
            opacity: ctaIn,
            transform: `scale(${pulse})`,
            padding: "30px 70px",
            borderRadius: 22,
            background: theme.gradientWarm,
            color: "#fff",
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: "0.01em",
            boxShadow: `0 26px 70px -18px ${theme.accentDeep}`,
          }}
        >
          {p.cta}
        </div>
        <div style={{ fontSize: 30, color: theme.muted, fontWeight: 500 }}>
          Acceso inmediato · Garantía de 7 días
        </div>
      </div>
    </SceneShell>
  );
};

// ─── Composición ─────────────────────────────────────────────────────────

export const VSL: React.FC<VideoProps> = (p) => {
  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, backgroundColor: theme.bg }}>
      <GradientBackground from={p.accentFrom} to={p.accentTo} amplitude={120} />
      <Series>
        <Series.Sequence durationInFrames={210}>
          <Hook p={p} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={450}>
          <Problem p={p} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={540}>
          <Solution p={p} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={540}>
          <Benefits p={p} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={510}>
          <Offer p={p} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
