"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface IconCloudProps {
  icons?: string[];
  images?: string[];
  size?: number;
  className?: string;
}

export function IconCloud({
  icons = [],
  images = [],
  size = 1.5,
  className,
}: IconCloudProps) {
  const cloudRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!mounted || !cloudRef.current) return;

    let radius = 150;
    const items = cloudRef.current.querySelectorAll(".cloud-item");
    const total = items.length;
    const sinDeg = (deg: number) => Math.sin((deg * Math.PI) / 180);
    const cosDeg = (deg: number) => Math.cos((deg * Math.PI) / 180);

    items.forEach((item, index) => {
      const htmlItem = item as HTMLElement;
      const phi = Math.acos(-1 + (2 * index) / total);
      const theta = Math.sqrt(total * Math.PI) * phi;

      // Calculate position
      const x = radius * sinDeg(phi * 180) * cosDeg(theta * 180);
      const y = radius * sinDeg(phi * 180) * sinDeg(theta * 180);
      const z = radius * cosDeg(phi * 180);

      // Apply transform
      htmlItem.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
      
      // Random rotation for emojis
      if (icons.length > 0) {
        const rotate = Math.random() * 360;
        htmlItem.style.transform += ` rotate(${rotate}deg)`;
      }

      // Animation
      const animDuration = 5 + Math.random() * 10;
      const animDelay = Math.random() * 5;
      
      htmlItem.style.animation = `float ${animDuration}s ease-in-out ${animDelay}s infinite`;
    });

    // Add rotation animation to the whole cloud
    if (cloudRef.current) {
      cloudRef.current.style.animation = "rotate3D 25s linear infinite";
    }
  }, [mounted, icons.length, images.length]);

  if (!mounted) return null;

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div
        ref={cloudRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform-style-3d"
      >
        {icons.map((icon, i) => (
          <div
            key={`cloud-icon-${i}`}
            className="cloud-item absolute select-none transform-style-3d"
            style={{ fontSize: `${size}rem` }}
          >
            {icon}
          </div>
        ))}
        {images.map((img, i) => (
          <div
            key={`cloud-img-${i}`}
            className="cloud-item absolute size-8 select-none transform-style-3d"
          >
            <img
              src={img}
              alt={`icon-${i}`}
              className="size-full object-contain"
              style={{ width: `${size}rem`, height: `${size}rem` }}
            />
          </div>
        ))}
      </div>

      <style jsx global>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        @keyframes rotate3D {
          0% {
            transform: translate(-50%, -50%) rotateX(5deg) rotateY(0);
          }
          100% {
            transform: translate(-50%, -50%) rotateX(5deg) rotateY(360deg);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, 10px, 0);
          }
        }
      `}</style>
    </div>
  );
} 