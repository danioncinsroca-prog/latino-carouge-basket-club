import Image from "next/image";
import type { ReactNode } from "react";

type PlaceholderTone = "ink" | "gold" | "panel";
type PlaceholderSize = "hero" | "portrait" | "news" | "wide";

const toneClasses: Record<PlaceholderTone, string> = {
  ink: "bg-[var(--color-ink)] text-[var(--color-cream)] border-[var(--color-gold)]",
  gold: "bg-[var(--color-gold)] text-[var(--color-ink)] border-[var(--color-ink)]",
  panel: "bg-[var(--color-surface)] text-[var(--color-ink)] border-[var(--color-ink)]",
};

const sizeClasses: Record<PlaceholderSize, string> = {
  hero: "min-h-[320px] sm:min-h-[420px]",
  portrait: "min-h-[320px]",
  news: "min-h-[180px]",
  wide: "min-h-[140px]",
};

type MediaPlaceholderProps = {
  label: string;
  note?: string;
  tone?: PlaceholderTone;
  size?: PlaceholderSize;
  extra?: ReactNode;
  className?: string;
  showHeadline?: boolean;
  image?: {
    src: string;
    alt: string;
    position?: string;
  };
};

export function MediaPlaceholder({
  label,
  note,
  tone = "ink",
  size = "hero",
  extra,
  className = "",
  showHeadline = true,
  image,
}: MediaPlaceholderProps) {
  if (image) {
    return (
      <div
        className={`relative overflow-hidden border ${sizeClasses[size]} ${className}`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover"
          style={{ objectPosition: image.position ?? "center center" }}
        />
      </div>
    );
  }

  const titleClass =
    size === "hero"
      ? "text-3xl sm:text-4xl"
      : size === "portrait"
        ? "text-lg sm:text-xl"
        : "text-xl";

  return (
    <div
      className={`relative flex w-full flex-col justify-between overflow-hidden border p-4 site-grid ${toneClasses[tone]} ${sizeClasses[size]} ${className}`}
    >
      <div className="relative z-10 font-condensed text-[0.7rem] font-bold uppercase tracking-[0.24em]">
        {label}
      </div>
      {extra ? <div className="relative z-10">{extra}</div> : null}
      <div className="relative z-10 space-y-2">
        {showHeadline ? (
          <div className={`font-display uppercase leading-none ${titleClass}`}>
            {label}
          </div>
        ) : null}
        {note ? (
          <div
            className={`max-w-sm text-current/80 ${
              size === "hero" ? "text-sm" : "text-xs"
            }`}
          >
            {note}
          </div>
        ) : null}
      </div>
    </div>
  );
}
