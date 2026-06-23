import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const MAGNIFIC_MCP_URL = "https://mcp.magnific.com";
const MAGNIFIC_API_KEY = process.env.MAGNIFIC_API_KEY;

export async function generateHeroImage(meta: {
  title: string;
  subtitle?: string;
  niche?: string;
}): Promise<string | null> {
  if (!MAGNIFIC_API_KEY) return null;

  const prompt = buildImagePrompt(meta);
  const transport = new StreamableHTTPClientTransport(new URL(MAGNIFIC_MCP_URL), {
    headers: { Authorization: `Bearer ${MAGNIFIC_API_KEY}` },
  });

  const client = new Client(
    { name: "launchpad-engine", version: "1.0.0" },
    { capabilities: {} },
  );

  try {
    await client.connect(transport);

    const result = await client.request(
      {
        method: "tools/call",
        params: {
          name: "generate-image",
          arguments: {
            prompt,
            aspect_ratio: "3:2",
            style: "photographic",
            negative_prompt: "text, words, letters, watermark, signature, low quality, blurry",
          },
        },
      },
      {},
    );

    const content = result.content?.[0] as any;
    const imageUrl = content?.data?.url || content?.url || content?.text || null;

    return imageUrl;
  } catch (error) {
    console.error("[image-generator] Magnific error:", error);
    return null;
  } finally {
    await client.close().catch(() => {});
  }
}

function buildImagePrompt(meta: { title: string; subtitle?: string; niche?: string }): string {
  const title = meta.title || "";
  const niche = meta.niche || "";
  return `Professional book cover hero image for "${title}". ${niche ? `Topic: ${niche}.` : ""} Modern, clean design, premium look, dark background with vibrant accent colors. No text, no words, no letters. Minimalist composition with dramatic lighting. Cinematic quality, 8K, professional book cover style.`;
}
