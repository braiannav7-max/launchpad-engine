// Video Engine — API pública.
export { VSL } from "./compositions/VSL";
export { AdReel } from "./compositions/AdReel";
export { HeroLoop } from "./compositions/HeroLoop";
export { RemotionRoot } from "./Root";
export { pipelineToVideoProps } from "./pipelineToVideoProps";
export type { ToVideoPropsInput } from "./pipelineToVideoProps";
export {
  videoPropsSchema,
  demoVideoProps,
  FORMATS,
  FPS,
  COMPOSITION_IDS,
} from "./schema";
export type { VideoProps, FormatId } from "./schema";
export { theme as videoTheme } from "./theme";
export {
  captureSupported,
  requestDisplayStream,
  recordStreamToWebm,
  downloadBlob,
} from "./capture";
export type { CaptureOptions } from "./capture";

import { VSL } from "./compositions/VSL";
import { AdReel } from "./compositions/AdReel";
import { HeroLoop } from "./compositions/HeroLoop";
import { COMPOSITION_IDS, FORMATS } from "./schema";
import type { FormatId, VideoProps } from "./schema";
import type React from "react";

export interface VideoFormatDef {
  id: FormatId;
  compositionId: string;
  name: string;
  description: string;
  component: React.FC<VideoProps>;
  width: number;
  height: number;
  durationInFrames: number;
  /** Loop perfecto (sólo el hero). */
  loop: boolean;
}

/** Catálogo de formatos para poblar selectores de UI (Player). */
export const VIDEO_FORMATS: VideoFormatDef[] = [
  {
    id: "vsl",
    compositionId: COMPOSITION_IDS.vsl,
    name: "VSL (venta)",
    description: "Video de venta horizontal 16:9 · ~75s",
    component: VSL,
    ...FORMATS.vsl,
    loop: false,
  },
  {
    id: "reel",
    compositionId: COMPOSITION_IDS.reel,
    name: "Ad Reel",
    description: "Vertical 9:16 para IG/TikTok · ~20s",
    component: AdReel,
    ...FORMATS.reel,
    loop: false,
  },
  {
    id: "hero",
    compositionId: COMPOSITION_IDS.hero,
    name: "Hero Loop",
    description: "Loop perfecto 16:9 para el fondo del hero · 6s",
    component: HeroLoop,
    ...FORMATS.hero,
    loop: true,
  },
];
