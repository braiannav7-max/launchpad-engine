// Video Engine — tema visual compartido por todas las composiciones.
// Mismos colores/gradiente que las landings premium para coherencia de marca.

export const theme = {
  bg: "#0b0b14",
  bgAlt: "#10101c",
  ink: "#e9e9f1",
  inkSoft: "#c9c9d6",
  muted: "#9b9bad",
  accent: "#ff7a18",
  accentDeep: "#f54900",
  violet: "#7c3aed",
  white: "#ffffff",
  // Gradiente principal (CTA, acentos)
  gradient: "linear-gradient(135deg, #7c3aed 0%, #f54900 100%)",
  gradientWarm: "linear-gradient(135deg, #ff7a18 0%, #f54900 100%)",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
} as const;

export type Theme = typeof theme;

/** Paleta de acento personalizable por video (cae al default de marca). */
export interface AccentPalette {
  from: string;
  to: string;
}

export const defaultAccent: AccentPalette = {
  from: theme.violet,
  to: theme.accentDeep,
};
