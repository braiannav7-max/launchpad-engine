import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import type { ExtractedContent, LandingContent } from "./types";

// ETAPA 2 — Landing Content Generator (IA).
// Solo genera CONTENIDO estructurado en JSON. Nunca HTML, CSS ni JS.
// Schema sin min/max ni constraints — Gemini structured output rinde mejor
// con schemas simples. El conteo se controla en el prompt.
const LandingSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  cta: z.string(),
  ctaSecondary: z.string(),
  problemTitle: z.string(),
  problemDescription: z.string(),
  painPoints: z.array(z.string()),
  solutionTitle: z.string(),
  solutionDescription: z.string(),
  benefits: z.array(z.string()),
  includes: z.array(z.object({ title: z.string(), description: z.string() })),
  outcomes: z.array(z.string()),
  faq: z.array(z.object({ q: z.string(), a: z.string() })),
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

  const system = `Eres un copywriter de respuesta directa experto en landing pages de venta para ebooks digitales en español.
Produces copy persuasivo, claro, orientado a conversión, sin clichés.
Reglas estrictas:
- Idioma: español neutro. Sin emojis en headline/subheadline.
- painPoints: exactamente 4 items, frases cortas.
- benefits: 5 items, frases de máximo 10 palabras.
- includes: 4 items con title corto y description de 1 frase.
- outcomes: 5 items, frases cortas en futuro ("Lograrás...", "Tendrás...").
- faq: 5 preguntas frecuentes realistas para un ebook digital (entrega, formato, dispositivos, garantía, tiempo de resultados).
- Si faltan datos del ebook, infiere a partir del título.
- NUNCA HTML/CSS/JS. Solo texto plano en los campos del schema.`;

  const prompt = `Datos del ebook:
Título: ${extracted.title}
Subtítulo: ${extracted.subtitle}
Público objetivo: ${extracted.targetAudience}
Problemas detectados: ${extracted.painPoints.join(" | ") || "(inferir del título y público)"}
Beneficios: ${extracted.benefits.join(" | ") || "(inferir)"}
Resultados esperados: ${extracted.outcomes.join(" | ") || "(inferir)"}

Genera el contenido completo de la landing page de venta.`;

  let result;
  try {
    result = await generateText({
    model,
    system,
    prompt,
    experimental_output: Output.object({ schema: LandingSchema }),
    });
  } catch (err) {
    console.error("[conversion-engine] structured output failed:", err);
    // Fallback: pedir JSON libre y parsear
    const fallback = await generateText({
      model,
      system:
        system +
        "\n\nResponde EXCLUSIVAMENTE con un objeto JSON válido (sin markdown, sin ```), con estas claves: headline, subheadline, cta, ctaSecondary, problemTitle, problemDescription, painPoints (array de strings), solutionTitle, solutionDescription, benefits (array de strings), includes (array de objetos {title, description}), outcomes (array de strings), faq (array de objetos {q, a}), guaranteeTitle, guaranteeText, finalCtaTitle.",
      prompt,
    });
    const text = fallback.text.trim().replace(/^```json\s*|\s*```$/g, "");
    const parsed = JSON.parse(text);
    return LandingSchema.parse(parsed) as LandingContent;
  }

  return result.experimental_output as LandingContent;
}