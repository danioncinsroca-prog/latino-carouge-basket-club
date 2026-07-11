import Image from "next/image";
import Link from "next/link";
import { ClubStructureShowcase } from "@/components/site/club-structure-showcase";
import { NewsShowcase } from "@/components/site/news-showcase";
import { PalmaresTimeline } from "@/components/site/palmares-timeline";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
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
  style,
  children,
}: Readonly<{
  id?: string;
  className?: string;
  innerClassName?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}>) {
  return (
    <section id={id} className={className} style={style}>
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
}

function CourtDivider({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`court-divider ${className}`.trim()} />;
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
          <section className="relative overflow-hidden py-12 sm:py-20 lg:py-32">
            <div aria-hidden className="absolute inset-0">
              <Image
                src="/stock/hero-dunk-illustration.png"
                alt=""
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-cover object-right sm:object-center"
              />
            </div>
            <div className="relative z-10 mx-auto max-w-7xl px-4 pb-6 sm:pb-8 sm:px-6 lg:pb-10 lg:px-8">
              <div className="max-w-3xl space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-6">
                  <h1
                    className="font-display uppercase leading-[0.9] text-[var(--color-cream)]"
                    style={{ fontSize: "clamp(1.75rem, 5vw, 5rem)" }}
                  >
                    {clubConfig.shortName}
                  </h1>
                  <p className="max-w-xl text-sm text-[var(--color-cream)]/72 sm:text-base lg:text-lg">
                    {content.hero.copy}
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3 sm:mt-8">
                  <Link href="#next-match" className="button-base button-gold text-xs px-4 py-2.5 sm:text-sm w-fit">
                    {content.hero.primaryCta}
                  </Link>
                  <Link
                    href={getSectionPath(locale, "team")}
                    className="button-base button-ghost-gold text-xs px-4 py-2.5 sm:text-sm w-fit"
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
            <div className="grid gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-8 lg:px-8 lg:py-12">
              <div className="min-w-0">
                  <div className="font-condensed text-[0.6rem] font-bold uppercase tracking-[0.26em] text-[var(--color-gold)] sm:text-[0.72rem]">
                    {content.nextMatch.label}
                  </div>
                  <div className="mt-3 font-display text-3xl uppercase leading-[1.08] [overflow-wrap:anywhere] sm:mt-4 sm:text-5xl lg:text-6xl">
                    {nextMatch?.dateLabel ?? content.fixturesSection.emptyTitle}
                  </div>
                  <div className="mt-2 font-condensed text-lg font-bold text-[var(--color-cream)]/84 sm:mt-3 sm:text-2xl">
                    {nextMatch?.timeLabel ?? "Basketpl@n"}
                  </div>
                </div>

              <div
                aria-hidden
                className="hidden font-display text-2xl uppercase text-[var(--color-gold)] sm:text-3xl lg:text-4xl lg:block"
              >
                {content.nextMatch.versus}
              </div>

              <div className="min-w-0 border-t border-[var(--color-cream)]/15 pt-6 sm:pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                  <div className="font-condensed text-[0.6rem] font-bold uppercase tracking-[0.26em] text-[var(--color-gold)] sm:text-[0.72rem]">
                    {nextMatch?.status ?? content.fixturesSection.kicker}
                  </div>
                  <div className="mt-3 font-display text-3xl uppercase leading-none [overflow-wrap:anywhere] sm:mt-3 sm:text-5xl lg:text-6xl">
                    {nextMatch?.opponent ?? "Latino Carouge"}
                  </div>
                  <div className="mt-1.5 font-condensed text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-cream)]/84 sm:mt-2 sm:text-lg">
                    {content.nextMatch.opponentLabel}
                  </div>
                  <div className="mt-2 text-xs text-[var(--color-cream)]/78 sm:mt-3 sm:text-sm">
                    {nextMatch?.venue ?? content.fixturesSection.emptyBody}
                  </div>
                  {clubConfig.externalLinks.ticketingUrl && (
                    <div className="mt-6">
                      <Link
                        href={clubConfig.externalLinks.ticketingUrl}
                        className="button-base button-gold"
                      >
                        {content.nextMatch.cta}
                      </Link>
                    </div>
                  )}
              </div>
            </div>
          </SectionShell>

          <SectionShell
            id="matches"
            className="border-t border-[var(--color-line)] bg-[var(--color-panel)] py-14 sm:py-16"
          >
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
              <UpcomingScoreboard
                fixtures={fixturesPreview}
                emptyTitle={content.fixturesSection.emptyTitle}
                emptyBody={content.fixturesSection.emptyBody}
              />
            </div>
          </SectionShell>

          <CourtDivider className="bg-[var(--color-panel)]" />

          <SectionShell
            id="news"
            className="bg-[var(--color-panel)] py-14 sm:py-16"
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
            id="effectif"
            className="scroll-mt-20 border-t border-white/12 bg-[var(--color-ink)] py-14 sm:scroll-mt-28 sm:py-16"
          >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="ink-divider space-y-3 pt-5">
                  <div className="font-condensed text-[0.72rem] font-bold uppercase tracking-[0.26em] text-[var(--color-gold)]">
                    {content.team.kicker}
                  </div>
                  <h2 className="font-display text-4xl uppercase leading-none text-[var(--color-cream)] sm:text-5xl">
                    {content.team.title}
                  </h2>
                  <p className="max-w-2xl text-sm text-[var(--color-cream)]/72 sm:text-base">
                    {content.team.intro}
                  </p>
                </div>
                <Link
                  href={getSectionPath(locale, "team")}
                  className="button-base button-ghost-gold"
                >
                  {content.team.viewAll}
                </Link>
              </div>

              <div className="mt-8">
                <ClubStructureShowcase
                  committee={content.committee}
                  teamCategories={content.teamCategories}
                />
              </div>
          </SectionShell>

          <SectionShell
            id="palmares"
            className="border-y border-[var(--color-line)] bg-[var(--color-ink)] py-14 sm:py-16"
          >
            <div className="mb-8">
              <div className="ink-divider space-y-3 pt-5">
                {content.palmaresSection.kicker && (
                  <div className="font-condensed text-[0.72rem] font-bold uppercase tracking-[0.26em] text-[var(--color-gold)]">
                    {content.palmaresSection.kicker}
                  </div>
                )}
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

          <SectionShell
            id="partners"
            className="bg-white py-8 sm:py-10"
          >
            <div className="flex flex-col items-center gap-10">
              <h2 className="font-display text-4xl uppercase leading-none sm:text-5xl">
                {content.partnersSection.label}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 lg:gap-24">
                {content.partnersSection.logos.map((partner) => (
                  <Image
                    key={partner.name}
                    src={partner.src}
                    alt={partner.name}
                    height={80}
                    width={partner.width}
                    unoptimized
                    className="h-20 w-auto object-contain"
                  />
                ))}
              </div>
            </div>
          </SectionShell>

          <SectionShell
            id="recruitment"
            className="border-y border-[var(--color-line)] py-14 sm:py-16"
            style={{ background: "color-mix(in srgb, var(--color-ink) 82%, black 18%)" }}
          >
            <div className="space-y-5 sm:space-y-6">
              <div className="flex flex-col gap-6 sm:gap-8 lg:grid lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                  <div className="ink-divider space-y-3 pt-5">
                    <div className="font-condensed text-[0.6rem] font-bold uppercase tracking-[0.26em] text-[var(--color-gold)] sm:text-[0.72rem]">
                      {content.recruitmentSection.kicker}
                    </div>
                    <h2 className="font-display text-3xl uppercase leading-none text-[var(--color-cream)] sm:text-4xl lg:text-5xl">
                      {content.recruitmentSection.title}
                    </h2>
                    <p className="max-w-xl text-xs text-[var(--color-cream)]/72 sm:text-sm lg:text-base">
                      {content.recruitmentSection.intro}
                    </p>
                  </div>
                  <ul className="mt-5 space-y-2 sm:mt-6">
                    {content.recruitmentSection.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-xs text-[var(--color-cream)]/80 sm:gap-3 sm:text-sm">
                        <span className="h-1.5 w-1.5 shrink-0 bg-[var(--color-gold)]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:shrink-0">
                  <Link href={`/${locale}/contact`} className="button-base button-gold text-sm px-6 py-3 sm:text-base sm:px-8 sm:py-4 w-full sm:w-auto">
                    {content.recruitmentSection.cta}
                  </Link>
                </div>
              </div>

              <div className="border-t border-[var(--color-line)]/30 pt-4 sm:pt-5">
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-xs font-semibold text-[var(--color-gold)] sm:text-sm">
                      {content.recruitmentSection.subtitle}
                    </p>
                    <p className="text-xs text-[var(--color-cream)]/80 sm:text-sm">
                      {content.recruitmentSection.trialOffer}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {content.recruitmentSection.categories.map((cat) => (
                      <div key={cat.code} className="rounded border border-[var(--color-gold)]/30 bg-[var(--color-ink)]/30 px-2.5 py-2 text-center sm:px-3 sm:py-2.5">
                        <div className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold)] sm:text-sm">
                          {cat.code}
                        </div>
                        <div className="text-[0.8rem] text-[var(--color-cream)]/70 mt-1 sm:text-sm sm:mt-1.5">
                          {cat.label}
                        </div>
                      </div>
                    ))}
                  </div>
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
