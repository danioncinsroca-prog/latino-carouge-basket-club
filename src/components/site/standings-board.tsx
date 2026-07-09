"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/site";
import type { ResolvedStandings, StandingRow } from "@/lib/standings";

const copy = {
  fr: {
    teamSelector: "Equipe",
    phaseSelector: "Competition",
    noRanking: "Basketpl@n ne publie pas encore de classement pour cette equipe.",
    noRankingTitle: "Classement non publie",
    source: "Voir sur Basketpl@n",
    publishedSeason: "Saison publiee",
    unavailable: "Non publie",
    columns: {
      position: "Position",
      team: "Equipe",
      points: "Points",
      played: "Matchs",
      wins: "Victoires",
      losses: "Defaites",
      forfeits: "FF",
      pointsFor: "Points pour",
      pointsAgainst: "Points contre",
      difference: "Difference",
    },
  },
  es: {
    teamSelector: "Equipo",
    phaseSelector: "Competicion",
    noRanking: "Basketpl@n todavia no publica clasificacion para este equipo.",
    noRankingTitle: "Clasificacion no publicada",
    source: "Ver en Basketpl@n",
    publishedSeason: "Temporada publicada",
    unavailable: "No publicado",
    columns: {
      position: "Posicion",
      team: "Equipo",
      points: "Puntos",
      played: "Partidos",
      wins: "Victorias",
      losses: "Derrotas",
      forfeits: "FF",
      pointsFor: "A favor",
      pointsAgainst: "En contra",
      difference: "Diferencia",
    },
  },
} as const;

function TeamMark({ row }: { row: StandingRow }) {
  if (row.logoSrc) {
    return (
      <Image
        src={row.logoSrc}
        alt={`${row.teamName} logo`}
        width={42}
        height={42}
        className="h-10 w-10 shrink-0 object-contain"
      />
    );
  }

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] font-condensed text-xs font-bold uppercase text-[var(--color-cream)]">
      {getInitials(row.teamName)}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function StatCell({ value, strong = false }: { value: number; strong?: boolean }) {
  return (
    <td
      className={`px-4 py-5 text-center [font-variant-numeric:tabular-nums] ${
        strong ? "font-display text-xl leading-none" : "font-condensed text-lg font-bold"
      }`}
    >
      {value}
    </td>
  );
}

