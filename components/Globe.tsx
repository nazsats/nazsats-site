"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

/**
 * Real-time rotating 3D Earth, lit for the light theme: a near-white sphere
 * with orange landmasses and markers, so it reads as a diagram rather than a
 * dark object dropped on the page. Auto-rotates; drag to spin. Built on cobe.
 */
export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerMovement = useRef(0);
  const phiRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = 0;
    const onResize = () => {
      width = canvas.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 0,
      diffuse: 0.4,
      mapSamples: 18000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [0.91, 0.36, 0.0],
      glowColor: [1, 0.93, 0.87],
      markers: [
        { location: [37.7595, -122.4367], size: 0.05 }, // San Francisco
        { location: [40.7128, -74.006], size: 0.06 }, // New York
        { location: [51.5072, -0.1276], size: 0.05 }, // London
        { location: [28.6139, 77.209], size: 0.06 }, // New Delhi
        { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
        { location: [1.3521, 103.8198], size: 0.04 }, // Singapore
        { location: [-33.8688, 151.2093], size: 0.04 }, // Sydney
      ],
    });

    let raf = 0;
    const loop = () => {
      // Auto-rotate unless the user is dragging.
      if (pointerInteracting.current === null) {
        phiRef.current += 0.004;
      }
      globe.update({
        phi: phiRef.current + pointerMovement.current,
        width: width * 2,
        height: width * 2,
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Fade in once the first frame is ready.
    requestAnimationFrame(() => {
      if (canvas) canvas.style.opacity = "1";
    });

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[620px] mx-auto">
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerMovement.current * 100;
          if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerMovement.current = delta / 100;
          }
        }}
        className="w-full h-full cursor-grab"
        style={{
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
