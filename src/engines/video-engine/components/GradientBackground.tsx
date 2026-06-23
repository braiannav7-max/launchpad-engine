import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const TAU = Math.PI * 2;

interface Props {
  from: string;
  to: string;
  /**
   * Período del movimiento en frames. Por defecto = duración de la composición,
   * de modo que un ciclo completo coincide con un loop perfecto (frame 0 === frame N).
   */
  periodInFrames?: number;
  /** Intensidad del movimiento de los orbes (px). */
  amplitude?: number;
}

/**
 * Fondo de orbes en órbita + grilla sutil. Todo el movimiento es periódico:
 * posición = centro + radio·(cos/sin)(2π·frame/período). Como en frame 0 y
 * frame=período las posiciones coinciden, el resultado es un loop sin costura.
 */
export const GradientBackground: React.FC<Props> = ({
  from,
  to,
  periodInFrames,
  amplitude = 90,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const period = periodInFrames ?? durationInFrames;
  const t = (frame % period) / period; // 0 → 1 a lo largo de un ciclo
  const a = t * TAU;

  // Dos orbes en órbitas desfasadas — una vuelta completa por ciclo.
  const o1x = width * 0.28 + Math.cos(a) * amplitude;
  const o1y = height * 0.3 + Math.sin(a) * amplitude;
  const o2x = width * 0.74 + Math.cos(a + Math.PI * 0.66) * amplitude;
  const o2y = height * 0.68 + Math.sin(a + Math.PI * 0.66) * amplitude;

  // Respiración de opacidad, también periódica.
  const breath = 0.32 + Math.sin(a) * 0.06;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(38% 38% at ${o1x}px ${o1y}px, ${from}, transparent 70%)`,
          opacity: breath + 0.18,
          filter: "blur(18px)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(34% 34% at ${o2x}px ${o2y}px, ${to}, transparent 70%)`,
          opacity: breath,
          filter: "blur(18px)",
        }}
      />
      {/* Grilla sutil para textura premium (estática → no afecta el loop). */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.5,
          maskImage:
            "radial-gradient(80% 80% at 50% 50%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(80% 80% at 50% 50%, #000 30%, transparent 100%)",
        }}
      />
      {/* Viñeta para foco central. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(70% 70% at 50% 45%, transparent 40%, rgba(0,0,0,.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
