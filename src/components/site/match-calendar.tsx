"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Fixture, Locale } from "@/lib/site";
import { getTeamLogoSrc } from "@/lib/team-logos";

type MatchCalendarProps = {
  fixtures: Fixture[];
  pastFixtures: Fixture[];
  locale: Locale;
  emptyTitle?: string;
  emptyBody?: string;
};

type CategoryOption = {
  id: string;
  label: string;
  sort: number;
  count: number;
};

const copy = {
  fr: {
    categorySelector: "Categorie",
    resultsTitle: "Matchs joues",
    upcomingTitle: "Prochains matchs",
    noResultsTitle: "Aucun resultat publie",
    noResultsBody:
      "Basketpl@n ne publie pas encore de match joue pour cette categorie.",
    noScheduleTitle: "Aucun match publie",
    gameNumber: "Match",
  },
  es: {
    categorySelector: "Categoria",
    resultsTitle: "Partidos jugados",
    upcomingTitle: "Proximos partidos",
    noResultsTitle: "Ningun resultado publicado",
    noResultsBody:
      "Basketpl@n todavia no publica partidos jugados para esta categoria.",
    noScheduleTitle: "Ningun partido publicado",
    gameNumber: "Partido",
  },
} as const;

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function normalizeCategoryId(fixture: Fixture) {
  return fixture.categoryId ?? fixture.categoryLabel ?? fixture.teamName ?? "club";
}

function getFixtureTime(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CH" : "es-CH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Zurich",
  }).format(date);
}

function getFixtureDate(fixture: Fixture) {
  return fixture.isoDate ? new Date(fixture.isoDate) : null;
}

function getRowDateLabel(fixture: Fixture, locale: Locale) {
  const date = getFixtureDate(fixture);

  if (!date) {
    return fixture.shortDate.toUpperCase();
  }

  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CH" : "es-CH", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: "Europe/Zurich",
  })
    .format(date)
    .replace(/\./g, "")
    .replace(",", "")
    .toUpperCase();
}

function getMonthLabel(fixture: Fixture, locale: Locale) {
  const date = getFixtureDate(fixture);

  if (!date) {
    return fixture.dateLabel.toUpperCase();
  }

  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CH" : "es-CH", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Zurich",
  })
    .format(date)
    .toUpperCase();
}

function sortByDateDesc(left: Fixture, right: Fixture) {
  return (right.isoDate ?? "").localeCompare(left.isoDate ?? "");
}

function sortByDateAsc(left: Fixture, right: Fixture) {
  return (left.isoDate ?? "").localeCompare(right.isoDate ?? "");
}

function buildCategories(fixtures: Fixture[]) {
  const categories = new Map<string, CategoryOption>();

  for (const fixture of fixtures) {
    const id = normalizeCategoryId(fixture);
    const existing = categories.get(id);

    if (existing) {
      existing.count += 1;
      continue;
    }

    categories.set(id, {
      id,
      label: fixture.categoryLabel ?? fixture.teamName ?? "Club",
      sort: fixture.categorySort ?? 99,
      count: 1,
    });
  }

  return Array.from(categories.values()).sort((left, right) => {
    if (left.sort !== right.sort) {
      return left.sort - right.sort;
    }

    return left.label.localeCompare(right.label);
  });
}

function groupByMonth(fixtures: Fixture[], locale: Locale) {
  const groups: Array<{ label: string; fixtures: Fixture[] }> = [];

  for (const fixture of fixtures) {
    const label = getMonthLabel(fixture, locale);
    const current = groups[groups.length - 1];

    if (current?.label === label) {
      current.fixtures.push(fixture);
      continue;
    }

    groups.push({ label, fixtures: [fixture] });
  }

  return groups;
}

function TeamLogo({ name, logoSrc }: { name: string; logoSrc?: string }) {
  const src = logoSrc ?? getTeamLogoSrc(name);

  return (
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[rgba(22,37,63,0.14)] sm:h-12 sm:w-12">
      {src ? (
        <Image
          src={src}
          alt={`${name} logo`}
          fill
          sizes="48px"
          className="object-contain p-1.5"
        />
      ) : (
        <span className="font-display text-sm uppercase leading-none text-[var(--color-ink)] sm:text-base">
          {getInitials(name)}
        </span>
      )}
    </span>
  );
}

