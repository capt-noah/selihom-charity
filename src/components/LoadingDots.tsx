import React from "react";

interface LoadingDotsProps {
  label?: string;
  className?: string;
}

export default function LoadingDots({ label, className = "" }: LoadingDotsProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`} aria-live="polite" aria-label={label || "Loading"}>
      <span className="h-2 w-2 rounded-full bg-brand-sky-200 animate-bounce [animation-delay:-0.3s]" />
      <span className="h-2 w-2 rounded-full bg-brand-sky-300 animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 rounded-full bg-brand-sky-400 animate-bounce" />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
