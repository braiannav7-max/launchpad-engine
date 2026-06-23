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

export interface PipelineInput {
  meta: EbookMetadata;
  templateId?: string;
  skipReview?: boolean;
}

export interface PipelineOutput {
  analysis: EnrichedProductAnalysis;
  content: LandingContent;
  review: ReviewResult | null;
  html: string;
}

export async function runPipeline(input: PipelineInput): Promise<PipelineOutput> {
  const { meta, templateId, skipReview } = input;

  const extracted = extractContent(meta);

  const analysis = await preAnalyze(meta);

  const content = await generateContent(meta, analysis);

  const review = skipReview
    ? null
    : await reviewContent(meta, analysis, content);

  const html = renderLanding({ meta, content, templateId });

  return { analysis, content, review, html };
}
