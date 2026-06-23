// Export MVP sin infra de render.
//
// El <Player> de Remotion renderiza la composición como DOM (no canvas), por eso
// la captura client-side se hace con getDisplayMedia (grabación de la pestaña
// actual) + MediaRecorder → .webm. No necesita servidor ni Chromium headless.
//
// Limitaciones asumidas para el MVP:
// - Grabación en tiempo real (un VSL de 75s tarda 75s).
// - Formato webm; sin audio en esta fase.
// - El usuario debe conceder permiso de captura y elegir "esta pestaña".
// - Para mp4 de alta fidelidad sin intervención → render server (Lambda/VPS), fase futura.

export interface CaptureOptions {
  durationInFrames: number;
  fps: number;
  onProgress?: (p: number) => void;
  videoBitsPerSecond?: number;
}

function pickMimeType(): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  const candidates = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  return candidates.find((c) => MediaRecorder.isTypeSupported(c)) ?? null;
}

/** ¿El navegador puede grabar la pestaña sin servidor? */
export function captureSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getDisplayMedia === "function" &&
    pickMimeType() !== null
  );
}

/** Pide al usuario capturar la pestaña actual. */
export async function requestDisplayStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getDisplayMedia({
    // Sugiere la pestaña actual cuando el navegador lo soporta.
    // (cast: la opción es estándar pero aún no está en todas las typings)
    video: { frameRate: 30, ...( { preferCurrentTab: true } as object) },
    audio: false,
  } as MediaStreamConstraints);
}

/**
 * Graba un MediaStream durante la duración de la composición → Blob webm.
 * El llamador debe arrancar la reproducción del Player en frame 0 antes.
 */
export async function recordStreamToWebm(
  stream: MediaStream,
  opts: CaptureOptions,
): Promise<Blob> {
  const mimeType = pickMimeType();
  if (!mimeType) throw new Error("Este navegador no soporta grabación webm.");

  const { durationInFrames, fps, onProgress } = opts;
  const durationMs = (durationInFrames / fps) * 1000;

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: opts.videoBitsPerSecond ?? 8_000_000,
  });

  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const done = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
    recorder.onerror = (e) =>
      reject((e as ErrorEvent).error ?? new Error("Error de MediaRecorder"));
  });

  const start = performance.now();
  recorder.start();

  // Si el usuario corta la captura desde el navegador, frenamos limpio.
  let userStopped = false;
  stream.getVideoTracks().forEach((t) => {
    t.addEventListener("ended", () => {
      userStopped = true;
    });
  });

  await new Promise<void>((resolve) => {
    const tick = () => {
      const elapsed = performance.now() - start;
      onProgress?.(Math.min(1, elapsed / durationMs));
      if (elapsed >= durationMs || userStopped) {
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  if (recorder.state !== "inactive") recorder.stop();
  stream.getTracks().forEach((t) => t.stop());
  return done;
}

/** Dispara la descarga de un Blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
