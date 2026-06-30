import type { FeaturedPlayer } from "@/lib/site";

function PlayerCard({ player }: { player: FeaturedPlayer }) {
  return (
    <div className="relative overflow-hidden bg-[var(--color-ink)] p-6 flex flex-col justify-between min-h-[260px]">
      <div
        className="pointer-events-none absolute right-0 top-0 select-none font-display text-[8rem] font-bold uppercase leading-none text-[var(--color-gold)]/10"
        aria-hidden="true"
      >
        {player.number}
      </div>

      <div className="relative z-10">
        <div className="font-condensed text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[var(--color-gold)]">
          {player.position}
        </div>
        <div className="mt-2 font-display text-3xl uppercase leading-none text-[var(--color-cream)]">
          {player.name}
        </div>
        <p className="mt-4 text-sm text-[var(--color-cream)]/72 leading-relaxed max-w-[28ch]">
          {player.highlight}
        </p>
      </div>

      {player.stat ? (
        <div className="relative z-10 mt-6 border-t border-[var(--color-cream)]/12 pt-4">
          <div className="font-display text-4xl uppercase leading-none text-[var(--color-gold)]">
            {player.stat.value}
          </div>
          <div className="mt-1 font-condensed text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--color-cream)]/50">
            {player.stat.label}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function FeaturedPlayers({ players }: { players: FeaturedPlayer[] }) {
  return (
    <div className="grid gap-px bg-[var(--color-gold)]/20 sm:grid-cols-2 lg:grid-cols-3">
      {players.map((player) => (
        <PlayerCard key={`${player.number}-${player.name}`} player={player} />
      ))}
    </div>
  );
}
