"use client";

import { SpinningText } from "@/components/magicui/spinning-text";

export function SpinningTextLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <SpinningText 
        radius={7} 
        className="text-blue-300 text-sm"
      >
        chronos • time travel • journey • memories • explore •
      </SpinningText>
    </div>
  );
} 