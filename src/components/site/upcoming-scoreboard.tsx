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
      className="relative flex min-h-[228px] flex-col overflow-hidden rounded-[1.15rem] border border-[rgba(245,241,230,0.12)] shadow-[0_26px_44px_rgba(8,14,24,0.22)] sm:min-h-[236px]"
      style={{
        background:
          "linear-gradient(180deg, #183254 0%, #122742 48%, #0c1828 100%)",
      }}
    >
      <div
        aria-hidden
        className="absolute left-0 top-0 h-8 w-20 bg-[var(--color-gold)]"
        style={{ clipPath: "polygon(0 0, 100% 0, 72% 100%, 0 100%)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 h-8 w-20 bg-[var(--color-gold)]"
        style={{ clipPath: "polygon(28% 0, 100% 0, 100% 100%, 0 100%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[1px] rounded-[1rem] border border-white/6"
      />

      <div className="relative grid flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-5 py-6 sm:px-6 sm:py-7">
        <div className="flex min-w-0 flex-col items-center gap-2.5 text-center">
          <div className="relative h-[6rem] w-[6rem] shrink-0 overflow-hidden rounded-full border-[3px] border-[rgba(240,188,43,0.72)] bg-white shadow-[0_10px_24px_rgba(0,0,0,0.28)]">
            <Image
              src="/latino-carouge-logo.jpg"
              alt="Latino Carouge BC"
              fill
              className="object-cover"
            />
          </div>
          <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-condensed text-[0.88rem] font-bold uppercase leading-none tracking-[0.08em] text-white sm:text-[0.94rem]">
            {clubConfig.shortName}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1.5">
          <div className="font-condensed text-[0.98rem] font-bold uppercase tracking-[0.32em] text-white">
            {displayDate}
          </div>
          <div
            className="min-w-[11.2rem] border border-[rgba(255,216,120,0.14)] bg-black/90 px-4 py-[0.78rem] text-center font-scoreboard text-[2.9rem] leading-none tracking-[0.04em] text-[#ffd86f] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]"
            style={{
              textShadow:
                "0 0 5px rgba(255,216,111,0.45), 0 0 14px rgba(255,216,111,0.22)",
            }}
          >
            {fixture.timeLabel}
          </div>
          <div className="font-condensed text-[1.9rem] font-bold uppercase leading-none tracking-[0.32em] text-[var(--color-gold)]">
            VS
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-center gap-2.5 text-center">
          <div className="flex h-[6rem] w-[6rem] shrink-0 items-center justify-center rounded-full border-2 border-white/18 bg-white/8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
            <span className="font-display text-[1.6rem] uppercase leading-none text-white/78">
              {opponentInitials}
            </span>
          </div>
          <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-condensed text-[0.88rem] font-bold uppercase leading-none tracking-[0.08em] text-white sm:text-[0.94rem]">
            {fixture.opponent}
          </div>
        </div>
      </div>
    </div>
  );
}

export function UpcomingScoreboard({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {fixtures.map((fixture) => (
        <ScoreboardCard
          key={`${fixture.shortDate}-${fixture.opponent}`}
          fixture={fixture}
        />
      ))}
    </div>
  );
}
