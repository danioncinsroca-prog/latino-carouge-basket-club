import type { PalmaresItem } from "@/lib/site";

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M8 21h8M12 17v4M6 3H4a2 2 0 000 4c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4a2 2 0 000-4h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 3h12v7a6 6 0 01-12 0V3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CupIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <circle cx="12" cy="14" r="6" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8.21 3.06L7 6l5 2 5-2-1.21-2.94" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12v4M10 14h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function MilestoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const icons: Record<PalmaresItem["type"], React.FC> = {
  trophy: TrophyIcon,
  cup: CupIcon,
  medal: MedalIcon,
  milestone: MilestoneIcon,
};

function TimelineItem({ item, isLast }: { item: PalmaresItem; isLast: boolean }) {
  const Icon = icons[item.type];

  return (
    <div className="flex flex-col items-center" style={{ minWidth: "160px", maxWidth: "200px" }}>
      <div className="flex flex-col items-center gap-2 pb-5">
        <div className="text-[var(--color-gold)]">
          <Icon />
        </div>
        <div className="font-display text-2xl uppercase leading-none text-[var(--color-ink)]">
          {item.year}
        </div>
      </div>

      <div className="relative flex w-full items-center justify-center">
        {!isLast && (
          <div className="absolute left-1/2 top-1/2 h-[2px] w-full -translate-y-1/2 bg-[var(--color-ink)]/15" />
        )}
        <div className="relative z-10 h-3.5 w-3.5 rounded-full bg-[var(--color-gold)] ring-2 ring-[var(--color-cream)] ring-offset-0" />
      </div>

      <div className="pt-5 text-center">
        <div className="font-condensed text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-ink)]">
          {item.title}
        </div>
        <p className="mt-2 text-xs text-[var(--color-muted)] leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
}

export function PalmaresTimeline({ items }: { items: PalmaresItem[] }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div
        className="flex gap-0"
        style={{ minWidth: `${items.length * 180}px` }}
      >
        {items.map((item, index) => (
          <div
            key={`${item.year}-${item.title}`}
            className="flex-1"
            style={{ minWidth: "160px" }}
          >
            <TimelineItem item={item} isLast={index === items.length - 1} />
          </div>
        ))}
      </div>
    </div>
  );
}
