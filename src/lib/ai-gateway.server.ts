import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createCerebras } from "@ai-sdk/cerebras";

export function createAiProvider(apiKey: string) {
  return createGoogleGenerativeAI({
    apiKey,
  });
}

export function createGroqProvider(apiKey: string) {
  return createGroq({
    apiKey,
  });
}

export function createCerebrasProvider(apiKey: string) {
  return createCerebras({
    apiKey,
  });
}

type ProviderModel = {
  provider: "groq" | "cerebras" | "google";
  modelId: string;
};

const providerChain: ProviderModel[] = [
  { provider: "groq", modelId: "llama-3.3-70b-versatile" },
  { provider: "cerebras", modelId: "llama-3.3-70b" },
  { provider: "google", modelId: "gemini-2.0-flash" },
];

export interface AgentModel {
  provider: string;
  modelId: string;
  model: ReturnType<ReturnType<typeof createGroqProvider>>;
}

function getEnvKey(provider: string): string | undefined {
  const map: Record<string, string> = {
    groq: process.env.GROQ_API_KEY,
    cerebras: process.env.CEREBRAS_API_KEY,
    google: process.env.GOOGLE_AI_API_KEY,
  };
  return map[provider];
}

function createProvider(provider: string, apiKey: string) {
  switch (provider) {
    case "groq":
      return createGroqProvider(apiKey);
    case "cerebras":
      return createCerebrasProvider(apiKey);
    case "google":
      return createAiProvider(apiKey);
    default:
      throw new Error(`Provider desconocido: ${provider}`);
  }
}

export function getAgentModel(): AgentModel {
  for (const entry of providerChain) {
    const key = getEnvKey(entry.provider);
    if (key) {
      return {
        provider: entry.provider,
        modelId: entry.modelId,
        model: createProvider(entry.provider, key)(entry.modelId) as any,
      };
    }
  }
  throw new Error(
    "No hay ningún provider configurado. Seteá GROQ_API_KEY, CEREBRAS_API_KEY o GOOGLE_AI_API_KEY",
  );
}
