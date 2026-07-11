import Link from "next/link";
import { MediaPlaceholder } from "@/components/site/media-placeholder";
import { MatchCalendar } from "@/components/site/match-calendar";
import { NewsShowcase } from "@/components/site/news-showcase";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { StandingsBoard } from "@/components/site/standings-board";
import { TeamCourtShowcase } from "@/components/site/team-court-showcase";
import {
  getHomePath,
  getSectionAnchor,
  getSectionPath,
  siteContent,
  type Locale,
  type SectionKey,
} from "@/lib/site";
import { getResolvedSchedule } from "@/lib/calendar";
import { getResolvedStandings } from "@/lib/standings";

type SectionPageProps = {
  locale: Locale;
  sectionKey: SectionKey;
};

export async function SectionPage({ locale, sectionKey }: SectionPageProps) {
  const content = siteContent[locale];
  const section = content.sectionPages[sectionKey];
  const backToSection = `${getHomePath(locale)}#${getSectionAnchor(sectionKey)}`;

  if (sectionKey === "standings") {
    const standings = await getResolvedStandings(locale);

    return (
      <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
        <SiteHeader locale={locale} currentSection={sectionKey} />

        <main className="pt-8 pb-14 sm:pt-10 sm:pb-16 lg:pt-12">
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-2">
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
                <Link
                  href={getSectionPath(locale, "matches")}
                  className="button-base button-outline"
                >
                  {section.jumpLabel}
                </Link>
              </div>
            </div>

            <div className="mt-10">
              <StandingsBoard standings={standings} locale={locale} />
            </div>
          </section>

          <SiteFooter locale={locale} />
        </main>
      </div>
    );
  }

  if (sectionKey === "history") {
    const schedule = await getResolvedSchedule(locale);

    return (
      <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
        <SiteHeader locale={locale} currentSection={sectionKey} />

        <main className="pt-8 pb-14 sm:pt-10 sm:pb-16 lg:pt-12">
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="min-w-0 space-y-2">
              <div className="meta-kicker">{section.badge}</div>
              <h1 className="mt-6 font-display text-5xl uppercase leading-none sm:text-6xl">
                {section.title}
              </h1>
              <p
                className="mt-5 text-base text-[var(--color-muted)] sm:text-lg"
                style={{ maxWidth: "min(42rem, calc(100vw - 2rem))" }}
              >
                {section.intro}
              </p>
              <p
                className="mt-4 font-condensed text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]"
                style={{ maxWidth: "min(42rem, calc(100vw - 2rem))" }}
              >
                {section.comingSoon}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={getHomePath(locale)}
                  className="button-base button-ink min-w-0 max-w-full w-full text-center sm:w-auto"
                  style={{ whiteSpace: "normal" }}
                >
                  {section.backHome}
                </Link>
                <Link
                  href={getSectionPath(locale, "matches")}
                  className="button-base button-outline min-w-0 max-w-full w-full text-center sm:w-auto"
                  style={{ whiteSpace: "normal" }}
                >
                  {section.jumpLabel}
                </Link>
              </div>
            </div>

            <div className="mt-10">
              <MatchCalendar
                fixtures={[]}
                pastFixtures={schedule.pastFixtures}
                locale={locale}
                emptyTitle={content.fixturesSection.emptyTitle}
                emptyBody={content.fixturesSection.emptyBody}
              />
            </div>
          </section>

          <SiteFooter locale={locale} />
        </main>
      </div>
    );
  }

  const schedule =
    sectionKey === "matches"
      ? await getResolvedSchedule(locale)
      : { fixtures: [], pastFixtures: [] };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader locale={locale} currentSection={sectionKey} />

      <main className="pt-6 sm:pt-8 lg:pt-12">
        <section className="mx-auto grid max-w-7xl gap-6 px-4 sm:gap-8 sm:px-6 lg:gap-10 lg:grid-cols-[1fr_0.75fr] lg:px-8">
          <div className="min-w-0 space-y-2">
            <div className="meta-kicker">{section.badge}</div>
            <h1 className="mt-6 font-display text-5xl uppercase leading-none sm:text-6xl">
              {section.title}
            </h1>
            <p
              className="mt-5 text-base text-[var(--color-muted)] sm:text-lg"
              style={{ maxWidth: "min(42rem, calc(100vw - 2rem))" }}
            >
              {section.intro}
            </p>
            <p
              className="mt-4 font-condensed text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]"
              style={{ maxWidth: "min(42rem, calc(100vw - 2rem))" }}
            >
              {section.comingSoon}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={getHomePath(locale)}
                className="button-base button-ink min-w-0 max-w-full w-full text-center sm:w-auto"
                style={{ whiteSpace: "normal" }}
              >
                {section.backHome}
              </Link>
              <Link
                href={backToSection}
                className="button-base button-outline min-w-0 max-w-full w-full text-center sm:w-auto"
                style={{ whiteSpace: "normal" }}
              >
                {section.jumpLabel}
              </Link>
            </div>
          </div>

          <div className="min-w-0 border-t border-[var(--color-line)] pt-6 sm:pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
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
              <div>
                <MatchCalendar
                  fixtures={schedule.fixtures}
                  pastFixtures={schedule.pastFixtures}
                  locale={locale}
                  emptyTitle={content.fixturesSection.emptyTitle}
                  emptyBody={content.fixturesSection.emptyBody}
                />
              </div>
            ) : null}
          </div>
        </section>

        <SiteFooter locale={locale} />
      </main>
    </div>
  );
}
