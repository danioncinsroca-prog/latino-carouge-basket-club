import Image from "next/image";
import { clubConfig, type Fixture } from "@/lib/site";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}

function ScoreboardCard({ fixture }: { fixture: Fixture }) {
  const clubInitials = getInitials(clubConfig.shortName.replace("BASKET CLUB", "").replace("BC", "").trim() || "LC");
  const opponentInitials = getInitials(fixture.opponent);

  return (
    <div className="flex flex-col bg-[var(--color-ink)] border-l-[3px] border-[var(--color-gold)] min-h-[220px]">
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[var(--color-cream)]/10">
        <div className="font-condensed text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[var(--color-gold)]">
          {fixture.status}
        </div>
        <span className="phase-label text-[var(--color-cream)]/60" style={{ borderTopColor: "rgba(240,188,43,0.35)" }}>
          {fixture.phase}
        </span>
      </div>

      <div className="flex flex-1 items-center gap-4 px-5 py-5">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[var(--color-gold)]/40">
          <Image
            src="/latino-carouge-logo.jpg"
            alt="Latino Carouge BC"
            fill
            className="object-cover"
          />
        </div>

        <div className="font-condensed text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-cream)]/60">
          vs
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-cream)]/10 border border-[var(--color-cream)]/20">
          <span className="font-display text-sm uppercase leading-none text-[var(--color-cream)]">
            {opponentInitials}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="font-display text-2xl uppercase leading-none text-[var(--color-cream)] truncate">
            {fixture.opponent}
          </div>
          <div className="mt-1 font-condensed text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-cream)]/50">
            {clubConfig.shortName}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 pb-5">
        <div className="flex items-center gap-2">
          <div className="bg-black/60 px-3 py-1.5 font-mono text-sm font-bold tracking-[0.15em] text-[var(--color-gold)]">
            {fixture.timeLabel}
          </div>
          <div className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-cream)]/50">
            {fixture.shortDate}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-cream)]/10 px-5 py-3">
        <div className="font-condensed text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-cream)]/45 truncate">
          {fixture.venue}
        </div>
      </div>
    </div>
  );
}

export function UpcomingScoreboard({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <div className="grid gap-px bg-[var(--color-gold)]/15 sm:grid-cols-2 lg:grid-cols-3">
      {fixtures.map((fixture) => (
        <ScoreboardCard
          key={`${fixture.shortDate}-${fixture.opponent}`}
          fixture={fixture}
        />
      ))}
    </div>
  );
}
