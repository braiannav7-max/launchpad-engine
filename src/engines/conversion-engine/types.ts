// Conversion Engine — shared types

/** Raw ebook metadata (from Ebook Engine: metadata.json + assets). */
export interface EbookMetadata {
  title: string;
  subtitle?: string;
  niche?: string;
  topic?: string;
  targetAudience?: string;
  objective?: string;
  coverImage?: string; // URL or data URI
  mockupImage?: string;
  buyLink?: string;
  brandName?: string;
  brandLogo?: string;
  price?: string;
  // Optional pre-extracted hints
  painPoints?: string[];
  benefits?: string[];
  outcomes?: string[];
}

/** ETAPA 1: Content Extraction Layer output (structured ebook data). */
export interface ExtractedContent {
  title: string;
  subtitle: string;
  targetAudience: string;
  painPoints: string[];
  benefits: string[];
  outcomes: string[];
  faq: { q: string; a: string }[];
  cta: string;
}

/** ETAPA 2: Landing Content Generator (IA) output — JSON only. */
export interface LandingContent {
  headline: string;
  subheadline: string;
  cta: string;
  ctaSecondary: string;
  problemTitle: string;
  problemDescription: string;
  painPoints: string[];
  solutionTitle: string;
  solutionDescription: string;
  benefits: string[];
  includes: { title: string; description: string }[];
  outcomes: string[];
  faq: { q: string; a: string }[];
  guaranteeTitle: string;
  guaranteeText: string;
  finalCtaTitle: string;
}

/** ETAPA 3: Template Engine — variables passed to a template. */
export interface TemplateVars extends Record<string, string> {
  TITLE: string;
  HEADLINE: string;
  SUBHEADLINE: string;
  COVER_IMAGE: string;
  MOCKUP_IMAGE: string;
  CTA: string;
  CTA_SECONDARY: string;
  BUY_LINK: string;
  BRAND_NAME: string;
  PROBLEM_TITLE: string;
  PROBLEM_DESCRIPTION: string;
  PAIN_POINTS_HTML: string;
  SOLUTION_TITLE: string;
  SOLUTION_DESCRIPTION: string;
  BENEFITS_HTML: string;
  INCLUDES_HTML: string;
  OUTCOMES_HTML: string;
  FAQ_HTML: string;
  GUARANTEE_TITLE: string;
  GUARANTEE_TEXT: string;
  FINAL_CTA_TITLE: string;
  META_TITLE: string;
  META_DESCRIPTION: string;
  ANALYTICS_HEAD: string;
  ANALYTICS_BODY: string;
}

/** A reusable landing page template. */
export interface LandingTemplate {
  id: string;
  name: string;
  description: string;
  render: (vars: TemplateVars) => string;
}