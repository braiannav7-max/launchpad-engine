import { generateObject, generateText } from "ai";
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

  // Intento 1: generateObject (response_format json_object + parse).
  try {
    const { object } = await generateObject({
      model,
      schema: LandingSchema,
      system,
      prompt,
    });
    return object as LandingContent;
  } catch (err) {
    console.error("[conversion-engine] generateObject failed:", err);
  }

  // Fallback: pedir JSON crudo + parse robusto.
  const fallback = await generateText({
    model,
    system:
      system +
      '\n\nResponde EXCLUSIVAMENTE con un objeto JSON válido. Sin markdown, sin texto antes ni después, sin comentarios. Escapa correctamente las comillas dentro de strings (usa \\"). Claves: headline, subheadline, cta, ctaSecondary, problemTitle, problemDescription, painPoints (string[]), solutionTitle, solutionDescription, benefits (string[]), includes ({title,description}[]), outcomes (string[]), faq ({q,a}[]), guaranteeTitle, guaranteeText, finalCtaTitle.',
    prompt,
  });
  const parsed = extractJson(fallback.text);
  return LandingSchema.parse(parsed) as LandingContent;
}

function extractJson(raw: string): unknown {
  let text = raw.trim();
  console.log("[conversion-engine] raw model output:\n" + raw);
  // strip markdown fences
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  // grab first { ... last }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) text = text.slice(start, end + 1);
  try {
    return JSON.parse(text);
  } catch {
    // Reparación heurística: escapar comillas dentro de valores string.
    const repaired = repairJsonStringQuotes(text);
    return JSON.parse(repaired);
  }
}

/**
 * Repara comillas dobles no escapadas dentro de valores string del JSON.
 * Recorre el texto carácter a carácter; cuando está dentro de un string,
 * si encuentra una `"` que no cierra el string (no le sigue `,`, `}`, `]`, `:` o whitespace+esos),
 * la escapa.
 */
function repairJsonStringQuotes(text: string): string {
  let out = "";
  let inStr = false;
  let escape = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (escape) {
      out += c;
      escape = false;
      continue;
    }
    if (c === "\\") {
      out += c;
      escape = true;
      continue;
    }
    if (c === '"') {
      if (!inStr) {
        inStr = true;
        out += c;
      } else {
        // ¿es realmente cierre? mira el siguiente non-space
        let j = i + 1;
        while (j < text.length && /\s/.test(text[j])) j++;
        const next = text[j];
        if (next === "," || next === "}" || next === "]" || next === ":" || j >= text.length) {
          inStr = false;
          out += c;
        } else {
          out += '\\"';
        }
      }
      continue;
    }
    out += c;
  }
  return out;
}