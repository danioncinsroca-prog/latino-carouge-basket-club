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
    <div
      className="flex flex-col overflow-hidden rounded-xl border-t-4 border-[var(--color-gold)] min-h-[300px]"
      style={{
        background: "linear-gradient(160deg, #1e3558 0%, #0f1c30 60%, #0a1520 100%)",
      }}
    >
      {/* Header: status + phase */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-cream)]/8">
        <span className="font-condensed text-[0.68rem] font-bold uppercase tracking-[0.26em] text-[var(--color-gold)]">
          {fixture.status}
        </span>
        <span className="font-condensed text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--color-cream)]/40">
          {fixture.phase}
        </span>
      </div>

      {/* Date */}
      <div className="pt-5 text-center font-condensed text-[0.7rem] font-bold uppercase tracking-[0.30em] text-[var(--color-cream)]/50">
        {fixture.shortDate}
      </div>

      {/* Logos + digital clock */}
      <div className="flex flex-1 items-center justify-between px-8 py-4 gap-4">
        {/* Home team */}
        <div className="flex flex-1 flex-col items-center gap-3">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[var(--color-gold)]/50 bg-white shadow-[0_0_20px_rgba(240,188,43,0.15)]">
            <Image
              src="/latino-carouge-logo.jpg"
              alt="Latino Carouge BC"
              fill
              className="object-cover"
            />
          </div>
          <div className="font-condensed text-sm font-bold uppercase tracking-[0.12em] text-white whitespace-nowrap text-center">
            {clubConfig.shortName}
          </div>
        </div>

        {/* Digital scoreboard clock */}
        <div className="flex shrink-0 flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-gold)]/35 text-base leading-none select-none">›</span>
            <div
              className="font-scoreboard bg-black/85 px-5 py-3 text-[2rem] leading-none tracking-[0.06em] text-[var(--color-gold)]"
              style={{
                textShadow:
                  "0 0 8px rgba(240,188,43,0.9), 0 0 20px rgba(240,188,43,0.5), 0 0 40px rgba(240,188,43,0.2)",
                border: "1px solid rgba(240,188,43,0.18)",
              }}
            >
              {fixture.timeLabel}
            </div>
            <span className="text-[var(--color-gold)]/35 text-base leading-none select-none">‹</span>
          </div>
          <div className="font-condensed text-xs font-bold uppercase tracking-[0.28em] text-[var(--color-gold)]">
            VS
          </div>
        </div>

        {/* Opponent team */}
        <div className="flex flex-1 flex-col items-center gap-3">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-cream)]/20 bg-[var(--color-cream)]/8">
            <span className="font-display text-base uppercase leading-none text-[var(--color-cream)]/80">
              {opponentInitials}
            </span>
          </div>
          <div className="font-condensed text-sm font-bold uppercase tracking-[0.12em] text-white whitespace-nowrap text-center">
            {fixture.opponent}
          </div>
        </div>
      </div>

      {/* Venue footer */}
      <div className="border-t border-[var(--color-cream)]/8 px-5 py-3">
        <div className="truncate font-condensed text-[0.62rem] uppercase tracking-[0.18em] text-[var(--color-cream)]/35">
          {fixture.venue}
        </div>
      </div>
    </div>
  );
}

export function UpcomingScoreboard({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {fixtures.map((fixture) => (
        <ScoreboardCard
          key={`${fixture.shortDate}-${fixture.opponent}`}
          fixture={fixture}
        />
      ))}
    </div>
  );
}
