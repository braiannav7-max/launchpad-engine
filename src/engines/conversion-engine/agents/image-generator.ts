const MAGNIFIC_API_KEY = process.env.MAGNIFIC_API_KEY;

export async function generateHeroImage(meta: {
  title: string;
  subtitle?: string;
  niche?: string;
}): Promise<string | null> {
  if (MAGNIFIC_API_KEY) {
    const url = await tryMagnific(meta);
    if (url) return url;
  }
  return tryPollinations(meta);
}

async function tryPollinations(meta: {
  title: string; niche?: string;
}): Promise<string | null> {
  const prompt = `professional ebook cover hero, ${meta.niche || meta.title}, modern minimalist design, dark background with vibrant neon accents, dramatic lighting, cinematic quality, no text no words no letters`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=800&seed=${Math.floor(Math.random() * 99999)}&nologo=true`;
}

async function tryMagnific(meta: {
  title: string; niche?: string;
}): Promise<string | null> {
  try {
    const { Client } = await import("@modelcontextprotocol/sdk/client/index.js");
    const { StreamableHTTPClientTransport } = await import(
      "@modelcontextprotocol/sdk/client/streamableHttp.js"
    );

    const prompt = `Professional book cover hero image for "${meta.title}". ${meta.niche ? `Topic: ${meta.niche}.` : ""} Modern, clean design, premium look, dark background with vibrant accent colors. No text, no words, no letters. Minimalist composition with dramatic lighting. Cinematic quality, 8K, professional book cover style.`;

    const transport = new StreamableHTTPClientTransport(new URL("https://mcp.magnific.com"), {
      headers: { Authorization: `Bearer ${MAGNIFIC_API_KEY}` },
    });

    const client = new Client(
      { name: "launchpad-engine", version: "1.0.0" },
      { capabilities: {} },
    );

    await client.connect(transport);

    const result = await client.request(
      {
        method: "tools/call",
        params: {
          name: "generate-image",
          arguments: { prompt, aspect_ratio: "3:2", style: "photographic", negative_prompt: "text, words, letters, watermark, signature, low quality, blurry" },
        },
      },
      {},
    );

    const content = result.content?.[0] as any;
    return content?.data?.url || content?.url || content?.text || null;
  } catch (error) {
    console.error("[image-generator] Magnific error:", error);
    return null;
  }
}