function MatchTeam({
  name,
  logoSrc,
  side,
}: {
  name: string;
  logoSrc?: string;
  side: "home" | "away";
}) {
  const nameNode = (
    <span className="min-w-0 font-condensed text-base font-bold uppercase leading-tight text-[var(--color-ink)] sm:text-xl lg:text-2xl">
      {name}
    </span>
  );
  const logoNode = <TeamLogo name={name} logoSrc={logoSrc} />;

  return (
    <div
      className={`flex min-w-0 items-center gap-2 ${
        side === "home"
          ? "justify-start text-left sm:justify-end sm:text-right"
          : "justify-start text-left"
      }`}
    >
      {side === "home" ? (
        <>
          {nameNode}
          {logoNode}
        </>
      ) : (
        <>
          {logoNode}
          {nameNode}
        </>
      )}
    </div>
  );
}

function ScoreBox({ fixture }: { fixture: Fixture }) {
  const hasScore = fixture.homeScore !== undefined && fixture.awayScore !== undefined;

  return (
    <div className="flex shrink-0 flex-col items-center">
      <div className="min-w-[5.75rem] bg-[var(--color-ink)] px-3 py-2 text-center font-display text-2xl font-bold leading-none text-white [font-variant-numeric:tabular-nums] sm:min-w-[7rem] sm:text-4xl">
        {hasScore ? `${fixture.homeScore} - ${fixture.awayScore}` : "VS"}
      </div>
      {fixture.scoreStatus ? (
        <div className="mt-1 font-condensed text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
          {fixture.scoreStatus}
        </div>
      ) : null}
    </div>
  );
}

function MatchRow({ fixture, locale }: { fixture: Fixture; locale: Locale }) {
  const labels = copy[locale];
  const homeTeam = fixture.homeTeam ?? fixture.teamName ?? "";
  const awayTeam = fixture.awayTeam ?? fixture.opponent;
  const date = getFixtureDate(fixture);

  return (
    <article className="grid gap-4 border-t border-[rgba(22,37,63,0.12)] bg-white px-0 py-5 sm:py-6 lg:grid-cols-[11rem_16rem_minmax(0,1fr)] lg:items-center lg:gap-6">
      <div className="flex items-baseline gap-3 lg:block">
        <div className="font-display text-2xl font-bold uppercase leading-none text-[var(--color-ink)] sm:text-3xl">
          {getRowDateLabel(fixture, locale)}
        </div>
        {date ? (
          <div className="font-condensed text-lg font-bold leading-none text-[#b01647] lg:mt-2">
            {getFixtureTime(date, locale)}
          </div>
        ) : null}
      </div>

      <div className="grid gap-1 border-l-2 border-[rgba(22,37,63,0.08)] pl-4">
        <div className="font-display text-2xl font-bold uppercase leading-none text-[#e34763] sm:text-3xl">
          {fixture.phase}
        </div>
        <div className="font-condensed text-sm font-bold uppercase leading-tight text-[var(--color-ink)]">
          {fixture.roundLabel ??
            (fixture.gameNumber ? `${labels.gameNumber} ${fixture.gameNumber}` : fixture.status)}
        </div>
        <div className="text-sm leading-tight text-[var(--color-muted)]">
          {fixture.venue}
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-3">
        <MatchTeam
          name={homeTeam}
          logoSrc={fixture.homeTeam === fixture.teamName ? fixture.teamLogoSrc : getTeamLogoSrc(homeTeam)}
          side="home"
        />
        <ScoreBox fixture={fixture} />
        <MatchTeam
          name={awayTeam}
          logoSrc={fixture.awayTeam === fixture.teamName ? fixture.teamLogoSrc : fixture.opponentLogoSrc}
          side="away"
        />
      </div>
    </article>
  );
}

