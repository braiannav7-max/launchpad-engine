import React from "react";
import { Composition } from "remotion";
import {
  COMPOSITION_IDS,
  demoVideoProps,
  FORMATS,
  FPS,
  videoPropsSchema,
} from "./schema";
import { VSL } from "./compositions/VSL";
import { AdReel } from "./compositions/AdReel";
import { HeroLoop } from "./compositions/HeroLoop";

/**
 * Registro de composiciones para Remotion Studio (`npx remotion studio`).
 * En producción los videos se previsualizan con <Player> (ver index.ts) y el
 * export MVP es client-side vía capture.ts — sin servidor de render.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={COMPOSITION_IDS.vsl}
        component={VSL}
        durationInFrames={FORMATS.vsl.durationInFrames}
        fps={FPS}
        width={FORMATS.vsl.width}
        height={FORMATS.vsl.height}
        schema={videoPropsSchema}
        defaultProps={demoVideoProps}
      />
      <Composition
        id={COMPOSITION_IDS.reel}
        component={AdReel}
        durationInFrames={FORMATS.reel.durationInFrames}
        fps={FPS}
        width={FORMATS.reel.width}
        height={FORMATS.reel.height}
        schema={videoPropsSchema}
        defaultProps={demoVideoProps}
      />
      <Composition
        id={COMPOSITION_IDS.hero}
        component={HeroLoop}
        durationInFrames={FORMATS.hero.durationInFrames}
        fps={FPS}
        width={FORMATS.hero.width}
        height={FORMATS.hero.height}
        schema={videoPropsSchema}
        defaultProps={demoVideoProps}
      />
    </>
  );
};
