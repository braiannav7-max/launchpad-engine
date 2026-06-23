# Launchpad Engine

Motor de generación de landing pages para ebooks.

## API

POST `/api/generate` con JSON body `{ meta: EbookMetadata }` → `{ html: string }`

## Variables de entorno

Los agentes usan el primer provider disponible en este orden:

| Orden | Provider | Variable | Límite gratis |
|-------|----------|----------|--------------|
| 1º | **Groq** (más rápido) | `GROQ_API_KEY` | 14.400 req/día |
| 2º | **Cerebras** (similar) | `CEREBRAS_API_KEY` | ~14.000 req/día |
| 3º | **Google Gemini** (fallback) | `GOOGLE_AI_API_KEY` | 1.500 req/día |

Solo necesitás al menos uno. Si se cae el primero, salta al siguiente automáticamente.

## Deploy

El build genera output compatible con Vercel, Netlify y Cloudflare Pages.
