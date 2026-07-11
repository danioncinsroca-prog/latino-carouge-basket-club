import { cache } from "react";
import { getTeamLogoSrc } from "@/lib/team-logos";
import type { Locale } from "@/lib/site";

const BASKETPLAN_BASE_URL = "https://www.basketplan.ch/";
const BASKETPLAN_LEAGUES_URL = `${BASKETPLAN_BASE_URL}findAllLeagueHoldings.do`;
const BASKETPLAN_SEARCH_URL = `${BASKETPLAN_BASE_URL}showSearchGames.do`;
const BASKETPLAN_FEDERATION_ID = process.env.BASKETPLAN_FEDERATION_ID ?? "5";
const BASKETPLAN_CLUB_ID = process.env.BASKETPLAN_CLUB_ID ?? "327";
const BASKETPLAN_MAX_RESULTS = process.env.BASKETPLAN_MAX_RESULTS ?? "500";
const BASKETPLAN_REVALIDATE_SECONDS = 900;

export type StandingRow = {
  position: number;
  teamName: string;
  logoSrc?: string;
  played: number;
  wins: number;
  losses: number;
  forfeits: number;
  pointsFor: number;
  pointsAgainst: number;
  difference: number;
  classificationPoints: number;
  isClub: boolean;
};

export type StandingView = {
  id: string;
  title: string;
  phase: string;
  dateRange: string;
  sourceUrl: string;
  rows: StandingRow[];
};

export type StandingTeam = {
  id: string;
  label: string;
  teamName: string;
  category: string;
  views: StandingView[];
};

export type ResolvedStandings = {
  teams: StandingTeam[];
  seasonLabel: string;
  source: "basketplan" | "fallback";
};

type SeasonOption = {
  id: string;
  label: string;
  selected: boolean;
};

type LeagueHolding = {
  id: string;
  title: string;
  rankingUrl: string;
};

type ClubGame = {
  leagueLabel: string;
  teamName: string;
};

type ClubTeamOption = {
  id: string;
  teamName: string;
  label: string;
  category: string;
  sort: number;
};

const fallbackClubTeams: ClubTeamOption[] = [
  buildClubTeamOption("1526", "Latino Carouge 3LCM"),
  buildClubTeamOption("1682", "Latino Carouge 2LCM"),
  buildClubTeamOption("6780", "Latino Carouge 2LCF"),
  buildClubTeamOption("5934", "Latino Carouge U20 F"),
  buildClubTeamOption("7837", "Latino Basket U18M"),
  buildClubTeamOption("7163", "Latino Carouge U16 M"),
  buildClubTeamOption("4129", "Latino Carouge U14M"),
  buildClubTeamOption("5560", "Latino  Carouge U14F"),
  buildClubTeamOption("4534", "Latino Carouge U12 mixte"),
  buildClubTeamOption("5084", "Latino carouge U10"),
  buildClubTeamOption("5133", "Latino 2"),
  buildClubTeamOption("4464", "Latino Carouge"),
];

export const getResolvedStandings = cache(
  async (locale: Locale): Promise<ResolvedStandings> => {
    void locale;

    try {
      const [seasons, clubTeams] = await Promise.all([
        getBasketplanSeasons(),
        getBasketplanClubTeams(),
      ]);
      const selectedSeason = seasons.find((season) => season.selected) ?? seasons[0];
      const selectedIndex = seasons.findIndex(
        (season) => season.id === selectedSeason?.id,
      );
      const candidateSeasons = [
        selectedSeason,
        selectedIndex >= 0 ? seasons[selectedIndex + 1] : undefined,
      ].filter((season): season is SeasonOption => Boolean(season));

      for (const season of candidateSeasons) {
        const teams = await getStandingsForSeason(season, clubTeams);

        if (teams.some((team) => team.views.length > 0)) {
          return {
            teams,
            seasonLabel: season.label,
            source: "basketplan",
          };
        }
      }
    } catch (error) {
      console.error("Failed to load Basketpl@n standings", error);
    }

    return {
      teams: fallbackClubTeams.map((team) => ({ ...team, views: [] })),
      seasonLabel: "",
      source: "fallback",
    };
  },
);

async function getBasketplanSeasons() {
  const html = await fetchText(
    `${BASKETPLAN_LEAGUES_URL}?federationId=${BASKETPLAN_FEDERATION_ID}`,
  );
  const matches = Array.from(
    html.matchAll(/<option\s+value="(\d+)"([^>]*)>(\d{4}\/\d{4})<\/option>/gi),
  );

  return matches.map((match) => ({
    id: match[1],
    label: match[3],
    selected: match[2].includes("selected"),
  }));
}

