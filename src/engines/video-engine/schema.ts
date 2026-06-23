// Video Engine — esquema de props de los videos.
// Derivado del LandingContent/EbookMetadata que ya produce el conversion-engine:
// NO se genera data nueva, se reutiliza la salida del pipeline.
import { z } from "zod";

export const videoPropsSchema = z.object({
  /** Nombre del producto / ebook. */
  title: z.string(),
  /** Titular de venta (gancho principal). */
  headline: z.string(),
  /** Subtítulo / promesa. */
  subheadline: z.string(),
  /** Nombre de marca (footer + branding). */
  brandName: z.string(),
  /** Texto del botón / llamado a la acción. */
  cta: z.string(),
  /** Portada del ebook (URL o data-URI). Opcional. */
  coverImage: z.string().optional(),
  /** Beneficios/resultados — bullets que se animan uno a uno. */
  bullets: z.array(z.string()),
  /** Dolores del avatar — usados en el bloque "problema". */
  painPoints: z.array(z.string()),
  /** Precio mostrado (ej. "USD 27"). Opcional. */
  price: z.string().optional(),
  /** Acento de color del gradiente (cae al de marca). */
  accentFrom: z.string(),
  accentTo: z.string(),
});

export type VideoProps = z.infer<typeof videoPropsSchema>;

// ─── Formatos de video ─────────────────────────────────────────────────

export const FPS = 30;

export const FORMATS = {
  /** VSL horizontal para venta (YouTube, web, embed). */
  vsl: { width: 1920, height: 1080, durationInFrames: 75 * FPS }, // 75s
  /** Reel vertical para ads / IG / TikTok. */
  reel: { width: 1080, height: 1920, durationInFrames: 20 * FPS }, // 20s
  /** Loop perfecto para fondo de hero de la landing. */
  hero: { width: 1280, height: 720, durationInFrames: 6 * FPS }, // 6s loop
} as const;

export type FormatId = keyof typeof FORMATS;

export const COMPOSITION_IDS = {
  vsl: "VSL",
  reel: "AdReel",
  hero: "HeroLoop",
} as const;

// ─── Props de ejemplo (preview en Studio / Player sin pipeline) ─────────

export const demoVideoProps: VideoProps = {
  title: "Productividad Radical",
  headline: "Recuperá tu tiempo en 30 días con un sistema simple y probado",
  subheadline: "El método paso a paso para enfocarte en lo que de verdad importa.",
  brandName: "BraianOS",
  cta: "QUIERO EMPEZAR HOY",
  coverImage:
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&q=80",
  bullets: [
    "Sistema paso a paso para enfocarte",
    "Plantillas listas para usar",
    "Casos reales aplicados",
    "Resultados medibles en 30 días",
  ],
  painPoints: [
    "Te distraés constantemente",
    "Trabajás mucho y avanzás poco",
    "No sabés por dónde empezar",
  ],
  price: "USD 27",
  accentFrom: "#7c3aed",
  accentTo: "#f54900",
};