function StandingsTable({
  rows,
  locale,
}: {
  rows: StandingRow[];
  locale: Locale;
}) {
  const labels = copy[locale];

  return (
    <div className="overflow-x-auto border border-[var(--color-line)] bg-white">
      <table className="w-full min-w-[1060px] border-collapse">
        <thead>
          <tr className="bg-white text-left">
            <th className="px-4 py-4 font-condensed text-xs font-bold uppercase tracking-[0.16em]">
              {labels.columns.position}
            </th>
            <th className="px-4 py-4 font-condensed text-xs font-bold uppercase tracking-[0.16em]">
              {labels.columns.team}
            </th>
            <th className="px-4 py-4 text-center font-condensed text-xs font-bold uppercase tracking-[0.16em]">
              {labels.columns.points}
            </th>
            <th className="px-4 py-4 text-center font-condensed text-xs font-bold uppercase tracking-[0.16em]">
              {labels.columns.played}
            </th>
            <th className="px-4 py-4 text-center font-condensed text-xs font-bold uppercase tracking-[0.16em]">
              {labels.columns.wins}
            </th>
            <th className="px-4 py-4 text-center font-condensed text-xs font-bold uppercase tracking-[0.16em]">
              {labels.columns.losses}
            </th>
            <th className="px-4 py-4 text-center font-condensed text-xs font-bold uppercase tracking-[0.16em]">
              {labels.columns.forfeits}
            </th>
            <th className="px-4 py-4 text-center font-condensed text-xs font-bold uppercase tracking-[0.16em]">
              {labels.columns.pointsFor}
            </th>
            <th className="px-4 py-4 text-center font-condensed text-xs font-bold uppercase tracking-[0.16em]">
              {labels.columns.pointsAgainst}
            </th>
            <th className="px-4 py-4 text-center font-condensed text-xs font-bold uppercase tracking-[0.16em]">
              {labels.columns.difference}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const showRankRail = row.isClub || row.position <= 3;

            return (
            <tr
              key={`${row.position}-${row.teamName}`}
              className={
                row.isClub
                  ? "border-y border-[var(--color-gold)] bg-[linear-gradient(90deg,rgba(240,188,43,0)_0%,rgba(240,188,43,0.3)_100%),linear-gradient(90deg,var(--color-ink)_0%,#0a2c52_100%)] text-white"
                  : index % 2 === 0
                    ? "bg-[#f7f7f7] text-[var(--color-ink)]"
                    : "bg-white text-[var(--color-ink)]"
              }
            >
              <td className="relative px-4 py-5">
                {showRankRail ? (
                  <span
                    aria-hidden
                    className={`absolute left-0 w-1.5 ${
                      row.isClub
                        ? "top-0 bottom-0 bg-[var(--color-gold)]"
                        : "top-2 bottom-2 bg-[var(--color-ink)]"
                    }`}
                  />
                ) : null}
                <div className="flex items-center gap-3 pl-5">
                  <span className="font-display text-2xl leading-none [font-variant-numeric:tabular-nums]">
                    {row.position}
                  </span>
                  <span
                    aria-hidden
                    className={row.isClub ? "text-white" : "text-[#00a85a]"}
                  >
                    ▲
                  </span>
                </div>
              </td>
              <td className="px-4 py-5">
                <div className="flex min-w-[260px] items-center gap-4">
                  <TeamMark row={row} />
                  <span className="font-condensed text-xl font-bold leading-tight">
                    {row.teamName}
                  </span>
                </div>
              </td>
              <StatCell value={row.classificationPoints} strong />
              <StatCell value={row.played} />
              <StatCell value={row.wins} />
              <StatCell value={row.losses} />
              <StatCell value={row.forfeits} />
              <StatCell value={row.pointsFor} />
              <StatCell value={row.pointsAgainst} />
              <StatCell value={row.difference} />
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function StandingsBoard({
  standings,
  locale,
}: {
  standings: ResolvedStandings;
  locale: Locale;
}) {
  const labels = copy[locale];
  const defaultTeam = standings.teams.find((team) => team.views.length > 0) ?? standings.teams[0];
  const [selectedTeamId, setSelectedTeamId] = useState(defaultTeam?.id ?? "");
  const selectedTeam = useMemo(
    () =>
      standings.teams.find((team) => team.id === selectedTeamId) ??
      defaultTeam,
    [defaultTeam, selectedTeamId, standings.teams],
  );
  const [selectedViewId, setSelectedViewId] = useState(
    selectedTeam?.views[0]?.id ?? "",
  );
  const selectedView = useMemo(
    () =>
      selectedTeam?.views.find((view) => view.id === selectedViewId) ??
      selectedTeam?.views[0],
    [selectedTeam, selectedViewId],
  );

  if (standings.teams.length === 0) {
    return (
      <div className="border border-[var(--color-line)] bg-white px-5 py-8 text-center">
        <h2 className="font-display text-4xl uppercase leading-none">
          {labels.noRankingTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--color-muted)]">
          {labels.noRanking}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border border-[var(--color-line)] bg-white p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="font-condensed text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            {labels.teamSelector}
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {standings.teams.map((team) => (
              <button
                key={team.id}
                type="button"
                data-team-id={team.id}
                data-selected={team.id === selectedTeam?.id}
                onClick={() => setSelectedTeamId(team.id)}
                className={`shrink-0 border px-3 py-2 text-left font-condensed text-sm font-bold uppercase tracking-[0.08em] transition ${
                  team.id === selectedTeam?.id
                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-cream)]"
                    : "border-[var(--color-line)] bg-[var(--color-panel)] text-[var(--color-ink)] hover:border-[var(--color-ink)]"
                }`}
              >
                <span>{team.label}</span>
                {team.views.length === 0 ? (
                  <span className="ml-2 text-[0.65rem] opacity-60">
                    {labels.unavailable}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:min-w-[18rem]">
          <div className="font-condensed text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            {labels.phaseSelector}
          </div>
          <select
            value={selectedView?.id ?? ""}
            disabled={!selectedTeam || selectedTeam.views.length === 0}
            onChange={(event) => setSelectedViewId(event.target.value)}
            className="border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-3 font-condensed text-sm font-bold uppercase tracking-[0.08em] text-[var(--color-ink)] disabled:opacity-50"
          >
            {selectedTeam?.views.length ? (
              selectedTeam.views.map((view) => (
                <option key={view.id} value={view.id}>
                  {view.phase}
                </option>
              ))
            ) : (
              <option>{labels.unavailable}</option>
            )}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="font-condensed text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
            {labels.publishedSeason} {standings.seasonLabel}
          </div>
          <h2 className="mt-2 font-display text-4xl uppercase leading-none sm:text-5xl">
            {selectedTeam?.teamName}
          </h2>
          {selectedView ? (
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {selectedView.title}
              {selectedView.dateRange ? ` · ${selectedView.dateRange}` : ""}
            </p>
          ) : null}
        </div>
        {selectedView ? (
          <a
            href={selectedView.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="button-base button-outline self-start sm:self-auto"
          >
            {labels.source}
          </a>
        ) : null}
      </div>

      {selectedView ? (
        <StandingsTable rows={selectedView.rows} locale={locale} />
      ) : (
        <div className="border border-[var(--color-line)] bg-white px-5 py-10 text-center">
          <h2 className="font-display text-4xl uppercase leading-none">
            {labels.noRankingTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--color-muted)]">
            {labels.noRanking}
          </p>
        </div>
      )}
    </div>
  );
}
