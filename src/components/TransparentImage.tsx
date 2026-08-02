import React, { useState, useEffect } from "react";

interface TransparentImageProps {
  src: string;
  alt: string;
  className?: string;
  maxHeight?: string;
}

export default function TransparentImage({ src, alt, className, maxHeight = "460px" }: TransparentImageProps) {
  const [processedSrc, setProcessedSrc] = useState<string>("");

  useEffect(() => {
    const img = new Image();
    // Enable cross-origin just in case, though local assets are same-origin
    img.crossOrigin = "anonymous";
    img.src = src;
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setProcessedSrc(src);
        return;
      }

      ctx.drawImage(img, 0, 0);
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Convert white/near-white pixels to transparent with smooth alpha roll-off
        // Pure white is 255, 255, 255. 
        // We target pixels where R, G, and B are all above 238 to catch JPEG compression noise.
        const threshold = 238;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          if (r >= threshold && g >= threshold && b >= threshold) {
            const minColor = Math.min(r, g, b);
            // Linear opacity mapping to smoothly feather the cutout edge
            const alphaFactor = (255 - minColor) / (255 - threshold);
            data[i + 3] = Math.max(0, Math.min(255, Math.round(data[i + 3] * alphaFactor)));
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setProcessedSrc(canvas.toDataURL("image/png"));
      } catch (e) {
        console.error("Failed to make image background transparent:", e);
        setProcessedSrc(src);
      }
    };

    img.onerror = () => {
      setProcessedSrc(src);
    };
  }, [src]);

  return (
    <img
      src={processedSrc || src}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      style={{ maxHeight }}
    />
  );
}
