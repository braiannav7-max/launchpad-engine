import { useMemo, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { toast } from "sonner";
import { Clapperboard, Download, Loader2, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  VIDEO_FORMATS,
  FPS,
  type VideoProps,
  captureSupported,
  requestDisplayStream,
  recordStreamToWebm,
  downloadBlob,
} from "@/engines/video-engine";

interface Props {
  videoProps: VideoProps | null;
}

export function VideoStudio({ videoProps }: Props) {
  const [formatId, setFormatId] = useState<string>("hero");
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const playerRef = useRef<PlayerRef>(null);

  const format = useMemo(
    () => VIDEO_FORMATS.find((f) => f.id === formatId) ?? VIDEO_FORMATS[0],
    [formatId],
  );

  const supported = captureSupported();

  async function handleExport() {
    if (!videoProps) return;
    if (!supported) {
      toast.error("Tu navegador no soporta la grabación sin servidor.", {
        description: "Probá en Chrome/Edge de escritorio, o usá un render server.",
      });
      return;
    }
    try {
      toast.info("Elegí «Esta pestaña» para grabar el video", {
        description: `Se grabará ${Math.round(format.durationInFrames / FPS)}s en tiempo real. No cambies de pestaña.`,
      });
      const stream = await requestDisplayStream();
      setRecording(true);
      setProgress(0);

      // Reproducir desde el inicio para capturar el video completo.
      playerRef.current?.seekTo(0);
      playerRef.current?.play();

      const blob = await recordStreamToWebm(stream, {
        durationInFrames: format.durationInFrames,
        fps: FPS,
        onProgress: setProgress,
      });

      playerRef.current?.pause();
      const safe = videoProps.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
      downloadBlob(blob, `${safe}-${format.id}.webm`);
      toast.success("Video descargado (.webm)");
    } catch (e) {
      if (e instanceof DOMException && e.name === "NotAllowedError") {
        toast.message("Grabación cancelada");
      } else {
        console.error(e);
        toast.error("No se pudo grabar el video", {
          description: e instanceof Error ? e.message : undefined,
        });
      }
    } finally {
      setRecording(false);
      setProgress(0);
    }
  }

  if (!videoProps) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center mb-4">
          <Clapperboard className="h-6 w-6 text-white" />
        </div>
        <div className="font-semibold text-foreground">Videos promocionales</div>
        <div className="text-sm mt-1 max-w-xs">
          Generá una landing y acá vas a poder previsualizar y descargar el VSL,
          el Reel y el loop del hero.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Selector de formato */}
      <div className="flex items-center gap-2 p-3 border-b border-border flex-wrap">
        {VIDEO_FORMATS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFormatId(f.id)}
            className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 transition-colors ${
              f.id === formatId
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent text-muted-foreground"
            }`}
            title={f.description}
          >
            {f.loop ? <Repeat className="h-3.5 w-3.5" /> : <Clapperboard className="h-3.5 w-3.5" />}
            {f.name}
          </button>
        ))}
      </div>

      {/* Player */}
      <div className="flex-1 min-h-0 flex items-center justify-center bg-[#0b0b14] p-4 overflow-hidden">
        <div
          className="w-full"
          style={{ maxWidth: format.height > format.width ? 320 : "100%" }}
        >
          <Player
            ref={playerRef}
            component={format.component}
            inputProps={videoProps}
            durationInFrames={format.durationInFrames}
            compositionWidth={format.width}
            compositionHeight={format.height}
            fps={FPS}
            loop={format.loop}
            autoPlay={format.loop}
            controls
            style={{
              width: "100%",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 30px 60px -25px rgba(0,0,0,.6)",
            }}
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="p-3 border-t border-border flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs text-muted-foreground">
          {format.description}
          {!supported && (
            <span className="block text-amber-500">
              Grabación no disponible en este navegador.
            </span>
          )}
        </div>
        <Button onClick={handleExport} disabled={recording || !supported} size="sm">
          {recording ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Grabando… {Math.round(progress * 100)}%
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" /> Descargar video (.webm)
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
