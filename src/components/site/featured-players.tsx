import type { FeaturedPlayer } from "@/lib/site";

function PlayerCard({ player }: { player: FeaturedPlayer }) {
  return (
    <article className="relative h-full overflow-hidden border border-white/10 bg-[rgba(9,20,35,0.78)] p-4 shadow-[0_22px_48px_rgba(4,10,18,0.22)] backdrop-blur-[2px] sm:p-5">
      <div className="flex h-full flex-col">
        <div className="relative mb-5 aspect-square overflow-visible">
          <div className="absolute inset-0 bg-[var(--color-gold)] shadow-[0_16px_30px_rgba(0,0,0,0.18)]" />
          <div
            aria-hidden
            className="absolute inset-[0.85rem] border border-[rgba(22,37,63,0.16)]"
          />
          <div
            aria-hidden
            className="absolute -left-4 bottom-4 flex flex-col gap-2"
          >
            <span className="h-[2px] w-7 bg-[var(--color-cream)]/55" />
            <span className="h-[2px] w-7 bg-[var(--color-cream)]/55" />
            <span className="h-[2px] w-7 bg-[var(--color-cream)]/55" />
          </div>
          <div
            aria-hidden
            className="absolute -right-4 top-5 h-[58%] w-6 border-y border-r border-[var(--color-cream)]/38"
          />
          <div className="absolute inset-x-0 bottom-3 text-center font-display text-[6.4rem] leading-none text-[var(--color-ink)]/78 sm:text-[7.1rem]">
            {player.number}
          </div>
        </div>

        <div className="font-display text-[2.1rem] uppercase leading-none text-[var(--color-cream)] sm:text-[2.4rem]">
          {player.name}
        </div>
        <div className="mt-2 font-condensed text-[0.82rem] font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">
          {player.position}
        </div>
        <p className="mt-4 max-w-[26ch] text-sm leading-relaxed text-[var(--color-cream)]/82">
          {player.highlight}
        </p>

        {player.stat ? (
          <div className="mt-auto pt-6">
            <div className="border-t border-white/12 pt-4">
              <div className="font-display text-4xl uppercase leading-none text-[var(--color-gold)]">
                {player.stat.value}
              </div>
              <div className="mt-1 font-condensed text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--color-cream)]/58">
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
    <div className="grid gap-6 lg:grid-cols-3">
      {players.map((player) => (
        <PlayerCard key={`${player.number}-${player.name}`} player={player} />
      ))}
    </div>
  );
}
