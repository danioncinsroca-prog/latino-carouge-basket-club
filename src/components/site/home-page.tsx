import Image from "next/image";
import Link from "next/link";
import { ClubStructureShowcase } from "@/components/site/club-structure-showcase";
import { NewsShowcase } from "@/components/site/news-showcase";
import { PalmaresTimeline } from "@/components/site/palmares-timeline";
import { RecruitmentSection } from "@/components/site/recruitment-section";
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
  const upcomingPreview = schedule.fixtures.slice(0, 2);
  const fixturesPreview =
    upcomingPreview.length > 0 ? upcomingPreview : schedule.pastFixtures.slice(0, 2);
  const nextMatch = fixturesPreview[0];
  const organizationJsonLd = buildSportsOrganizationJsonLd(locale);
  const eventJsonLd = buildSportsEventJsonLd(locale, schedule.fixtures);

  return (
    <>
      <div className="min-h-screen text-[var(--color-ink)]">
        <SiteHeader locale={locale} />

        <main>
          <section className="relative overflow-hidden min-h-[90dvh] flex flex-col">
            <div aria-hidden className="absolute inset-0">
              <Image
                src="/hero-hq.png"
                alt=""
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-cover object-[90%_center] sm:object-center"
              />
            </div>
            <div className="relative z-10 flex flex-1 items-end px-0 sm:px-8 lg:items-center lg:px-[clamp(3rem,7vw,9rem)]">
              <div className="w-full max-w-xl space-y-4 bg-[#062c5a]/95 px-4 py-8 sm:space-y-6 sm:bg-transparent sm:px-0 sm:pb-16 lg:max-w-[min(52vw,58rem)] lg:py-0">
                <div className="space-y-3 sm:space-y-6">
                  <h1
                    className="font-display uppercase leading-[0.9] text-[var(--color-cream)]"
                    style={{ fontSize: "clamp(2.5rem, 4.6vw, 5.75rem)" }}
                  >
                    {clubConfig.shortName}
                  </h1>
                  <p className="max-w-xl text-sm text-[var(--color-cream)]/72 sm:text-base lg:text-lg">
                    {content.hero.copy}
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3 sm:mt-8">
                  <Link href="#matches" className="button-base button-gold text-xs px-4 py-2.5 sm:text-sm w-fit">
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
            id="matches"
            className="bg-[var(--color-panel)] py-14 sm:py-16"
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

          <section
            id="effectif"
            className="relative scroll-mt-20 overflow-hidden bg-[var(--color-ink)] py-14 sm:scroll-mt-28 sm:py-16"
          >
            <div aria-hidden className="absolute inset-0 bg-[var(--color-ink)]" />
            <div aria-hidden className="absolute inset-0 opacity-[0.96]">
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
            </div>
          </section>

          <SectionShell
            id="palmares"
            className="bg-[var(--color-ink)] py-14 sm:py-16"
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
            className="bg-[var(--color-surface)] py-16 sm:py-20 lg:py-24"
          >
            <RecruitmentSection
              content={content.recruitmentSection}
              locale={locale}
            />
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
