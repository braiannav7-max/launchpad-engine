import type {
  EbookMetadata,
  EnrichedProductAnalysis,
  LandingContent,
  ReviewResult,
} from "../types";
import { extractContent } from "../extractor";
import { renderLanding } from "../index";
import { preAnalyze } from "./pre-analyzer";
import { generateContent } from "./sales-closer";
import { reviewContent } from "./post-reviewer";
import { generateHeroImage } from "./image-generator";

export interface PipelineInput {
  meta: EbookMetadata;
  templateId?: string;
  skipReview?: boolean;
  skipImage?: boolean;
}

export interface PipelineOutput {
  analysis: EnrichedProductAnalysis;
  content: LandingContent;
  review: ReviewResult | null;
  html: string;
  heroImageUrl?: string | null;
}

export async function runPipeline(input: PipelineInput): Promise<PipelineOutput> {
  const { meta, templateId, skipReview, skipImage } = input;

  const extracted = extractContent(meta);

  const analysis = await preAnalyze(meta);

  const content = await generateContent(meta, analysis);

  const review = skipReview
    ? null
    : await reviewContent(meta, analysis, content);

  let heroImageUrl: string | null = null;
  if (!skipImage && !meta.coverImage) {
    heroImageUrl = await generateHeroImage(meta);
    if (heroImageUrl) {
      meta.coverImage = heroImageUrl;
      meta.mockupImage = meta.mockupImage || heroImageUrl;
    }
  }

  const html = renderLanding({ meta, content, templateId });

  return { analysis, content, review, html, heroImageUrl };
}
