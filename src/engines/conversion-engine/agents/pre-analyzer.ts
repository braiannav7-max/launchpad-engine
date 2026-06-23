import { generateObject } from "ai";
import { z } from "zod";
import { getAgentModel } from "@/lib/ai-gateway.server";
import type { EbookMetadata, EnrichedProductAnalysis } from "../types";

const AnalysisSchema = z.object({
  productType: z.enum([
    "ebook",
    "digital_product",
    "physical_product",
    "service",
    "course",
    "coaching",
    "software",
    "custom",
  ]),
  persuasionAngles: z.array(
    z.object({ name: z.string(), description: z.string(), hook: z.string() }),
  ),
  enrichedAvatar: z.string(),
  keyObjections: z.array(
    z.object({ objection: z.string(), rebuttal: z.string() }),
  ),
  differentiation: z.string(),
  emotionalTriggers: z.array(z.string()),
  toneOfVoice: z.string(),
  pricePositioning: z.string(),
});

export async function preAnalyze(
  meta: EbookMetadata,
): Promise<EnrichedProductAnalysis> {
  const agentModel = getAgentModel();

  const system = `Eres un estratega de marketing senior con 20 años de experiencia en posicionamiento y copy.
Analizás productos, servicios y audiencias para extraer insights que un copywriter pueda usar.

Tu tarea es analizar el producto o servicio proporcionado y devolver un análisis estructurado.
Sé específico, evita genéricos. Cada insight debe ser accionable para un copywriter.

Si falta información, inferila del título, nicho y audiencia.`;

  const prompt = `Analizá este producto/servicio para generar una landing page de alto impacto:

Título: ${meta.title}
Subtítulo: ${meta.subtitle || "(sin subtítulo)"}
Nicho: ${meta.niche || "(no especificado)"}
Público objetivo: ${meta.targetAudience || "(inferir)"}
Objetivo / transformación: ${meta.objective || "(inferir)"}
Marca: ${meta.brandName || "(sin marca)"}
Problemas que resuelve: ${(meta.painPoints ?? []).join(" | ") || "(inferir)"}
Beneficios: ${(meta.benefits ?? []).join(" | ") || "(inferir)"}

Determiná:
1. Tipo de producto (ebook, digital_product, physical_product, service, course, coaching, software, custom)
2. 3-5 ángulos de persuasión únicos con un hook cada uno
3. Descripción detallada del avatar del cliente ideal
4. Principales objeciones de compra con su rebuttal
5. Diferenciación clave vs competidores
6. Gatillos emocionales principales
7. Tono de voz recomendado
8. Posicionamiento de precio`;

  try {
    const { object } = await generateObject({
      model: agentModel.model,
      schema: AnalysisSchema,
      system,
      prompt,
    });
    return object as EnrichedProductAnalysis;
  } catch (err) {
    console.error(`[pre-analyzer] ${agentModel.provider} failed:`, err);
    return defaultAnalysis(meta);
  }
}

function defaultAnalysis(meta: EbookMetadata): EnrichedProductAnalysis {
  return {
    productType: detectProductType(meta),
    persuasionAngles: [
      {
        name: "Transformación",
        description: "Mostrar el cambio de antes a después",
        hook: `De ${meta.painPoints?.[0] || "donde estás"} a donde querés estar`,
      },
      {
        name: "Resultados",
        description: "Enfocarse en los beneficios medibles",
        hook: "Resultados que hablan solos",
      },
    ],
    enrichedAvatar: meta.targetAudience || meta.niche || "Público general",
    keyObjections: [
      {
        objection: "No tengo tiempo",
        rebuttal: "Está diseñado para personas ocupadas",
      },
    ],
    differentiation: meta.objective || "Propuesta única de valor",
    emotionalTriggers: ["deseo", "urgencia", "exclusividad"],
    toneOfVoice: "directo, persuasivo, cercano",
    pricePositioning: "valor",
  };
}

function detectProductType(
  meta: EbookMetadata,
): EnrichedProductAnalysis["productType"] {
  const text = [meta.title, meta.subtitle, meta.niche, meta.objective]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/curso|course|masterclass|taller|workshop|formación/.test(text)) return "course";
  if (/coach|coaching|mentoría|mentoring|asesoría/.test(text)) return "coaching";
  if (/software|app|saaS|plataforma|suscripción/.test(text)) return "software";
  if (/físico|envío|producto|kit|caja|box|talle/.test(text)) return "physical_product";
  if (/servicio|consultoría|asesoramiento/.test(text)) return "service";
  if (/ebook|guía|manual|pdf|digital|descargable/.test(text)) return "ebook";
  return "digital_product";
}
