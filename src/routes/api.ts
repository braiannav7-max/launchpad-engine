import { createServerFn, eventHandler, toResponse } from "@tanstack/react-start";
import { z } from "zod";

const MetaSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  niche: z.string().optional(),
  topic: z.string().optional(),
  targetAudience: z.string().optional(),
  objective: z.string().optional(),
  coverImage: z.string().optional(),
  mockupImage: z.string().optional(),
  heroVideo: z.string().optional(),
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
  skipReview: z.boolean().optional(),
  skipImage: z.boolean().optional(),
});

export const generateLanding = createServerFn({ method: "POST" })
  .validator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const { runPipeline } = await import(
      "../engines/conversion-engine/agents/pipeline"
    );
    const result = await runPipeline({
      meta: data.meta as any,
      templateId: data.templateId,
      skipReview: data.skipReview,
      skipImage: data.skipImage,
    });
    return { html: result.html, heroImageUrl: result.heroImageUrl ?? null };
  });

export const apiHandler = eventHandler(async (event) => {
  if (event.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const body = await readBody(event);
  const parsed = InputSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.message }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  const result = await generateLanding({ data: parsed.data });
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
});
