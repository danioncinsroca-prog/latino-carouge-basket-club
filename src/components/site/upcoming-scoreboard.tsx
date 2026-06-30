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
  const opponentInitials = getInitials(fixture.opponent);

  return (
    <div className="flex flex-col overflow-hidden bg-[var(--color-ink)] border-l-4 border-[var(--color-gold)] min-h-[210px]">
      {/* Header strip */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-cream)]/10">
        <span className="font-condensed text-[0.68rem] font-bold uppercase tracking-[0.26em] text-[var(--color-gold)]">
          {fixture.status}
        </span>
        <span className="font-condensed text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--color-cream)]/50">
          {fixture.phase}
        </span>
      </div>

      {/* Date + time row */}
      <div className="flex items-center gap-3 px-5 pt-4">
        <div className="font-display text-xl uppercase leading-none text-[var(--color-cream)]">
          {fixture.shortDate}
        </div>
        <div className="bg-black/60 px-2.5 py-1 font-mono text-xs font-bold tracking-[0.14em] text-[var(--color-gold)]">
          {fixture.timeLabel}
        </div>
      </div>

      {/* Matchup */}
      <div className="flex flex-1 items-center gap-3 px-5 py-4">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[var(--color-gold)]/50">
          <Image
            src="/latino-carouge-logo.jpg"
            alt="Latino Carouge BC"
            fill
            className="object-cover"
          />
        </div>

        <div className="font-condensed text-xs font-bold uppercase text-[var(--color-cream)]/50">
          vs
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-cream)]/20 bg-[var(--color-cream)]/10">
          <span className="font-display text-xs uppercase leading-none text-[var(--color-cream)]">
            {opponentInitials}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="font-display text-xl uppercase leading-tight text-[var(--color-cream)] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
            {fixture.opponent}
          </div>
        </div>
      </div>

      {/* Venue footer */}
      <div className="border-t border-[var(--color-cream)]/10 px-5 py-2.5">
        <div className="truncate font-condensed text-[0.65rem] uppercase tracking-[0.16em] text-[var(--color-cream)]/40">
          {fixture.venue}
        </div>
      </div>
    </div>
  );
}

export function UpcomingScoreboard({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <div className="grid gap-px bg-[var(--color-gold)]/20 sm:grid-cols-2 lg:grid-cols-3">
      {fixtures.map((fixture) => (
        <ScoreboardCard
          key={`${fixture.shortDate}-${fixture.opponent}`}
          fixture={fixture}
        />
      ))}
    </div>
  );
}
