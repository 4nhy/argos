"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin metallic progress bar pinned to the top, tracking scroll depth. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        transformOrigin: "0%",
        scaleX,
        zIndex: 60,
        background: "linear-gradient(90deg, #6f88ac, #eaf0f8 55%, #cfe0f2)",
        boxShadow: "0 0 12px rgba(150, 185, 230, 0.5)",
      }}
    />
  );
}
