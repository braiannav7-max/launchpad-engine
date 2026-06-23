import type { LandingTemplate } from "../types";
import { ebookLandingTemplate } from "./ebook-landing";
import { ebookLandingPremiumTemplate } from "./ebook-landing-premium";

// Registry — add new templates here without touching engine logic.
export const templates: Record<string, LandingTemplate> = {
  "ebook-landing-01": ebookLandingTemplate,
  "ebook-landing-premium-01": ebookLandingPremiumTemplate,
};

export function getTemplate(id: string): LandingTemplate {
  const tpl = templates[id];
  if (!tpl) throw new Error(`Template not found: ${id}`);
  return tpl;
}

export function listTemplates() {
  return Object.values(templates).map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
  }));
}