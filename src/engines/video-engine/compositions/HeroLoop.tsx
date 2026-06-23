import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { VideoProps } from "../schema";
import { theme } from "../theme";
import { GradientBackground } from "../components/GradientBackground";
import { FloatingCover, Pill } from "../components/primitives";

const TAU = Math.PI * 2;

/**
 * HeroLoop — fondo animado de 6s pensado para loopear sin costura como
 * background del hero de la landing.
 *
 * Regla de oro del loop perfecto: TODA animación es periódica con período =
 * durationInFrames. Así el frame 0 y el frame N son idénticos. No se usan
 * springs ni interpolaciones de una sola dirección (no vuelven al inicio).
 */
export const HeroLoop: React.FC<VideoProps> = ({
  title,
  headline,
  brandName,
  coverImage,
  accentFrom,
  accentTo,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const t = (frame % durationInFrames) / durationInFrames; // 0 → 1
  const a = t * TAU;

  // Respiración del titular (periódica).
  const headlineOpacity = 0.9 + Math.sin(a) * 0.1;

  // Barrido de luz: viaja de -30% a 130%. En ambos extremos está fuera de
  // cuadro (invisible), por eso el salto del loop no se ve.
  const sweepX = interpolate(t, [0, 1], [-30, 130]);

  // Partículas en órbita: cada una recorre una vuelta completa por ciclo.
  const particles = new Array(18).fill(0).map((_, i) => {
    const seed = i + 1;
    const baseX = random(`px-${seed}`) * width;
    const baseY = random(`py-${seed}`) * height;
    const orbit = 14 + random(`po-${seed}`) * 26;
    const phase = random(`pp-${seed}`) * TAU;
    const size = 2 + random(`ps-${seed}`) * 4;
    const x = baseX + Math.cos(a + phase) * orbit;
    const y = baseY + Math.sin(a + phase) * orbit;
    const twinkle = 0.25 + (0.5 + Math.sin(a * 2 + phase) * 0.5) * 0.55;
    return { x, y, size, twinkle, key: i };
  });

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, overflow: "hidden" }}>
      <GradientBackground from={accentFrom} to={accentTo} />

      {/* Partículas flotantes */}
      <AbsoluteFill>
        {particles.map((p) => (
          <div
            key={p.key}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: theme.white,
              opacity: p.twinkle,
              boxShadow: `0 0 ${p.size * 3}px rgba(255,255,255,.6)`,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* Contenido central */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 8%",
          textAlign: "center",
          gap: 28,
        }}
      >
        <Pill fontSize={20}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: theme.accent,
              boxShadow: `0 0 12px ${theme.accent}`,
            }}
          />
          {brandName}
        </Pill>

        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: theme.white,
            letterSpacing: "-0.02em",
            lineHeight: 1.08,
            maxWidth: 980,
            opacity: headlineOpacity,
            textShadow: "0 8px 40px rgba(0,0,0,.5)",
          }}
        >
          {headline || title}
        </div>
      </AbsoluteFill>

      {/* Portada flotando, abajo a la derecha (periódica → loopea) */}
      <div
        style={{
          position: "absolute",
          right: "7%",
          bottom: "-6%",
          opacity: 0.96,
        }}
      >
        <FloatingCover src={coverImage} title={title} width={150} tilt={-6} />
      </div>

      {/* Barrido de luz diagonal */}
      <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: `${sweepX}%`,
            width: "22%",
            height: "140%",
            background:
              "linear-gradient(105deg, transparent, rgba(255,255,255,.12), transparent)",
            transform: "rotate(8deg)",
            filter: "blur(6px)",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
