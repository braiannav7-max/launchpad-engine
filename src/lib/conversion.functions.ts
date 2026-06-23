import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  type EbookMetadata,
  type EnrichedProductAnalysis,
  type ReviewResult,
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
  skipReview: z.boolean().optional(),
});

export const generateLandingFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const meta = data.meta as EbookMetadata;

    const { runPipeline } = await import(
      "@/engines/conversion-engine/agents/pipeline"
    );
    const result = await runPipeline({
      meta,
      templateId: data.templateId,
      skipReview: data.skipReview,
    });

    return {
      html: result.html,
      content: result.content,
      analysis: result.analysis,
      review: result.review,
    };
  });