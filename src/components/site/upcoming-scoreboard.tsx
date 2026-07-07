import Image from "next/image";
import { clubConfig, type Fixture } from "@/lib/site";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}

function getDisplayDate(fixture: Fixture): string {
  const yearFromIso = fixture.isoDate ? new Date(fixture.isoDate).getFullYear() : null;
  const yearFromLabel = fixture.dateLabel.match(/\b(20\d{2})\b/)?.[1] ?? null;
  const year = yearFromIso ?? yearFromLabel;
  const shortDate = fixture.shortDate.trim().toUpperCase();

  return year ? `${shortDate} ${year}` : shortDate;
}

function ScoreboardCard({ fixture }: { fixture: Fixture }) {
  const opponentInitials = getInitials(fixture.opponent);
  const displayDate = getDisplayDate(fixture);

  return (
    <div
      className="relative flex min-h-[200px] flex-col overflow-hidden rounded-[1rem] border border-[rgba(245,241,230,0.12)] sm:min-h-[228px] lg:min-h-[236px] sm:rounded-[1.15rem]"
      style={{
        background:
          "linear-gradient(180deg, #183254 0%, #122742 48%, #0c1828 100%)",
      }}
    >
      <div
        aria-hidden
        className="absolute left-0 top-0 h-6 w-16 bg-[var(--color-gold)] sm:h-8 sm:w-20"
        style={{ clipPath: "polygon(0 0, 100% 0, 72% 100%, 0 100%)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 h-6 w-16 bg-[var(--color-gold)] sm:h-8 sm:w-20"
        style={{ clipPath: "polygon(28% 0, 100% 0, 100% 100%, 0 100%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[1px] rounded-[0.95rem] border border-white/6 sm:rounded-[1rem]"
      />

      <div className="relative grid flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3 py-4 sm:gap-3 sm:px-5 sm:py-6 lg:px-6 lg:py-7">
        <div className="flex min-w-0 flex-col items-center gap-2 text-center sm:gap-2.5">
          <div className="relative h-[6.5rem] w-[6.5rem] shrink-0 overflow-hidden rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.28)] sm:h-[8.5rem] sm:w-[8.5rem] sm:shadow-[0_10px_24px_rgba(0,0,0,0.28)]">
            <Image
              src="/latino-carouge-logo.png"
              alt="Latino Carouge BC"
              fill
              className="object-cover"
            />
          </div>
          <div className="font-condensed text-[0.9rem] font-bold uppercase leading-tight tracking-[0.06em] text-white sm:text-[1.1rem] lg:text-[1.2rem]">
            {clubConfig.shortName}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1">
          <div className="font-condensed text-[0.85rem] font-bold uppercase tracking-[0.06em] text-white sm:text-[1.1rem] lg:text-[1.3rem]">
            {displayDate}
          </div>
          <div
            className="min-w-[9.2rem] border border-[rgba(255,216,120,0.14)] bg-black/90 px-3 py-[0.6rem] text-center font-scoreboard text-[2rem] leading-none tracking-[0.04em] text-[#ffd86f] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] sm:min-w-[11.2rem] sm:px-4 sm:py-[0.78rem] sm:text-[2.9rem]"
            style={{
              textShadow:
                "0 0 5px rgba(255,216,111,0.45), 0 0 14px rgba(255,216,111,0.22)",
            }}
          >
            {fixture.timeLabel}
          </div>
          <div className="font-condensed text-[2rem] font-bold uppercase leading-none tracking-[-0.02em] text-[var(--color-gold)] sm:text-[2.8rem]">
            VS
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-center gap-2 text-center sm:gap-2.5">
          <div className="flex h-[5rem] w-[5rem] shrink-0 items-center justify-center rounded-full bg-white/8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] sm:h-[6rem] sm:w-[6rem]">
            <span className="font-display text-[1.3rem] uppercase leading-none text-white/78 sm:text-[1.6rem]">
              {opponentInitials}
            </span>
          </div>
          <div className="font-condensed text-[0.9rem] font-bold uppercase leading-tight tracking-[0.06em] text-white sm:text-[1.1rem] lg:text-[1.2rem]">
            {fixture.opponent}
          </div>
        </div>
      </div>
    </div>
  );
}

export function UpcomingScoreboard({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-2">
      {fixtures.map((fixture) => (
        <ScoreboardCard
          key={`${fixture.shortDate}-${fixture.opponent}`}
          fixture={fixture}
        />
      ))}
    </div>
  );
}
