import Link from "next/link";
import { MediaPlaceholder } from "@/components/site/media-placeholder";
import { NewsShowcase } from "@/components/site/news-showcase";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { TeamCourtShowcase } from "@/components/site/team-court-showcase";
import { UpcomingScoreboard } from "@/components/site/upcoming-scoreboard";
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

  if (sectionKey === "history") {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
        <SiteHeader locale={locale} currentSection={sectionKey} />

        <main className="pt-8 sm:pt-10 lg:pt-12">
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-2">
              <div className="meta-kicker">{section.badge}</div>
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
                <Link href={getHomePath(locale)} className="button-base button-ink">
                  {section.backHome}
                </Link>
                <Link href={backToSection} className="button-base button-outline">
                  {section.jumpLabel}
                </Link>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto border border-[var(--color-line)]">
              <table className="w-full min-w-full border-collapse">
                <thead className="bg-[var(--color-ink)] text-[var(--color-cream)]">
                  <tr>
                    <th className="px-3 py-2 text-left font-condensed text-[0.6rem] font-bold uppercase tracking-[0.24em] sm:px-4 sm:py-3 sm:text-[0.68rem]">
                      {content.historySection.table.date}
                    </th>
                    <th className="px-3 py-2 text-left font-condensed text-[0.6rem] font-bold uppercase tracking-[0.24em] sm:px-4 sm:py-3 sm:text-[0.68rem]">
                      {content.historySection.table.match}
                    </th>
                    <th className="px-3 py-2 text-right font-condensed text-[0.6rem] font-bold uppercase tracking-[0.24em] sm:px-4 sm:py-3 sm:text-[0.68rem]">
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
                      <td className="border-t border-[var(--color-line)] px-3 py-2 text-[0.75rem] text-[var(--color-muted)] sm:px-4 sm:py-3 sm:text-sm">
                        {result.dateLabel}
                      </td>
                      <td className="border-t border-[var(--color-line)] px-3 py-2 font-condensed text-[0.75rem] font-bold uppercase tracking-[0.12em] sm:px-4 sm:py-3 sm:text-sm">
                        {clubConfig.shortName} {content.nextMatch.versus}{" "}
                        {result.opponent}
                      </td>
                      <td className="border-t border-[var(--color-line)] px-3 py-2 text-right font-display text-lg leading-none whitespace-nowrap [font-variant-numeric:tabular-nums] sm:px-4 sm:py-3 sm:text-2xl">
                        {result.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <SiteFooter locale={locale} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader locale={locale} currentSection={sectionKey} />

      <main className="pt-6 sm:pt-8 lg:pt-12">
        <section className="mx-auto grid max-w-7xl gap-6 px-4 sm:gap-8 sm:px-6 lg:gap-10 lg:grid-cols-[1fr_0.75fr] lg:px-8">
          <div className="space-y-2">
            <div className="meta-kicker">{section.badge}</div>
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
              <Link href={getHomePath(locale)} className="button-base button-ink">
                {section.backHome}
              </Link>
              <Link href={backToSection} className="button-base button-outline">
                {section.jumpLabel}
              </Link>
            </div>
          </div>

          <div className="border-t border-[var(--color-line)] pt-6 sm:pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
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
              <NewsShowcase
                items={content.news}
                locale={locale}
                fallbackImage={content.placeholders.news.image}
              />
            ) : null}

            {sectionKey === "matches" ? (
              <div className="rounded-[1.2rem] border border-[var(--color-line)] bg-[var(--color-panel)] p-4 sm:p-5">
                <UpcomingScoreboard fixtures={schedule.fixtures} />
              </div>
            ) : null}
          </div>
        </section>

        <SiteFooter locale={locale} />
      </main>
    </div>
  );
}