async function getBasketplanClubTeams() {
  try {
    const html = await fetchText(
      `${BASKETPLAN_SEARCH_URL}?actionType=&federationId=${BASKETPLAN_FEDERATION_ID}&clubId=${BASKETPLAN_CLUB_ID}`,
    );
    const selectMatch = html.match(
      /<select[^>]+name="teamId"[^>]*>([\s\S]*?)<\/select>/i,
    );

    if (!selectMatch) {
      return fallbackClubTeams;
    }

    const teams = Array.from(
      selectMatch[1].matchAll(/<option\s+value="([^"]+)">([\s\S]*?)<\/option>/gi),
    )
      .map((match) => ({
        id: match[1],
        name: cleanHtmlText(match[2]),
      }))
      .filter((team) => team.id !== "-1" && isLatinoTeamName(team.name))
      .map((team) => buildClubTeamOption(team.id, team.name))
      .sort((left, right) => left.sort - right.sort);

    return teams.length > 0 ? teams : fallbackClubTeams;
  } catch {
    return fallbackClubTeams;
  }
}

async function getStandingsForSeason(
  season: SeasonOption,
  clubTeams: ClubTeamOption[],
) {
  const [holdings, games] = await Promise.all([
    getLeagueHoldings(season.id),
    getClubGames(season.label),
  ]);
  const activeLeagueLabels = Array.from(
    new Set(games.map((game) => game.leagueLabel).filter(Boolean)),
  );
  const candidateHoldings = holdings.filter((holding) =>
    activeLeagueLabels.some((leagueLabel) =>
      holdingMatchesLeague(holding.title, leagueLabel),
    ),
  );
  const rankingViews = (
    await Promise.all(candidateHoldings.map((holding) => getRankingView(holding)))
  ).filter((view): view is StandingView => Boolean(view));
  const teams = clubTeams.map((team) => ({
    ...team,
    views: rankingViews
      .filter((view) =>
        view.rows.some((row) =>
          sameNormalizedTeam(row.teamName, team.teamName),
        ),
      )
      .sort(sortStandingViews),
  }));

  for (const view of rankingViews) {
    const clubRow = view.rows.find((row) => row.isClub);

    if (!clubRow) {
      continue;
    }

    const knownTeam = teams.some((team) =>
      sameNormalizedTeam(team.teamName, clubRow.teamName),
    );

    if (!knownTeam) {
      const option = buildClubTeamOption(`ranking-${view.id}`, clubRow.teamName);
      teams.push({
        ...option,
        views: [view],
      });
    }
  }

  return teams.sort((left, right) => {
    if (left.views.length > 0 && right.views.length === 0) {
      return -1;
    }

    if (left.views.length === 0 && right.views.length > 0) {
      return 1;
    }

    return left.sort - right.sort;
  });
}

async function getLeagueHoldings(seasonId: string) {
  const html = await fetchText(
    `${BASKETPLAN_LEAGUES_URL}?federationId=${BASKETPLAN_FEDERATION_ID}&seasonId=${seasonId}`,
  );

  return Array.from(html.matchAll(/<tr\b[\s\S]*?<\/tr>/gi))
    .map((match) => match[0])
    .filter((row) => row.includes("showRankingForLeague.do?leagueHoldingId="))
    .map((row): LeagueHolding | null => {
      const rankingPath = row.match(
        /href="([^"]*showRankingForLeague\.do\?leagueHoldingId=(\d+)[^"]*)"/i,
      );

      if (!rankingPath) {
        return null;
      }

      return {
        id: rankingPath[2],
        title: cleanHtmlText(row),
        rankingUrl: new URL(
          decodeHtmlEntities(rankingPath[1]),
          BASKETPLAN_BASE_URL,
        ).toString(),
      };
    })
    .filter((holding): holding is LeagueHolding => Boolean(holding));
}

