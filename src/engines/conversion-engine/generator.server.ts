import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import type { ExtractedContent, LandingContent } from "./types";

// ETAPA 2 — Landing Content Generator (IA).
// Solo genera CONTENIDO estructurado en JSON. Nunca HTML, CSS ni JS.
const LandingSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  cta: z.string(),
  ctaSecondary: z.string(),
  problemTitle: z.string(),
  problemDescription: z.string(),
  painPoints: z.array(z.string()).min(3).max(4),
  solutionTitle: z.string(),
  solutionDescription: z.string(),
  benefits: z.array(z.string()).min(4).max(6),
  includes: z
    .array(z.object({ title: z.string(), description: z.string() }))
    .min(3)
    .max(4),
  outcomes: z.array(z.string()).min(4).max(6),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).min(4).max(6),
  guaranteeTitle: z.string(),
  guaranteeText: z.string(),
  finalCtaTitle: z.string(),
});

export async function generateLandingContent(
  extracted: ExtractedContent,
): Promise<LandingContent> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY no configurada");

  const gateway = createLovableAiGatewayProvider(apiKey);
  const model = gateway("google/gemini-3-flash-preview");

  const system = `Eres un copywriter directo de respuesta experto en landing pages de venta para ebooks digitales en español.
Tu trabajo es producir copy persuasivo, claro, sin clichés genéricos, orientado a conversión.
Reglas:
- Idioma: español neutro.
- Sin emojis en headline ni subheadline.
- Headline en máximo 12 palabras, con beneficio claro.
- Beneficios y resultados como frases cortas (máx 12 palabras).
- FAQ realistas para un ebook digital (entrega, formato, garantía, soporte, dispositivos, tiempo de resultados).
- NUNCA generes HTML, CSS ni JavaScript. Solo el contenido en los campos del schema.`;

  const prompt = `Datos del ebook:
Título: ${extracted.title}
Subtítulo: ${extracted.subtitle}
Público objetivo: ${extracted.targetAudience}
Problemas detectados: ${extracted.painPoints.join(" | ") || "(inferir del título y público)"}
Beneficios: ${extracted.benefits.join(" | ") || "(inferir)"}
Resultados esperados: ${extracted.outcomes.join(" | ") || "(inferir)"}

Genera el contenido completo de la landing page de venta.`;

  const result = await generateText({
    model,
    system,
    prompt,
    experimental_output: Output.object({ schema: LandingSchema }),
  });

  // AI SDK v6 exposes structured output on `experimental_output`
  return (result as unknown as { experimental_output: LandingContent }).experimental_output;
}