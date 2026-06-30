import Image from "next/image";
import Link from "next/link";
import { FeaturedPlayers } from "@/components/site/featured-players";
import { NewsShowcase } from "@/components/site/news-showcase";
import { PalmaresTimeline } from "@/components/site/palmares-timeline";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { TeamCourtShowcase } from "@/components/site/team-court-showcase";
import { UpcomingScoreboard } from "@/components/site/upcoming-scoreboard";
import {
  buildSportsEventJsonLd,
  buildSportsOrganizationJsonLd,
  clubConfig,
  getSectionPath,
  siteContent,
  type Locale,
} from "@/lib/site";
import { getResolvedSchedule } from "@/lib/calendar";

type HomePageProps = {
  locale: Locale;
};

function SectionHeading({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="ink-divider space-y-3 pt-5">
      <div className="font-condensed text-[0.72rem] font-bold uppercase tracking-[0.26em] text-[var(--color-muted)]">
        {kicker}
      </div>
      <h2 className="font-display text-4xl uppercase leading-none sm:text-5xl">
        {title}
      </h2>
      <p className="max-w-2xl text-sm text-[var(--color-muted)] sm:text-base">
        {intro}
      </p>
    </div>
  );
}

function SectionShell({
  id,
  className = "",
  innerClassName = "",
  children,
}: Readonly<{
  id?: string;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}>) {
  return (
    <section id={id} className={className}>
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
}

export async function HomePage({ locale }: HomePageProps) {
  const content = siteContent[locale];
  const schedule = await getResolvedSchedule(locale);
  const fixturesPreview = schedule.fixtures.slice(0, 2);
  const nextMatch = fixturesPreview[0];
  const organizationJsonLd = buildSportsOrganizationJsonLd(locale);
  const eventJsonLd = buildSportsEventJsonLd(locale, schedule.fixtures);

  return (
    <>
      <div className="min-h-screen text-[var(--color-ink)]">
        <SiteHeader locale={locale} />

        <main>
          <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
            <div aria-hidden className="absolute inset-0">
              <Image
                src="/stock/hero-bg.png"
                alt=""
                fill
                priority
                quality={90}
                sizes="100vw"
                className="object-cover object-[center_35%]"
              />
            </div>
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(8,14,24,0.88) 0%, rgba(8,14,24,0.62) 55%, rgba(8,14,24,0.28) 100%)",
              }}
            />
            <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
              <div className="max-w-2xl space-y-6">
                <div className="space-y-6">
                  <h1 className="font-display text-6xl uppercase leading-[0.9] text-[var(--color-cream)] sm:text-7xl lg:text-8xl">
                    {clubConfig.shortName}
                  </h1>
                  <p className="max-w-xl text-base text-[var(--color-cream)]/72 sm:text-lg">
                    {content.hero.copy}
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="#next-match" className="button-base button-gold">
                    {content.hero.primaryCta}
                  </Link>
                  <Link
                    href={getSectionPath(locale, "team")}
                    className="button-base button-outline-gold"
                  >
                    {content.hero.secondaryCta}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <SectionShell
            id="next-match"
            className="bg-[var(--color-ink)] text-[var(--color-cream)]"
            innerClassName="py-0"
          >
            <div className="grid gap-0 lg:min-h-[230px] lg:grid-cols-[0.32fr_1fr_0.36fr]">
              <div className="border-b border-[var(--color-cream)]/15 px-6 py-10 lg:border-b-0 lg:border-r lg:px-8 lg:py-12">
                  <div className="font-condensed text-[0.72rem] font-bold uppercase tracking-[0.26em] text-[var(--color-gold)]">
                    {content.nextMatch.label}
                  </div>
                  <div className="mt-3 font-display text-4xl uppercase leading-none">
                    {nextMatch.dateLabel}
                  </div>
                  <div className="mt-2 text-sm text-[var(--color-cream)]/78">
                    {nextMatch.timeLabel}
                  </div>
                </div>

              <div className="border-b border-[var(--color-cream)]/15 px-6 py-10 lg:border-b-0 lg:border-r lg:px-8 lg:py-12">
                  <div className="font-condensed text-[0.72rem] font-bold uppercase tracking-[0.26em] text-[var(--color-gold)]">
                    {nextMatch.status}
                  </div>
                  <div className="mt-3 font-display text-5xl uppercase leading-none sm:text-6xl">
                    {nextMatch.opponent}
                  </div>
                  <div className="mt-2 font-condensed text-lg font-bold uppercase tracking-[0.14em] text-[var(--color-cream)]/84">
                    {content.nextMatch.opponentLabel}
                  </div>
                  <div className="mt-3 text-sm text-[var(--color-cream)]/78">
                    {nextMatch.venue}
                  </div>
                </div>

              <div className="flex flex-col justify-between px-6 py-10 lg:px-8 lg:py-12">
                  <p className="text-sm text-[var(--color-cream)]/82">
                    {content.nextMatch.copy}
                  </p>
                  <div className="mt-6">
                    <Link
                      href={
                        clubConfig.externalLinks.ticketingUrl ??
                        getSectionPath(locale, "matches")
                      }
                      className="button-base button-gold"
                    >
                      {content.nextMatch.cta}
                    </Link>
                  </div>
              </div>
            </div>
          </SectionShell>

          <SectionShell
            id="effectif"
            className="border-t border-[var(--color-line)] bg-[var(--color-panel)] py-14 sm:py-16"
          >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeading
                  kicker={content.team.kicker}
                  title={content.team.title}
                  intro={content.team.intro}
                />
                <Link
                  href={getSectionPath(locale, "team")}
                  className="button-base button-outline-gold"
                >
                  {content.team.viewAll}
                </Link>
              </div>

              <div className="mt-8">
                <TeamCourtShowcase
                  locale={locale}
                  coach={content.coach}
                  roster={content.roster}
                  coachPlaceholder={content.placeholders.coach}
                />
              </div>
          </SectionShell>

          <section
            id="featured-players"
            className="relative overflow-hidden bg-[var(--color-ink)] py-14 sm:py-16"
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-[var(--color-ink)]"
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.96]"
            >
              <Image
                src="/stock/featured-players-bg.png"
                alt=""
                fill
                quality={100}
                unoptimized
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <div className="ink-divider space-y-3 pt-5">
                  <div className="font-condensed text-[0.72rem] font-bold uppercase tracking-[0.26em] text-[var(--color-gold)]">
                    {content.featuredPlayersSection.kicker}
                  </div>
                  <h2 className="font-display text-4xl uppercase leading-none text-[var(--color-cream)] sm:text-5xl">
                    {content.featuredPlayersSection.title}
                  </h2>
                  <p className="max-w-2xl text-sm text-[var(--color-cream)]/72 sm:text-base">
                    {content.featuredPlayersSection.intro}
                  </p>
                </div>
              </div>
              <FeaturedPlayers players={content.featuredPlayers} />
            </div>
          </section>

          <SectionShell
            id="news"
            className="py-14 sm:py-16"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                kicker={content.newsSection.kicker}
                title={content.newsSection.title}
                intro={content.newsSection.intro}
              />
              <Link
                href={getSectionPath(locale, "news")}
                className="button-base button-outline-gold"
              >
                {content.newsSection.viewAll}
              </Link>
            </div>

            <div className="mt-8">
              <NewsShowcase
                items={content.news}
                locale={locale}
                fallbackImage={content.placeholders.news.image}
              />
            </div>
          </SectionShell>

          <SectionShell
            id="partners"
            className="border-y border-[var(--color-line)] bg-white py-8 sm:py-10"
          >
            <div className="flex flex-col items-center gap-7">
              <div className="font-condensed text-[0.72rem] font-bold uppercase tracking-[0.26em] text-[var(--color-muted)]">
                {content.partnersSection.label}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 lg:gap-24">
                {content.partnersSection.logos.map((partner) => (
                  <Image
                    key={partner.name}
                    src={partner.src}
                    alt={partner.name}
                    height={48}
                    width={partner.width}
                    className="h-12 w-auto object-contain"
                  />
                ))}
              </div>
            </div>
          </SectionShell>

          <SectionShell
            id="matches"
            className="border-y border-[var(--color-line)] bg-[var(--color-panel)] py-14 sm:py-16"
          >
            <div className="space-y-14">
              <div>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <SectionHeading
                    kicker={content.fixturesSection.kicker}
                    title={content.fixturesSection.title}
                    intro={content.fixturesSection.intro}
                  />
                  <Link
                    href={getSectionPath(locale, "matches")}
                    className="button-base button-outline-gold"
                  >
                    {content.fixturesSection.viewAll}
                  </Link>
                </div>
                <div className="mt-8">
                  <UpcomingScoreboard fixtures={fixturesPreview} />
                </div>
              </div>

              <div id="history">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <SectionHeading
                    kicker={content.historySection.kicker}
                    title={content.historySection.title}
                    intro={content.historySection.intro}
                  />
                  <Link
                    href={getSectionPath(locale, "history")}
                    className="button-base button-outline-gold"
                  >
                    {content.historySection.viewAll}
                  </Link>
                </div>
                <div className="mt-8 overflow-hidden border border-[var(--color-line)]">
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
              </div>
            </div>
          </SectionShell>

          <SectionShell
            id="palmares"
            className="border-y border-[var(--color-line)] bg-[var(--color-ink)] py-14 sm:py-16"
          >
            <div className="mb-8">
              <div className="ink-divider space-y-3 pt-5">
                <div className="font-condensed text-[0.72rem] font-bold uppercase tracking-[0.26em] text-[var(--color-gold)]">
                  {content.palmaresSection.kicker}
                </div>
                <h2 className="font-display text-4xl uppercase leading-none text-[var(--color-cream)] sm:text-5xl">
                  {content.palmaresSection.title}
                </h2>
                <p className="max-w-2xl text-sm text-[var(--color-cream)]/65 sm:text-base">
                  {content.palmaresSection.intro}
                </p>
              </div>
            </div>
            <PalmaresTimeline items={content.palmares} />
          </SectionShell>

          <SiteFooter locale={locale} />
        </main>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      {eventJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(eventJsonLd),
          }}
        />
      ) : null}
    </>
  );
}
