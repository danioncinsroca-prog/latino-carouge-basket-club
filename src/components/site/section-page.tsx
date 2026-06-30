import Link from "next/link";
import { MediaPlaceholder } from "@/components/site/media-placeholder";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { TeamCourtShowcase } from "@/components/site/team-court-showcase";
import {
  clubConfig,
  getHomePath,
  getSectionAnchor,
  siteContent,
  type Locale,
  type SectionKey,
} from "@/lib/site";
import { getResolvedSchedule } from "@/lib/calendar";

type SectionPageProps = {
  locale: Locale;
  sectionKey: SectionKey;
};

export async function SectionPage({ locale, sectionKey }: SectionPageProps) {
  const content = siteContent[locale];
  const schedule = await getResolvedSchedule(locale);
  const section = content.sectionPages[sectionKey];
  const backToSection = `${getHomePath(locale)}#${getSectionAnchor(sectionKey)}`;

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader locale={locale} currentSection={sectionKey} />

      <main className="pt-8 sm:pt-10 lg:pt-12">
        <section className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.75fr] lg:px-8">
          <div className="space-y-2">
              <div className="meta-kicker">
                {section.badge}
              </div>
              <h1 className="mt-6 font-display text-5xl uppercase leading-none sm:text-6xl">
                {section.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base text-[var(--color-muted)] sm:text-lg">
                {section.intro}
              </p>
              <p className="mt-4 max-w-2xl font-condensed text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                {section.comingSoon}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={getHomePath(locale)}
                  className="button-base button-ink"
                >
                  {section.backHome}
                </Link>
                <Link
                  href={backToSection}
                  className="button-base button-outline"
                >
                  {section.jumpLabel}
                </Link>
              </div>
          </div>

          <div className="border-l border-[var(--color-line)] pl-0 lg:pl-10">
            <MediaPlaceholder
              label={section.placeholder.label}
              note={section.placeholder.note}
              tone="ink"
              size="hero"
              image={section.placeholder.image}
            />
          </div>
        </section>

        <section className="mt-14 border-y border-[var(--color-line)] bg-[var(--color-panel)] py-14 sm:mt-16 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {sectionKey === "team" ? (
              <TeamCourtShowcase
                locale={locale}
                coach={content.coach}
                roster={content.roster}
                coachPlaceholder={content.placeholders.coach}
              />
            ) : null}

            {sectionKey === "news" ? (
              <div className="grid gap-px border border-[var(--color-line)] bg-[var(--color-line)] lg:grid-cols-3">
                {content.news.map((item) => (
                  <article key={item.title} className="bg-[var(--color-panel)] p-4">
                    <MediaPlaceholder
                      label={content.placeholders.news.label}
                      note={content.placeholders.news.note}
                      tone="panel"
                      size="news"
                      image={content.placeholders.news.image}
                    />
                    <div className="mt-4 font-condensed text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                      {item.dateLabel}
                    </div>
                    <h2 className="mt-3 font-display text-3xl uppercase leading-none">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm text-[var(--color-muted)]">
                      {item.excerpt}
                    </p>
                  </article>
                ))}
              </div>
            ) : null}

            {sectionKey === "matches" ? (
              <div className="grid gap-px border border-[var(--color-line)] bg-[var(--color-line)]">
                {schedule.fixtures.map((fixture) => (
                  <div
                    key={`${fixture.dateLabel}-${fixture.opponent}`}
                    className="grid gap-4 bg-[var(--color-panel)] p-5 sm:grid-cols-[0.28fr_1fr_auto]"
                  >
                    <div>
                      <div className="font-display text-4xl uppercase leading-none">
                        {fixture.shortDate}
                      </div>
                      <div className="mt-2 font-condensed text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                        {fixture.timeLabel}
                      </div>
                    </div>
                    <div>
                      <div className="font-condensed text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                        {fixture.status}
                      </div>
                      <div className="mt-3 font-display text-3xl uppercase leading-none">
                        {clubConfig.shortName}
                      </div>
                      <div className="mt-2 font-condensed text-sm font-bold uppercase tracking-[0.14em]">
                        {content.nextMatch.versus} {fixture.opponent}
                      </div>
                      <div className="mt-3 text-sm text-[var(--color-muted)]">
                        {fixture.venue}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="phase-label">
                        {fixture.phase}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {sectionKey === "history" ? (
              <div className="overflow-hidden border border-[var(--color-line)]">
                <table className="w-full border-collapse">
                  <thead className="bg-[var(--color-ink)] text-[var(--color-cream)]">
                    <tr>
                      <th className="px-4 py-3 text-left font-condensed text-[0.68rem] font-bold uppercase tracking-[0.24em]">
                        {content.historySection.table.date}
                      </th>
                      <th className="px-4 py-3 text-left font-condensed text-[0.68rem] font-bold uppercase tracking-[0.24em]">
                        {content.historySection.table.match}
                      </th>
                      <th className="w-[7.5rem] px-4 py-3 text-right font-condensed text-[0.68rem] font-bold uppercase tracking-[0.24em]">
                        {content.historySection.table.score}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.results.map((result, index) => (
                      <tr
                        key={`${result.dateLabel}-${result.opponent}`}
                        className={
                          index % 2 === 0
                            ? "bg-[var(--color-panel)]"
                            : "bg-[var(--color-surface)]"
                        }
                      >
                        <td className="border-t border-[var(--color-line)] px-4 py-3 text-sm text-[var(--color-muted)]">
                          {result.dateLabel}
                        </td>
                        <td className="border-t border-[var(--color-line)] px-4 py-3 font-condensed text-sm font-bold uppercase tracking-[0.12em]">
                          {clubConfig.shortName} {content.nextMatch.versus}{" "}
                          {result.opponent}
                        </td>
                        <td className="w-[7.5rem] border-t border-[var(--color-line)] px-4 py-3 text-right font-display text-2xl leading-none whitespace-nowrap [font-variant-numeric:tabular-nums]">
                          {result.score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </section>

        <SiteFooter locale={locale} />
      </main>
    </div>
  );
}
