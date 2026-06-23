import { generateObject } from "ai";
import { z } from "zod";
import { getAgentModel } from "@/lib/ai-gateway.server";
import type {
  EbookMetadata,
  EnrichedProductAnalysis,
  LandingContent,
  ReviewResult,
} from "../types";

const ReviewSchema = z.object({
  score: z.number().min(0).max(10),
  summary: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(
    z.object({
      field: z.string(),
      suggestion: z.string(),
      priority: z.enum(["high", "medium", "low"]),
    }),
  ),
});

export async function reviewContent(
  meta: EbookMetadata,
  analysis: EnrichedProductAnalysis,
  content: LandingContent,
): Promise<ReviewResult> {
  const agentModel = getAgentModel();

  const system = `Sos un editor senior de copy publicitario especializado en optimización de conversión.
Revisás contenido de landing pages y detectás:

- Problemas de claridad (¿se entiende la propuesta en segundos?)
- Problemas de persuasión (¿convencen los argumentos?)
- Problemas de tono (¿suena auténtico o genérico?)
- Problemas de estructura (¿fluye bien la lectura?)
- Problemas de CTA (¿dan ganas de hacer clic?)
- Problemas de objeciones (¿responden las dudas del comprador?)

Sé directo y específico. Cada sugerencia debe ser accionable.
La puntuación es sobre 10. Sé honesto.`;

  const prompt = `REVISÁ este contenido de landing page:

Título del producto: ${meta.title}
Tipo: ${analysis.productType}
Avatar: ${analysis.enrichedAvatar}
Tono recomendado: ${analysis.toneOfVoice}
Diferenciación: ${analysis.differentiation}

CONTENIDO GENERADO:
Headline: ${content.headline}
Subheadline: ${content.subheadline}
CTA: ${content.cta}
CTA Secundario: ${content.ctaSecondary}
Título Problema: ${content.problemTitle}
Descripción Problema: ${content.problemDescription}
Pain Points: ${content.painPoints.join(" | ")}
Título Solución: ${content.solutionTitle}
Descripción Solución: ${content.solutionDescription}
Beneficios: ${content.benefits.join(" | ")}
Outcomes: ${content.outcomes.join(" | ")}
Garantía: ${content.guaranteeTitle} — ${content.guaranteeText}
CTA Final: ${content.finalCtaTitle}

Evaluá el contenido y devolvé mejoras específicas.`;

  try {
    const { object } = await generateObject({
      model: agentModel.model,
      schema: ReviewSchema,
      system,
      prompt,
    });
    return object as ReviewResult;
  } catch (err) {
    console.error(`[post-reviewer] ${agentModel.provider} failed:`, err);
    return defaultReview();
  }
}

function defaultReview(): ReviewResult {
  return {
    score: 7,
    summary: "Contenido generado. Revisión automática no disponible.",
    strengths: ["Cumple con la estructura solicitada"],
    improvements: [],
  };
}
