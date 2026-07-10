import type { CommitteeContent, TeamCategoriesContent } from "@/lib/site";

type ClubStructureShowcaseProps = {
  committee: CommitteeContent;
  teamCategories: TeamCategoriesContent;
};

export function ClubStructureShowcase({
  committee,
  teamCategories,
}: ClubStructureShowcaseProps) {
  return (
    <div className="grid grid-cols-1 gap-px border border-white/12 bg-white/8 lg:grid-cols-[0.4fr_0.6fr]">
      <section className="bg-[var(--color-ink)] p-4 sm:p-6 lg:p-8">
        <header className="border-b border-white/12 pb-6">
          <h3 className="font-display text-4xl uppercase leading-none text-[var(--color-cream)] sm:text-5xl">
            {committee.label}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--color-cream)]/72">
            {committee.intro}
          </p>
        </header>

        <ol className="border-b border-white/12">
          {committee.members.map((member, index) => (
            <li
              key={`${member.name}-${member.role}`}
              className="grid grid-cols-[3rem_1fr] gap-4 border-t border-white/12 py-5 first:border-t-0"
            >
              <span className="font-display text-3xl leading-none text-[var(--color-gold)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="font-display text-2xl uppercase leading-none text-[var(--color-cream)]">
                  {member.name}
                </div>
                <div className="mt-2 font-condensed text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--color-cream)]/72">
                  {member.role}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-[var(--color-ink)] p-4 sm:p-6 lg:p-8">
        <header className="border-b border-white/12 pb-6">
          <h3 className="font-display text-4xl uppercase leading-none text-[var(--color-cream)] sm:text-5xl">
            {teamCategories.label}
          </h3>
        </header>

        <ul className="mt-8 grid grid-cols-1 gap-px border border-white/12 bg-white/8 sm:grid-cols-2 xl:grid-cols-3">
          {teamCategories.items.map((category) => (
            <li key={category.name} className="bg-[var(--color-ink)]">
              <article className="h-full">
                <div className="site-grid relative flex aspect-[16/10] items-start overflow-hidden border-b border-white/12 bg-[var(--color-gold)] p-4 text-[var(--color-ink)]">
                  <span className="relative z-10 font-condensed text-[0.68rem] font-bold uppercase tracking-[0.2em]">
                    {teamCategories.imagePending}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-2 -right-1 max-w-[90%] text-right font-display text-5xl uppercase leading-[0.78] text-[var(--color-ink)]/12 sm:text-6xl"
                  >
                    {category.name}
                  </span>
                </div>

                <footer className="flex min-h-20 items-center justify-between gap-3 p-4">
                  <h4 className="font-display text-3xl uppercase leading-none text-[var(--color-cream)]">
                    {category.name}
                  </h4>
                  {category.status === "coming-soon" ? (
                    <span className="shrink-0 border border-[var(--color-gold)] px-2.5 py-1 font-condensed text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                      {teamCategories.comingSoon}
                    </span>
                  ) : null}
                </footer>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
