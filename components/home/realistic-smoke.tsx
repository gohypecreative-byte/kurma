"use client";

import { useEffect, useRef } from "react";

// Image natural dimensions across all 16:9 Kurma banner photographs (1376x768)
const IMG_NATURAL_WIDTH = 1376;
const IMG_NATURAL_HEIGHT = 768;

export type SmokePreset = "hero" | "shop" | "about" | "contact";

const PRESET_COORDINATES: Record<SmokePreset, { x: number; y: number }> = {
  hero: { x: 832.5, y: 178.0 },
  shop: { x: 738.5, y: 320.5 },
  about: { x: 867.0, y: 295.5 },
  contact: { x: 894.5, y: 354.5 },
};

export interface RealisticSmokeProps {
  preset?: SmokePreset;
  tipRatioX?: number;
  tipRatioY?: number;
  className?: string;
}

interface VolumetricPuff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  baseRadius: number;
  maxRadius: number;
  phase: number;
  spreadRate: number;
  layer: "cloud" | "wisps" | "filament";
  alphaMult: number;
}

export function RealisticSmoke({
  preset = "hero",
  tipRatioX,
  tipRatioY,
  className,
}: RealisticSmokeProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const coords = PRESET_COORDINATES[preset] || PRESET_COORDINATES.hero;
    const activeRatioX = tipRatioX !== undefined ? tipRatioX : coords.x / IMG_NATURAL_WIDTH;
    const activeRatioY = tipRatioY !== undefined ? tipRatioY : coords.y / IMG_NATURAL_HEIGHT;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Respect reduced-motion preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let isVisible = true;
    let animId: number;
    let puffs: VolumetricPuff[] = [];
    let tipX = 0;
    let tipY = 0;
    let canvasW = 0;
    let canvasH = 0;
    let lastTime = performance.now();
    let emitAcc = 0;

    // Calculate exact rendered coordinates of the sandalwood stick tip matching object-cover
    function updateTipPosition() {
      if (!canvas) return;
      const parent = canvas.parentElement;
      const W = parent ? parent.clientWidth : (canvas.clientWidth || window.innerWidth);
      const H = parent ? parent.clientHeight : (canvas.clientHeight || window.innerHeight);

      if (W === 0 || H === 0) return;
      canvasW = W;
      canvasH = H;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx?.setTransform(1, 0, 0, 1, 0, 0);
      ctx?.scale(dpr, dpr);

      const containerAspect = W / H;
      const imageAspect = IMG_NATURAL_WIDTH / IMG_NATURAL_HEIGHT;

      let renderedW: number;
      let renderedH: number;
      let renderedLeft: number;
      let renderedTop: number;

      if (containerAspect > imageAspect) {
        renderedW = W;
        renderedH = W / imageAspect;
        renderedLeft = 0;
        renderedTop = (H - renderedH) * (window.innerWidth >= 768 ? 0.35 : 0.5);
      } else {
        renderedH = H;
        renderedW = H * imageAspect;
        if (window.innerWidth >= 768) {
          renderedLeft = (W - renderedW) / 2;
        } else {
          renderedLeft = W - renderedW; // object-right on mobile
        }
        renderedTop = 0;
      }

      tipX = renderedLeft + renderedW * activeRatioX;
      tipY = renderedTop + renderedH * activeRatioY;
    }

    updateTipPosition();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          updateTipPosition();
        }
      }
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

    // Particle factory - refined, elegant spread (slender near tip, gentle billowing upward)
    function createPuff(layer: "cloud" | "wisps" | "filament"): VolumetricPuff {
      if (layer === "filament") {
        // Slender rising stream directly over the lit tip
        return {
          x: tipX + (Math.random() - 0.5) * 1.0,
          y: tipY,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -(48 + Math.random() * 12),
          life: 0,
          maxLife: 5.5 + Math.random() * 1.5,
          baseRadius: 1.8 + Math.random() * 0.8,
          maxRadius: 15 + Math.random() * 6,
          phase: Math.random() * Math.PI * 2,
          spreadRate: 0.5 + Math.random() * 0.25,
          layer: "filament",
          alphaMult: 0.85 + Math.random() * 0.3,
        };
      } else if (layer === "cloud") {
        // Volumetric body - refined spread (50px to 75px max radius)
        return {
          x: tipX + (Math.random() - 0.5) * 1.5,
          y: tipY,
          vx: (Math.random() - 0.5) * 5.0,
          vy: -(42 + Math.random() * 14),
          life: 0,
          maxLife: 8.0 + Math.random() * 2.0, // Rises past top of section
          baseRadius: 3.2 + Math.random() * 1.8,
          maxRadius: 52 + Math.random() * 24, // Refined from previous 140px
          phase: Math.random() * Math.PI * 2,
          spreadRate: 0.85 + Math.random() * 0.35,
          layer: "cloud",
          alphaMult: 0.75 + Math.random() * 0.35,
        };
      } else {
        // Curling wisps - elegant undulating ribbon width
        const side = Math.random() < 0.5 ? -1 : 1;
        return {
          x: tipX + (Math.random() - 0.5) * 1.2,
          y: tipY,
          vx: side * (3 + Math.random() * 4.5),
          vy: -(44 + Math.random() * 14),
          life: 0,
          maxLife: 7.2 + Math.random() * 1.8,
          baseRadius: 2.5 + Math.random() * 1.2,
          maxRadius: 32 + Math.random() * 16, // Refined from previous 82px
          phase: Math.random() * Math.PI * 2,
          spreadRate: 0.75 + Math.random() * 0.3,
          layer: "wisps",
          alphaMult: 0.8 + Math.random() * 0.35,
        };
      }
    }

    // Step physics for smoke puff with controlled, realistic spread
    function stepPuff(p: VolumetricPuff, dt: number, nowMs: number) {
      p.life += dt;
      const progress = p.life / p.maxLife;

      // Steady upward rise with natural light deceleration
      const decel = 1 - progress * 0.28;
      p.y += p.vy * decel * dt;

      // Distance ascended from tip
      const distanceAboveTip = Math.max(0, tipY - p.y);
      // Tight, focused stream for the first 28px above the lit tip
      const spreadFactor = Math.min(1, Math.max(0, (distanceAboveTip - 28) / 50));

      const t = nowMs * 0.0011;

      // Controlled harmonic drift creating gentle, elegant serpentine sways
      const drift1 = Math.sin(t * 0.85 + distanceAboveTip * 0.013 + p.phase) * (11 + progress * 28);
      const drift2 = Math.cos(t * 1.4 - distanceAboveTip * 0.022) * (6 + progress * 16);

      // Refined lateral diffusion
      const diffusion = p.vx * Math.pow(progress, 0.85) * (4.5 * p.spreadRate);

      p.x = tipX + (drift1 + drift2) * spreadFactor + diffusion;
    }

    // Pre-warm the simulation so smoke is already billowing on page load
    if (tipX > 0 && tipY > 0) {
      const warmUpDelta = 0.035;
      for (let step = 0; step < 240; step++) {
        emitAcc += warmUpDelta * 46;
        while (emitAcc >= 1) {
          emitAcc -= 1;
          const r = Math.random();
          if (r < 0.44) {
            puffs.push(createPuff("cloud"));
          } else if (r < 0.75) {
            puffs.push(createPuff("wisps"));
          } else {
            puffs.push(createPuff("filament"));
          }
        }

        const simTime = step * warmUpDelta * 1000;
        for (let i = puffs.length - 1; i >= 0; i--) {
          const p = puffs[i];
          stepPuff(p, warmUpDelta, simTime);
          if (p.life >= p.maxLife || p.y < -100) {
            puffs.splice(i, 1);
          }
        }
      }
    }

    // Main 60 FPS animation loop
    function loop(now: number) {
      animId = requestAnimationFrame(loop);
      if (!isVisible || !ctx || !canvas) return;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (canvasW === 0 || canvasH === 0 || tipX === 0 || tipY === 0) {
        updateTipPosition();
      }

      ctx.clearRect(0, 0, canvasW, canvasH);

      if (tipX === 0 || tipY === 0) return;

      // Continuous emission rate (~44 puffs/sec)
      emitAcc += dt * 44;
      while (emitAcc >= 1) {
        emitAcc -= 1;
        const r = Math.random();
        if (r < 0.44) {
          puffs.push(createPuff("cloud"));
        } else if (r < 0.75) {
          puffs.push(createPuff("wisps"));
        } else {
          puffs.push(createPuff("filament"));
        }
      }

      // Update positions
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        stepPuff(p, dt, now);
        if (p.life >= p.maxLife || p.y < -100) {
          puffs.splice(i, 1);
        }
      }

      // 1. RENDER VOLUMETRIC BACKGROUND CLOUD BODY (Soft, refined width, rises past top)
      for (let i = 0; i < puffs.length; i++) {
        const p = puffs[i];
        if (p.layer !== "cloud") continue;

        const progress = p.life / p.maxLife;

        // Sustained opacity curve through the top of the section
        let alpha = 0;
        if (progress < 0.1) {
          alpha = (progress / 0.1) * 0.17;
        } else if (progress < 0.75) {
          alpha = 0.17 - ((progress - 0.1) / 0.65) * 0.05; // 0.17 -> 0.12
        } else {
          alpha = 0.12 * (1 - (progress - 0.75) / 0.25);
        }

        alpha *= p.alphaMult;
        if (alpha <= 0.003) continue;

        const currentRadius = p.baseRadius + Math.pow(progress, 0.9) * (p.maxRadius - p.baseRadius);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius);
        grad.addColorStop(0, `rgba(252, 248, 240, ${alpha})`);
        grad.addColorStop(0.3, `rgba(246, 240, 230, ${alpha * 0.72})`);
        grad.addColorStop(0.65, `rgba(236, 228, 216, ${alpha * 0.28})`);
        grad.addColorStop(0.9, `rgba(228, 218, 204, ${alpha * 0.06})`);
        grad.addColorStop(1, "rgba(225, 215, 200, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. RENDER SWIRLING WISPS (Gentle serpentine curling tendrils)
      for (let i = 0; i < puffs.length; i++) {
        const p = puffs[i];
        if (p.layer !== "wisps") continue;

        const progress = p.life / p.maxLife;

        let alpha = 0;
        if (progress < 0.1) {
          alpha = (progress / 0.1) * 0.24;
        } else if (progress < 0.72) {
          alpha = 0.24 - ((progress - 0.1) / 0.62) * 0.07; // 0.24 -> 0.17
        } else {
          alpha = 0.17 * (1 - (progress - 0.72) / 0.28);
        }

        alpha *= p.alphaMult;
        if (alpha <= 0.003) continue;

        const currentRadius = p.baseRadius + Math.pow(progress, 0.95) * (p.maxRadius - p.baseRadius);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius);
        grad.addColorStop(0, `rgba(254, 250, 244, ${alpha})`);
        grad.addColorStop(0.35, `rgba(248, 242, 234, ${alpha * 0.68})`);
        grad.addColorStop(0.7, `rgba(238, 230, 220, ${alpha * 0.22})`);
        grad.addColorStop(1, "rgba(230, 220, 208, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. RENDER CORE STREAM (Slender, soft filament rising straight from the burning tip)
      for (let i = 0; i < puffs.length; i++) {
        const p = puffs[i];
        if (p.layer !== "filament") continue;

        const progress = p.life / p.maxLife;

        let alpha = 0;
        if (progress < 0.12) {
          alpha = (progress / 0.12) * 0.42;
        } else if (progress < 0.6) {
          alpha = 0.42 - ((progress - 0.12) / 0.48) * 0.17;
        } else {
          alpha = 0.25 * (1 - (progress - 0.6) / 0.4);
        }

        alpha *= p.alphaMult;
        if (alpha <= 0.004) continue;

        const currentRadius = p.baseRadius + Math.pow(progress, 1.1) * (p.maxRadius - p.baseRadius);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius);
        grad.addColorStop(0, `rgba(255, 252, 246, ${alpha})`);
        grad.addColorStop(0.35, `rgba(248, 243, 234, ${alpha * 0.65})`);
        grad.addColorStop(0.75, `rgba(236, 228, 218, ${alpha * 0.2})`);
        grad.addColorStop(1, "rgba(230, 222, 210, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. SUBTLE WARM AIR SHIMMER AT THE BURNING SANDALWOOD TIP
      const shimmer = 0.5 + 0.5 * Math.sin(now * 0.0035);
      const tipGrad = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 3.5);
      tipGrad.addColorStop(0, `rgba(255, 140, 60, ${0.12 + shimmer * 0.08})`);
      tipGrad.addColorStop(1, "rgba(255, 90, 30, 0)");
      ctx.fillStyle = tipGrad;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [preset, tipRatioX, tipRatioY]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-1 ${className || ""}`}
      aria-hidden="true"
    />
  );
}
