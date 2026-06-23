import { generateObject, generateText } from "ai";
import { z } from "zod";
import { getAgentModel } from "@/lib/ai-gateway.server";
import type {
  EbookMetadata,
  EnrichedProductAnalysis,
  LandingContent,
} from "../types";

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

export async function generateContent(
  meta: EbookMetadata,
  analysis: EnrichedProductAnalysis,
): Promise<LandingContent> {
  const agentModel = getAgentModel();

  const productTypeCopy = getProductTypeInstructions(analysis.productType);

  const system = `Sos un copywriter de respuesta directa EXPERTO. No sos un asistente genérico — sos un VENDEDOR que escribe.

Reglas absolutas:
- Nunca usés frases hechas, clichés de marketing ni palabras vacías ("revolucionario", "innovador", "solución única").
- Cada palabra vende o sobra. No hay término medio.
- El tono se adapta al producto y a la audiencia.
- Idioma: español neutro rioplatense. Sin emojis en headlines ni CTAs.

${productTypeCopy}

Estructura de la landing:
- HEADLINE: título que detiene el scroll (máx 12 palabras).
- SUBHEADLINE: promesa o complemento (1-2 líneas).
- CTA: imperativo corto ("Quiero mi acceso", "Lo quiero ahora").
- PROBLEMA: titular que duele + descripción de 2-3 líneas.
- PAIN POINTS: exactamente 4, cada uno un latch mental que engancha.
- SOLUCIÓN: titular que alivia + descripción orientada a resultado.
- BENEFICIOS: 5 items cortos (< 10 palabras cada uno), tangibles.
- INCLUYE: 4 items con título corto y descripción de 1 línea.
- OUTCOMES: 5 resultados en futuro ("Vas a lograr...", "Tendrás...").
- FAQ: 5 preguntas realistas sobre compra, envío/entrega, garantía, formato, resultados.
- GARANTÍA: título potente + texto tranquilizador.
- CTA FINAL: título que cierra la venta.

Usá los insights del análisis para afinar tono, ángulos y objeciones.`;

  const prompt = `PRODUCTO / SERVICIO:
Título: ${meta.title}
Subtítulo: ${meta.subtitle || "(sin subtítulo)"}
Público: ${analysis.enrichedAvatar}
Marca: ${meta.brandName || "Tu Marca"}

ANÁLISIS PREVIO (usá estos insights en el copy):
Tipo de producto: ${analysis.productType}
Ángulos de persuasión: ${analysis.persuasionAngles.map((a) => `${a.name}: ${a.description}`).join(" | ")}
Diferenciación: ${analysis.differentiation}
Tono recomendado: ${analysis.toneOfVoice}
Objeciones principales: ${analysis.keyObjections.map((o) => `${o.objection} → ${o.rebuttal}`).join(" | ")}

Problemas del cliente: ${(meta.painPoints ?? []).join(", ") || "(inferir del análisis)"}
Beneficios: ${(meta.benefits ?? []).join(", ") || "(inferir)"}

Generá el contenido completo de la landing page.`;

  try {
    const { object } = await generateObject({
      model: agentModel.model,
      schema: LandingSchema,
      system,
      prompt,
    });
    return object as LandingContent;
  } catch (err) {
    console.error(`[sales-closer] ${agentModel.provider} failed:`, err);
    const fallback = await generateText({
      model: agentModel.model,
      system:
        system +
        '\n\nRespondé SOLO con un objeto JSON válido. Sin markdown, sin texto extra. Schema: headline, subheadline, cta, ctaSecondary, problemTitle, problemDescription, painPoints[], solutionTitle, solutionDescription, benefits[], includes[{title,description}], outcomes[], faq[{q,a}], guaranteeTitle, guaranteeText, finalCtaTitle.',
      prompt,
    });
    const parsed = extractJson(fallback.text);
    return LandingSchema.parse(parsed) as LandingContent;
  }
}

function extractJson(raw: string): unknown {
  let text = raw.trim();
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) text = text.slice(start, end + 1);
  try {
    return JSON.parse(text);
  } catch {
    const repaired = repairJsonStringQuotes(text);
    return JSON.parse(repaired);
  }
}

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
        let j = i + 1;
        while (j < text.length && /\s/.test(text[j])) j++;
        const next = text[j];
        if (
          next === "," || next === "}" || next === "]" || next === ":" || j >= text.length
        ) {
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

function getProductTypeInstructions(
  type: EnrichedProductAnalysis["productType"],
): string {
  const map: Record<string, string> = {
    ebook:
      "Vendés un EBOOK / DIGITAL. El foco: conocimiento que transforma, acceso inmediato, formato descargable. El cliente COMPRA para resolver un problema o adquirir una habilidad. Destacá resultados, autoridad y facilidad de consumo.",
    digital_product:
      "Vendés un PRODUCTO DIGITAL. El foco: acceso inmediato, sin stock, sin espera. Destacá practicidad, valor percibido y resultados.",
    physical_product:
      "Vendés un PRODUCTO FÍSICO. El foco: calidad, materiales, envío, garantía. Destacá características tangibles, durabilidad, experiencia unboxing y satisfacción.",
    service:
      "Vendés un SERVICIO. El foco: autoridad, confianza, proceso, resultados. Destacá experiencia del proveedor, casos de éxito y proceso claro.",
    course:
      "Vendés un CURSO / FORMACIÓN. El foco: plan de estudios, instructor, resultados de alumnos. Destacá estructura, materiales incluidos y certificación.",
    coaching:
      "Vendés COACHING / MENTORÍA. El foco: transformación personal, acompañamiento, accountability. Destacá el método, resultados y acceso al coach.",
    software:
      "Vendés SOFTWARE / SaaS. El foco: funcionalidades, ahorro de tiempo, ROI. Destacá features clave, facilidad de uso y soporte.",
    custom:
      "Vendés un PRODUCTO o SERVICIO PERSONALIZADO. Adaptá el tono al nicho específico. El foco: exclusividad, atención personalizada, resultado único.",
  };
  return map[type] || map.custom;
}
