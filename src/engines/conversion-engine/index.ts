// Conversion Engine — orquesta las 3 etapas y produce un index.html autocontenido.
import type {
  EbookMetadata,
  ExtractedContent,
  LandingContent,
  TemplateVars,
} from "./types";
import { extractContent } from "./extractor";
import { getTemplate } from "./templates";
import { escapeHtml } from "./template-engine";

export type { EbookMetadata, ExtractedContent, LandingContent } from "./types";
export { listTemplates } from "./templates";

function painPointsHtml(points: string[]): string {
  return points
    .map(
      (p, i) =>
        `<div class="card"><div class="ic">0${i + 1}</div><h3>${escapeHtml(
          p,
        )}</h3></div>`,
    )
    .join("\n");
}

function checksHtml(items: string[]): string {
  return items.map((b) => `<li>${escapeHtml(b)}</li>`).join("\n");
}

function includesHtml(items: { title: string; description: string }[]): string {
  return items
    .map(
      (it, i) =>
        `<div class="card"><div class="ic">${String(i + 1).padStart(
          2,
          "0",
        )}</div><h3>${escapeHtml(it.title)}</h3><p>${escapeHtml(it.description)}</p></div>`,
    )
    .join("\n");
}

function outcomesHtml(items: string[]): string {
  return items
    .map(
      (o) =>
        `<div class="benefit"><span class="dot"></span><span>${escapeHtml(o)}</span></div>`,
    )
    .join("\n");
}

function faqHtml(items: { q: string; a: string }[]): string {
  return items
    .map(
      (f) =>
        `<details><summary>${escapeHtml(f.q)}</summary><p>${escapeHtml(f.a)}</p></details>`,
    )
    .join("\n");
}

export interface BuildLandingInput {
  meta: EbookMetadata;
  content: LandingContent;
  templateId?: string;
}

export function buildVars(input: BuildLandingInput): TemplateVars {
  const { meta, content } = input;
  return {
    TITLE: meta.title,
    HEADLINE: content.headline,
    SUBHEADLINE: content.subheadline,
    COVER_IMAGE: meta.coverImage || "",
    MOCKUP_IMAGE: meta.mockupImage || meta.coverImage || "",
    CTA: content.cta,
    CTA_SECONDARY: content.ctaSecondary,
    BUY_LINK: meta.buyLink || "#comprar",
    BRAND_NAME: meta.brandName || "Tu Marca",
    PROBLEM_TITLE: content.problemTitle,
    PROBLEM_DESCRIPTION: content.problemDescription,
    PAIN_POINTS_HTML: painPointsHtml(content.painPoints),
    SOLUTION_TITLE: content.solutionTitle,
    SOLUTION_DESCRIPTION: content.solutionDescription,
    BENEFITS_HTML: checksHtml(content.benefits),
    INCLUDES_HTML: includesHtml(content.includes),
    OUTCOMES_HTML: outcomesHtml(content.outcomes),
    FAQ_HTML: faqHtml(content.faq),
    GUARANTEE_TITLE: content.guaranteeTitle,
    GUARANTEE_TEXT: content.guaranteeText,
    FINAL_CTA_TITLE: content.finalCtaTitle,
    META_TITLE: `${meta.title}${meta.subtitle ? " — " + meta.subtitle : ""}`,
    META_DESCRIPTION: content.subheadline,
    // Hooks listos para SEO Engine y Analytics Engine futuros.
    ANALYTICS_HEAD: "",
    ANALYTICS_BODY: "",
  };
}

export function renderLanding(input: BuildLandingInput): string {
  const tpl = getTemplate(input.templateId || "ebook-landing-01");
  return tpl.render(buildVars(input));
}

/** Helper sincrono — útil para tests sin IA. */
export function extract(meta: EbookMetadata): ExtractedContent {
  return extractContent(meta);
}