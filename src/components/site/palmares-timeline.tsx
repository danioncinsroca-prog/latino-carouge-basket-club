import type { PalmaresItem } from "@/lib/site";

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8 21h8M12 17v4M6 3H4a2 2 0 000 4c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4a2 2 0 000-4h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 3h12v7a6 6 0 01-12 0V3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CupIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MedalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="14" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8.21 3.06L7 6l5 2 5-2-1.21-2.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12v4M10 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function MilestoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const icons: Record<PalmaresItem["type"], React.FC<{ className?: string }>> = {
  trophy: TrophyIcon,
  cup: CupIcon,
  medal: MedalIcon,
  milestone: MilestoneIcon,
};

export function PalmaresTimeline({ items }: { items: PalmaresItem[] }) {
  const count = items.length;

  return (
    <>
      {/* Mobile: vertical timeline, no horizontal scroll */}
      <div className="flex flex-col gap-6 sm:hidden">
        {items.map((item, index) => {
          const Icon = icons[item.type];
          return (
            <div key={`m-${item.year}-${item.title}`} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="text-[var(--color-gold)]">
                  <Icon className="h-8 w-8" />
                </div>
                {index < count - 1 && (
                  <div className="mt-2 w-px flex-1 bg-[var(--color-cream)]/20" />
                )}
              </div>
              <div className="pb-2">
                <div className="font-display text-lg uppercase leading-none text-[var(--color-gold)]">
                  {item.year}
                </div>
                <div className="mt-2 font-condensed text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--color-cream)]">
                  {item.title}
                </div>
                <p className="mt-1.5 text-[0.65rem] leading-relaxed text-[var(--color-cream)]/55">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tablet/desktop: horizontal timeline */}
      <div
        className="hidden sm:grid"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(120px, 1fr))` }}
      >
        {/* Row 1: Year + Icon */}
        {items.map((item) => {
          const Icon = icons[item.type];
          return (
            <div
              key={`top-${item.year}-${item.title}`}
              className="flex flex-col items-center gap-4 px-6 pb-6"
            >
              <div className="font-display text-2xl uppercase leading-none text-[var(--color-gold)]">
                {item.year}
              </div>
              <div className="text-[var(--color-gold)]">
                <Icon className="h-12 w-12" />
              </div>
            </div>
          );
        })}

        {/* Row 2: Continuous horizontal line + vertical tick per item */}
        {items.map((item, index) => (
          <div
            key={`line-${item.year}-${item.title}`}
            className="relative flex h-10 items-center justify-center"
          >
            <div
              className={`absolute top-1/2 h-px -translate-y-1/2 bg-[var(--color-cream)]/20 ${
                index === 0
                  ? "left-1/2 right-0"
                  : index === count - 1
                    ? "left-0 right-1/2"
                    : "left-0 right-0"
              }`}
            />
            <div className="relative z-10 h-10 w-px bg-[var(--color-gold)]/70" />
          </div>
        ))}

        {/* Row 3: Title + Description */}
        {items.map((item) => (
          <div key={`bottom-${item.year}-${item.title}`} className="px-6 pt-6 text-center">
            <div className="font-condensed text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-cream)]">
              {item.title}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-cream)]/55">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
