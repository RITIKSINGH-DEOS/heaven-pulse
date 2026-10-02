'use client';

import React, { useEffect, useRef } from 'react';

export const ParticleWaveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Wave parameters (Exact match to 3D particle mesh in reference image)
    const cols = 55;
    const rows = 35;
    const xSpacing = width > 1200 ? 32 : 24;
    const zSpacing = 28;

    // Scattered glowing amber embers (from reference image)
    interface Ember {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      alpha: number;
      color: string;
    }

    const embers: Ember[] = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedY: -(Math.random() * 0.4 + 0.15),
      speedX: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.3 ? '#f97316' : '#10b981', // amber & emerald sparks
    }));

    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Render 3D Flowing Particle Mesh
      const centerX = width * 0.5;
      const centerY = height * 0.38;

      for (let ix = 0; ix < cols; ix++) {
        for (let iz = 0; iz < rows; iz++) {
          // Perspective projection math
          const xPos = (ix - cols / 2) * xSpacing;
          const zPos = (iz - rows / 2) * zSpacing + 500;

          // Multi-frequency wave calculation
          const wave1 = Math.sin((ix * 0.2) + step * 0.03) * 35;
          const wave2 = Math.cos((iz * 0.25) + step * 0.02) * 45;
          const wave3 = Math.sin(((ix + iz) * 0.12) + step * 0.015) * 25;
          const yPos = wave1 + wave2 + wave3;

          // 3D to 2D projection
          const fov = 450;
          const scale = fov / (fov + zPos);
          const screenX = centerX + xPos * scale;
          const screenY = centerY + yPos * scale + (zPos * 0.35);

          if (scale > 0 && screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
            // Depth shading: closer points are brighter
            const depthFactor = Math.max(0.1, Math.min(1, scale * 1.6));
            const pointAlpha = depthFactor * 0.65;
            const pointSize = Math.max(0.8, scale * 2.8);

            ctx.beginPath();
            ctx.arc(screenX, screenY, pointSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${pointAlpha})`;
            ctx.fill();
          }
        }
      }

      // 2. Render Ambient Floating Embers (orange & emerald glowing specks)
      embers.forEach((ember) => {
        ember.y += ember.speedY;
        ember.x += ember.speedX;

        if (ember.y < 0) {
          ember.y = height + 10;
          ember.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        ctx.fillStyle = ember.color;
        ctx.shadowColor = ember.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = ember.alpha;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      step += 0.8;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
