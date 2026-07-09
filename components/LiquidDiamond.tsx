"use client";

import { LiquidMetal } from "@paper-design/shaders-react";

/** Flowing liquid-metal diamond (paper.design liquid-metal shader), black backdrop so
 *  it blends into the void. Size set via `style` directly on the component — that's how
 *  the shader sizes its drawing buffer. */
export default function LiquidDiamond() {
  return (
    <LiquidMetal
      style={{
        width: "min(360px, 78vw)",
        height: "min(360px, 78vw)",
      }}
      colorBack="rgba(0, 0, 0, 0)"
      colorTint="#ffffff"
      shape="diamond"
      repetition={2}
      softness={0.1}
      shiftRed={0.3}
      shiftBlue={0.3}
      distortion={0.07}
      contour={0.4}
      angle={70}
      speed={1}
      scale={0.6}
      rotation={0}
      offsetX={0}
      offsetY={0}
      fit="contain"
    />
  );
}
