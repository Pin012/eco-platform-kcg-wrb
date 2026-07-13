import React, { useEffect, useRef } from 'react';

// ==========================================
// 1. 種子隨機數生成器 (PRNG - Mulberry32)
// ==========================================
function createRandom(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

// ==========================================
// 2. 二維柏林雜訊 (2D Perlin Noise)
// ==========================================
class PerlinNoise2D {
  p: Uint8Array;
  perm: Uint8Array;

  constructor(seed: number) {
    const rand = createRandom(seed);
    this.p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) this.p[i] = i;
    // 隨機打亂
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const tmp = this.p[i];
      this.p[i] = this.p[j];
      this.p[j] = tmp;
    }
    this.perm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
    }
  }

  fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
  lerp(t: number, a: number, b: number) { return a + t * (b - a); }
  grad(hash: number, x: number, y: number) {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
  }

  noise(x: number, y: number) {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = this.fade(xf);
    const v = this.fade(yf);

    const aa = this.perm[this.perm[xi] + yi];
    const ab = this.perm[this.perm[xi] + yi + 1];
    const ba = this.perm[this.perm[xi + 1] + yi];
    const bb = this.perm[this.perm[xi + 1] + yi + 1];

    const x1 = this.lerp(u, this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf));
    const x2 = this.lerp(u, this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1));
    return this.lerp(v, x1, x2);
  }
}

// ==========================================
// 3. React 等高線疊加控制元件
// ==========================================

interface ContourOverlayProps {
  className?: string;
  lineCount?: number;
  opacity?: number;
  strokeColor?: string;
  density?: number;
  distortion?: number;
  seed?: number;
  step?: number;
}

export function ContourOverlay({
  className = '',
  lineCount = 16,
  opacity = 0.22,
  strokeColor = '#ffffff', 
  density = 1.5,
  distortion = 0.75,
  seed = 8888,
  step = 11
}: ContourOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let resizeDebounceTimeout: ReturnType<typeof setTimeout> | null = null;
    const perlin = new PerlinNoise2D(seed);

    const getHeight = (x: number, y: number) => {
      const scale = 0.0018 * density;
      const nx = x * scale;
      const ny = y * scale;

      const warp = distortion * 1.8;
      const qx = perlin.noise(nx + 0.0, ny + 0.0) * warp;
      const qy = perlin.noise(nx + 5.2, ny + 1.3) * warp;

      const rx = perlin.noise(nx + qx + 1.7, ny + qy + 9.2) * warp * 0.4;
      const ry = perlin.noise(nx + qx + 8.3, ny + qy + 2.8) * warp * 0.4;

      let heightValue = 0;
      let amplitude = 1.0;
      let frequency = 1.0;
      let maxAmplitude = 0;

      for (let i = 0; i < 3; i++) {
        heightValue += amplitude * perlin.noise((nx + qx + rx) * frequency, (ny + qy + ry) * frequency);
        maxAmplitude += amplitude;
        amplitude *= 0.5;
        frequency *= 2.0;
      }

      return (heightValue / maxAmplitude + 1.0) * 0.5;
    };

    const drawContours = (width: number, height: number) => {
      const cols = Math.ceil(width / step) + 1;
      const rows = Math.ceil(height / step) + 1;

      const grid: number[][] = [];
      for (let i = 0; i < cols; i++) {
        grid[i] = [];
        for (let j = 0; j < rows; j++) {
          grid[i][j] = getHeight(i * step, j * step);
        }
      }

      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = strokeColor;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const thresholds: number[] = [];
      const minH = 0.18;
      const maxH = 0.82;
      const count = lineCount;
      for (let k = 0; k < count; k++) {
        thresholds.push(minH + (maxH - minH) * (k / Math.max(1, count - 1)));
      }

      for (const H of thresholds) {
        ctx.beginPath();
        for (let i = 0; i < cols - 1; i++) {
          for (let j = 0; j < rows - 1; j++) {
            const x = i * step;
            const y = j * step;

            const vA = grid[i][j];
            const vB = grid[i + 1][j];
            const vC = grid[i + 1][j + 1];
            const vD = grid[i][j + 1];

            let state = 0;
            if (vA >= H) state |= 8;
            if (vB >= H) state |= 4;
            if (vC >= H) state |= 2;
            if (vD >= H) state |= 1;

            if (state === 0 || state === 15) continue;

            const lerpX = (valA: number, valB: number, xA: number, xB: number) => xA + (H - valA) / (valB - valA + 1e-6) * (xB - xA);
            const lerpY = (valA: number, valB: number, yA: number, yB: number) => yA + (H - valA) / (valB - valA + 1e-6) * (yB - yA);

            const pTop = { x: lerpX(vA, vB, x, x + step), y: y };
            const pRight = { x: x + step, y: lerpY(vB, vC, y, y + step) };
            const pBottom = { x: lerpX(vD, vC, x, x + step), y: y + step };
            const pLeft = { x: x, y: lerpY(vA, vD, y, y + step) };

            const drawLine = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
            };

            switch (state) {
              case 1:  drawLine(pLeft, pBottom); break;
              case 2:  drawLine(pBottom, pRight); break;
              case 3:  drawLine(pLeft, pRight); break;
              case 4:  drawLine(pTop, pRight); break;
              case 5:  drawLine(pTop, pLeft); drawLine(pBottom, pRight); break;
              case 6:  drawLine(pTop, pBottom); break;
              case 7:  drawLine(pTop, pLeft); break;
              case 8:  drawLine(pTop, pLeft); break;
              case 9:  drawLine(pTop, pBottom); break;
              case 10: drawLine(pTop, pRight); drawLine(pLeft, pBottom); break;
              case 11: drawLine(pTop, pRight); break;
              case 12: drawLine(pLeft, pRight); break;
              case 13: drawLine(pBottom, pRight); break;
              case 14: drawLine(pLeft, pBottom); break;
            }
          }
        }
        ctx.stroke();
      }
    };

    const resize = (width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      drawContours(width, height);
    };

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (resizeDebounceTimeout) clearTimeout(resizeDebounceTimeout);
        resizeDebounceTimeout = setTimeout(() => {
          resize(entry.contentRect.width, entry.contentRect.height);
        }, 60);
      }
    });
    
    if (canvas.parentElement) {
       observer.observe(canvas.parentElement);
       // Initial draw
       const rect = canvas.parentElement.getBoundingClientRect();
       resize(rect.width, rect.height);
    } else {
       observer.observe(canvas);
       const rect = canvas.getBoundingClientRect();
       resize(rect.width, rect.height);
    }

    return () => {
      observer.disconnect();
      if (resizeDebounceTimeout) clearTimeout(resizeDebounceTimeout);
    };
  }, [lineCount, opacity, strokeColor, density, distortion, seed, step]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} 
    />
  );
}
