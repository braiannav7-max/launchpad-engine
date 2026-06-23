import { createStart, createMiddleware } from "@tanstack/react-start";
import { z } from "zod";
import { renderErrorPage } from "./lib/error-page";

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
  skipImage: z.boolean().optional(),
});

const apiMiddleware = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url);
  if (url.pathname === "/api/generate") {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "POST, OPTIONS",
          "access-control-allow-headers": "Content-Type",
        },
      });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }
    try {
      const body = await request.json();
      const data = InputSchema.parse(body);
      const { runPipeline } = await import(
        "./engines/conversion-engine/agents/pipeline"
      );
      const result = await runPipeline({
        meta: data.meta as any,
        templateId: data.templateId,
        skipReview: data.skipReview,
        skipImage: data.skipImage,
      });
      return new Response(
        JSON.stringify({ html: result.html, heroImageUrl: result.heroImageUrl ?? null }),
        { status: 200, headers: { "content-type": "application/json; charset=utf-8" } },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error generando landing";
      return new Response(JSON.stringify({ error: message }), {
        status: 400,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }
  }
  return next();
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [apiMiddleware, errorMiddleware],
}));