function EmptyState({
  title,
  body,
}: {
  title: string;
  body?: string;
}) {
  return (
    <div className="border border-[var(--color-line)] bg-white px-5 py-8 text-center">
      <h2 className="font-display text-3xl uppercase leading-none text-[var(--color-ink)] sm:text-4xl">
        {title}
      </h2>
      {body ? (
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--color-muted)] sm:text-base">
          {body}
        </p>
      ) : null}
    </div>
  );
}

export function MatchCalendar({
  fixtures,
  pastFixtures,
  locale,
  emptyTitle,
  emptyBody,
}: MatchCalendarProps) {
  const labels = copy[locale];
  const categories = useMemo(
    () => buildCategories([...pastFixtures, ...fixtures]),
    [fixtures, pastFixtures],
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0]?.id ?? "",
  );
  const activeCategoryId = categories.some((category) => category.id === selectedCategoryId)
    ? selectedCategoryId
    : categories[0]?.id ?? "";
  const selectedPastFixtures = useMemo(
    () =>
      pastFixtures
        .filter((fixture) => normalizeCategoryId(fixture) === activeCategoryId)
        .sort(sortByDateDesc),
    [activeCategoryId, pastFixtures],
  );
  const selectedUpcomingFixtures = useMemo(
    () =>
      fixtures
        .filter((fixture) => normalizeCategoryId(fixture) === activeCategoryId)
        .sort(sortByDateAsc),
    [activeCategoryId, fixtures],
  );
  const pastGroups = useMemo(
    () => groupByMonth(selectedPastFixtures, locale),
    [locale, selectedPastFixtures],
  );
  const hasAnyFixtures = fixtures.length > 0 || pastFixtures.length > 0;

  if (!hasAnyFixtures || categories.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? labels.noScheduleTitle}
        body={emptyBody}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="border border-[var(--color-line)] bg-white p-4 sm:p-5">
        <div className="font-condensed text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">
          {labels.categorySelector}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategoryId(category.id)}
              data-selected={category.id === activeCategoryId}
              className={`shrink-0 border px-3 py-2 text-left font-condensed text-sm font-bold uppercase tracking-[0.08em] transition ${
                category.id === activeCategoryId
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-cream)]"
                  : "border-[var(--color-line)] bg-[var(--color-panel)] text-[var(--color-ink)] hover:border-[var(--color-ink)]"
              }`}
            >
              <span>{category.label}</span>
              <span className="ml-2 text-[0.68rem] opacity-70">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedUpcomingFixtures.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-display text-4xl uppercase leading-none text-[var(--color-ink)] sm:text-5xl">
            {labels.upcomingTitle}
          </h2>
          <div className="bg-white px-4 sm:px-5">
            {selectedUpcomingFixtures.map((fixture) => (
              <MatchRow
                key={`${fixture.isoDate ?? fixture.shortDate}-${fixture.homeTeam}-${fixture.awayTeam}`}
                fixture={fixture}
                locale={locale}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-6">
        <h2 className="font-display text-4xl uppercase leading-none text-[var(--color-ink)] sm:text-5xl">
          {labels.resultsTitle}
        </h2>

        {pastGroups.length > 0 ? (
          <div className="space-y-8">
            {pastGroups.map((group, index) => (
              <div key={group.label}>
                {index > 0 ? (
                  <div className="mb-8 flex h-2 bg-[var(--color-ink)]">
                    <span className="h-full w-24 bg-[var(--color-gold)]" />
                  </div>
                ) : null}
                <h3 className="mb-3 font-display text-3xl uppercase leading-none text-[var(--color-ink)] sm:text-4xl">
                  {group.label}
                </h3>
                <div className="bg-white px-4 sm:px-5">
                  {group.fixtures.map((fixture) => (
                    <MatchRow
                      key={`${fixture.isoDate ?? fixture.shortDate}-${fixture.homeTeam}-${fixture.awayTeam}`}
                      fixture={fixture}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title={labels.noResultsTitle} body={labels.noResultsBody} />
        )}
      </section>
    </div>
  );
}
