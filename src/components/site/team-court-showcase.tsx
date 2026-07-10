import { MediaPlaceholder } from "@/components/site/media-placeholder";
import type {
  CoachProfile,
  Locale,
  MediaPlaceholder as MediaPlaceholderConfig,
  RosterPlayer,
} from "@/lib/site";

type TeamCourtShowcaseProps = {
  locale: Locale;
  coach: CoachProfile;
  roster: RosterPlayer[];
  coachPlaceholder: MediaPlaceholderConfig;
};

const sectionLabels: Record<
  Locale,
  { coach: string; players: string; rosterTitle: string }
> = {
  fr: {
    coach: "Coach principal",
    players: "Joueurs",
    rosterTitle: "Effectif",
  },
  es: {
    coach: "Entrenador principal",
    players: "Jugadores",
    rosterTitle: "Plantilla",
  },
};

export function TeamCourtShowcase({
  locale,
  coach,
  roster,
  coachPlaceholder,
}: TeamCourtShowcaseProps) {
  const labels = sectionLabels[locale];

  return (
    <div className="grid gap-px border border-white/12 bg-white/8 grid-cols-1 lg:grid-cols-[0.42fr_0.58fr]">
      <div className="bg-[var(--color-ink)] p-4 sm:p-6 lg:p-8">
        <div className="font-condensed text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
          {labels.coach}
        </div>

        <div className="mt-4 border-b border-white/12 pb-6">
          <div className="font-display text-4xl uppercase leading-none text-[var(--color-cream)] sm:text-5xl">
            {coach.name}
          </div>
          <div className="mt-2 font-condensed text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-cream)]/72">
            {coach.role}
          </div>
          <p className="mt-4 max-w-md text-sm text-[var(--color-cream)]/72 leading-relaxed">
            {coach.bio}
          </p>
        </div>

        <MediaPlaceholder
          label={coachPlaceholder.label}
          tone="gold"
          size="portrait"
          className="mt-8"
          showHeadline={false}
          image={coachPlaceholder.image}
        />
      </div>

      <div className="bg-[var(--color-ink)] p-6 sm:p-8">
        <div className="border-b border-white/12 pb-6">
          <div className="font-condensed text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
            {labels.players}
          </div>
          <div className="mt-3 font-display text-4xl uppercase leading-none text-[var(--color-cream)] sm:text-5xl">
            {labels.rosterTitle}
          </div>
        </div>

        <div className="mt-8 grid gap-px border border-white/12 bg-white/8 sm:grid-cols-2 xl:grid-cols-3">
          {roster.map((player) => (
            <div
              key={player.number}
              className="flex min-h-[224px] flex-col justify-between bg-[var(--color-ink)] p-4"
            >
              <div>
                <div className="font-condensed text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                  {player.position}
                </div>
                <div className="mt-3 flex items-end justify-between gap-4 border-b border-white/12 pb-3">
                  <div className="font-display text-3xl uppercase leading-none text-[var(--color-cream)]">
                    {player.name}
                  </div>
                  <div className="font-display text-5xl leading-none text-[var(--color-gold)]">
                    {player.number}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-[var(--color-cream)]/72">
                {player.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
