import "./lib/error-capture";

import { z } from "zod";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import type { EbookMetadata } from "./engines/conversion-engine";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

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

async function handleApiGenerate(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const data = InputSchema.parse(body);
    const meta = data.meta as EbookMetadata;

    const { runPipeline } = await import(
      "./engines/conversion-engine/agents/pipeline"
    );
    const result = await runPipeline({
      meta,
      templateId: data.templateId,
      skipReview: data.skipReview,
    });

    return new Response(JSON.stringify({ html: result.html }), {
      status: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error generando landing";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
}

async function handleApiGeneratePreflight(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "Content-Type",
    },
  });
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);

      if (url.pathname === "/api/generate") {
        if (request.method === "OPTIONS") return handleApiGeneratePreflight();
        if (request.method === "POST") return handleApiGenerate(request);
        return new Response("Method not allowed", { status: 405 });
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
