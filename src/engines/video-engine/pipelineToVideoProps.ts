// Adaptador: salida del conversion-engine → props de video.
// Reusa headline/painPoints/benefits/cover/brand que el pipeline ya generó.
import type { EbookMetadata, LandingContent } from "../conversion-engine/types";
import type { VideoProps } from "./schema";
import { defaultAccent } from "./theme";

export interface ToVideoPropsInput {
  meta: EbookMetadata;
  content: LandingContent;
  accent?: { from: string; to: string };
}

function clean(list: string[] | undefined, max: number): string[] {
  return (list ?? [])
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
}

export function pipelineToVideoProps(input: ToVideoPropsInput): VideoProps {
  const { meta, content, accent } = input;

  // Bullets de venta: priorizamos outcomes, completamos con benefits.
  const bullets = clean(
    [...(content.outcomes ?? []), ...(content.benefits ?? [])],
    5,
  );

  return {
    title: meta.title,
    headline: content.headline || meta.title,
    subheadline: content.subheadline || meta.subtitle || "",
    brandName: meta.brandName || "Tu Marca",
    cta: content.cta || "QUIERO ACCEDER",
    coverImage: meta.coverImage || meta.mockupImage || undefined,
    bullets: bullets.length ? bullets : clean(content.benefits, 5),
    painPoints: clean(content.painPoints, 4),
    price: meta.price || undefined,
    accentFrom: accent?.from || defaultAccent.from,
    accentTo: accent?.to || defaultAccent.to,
  };
}
