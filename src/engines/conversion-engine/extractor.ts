import type { EbookMetadata, ExtractedContent } from "./types";

// ETAPA 1 — Content Extraction Layer.
// Normaliza la metadata del Ebook Engine a un objeto estructurado
// listo para que la IA genere contenido persuasivo.
// No usa IA — pura transformación.
export function extractContent(meta: EbookMetadata): ExtractedContent {
  return {
    title: meta.title?.trim() || "Tu Ebook",
    subtitle: meta.subtitle?.trim() || "",
    targetAudience: meta.targetAudience?.trim() || meta.niche?.trim() || "",
    painPoints: meta.painPoints ?? [],
    benefits: meta.benefits ?? [],
    outcomes: meta.outcomes ?? [],
    faq: [],
    cta: "QUIERO MI EBOOK AHORA",
  };
}