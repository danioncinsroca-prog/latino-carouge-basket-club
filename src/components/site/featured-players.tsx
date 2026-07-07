import type { FeaturedPlayer } from "@/lib/site";

function PlayerCard({ player }: { player: FeaturedPlayer }) {
  return (
    <article className="relative h-full overflow-hidden border border-white/10 bg-[rgba(9,20,35,0.78)] p-3 shadow-[0_16px_32px_rgba(4,10,18,0.22)] backdrop-blur-[2px] sm:p-4 lg:p-5 lg:shadow-[0_22px_48px_rgba(4,10,18,0.22)]">
      <div className="flex h-full flex-col">
        <div className="relative mb-3 aspect-square overflow-visible sm:mb-4 lg:mb-5">
          <div className="absolute inset-0 bg-[var(--color-gold)] shadow-[0_12px_24px_rgba(0,0,0,0.18)] sm:shadow-[0_16px_30px_rgba(0,0,0,0.18)]" />
          <div
            aria-hidden
            className="absolute inset-[0.85rem] border border-[rgba(22,37,63,0.16)]"
          />
          <div
            aria-hidden
            className="absolute -left-3 bottom-3 flex flex-col gap-1.5 sm:-left-4 sm:bottom-4 sm:gap-2"
          >
            <span className="h-[2px] w-6 bg-[var(--color-cream)]/55 sm:w-7" />
            <span className="h-[2px] w-6 bg-[var(--color-cream)]/55 sm:w-7" />
            <span className="h-[2px] w-6 bg-[var(--color-cream)]/55 sm:w-7" />
          </div>
          <div
            aria-hidden
            className="absolute -right-3 top-4 h-[58%] w-5 border-y border-r border-[var(--color-cream)]/38 sm:-right-4 sm:top-5 sm:w-6"
          />
          <div className="absolute inset-x-0 bottom-2 text-center font-display text-[5rem] leading-none text-[var(--color-ink)]/78 sm:bottom-3 sm:text-[6.4rem] lg:text-[7.1rem]">
            {player.number}
          </div>
        </div>

        <div className="font-display text-[1.6rem] uppercase leading-none text-[var(--color-cream)] sm:text-[2.1rem] lg:text-[2.4rem]">
          {player.name}
        </div>
        <div className="mt-1.5 font-condensed text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[var(--color-gold)] sm:mt-2 sm:text-[0.82rem]">
          {player.position}
        </div>
        <p className="mt-3 max-w-[26ch] text-[0.85rem] leading-relaxed text-[var(--color-cream)]/82 sm:mt-4 sm:text-sm">
          {player.highlight}
        </p>

        {player.stat ? (
          <div className="mt-auto pt-4 sm:pt-6">
            <div className="border-t border-white/12 pt-3 sm:pt-4">
              <div className="font-display text-3xl uppercase leading-none text-[var(--color-gold)] sm:text-4xl">
                {player.stat.value}
              </div>
              <div className="mt-1 font-condensed text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--color-cream)]/58 sm:text-[0.68rem]">
                {player.stat.label}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function FeaturedPlayers({ players }: { players: FeaturedPlayer[] }) {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {players.map((player) => (
        <PlayerCard key={`${player.number}-${player.name}`} player={player} />
      ))}
    </div>
  );
}
