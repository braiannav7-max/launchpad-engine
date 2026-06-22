import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  extract,
  renderLanding,
  type EbookMetadata,
} from "@/engines/conversion-engine";

const MetaSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  niche: z.string().optional(),
  topic: z.string().optional(),
  targetAudience: z.string().optional(),
  objective: z.string().optional(),
  coverImage: z.string().optional(),
  mockupImage: z.string().optional(),
  buyLink: z.string().optional(),
  brandName: z.string().optional(),
  brandLogo: z.string().optional(),
  price: z.string().optional(),
  painPoints: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  outcomes: z.array(z.string()).optional(),
});

const InputSchema = z.object({
  meta: MetaSchema,
  templateId: z.string().optional(),
});

export const generateLandingFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const meta = data.meta as EbookMetadata;

    // ETAPA 1
    const extracted = extract(meta);

    // ETAPA 2 — IA (solo contenido JSON)
    const { generateLandingContent } = await import(
      "@/engines/conversion-engine/generator.server"
    );
    const content = await generateLandingContent(extracted);

    // ETAPA 3 — Template Engine (puro reemplazo)
    const html = renderLanding({ meta, content, templateId: data.templateId });

    return { html, content, extracted };
  });