import Link from "next/link";
import { MediaPlaceholder } from "@/components/site/media-placeholder";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { TeamCourtShowcase } from "@/components/site/team-court-showcase";
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
  const fixturesPreview = schedule.fixtures.slice(0, 3);
  const nextMatch = fixturesPreview[0];
  const organizationJsonLd = buildSportsOrganizationJsonLd(locale);
  const eventJsonLd = buildSportsEventJsonLd(locale, schedule.fixtures);

  return (
    <>
      <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
        <SiteHeader locale={locale} />

        <main className="pt-8 sm:pt-10 lg:pt-12">
          <SectionShell innerClassName="pb-10">
            <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div className="space-y-6">
                <div className="mb-6">
                  <div className="meta-kicker">
                    {content.hero.badge}
                  </div>
                </div>
                <div className="space-y-6">
                  <h1 className="font-display text-6xl uppercase leading-[0.9] sm:text-7xl lg:text-8xl">
                    {clubConfig.shortName}
                  </h1>
                  <p className="max-w-2xl font-condensed text-lg font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    {content.hero.claim}
                  </p>
                  <p className="max-w-xl text-base text-[var(--color-muted)] sm:text-lg">
                    {content.hero.copy}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="#next-match"
                    className="button-base button-ink"
                  >
                    {content.hero.primaryCta}
                  </Link>
                  <Link
                    href={getSectionPath(locale, "team")}
                    className="button-base button-outline"
                  >
                    {content.hero.secondaryCta}
                  </Link>
                </div>
              </div>

              <div className="border-l border-[var(--color-line)] pl-0 lg:pl-10">
                <MediaPlaceholder
                  label={content.placeholders.hero.label}
                  note={content.placeholders.hero.note}
                  tone="ink"
                  size="hero"
                  image={content.placeholders.hero.image}
                  extra={
                    <div className="font-condensed text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                      {content.placeholders.hero.caption}
                    </div>
                  }
                />
              </div>
            </section>
          </SectionShell>

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
            className="border-y border-[var(--color-line)] bg-[var(--color-panel)] py-14 sm:py-16"
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

              <div className="mt-8 grid gap-px border border-[var(--color-line)] bg-[var(--color-line)] lg:grid-cols-3">
                {content.news.map((item) => (
                  <article key={item.title} className="bg-[var(--color-panel)] p-4">
                    <MediaPlaceholder
                      label={content.placeholders.news.label}
                      note={content.placeholders.news.note}
                      tone="panel"
                      size="news"
                      image={item.image ?? content.placeholders.news.image}
                    />
                    <div className="mt-4 font-condensed text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                      {item.dateLabel}
                    </div>
                    <h3 className="mt-3 font-display text-3xl uppercase leading-none">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm text-[var(--color-muted)]">
                      {item.excerpt}
                    </p>
                  </article>
                ))}
              </div>
          </SectionShell>

          <SectionShell
            id="matches"
            className="border-y border-[var(--color-line)] bg-[var(--color-panel)] py-14 sm:py-16"
          >
              <div className="grid gap-8 xl:grid-cols-[0.55fr_0.45fr]">
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
                  <div className="mt-8 grid gap-px border border-[var(--color-line)] bg-[var(--color-line)]">
                    {fixturesPreview.map((fixture) => (
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
