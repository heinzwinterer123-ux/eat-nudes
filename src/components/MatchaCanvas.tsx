'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, MotionValue } from 'framer-motion';

const FRAME_COUNT = 120;

export default function MatchaCanvas({
  onLoadProgress,
  smoothProgress,
}: {
  onLoadProgress: (progress: number) => void;
  smoothProgress: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/sequence/frame_${i}.webp`;
      img.onload = () => {
        loadedCount++;
        onLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
        if (loadedCount === FRAME_COUNT) {
          setImages(imgArray);
          setLoaded(true);
        }
      };
      imgArray.push(img);
    }

    return () => {
      // Cleanup logic if needed
    };
  }, [onLoadProgress]);

  // Draw to canvas
  useEffect(() => {
    if (!loaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(0); // Initial render
    };

    const renderFrame = (index: number) => {
      if (!ctx || !images[index]) return;

      const img = images[index];
      
      // Clear canvas (pure black background)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cover fit — fills the entire canvas, cropping edges if needed.
      // This looks great on both portrait phones and landscape desktops.
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasRatio > imgRatio) {
        // Canvas wider than image → fill width, crop top/bottom equally
        drawWidth = canvas.width;
        drawHeight = img.height * (canvas.width / img.width);
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        // Canvas taller than image → fill height, crop left/right equally
        drawHeight = canvas.height;
        drawWidth = img.width * (canvas.height / img.height);
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // On desktop, cover the watermark at the bottom-right corner.
      // On mobile (portrait cover fit) the watermark is naturally off-screen, so skip it.
      if (canvas.width >= 768) {
        const scale = Math.min(drawWidth / img.width, drawHeight / img.height);
        const watermarkWidth = Math.min(420 * scale, canvas.width * 0.55);
        const watermarkHeight = Math.min(260 * scale, canvas.height * 0.3);

        ctx.fillStyle = '#000000';
        ctx.fillRect(
          canvas.width - watermarkWidth,
          canvas.height - watermarkHeight,
          watermarkWidth,
          watermarkHeight
        );
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Subscribe to scroll changes
    const unsubscribe = smoothProgress.on('change', (latest) => {
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.floor(latest * FRAME_COUNT))
      );
      renderFrame(frameIndex);
    });

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      unsubscribe();
    };
  }, [loaded, images, smoothProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-contain"
    />
  );
}
