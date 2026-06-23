import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  Download,
  Upload,
  FileJson,
  Wand2,
  Loader2,
  Eye,
  Code2,
} from "lucide-react";
import { generateLandingFn } from "@/lib/conversion.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BraianOS · Conversion Engine — Ebook a Landing Page" },
      {
        name: "description",
        content:
          "Transforma cualquier ebook en una landing page profesional lista para vender. Automático, rápido y sin costo.",
      },
      { property: "og:title", content: "BraianOS · Conversion Engine" },
      {
        property: "og:description",
        content:
          "De ebook a landing page que vende. Automático, rápido y sin costo.",
      },
    ],
  }),
  component: ConversionEngineApp,
});

type FormState = {
  title: string;
  subtitle: string;
  niche: string;
  targetAudience: string;
  objective: string;
  brandName: string;
  buyLink: string;
  coverImage: string;
  mockupImage: string;
  benefits: string;
  painPoints: string;
};

const initialForm: FormState = {
  title: "",
  subtitle: "",
  niche: "",
  targetAudience: "",
  objective: "",
  brandName: "",
  buyLink: "",
  coverImage: "",
  mockupImage: "",
  benefits: "",
  painPoints: "",
};

function ConversionEngineApp() {
  const generate = useServerFn(generateLandingFn);
  const [form, setForm] = useState<FormState>(initialForm);
  const [jsonInput, setJsonInput] = useState("");
  const [html, setHtml] = useState<string | null>(null);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  function buildMetaFromForm() {
    return {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || undefined,
      niche: form.niche.trim() || undefined,
      targetAudience: form.targetAudience.trim() || undefined,
      objective: form.objective.trim() || undefined,
      brandName: form.brandName.trim() || undefined,
      buyLink: form.buyLink.trim() || undefined,
      coverImage: form.coverImage.trim() || undefined,
      mockupImage: form.mockupImage.trim() || undefined,
      benefits: form.benefits
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      painPoints: form.painPoints
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
  }

  async function run(meta: ReturnType<typeof buildMetaFromForm>) {
    if (!meta.title) {
      toast.error("Falta el título del ebook");
      return;
    }
    setLoading(true);
    setHtml(null);
    try {
      const result = await generate({ data: { meta } });
      setHtml(result.html);
      setView("preview");
      toast.success("Landing generada", {
        description: "Tu index.html está listo para descargar.",
      });
      // En mobile el preview está debajo del form — hacer scroll para que el usuario lo vea.
      requestAnimationFrame(() => {
        previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "Error generando landing";
      toast.error("No se pudo generar la landing", { description: msg });
    } finally {
      setLoading(false);
    }
  }

  function handleJsonGenerate() {
    try {
      const parsed = JSON.parse(jsonInput);
      void run(parsed);
    } catch {
      toast.error("JSON inválido");
    }
  }

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setJsonInput(String(reader.result || ""));
    };
    reader.readAsText(file);
  }

  function download() {
    if (!html) return;
    const file = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  function loadDemo() {
    setForm({
      title: "Productividad Radical",
      subtitle: "El método de 30 días para recuperar tu tiempo",
      niche: "Desarrollo personal",
      targetAudience:
        "Emprendedores y freelancers que se sienten saturados y no logran avanzar en sus proyectos clave",
      objective:
        "Que el lector implemente un sistema simple para enfocarse en lo que realmente importa cada día",
      brandName: "BraianOS",
      buyLink: "https://example.com/comprar",
      coverImage:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&q=80",
      mockupImage:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&q=80",
      benefits:
        "Sistema paso a paso para enfocarte\nPlantillas listas para usar\nCasos reales aplicados\nResultados medibles en 30 días",
      painPoints:
        "Te distraes constantemente\nTrabajas mucho y avanzas poco\nNo sabes por dónde empezar",
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors />
      <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-semibold leading-none">BraianOS</div>
              <div className="text-xs text-muted-foreground">
                Conversion Engine v1
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground hidden sm:block">
            De ebook a landing page que vende
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 grid gap-8 lg:grid-cols-[420px_1fr]">
        <section className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Genera tu landing
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sube el <code>metadata.json</code> del Ebook Engine o completa el
              formulario. La IA solo genera <strong>contenido</strong>; el HTML
              viene de un template auditable.
            </p>
          </div>

          <Card className="p-4">
            <Tabs defaultValue="form">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="form">
                  <Wand2 className="h-4 w-4 mr-2" /> Formulario
                </TabsTrigger>
                <TabsTrigger value="json">
                  <FileJson className="h-4 w-4 mr-2" /> Subir JSON
                </TabsTrigger>
              </TabsList>

              <TabsContent value="form" className="space-y-3 mt-4">
                <Field label="Título *">
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Productividad Radical"
                  />
                </Field>
                <Field label="Subtítulo">
                  <Input
                    value={form.subtitle}
                    onChange={(e) =>
                      setForm({ ...form, subtitle: e.target.value })
                    }
                    placeholder="El método de 30 días..."
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nicho">
                    <Input
                      value={form.niche}
                      onChange={(e) =>
                        setForm({ ...form, niche: e.target.value })
                      }
                      placeholder="Desarrollo personal"
                    />
                  </Field>
                  <Field label="Marca">
                    <Input
                      value={form.brandName}
                      onChange={(e) =>
                        setForm({ ...form, brandName: e.target.value })
                      }
                      placeholder="BraianOS"
                    />
                  </Field>
                </div>
                <Field label="Público objetivo">
                  <Textarea
                    rows={2}
                    value={form.targetAudience}
                    onChange={(e) =>
                      setForm({ ...form, targetAudience: e.target.value })
                    }
                    placeholder="Emprendedores que..."
                  />
                </Field>
                <Field label="Objetivo / transformación">
                  <Textarea
                    rows={2}
                    value={form.objective}
                    onChange={(e) =>
                      setForm({ ...form, objective: e.target.value })
                    }
                    placeholder="Que el lector logre..."
                  />
                </Field>
                <Field label="Beneficios (uno por línea)">
                  <Textarea
                    rows={3}
                    value={form.benefits}
                    onChange={(e) =>
                      setForm({ ...form, benefits: e.target.value })
                    }
                    placeholder={"Sistema paso a paso\nPlantillas listas..."}
                  />
                </Field>
                <Field label="Problemas que resuelve (uno por línea)">
                  <Textarea
                    rows={3}
                    value={form.painPoints}
                    onChange={(e) =>
                      setForm({ ...form, painPoints: e.target.value })
                    }
                    placeholder={"Te distraes constantemente\n..."}
                  />
                </Field>
                <div className="grid grid-cols-1 gap-3">
                  <Field label="URL de portada (cover.png)">
                    <Input
                      value={form.coverImage}
                      onChange={(e) =>
                        setForm({ ...form, coverImage: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </Field>
                  <Field label="URL de mockup">
                    <Input
                      value={form.mockupImage}
                      onChange={(e) =>
                        setForm({ ...form, mockupImage: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </Field>
                  <Field label="Link de compra (buyLink)">
                    <Input
                      value={form.buyLink}
                      onChange={(e) =>
                        setForm({ ...form, buyLink: e.target.value })
                      }
                      placeholder="https://tu-checkout.com"
                    />
                  </Field>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => run(buildMetaFromForm())}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generar landing
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={loadDemo} type="button">
                    Demo
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="json" className="space-y-3 mt-4">
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileRef.current?.click()}
                  type="button"
                >
                  <Upload className="h-4 w-4 mr-2" /> Subir metadata.json
                </Button>
                <Field label="O pega el JSON aquí">
                  <Textarea
                    rows={12}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='{ "title": "...", "subtitle": "...", "coverImage": "https://..." }'
                    className="font-mono text-xs"
                  />
                </Field>
                <Button
                  onClick={handleJsonGenerate}
                  disabled={loading || !jsonInput.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generar desde JSON
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="p-4 text-xs text-muted-foreground space-y-2">
            <div className="font-semibold text-foreground">
              Arquitectura del motor
            </div>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Content Extraction Layer (sin IA)</li>
              <li>Landing Content Generator (IA → JSON)</li>
              <li>Template Engine (reemplazo de variables)</li>
            </ol>
            <div>
              Output: <code>index.html</code> autocontenido — HTML + CSS + JS
              integrados, listo para Vercel, Netlify, Cloudflare Pages.
            </div>
          </Card>
        </section>

        <section ref={previewRef} className="space-y-4 scroll-mt-20">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
              <button
                onClick={() => setView("preview")}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 transition-colors ${view === "preview" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
              >
                <Eye className="h-4 w-4" /> Preview
              </button>
              <button
                onClick={() => setView("code")}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 transition-colors ${view === "code" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
              >
                <Code2 className="h-4 w-4" /> HTML
              </button>
            </div>
            <Button
              onClick={download}
              disabled={!html}
              variant="default"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" /> Descargar index.html
            </Button>
          </div>

          <Card className="overflow-hidden h-[78vh]">
            {!html ? (
              <EmptyState loading={loading} />
            ) : view === "preview" ? (
              <iframe
                title="Landing preview"
                src={blobUrl ?? undefined}
                className="w-full h-full border-0 bg-white"
              />
            ) : (
              <pre className="w-full h-full overflow-auto p-4 text-xs font-mono bg-muted/30 m-0">
                {html}
              </pre>
            )}
          </Card>
        </section>
      </main>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function EmptyState({ loading }: { loading: boolean }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
      {loading ? (
        <>
          <Loader2 className="h-8 w-8 animate-spin mb-3" />
          <div className="text-sm">Generando contenido con IA…</div>
          <div className="text-xs mt-1">
            Extrayendo · Redactando · Renderizando
          </div>
        </>
      ) : (
        <>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="font-semibold text-foreground">
            Tu landing aparecerá aquí
          </div>
          <div className="text-sm mt-1 max-w-xs">
            Completa el formulario o pega un metadata.json y pulsa{" "}
            <em>Generar landing</em>.
          </div>
        </>
      )}
    </div>
  );
}
