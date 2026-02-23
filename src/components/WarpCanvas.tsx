"use client";

import { useEffect, useRef, useCallback } from "react";

interface WarpCanvasProps {
  speed?: number;
  accelerating?: boolean;
}

interface Star {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  color: string;
}

const COLORS = [
  "rgba(100, 180, 255,",   // light blue
  "rgba(140, 120, 255,",   // purple
  "rgba(80, 200, 255,",    // cyan
  "rgba(180, 140, 255,",   // lavender
  "rgba(60, 160, 255,",    // deep blue
  "rgba(200, 180, 255,",   // soft purple
];

export default function WarpCanvas({ speed = 1, accelerating = false }: WarpCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);
  const currentSpeedRef = useRef(speed);
  const targetSpeedRef = useRef(speed);

  const initStars = useCallback((count: number, width: number, height: number) => {
    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      const z = Math.random() * width;
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z,
        prevZ: z,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    return stars;
  }, []);

  useEffect(() => {
    targetSpeedRef.current = accelerating ? 15 : speed;
  }, [speed, accelerating]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (starsRef.current.length === 0) {
        starsRef.current = initStars(800, canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      if (!ctx || !canvas) return;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Smooth speed interpolation
      const lerpFactor = accelerating ? 0.04 : 0.02;
      currentSpeedRef.current += (targetSpeedRef.current - currentSpeedRef.current) * lerpFactor;
      const currentSpeed = currentSpeedRef.current;

      // Trail effect - darker fade for longer trails at high speed
      const fadeAlpha = accelerating ? 0.08 : 0.15;
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
      ctx.fillRect(0, 0, w, h);

      // Center glow
      const glowRadius = 150 + currentSpeed * 10;
      const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
      centerGlow.addColorStop(0, `rgba(80, 140, 255, ${0.03 + currentSpeed * 0.005})`);
      centerGlow.addColorStop(0.5, `rgba(100, 80, 200, ${0.02 + currentSpeed * 0.003})`);
      centerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, w, h);

      for (const star of starsRef.current) {
        star.prevZ = star.z;
        star.z -= currentSpeed * 2;

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * w * 2;
          star.y = (Math.random() - 0.5) * h * 2;
          star.z = w;
          star.prevZ = w;
          star.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }

        // Project to 2D
        const sx = (star.x / star.z) * w * 0.3 + cx;
        const sy = (star.y / star.z) * h * 0.3 + cy;
        const px = (star.x / star.prevZ) * w * 0.3 + cx;
        const py = (star.y / star.prevZ) * h * 0.3 + cy;

        // Size based on depth
        const size = Math.max(0.5, (1 - star.z / w) * 3);
        const alpha = Math.min(1, (1 - star.z / w) * 1.5);

        // Draw streak line
        const dx = sx - px;
        const dy = sy - py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0.5) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = `${star.color} ${alpha})`;
          ctx.lineWidth = size;
          ctx.stroke();
        }

        // Draw star point
        ctx.beginPath();
        ctx.arc(sx, sy, size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color} ${alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [initStars, accelerating]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "transparent" }}
    />
  );
}
