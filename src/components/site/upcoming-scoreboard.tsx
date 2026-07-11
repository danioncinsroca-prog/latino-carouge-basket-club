import Image from "next/image";
import { clubConfig, type Fixture } from "@/lib/site";
import { getTeamLogoSrc } from "@/lib/team-logos";

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

function TeamBadge({
  name,
  logoSrc,
  size = "large",
}: {
  name: string;
  logoSrc?: string;
  size?: "large" | "small";
}) {
  const initials = getInitials(name);
  const dimensions =
    size === "large"
      ? "h-[5.6rem] w-[5.6rem] sm:h-[8.5rem] sm:w-[8.5rem]"
      : "h-[4.7rem] w-[4.7rem] sm:h-[6rem] sm:w-[6rem]";
  const textSize =
    size === "large"
      ? "text-[1.25rem] sm:text-[2rem]"
      : "text-[1.1rem] sm:text-[1.6rem]";

  return (
    <div
      className={`relative flex ${dimensions} shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/92 shadow-[0_8px_16px_rgba(0,0,0,0.28)] ring-1 ring-white/10 sm:shadow-[0_10px_24px_rgba(0,0,0,0.28)]`}
    >
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt={`${name} logo`}
          fill
          sizes={size === "large" ? "136px" : "96px"}
          className="object-contain p-3"
        />
      ) : (
        <span className={`font-display ${textSize} uppercase leading-none text-[#183254]`}>
          {initials}
        </span>
      )}
    </div>
  );
}

function ScoreboardCard({ fixture }: { fixture: Fixture }) {
  const teamName = fixture.teamName ?? clubConfig.shortName;
  const teamLogoSrc = fixture.teamLogoSrc ?? getTeamLogoSrc(teamName);
  const opponentLogoSrc =
    fixture.opponentLogoSrc ?? getTeamLogoSrc(fixture.opponent);
  const displayDate = getDisplayDate(fixture);

  return (
    <div
      className="relative flex min-h-[200px] flex-col overflow-hidden rounded-xl shadow-lg sm:min-h-[228px] lg:min-h-[236px] sm:rounded-2xl"
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
        className="pointer-events-none absolute inset-[1px] rounded-[calc(0.75rem-1px)] shadow-inset-subtle sm:rounded-[calc(1rem-1px)]"
      />

      <div className="relative grid flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 px-2 py-4 sm:gap-3 sm:px-5 sm:py-6 lg:px-6 lg:py-7">
        <div className="flex min-w-0 flex-col items-center gap-2 text-center sm:gap-2.5">
          <TeamBadge name={teamName} logoSrc={teamLogoSrc} />
          <div className="max-w-full font-condensed text-[0.78rem] font-bold uppercase leading-tight tracking-[0.045em] text-white [overflow-wrap:anywhere] sm:text-[1.1rem] sm:tracking-[0.06em] lg:text-[1.2rem]">
            {teamName}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1">
          <div className="font-condensed text-[0.85rem] font-bold uppercase tracking-[0.06em] text-white sm:text-[1.1rem] lg:text-[1.3rem]">
            {displayDate}
          </div>
          <div
            className="min-w-[6.8rem] bg-black/90 px-1.5 py-[0.55rem] text-center font-scoreboard text-[1.7rem] leading-none tracking-[0.04em] text-[#ffd86f] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] sm:min-w-[11.2rem] sm:px-4 sm:py-[0.78rem] sm:text-[2.9rem]"
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
          <TeamBadge
            name={fixture.opponent}
            logoSrc={opponentLogoSrc}
            size="small"
          />
          <div className="max-w-full font-condensed text-[0.78rem] font-bold uppercase leading-tight tracking-[0.045em] text-white [overflow-wrap:anywhere] sm:text-[1.1rem] sm:tracking-[0.06em] lg:text-[1.2rem]">
            {fixture.opponent}
          </div>
        </div>
      </div>
    </div>
  );
}

export function UpcomingScoreboard({
  fixtures,
  emptyTitle,
  emptyBody,
}: {
  fixtures: Fixture[];
  emptyTitle?: string;
  emptyBody?: string;
}) {
  if (fixtures.length === 0) {
    return (
      <div className="rounded-xl bg-[var(--color-surface)] px-5 py-6 text-center shadow-md sm:px-6 sm:py-8">
        <div className="font-display text-3xl uppercase leading-none text-[var(--color-ink)] sm:text-4xl">
          {emptyTitle ?? "Calendrier a venir"}
        </div>
        {emptyBody ? (
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--color-muted)] sm:text-base">
            {emptyBody}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-2">
      {fixtures.map((fixture) => (
        <ScoreboardCard
          key={`${fixture.isoDate ?? fixture.shortDate}-${fixture.opponent}`}
          fixture={fixture}
        />
      ))}
    </div>
  );
}