async function getClubGames(seasonLabel: string) {
  const range = getSeasonDateRange(seasonLabel);
  const form = new URLSearchParams({
    actionType: "searchGames",
    gameNumber: "",
    from: range.from,
    to: range.to,
    maxResult: BASKETPLAN_MAX_RESULTS,
    statusID: "-1",
    messageLevel: "",
    forfaitID: "",
    locationName: "",
    locationZip: "",
    locationCity: "",
    federationId: BASKETPLAN_FEDERATION_ID,
    clubId: BASKETPLAN_CLUB_ID,
    teamId: "-1",
    leagueId: "-1",
    leagueLevelId: "",
    leagueGroupId: "",
    playerCategoryId: "0",
  });
  const response = await fetch(BASKETPLAN_SEARCH_URL, {
    method: "POST",
    headers: {
      accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      "user-agent": "Latino Carouge Basket Club standings sync",
    },
    body: form.toString(),
    next: { revalidate: BASKETPLAN_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Basketpl@n games returned ${response.status}`);
  }

  const html = await response.text();

  return Array.from(html.matchAll(/<tr\b[\s\S]*?<\/tr>/gi))
    .map((match) => match[0])
    .filter((row) => row.includes("showGameOverview.do?gameId="))
    .map(parseClubGameRow)
    .filter((game): game is ClubGame => Boolean(game));
}

function parseClubGameRow(row: string): ClubGame | null {
  const cells = getTableCells(row);

  if (cells.length < 9) {
    return null;
  }

  const homeTeam = cleanBasketplanTeamName(cells[7]);
  const awayTeam = cleanBasketplanTeamName(cells[8]);
  const teamName = isLatinoTeamName(homeTeam) ? homeTeam : awayTeam;

  if (!isLatinoTeamName(teamName)) {
    return null;
  }

  return {
    leagueLabel: cells[3],
    teamName,
  };
}

async function getRankingView(holding: LeagueHolding) {
  const html = await fetchText(holding.rankingUrl);
  const rows = Array.from(html.matchAll(/<tr\b[\s\S]*?<\/tr>/gi))
    .map((match) => parseStandingRow(match[0]))
    .filter((row): row is StandingRow => Boolean(row));

  if (!rows.some((row) => row.isClub)) {
    return null;
  }

  const parsedTitle = parseHoldingTitle(holding.title);

  return {
    id: holding.id,
    title: parsedTitle.title,
    phase: parsedTitle.phase,
    dateRange: parsedTitle.dateRange,
    sourceUrl: holding.rankingUrl,
    rows,
  };
}

function parseStandingRow(row: string): StandingRow | null {
  const cells = getTableCells(row);

  if (cells.length < 10 || !/^\d+$/.test(cells[0])) {
    return null;
  }

  const teamName = cleanBasketplanTeamName(cells[1]);

  return {
    position: toNumber(cells[0]),
    teamName,
    logoSrc: getTeamLogoSrc(teamName),
    played: toNumber(cells[2]),
    wins: toNumber(cells[3]),
    losses: toNumber(cells[4]),
    forfeits: toNumber(cells[5]),
    pointsFor: toNumber(cells[6]),
    pointsAgainst: toNumber(cells[7]),
    difference: toNumber(cells[8]),
    classificationPoints: toNumber(cells[cells.length - 1]),
    isClub: isLatinoTeamName(teamName),
  };
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
      "user-agent": "Latino Carouge Basket Club standings sync",
    },
    next: { revalidate: BASKETPLAN_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Basketpl@n returned ${response.status} for ${url}`);
  }

  return response.text();
}

function getSeasonDateRange(seasonLabel: string) {
  const match = seasonLabel.match(/^(\d{4})\/(\d{4})$/);

  if (!match) {
    return {
      from: "01.07.25",
      to: "30.06.26",
    };
  }

  return {
    from: `01.07.${match[1].slice(2)}`,
    to: `30.06.${match[2].slice(2)}`,
  };
}

function buildClubTeamOption(id: string, teamName: string): ClubTeamOption {
  const category = getCategoryLabel(teamName);

  return {
    id,
    teamName: cleanBasketplanTeamName(teamName),
    label: category,
    category,
    sort: getCategorySort(teamName),
  };
}

function getCategoryLabel(teamName: string) {
  const normalized = normalizeText(teamName);

  if (normalized.includes("u10")) {
    return "U10";
  }

  if (normalized.includes("u12")) {
    return "U12";
  }

  if (normalized.includes("u14f")) {
    return "U14 F";
  }

  if (normalized.includes("u14m")) {
    return "U14 M";
  }

  if (normalized.includes("u16")) {
    return "U16 M";
  }

  if (normalized.includes("u18")) {
    return "U18 M";
  }

  if (normalized.includes("u20")) {
    return "U20 F";
  }

  if (normalized.includes("2lcf")) {
    return "Seniors F";
  }

  if (normalized.includes("2lcm")) {
    return "Seniors 2LCM";
  }

  if (normalized.includes("3lcm")) {
    return "Seniors 3LCM";
  }

  return "Seniors";
}

function getCategorySort(teamName: string) {
  const category = getCategoryLabel(teamName);
  const order = [
    "Seniors 3LCM",
    "Seniors 2LCM",
    "Seniors F",
    "Seniors",
    "U20 F",
    "U18 M",
    "U16 M",
    "U14 M",
    "U14 F",
    "U12",
    "U10",
  ];
  const index = order.indexOf(category);

  return index === -1 ? 99 : index;
}

function parseHoldingTitle(rawTitle: string) {
  const title = rawTitle.replace(/\s+ACGBA\s*$/i, "").trim();
  const dateMatch = title.match(/(\d{2}\.\d{2}\.\d{2})\s+(\d{2}\.\d{2}\.\d{2})/);
  const withoutDates = title
    .replace(/\d{2}\.\d{2}\.\d{2}\s+\d{2}\.\d{2}\.\d{2}/, "")
    .trim();
  const phase = normalizeLeaguePhase(withoutDates.replace(/\s+/g, " "));

  return {
    title: phase,
    phase,
    dateRange: dateMatch ? `${dateMatch[1]} - ${dateMatch[2]}` : "",
  };
}

function normalizeLeaguePhase(value: string) {
  return value
    .replace(/^3LM\b/, "H3L")
    .replace(/^2LM\b/, "H2L");
}

function sortStandingViews(left: StandingView, right: StandingView) {
  const leftScore = getViewSortScore(left.phase);
  const rightScore = getViewSortScore(right.phase);

  if (leftScore !== rightScore) {
    return leftScore - rightScore;
  }

  const leftStart = parseDateRangeStart(left.dateRange);
  const rightStart = parseDateRangeStart(right.dateRange);

  if (leftStart !== rightStart) {
    return rightStart.localeCompare(leftStart);
  }

  return left.title.localeCompare(right.title);
}

function parseDateRangeStart(dateRange: string) {
  const match = dateRange.match(/^(\d{2})\.(\d{2})\.(\d{2})/);

  if (!match) {
    return "";
  }

  return `20${match[3]}-${match[2]}-${match[1]}`;
}

function getViewSortScore(value: string) {
  const normalized = normalizeText(value);

  if (normalized.includes("saison")) {
    return 0;
  }

  if (normalized.includes("play off") || normalized.includes("play inn")) {
    return 1;
  }

  if (normalized.includes("classement")) {
    return 2;
  }

  return 3;
}

function holdingMatchesLeague(holdingTitle: string, leagueLabel: string) {
  const holding = normalizeText(holdingTitle);
  const league = normalizeText(leagueLabel);

  if (!league) {
    return false;
  }

  if (holding.startsWith(`${league} `)) {
    return true;
  }

  const compactHolding = holding.replace(/\s+/g, "");
  const compactLeague = league.replace(/\s+/g, "");

  return compactHolding.startsWith(compactLeague);
}

function getTableCells(row: string) {
  return Array.from(
    row.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi),
  ).map((match) => cleanHtmlText(match[1]));
}

function cleanBasketplanTeamName(value: string) {
  return value
    .replace(/\s*\([^)]*\)\s*$/g, "")
    .replace(/\s+3LCM\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanHtmlText(value: string) {
  return decodeHtmlEntities(
    value
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  ).trim();
}

function decodeHtmlEntities(value: string) {
  const entities: Record<string, string> = {
    amp: "&",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
    apos: "'",
  };

  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, code: string) => {
    const normalizedCode = code.toLowerCase();

    if (normalizedCode.startsWith("#x")) {
      return String.fromCodePoint(Number.parseInt(normalizedCode.slice(2), 16));
    }

    if (normalizedCode.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(normalizedCode.slice(1), 10));
    }

    return entities[normalizedCode] ?? entity;
  });
}

function sameNormalizedTeam(left: string, right: string) {
  return normalizeText(left) === normalizeText(right);
}

function isLatinoTeamName(value: string) {
  return normalizeText(value).includes("latino");
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toNumber(value: string) {
  return Number.parseInt(value.replace(/[^\d-]/g, ""), 10) || 0;
}
