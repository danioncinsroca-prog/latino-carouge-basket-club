import { cache } from "react";
import { clubConfig, type Fixture, type Locale } from "@/lib/site";
import { getTeamLogoSrc } from "@/lib/team-logos";

const CALENDAR_ENV_KEYS = [
  "INFOMANIAK_CALENDAR_ICS_URL",
  "CALENDAR_ICS_URL",
] as const;
const BASKETPLAN_SEARCH_URL = "https://www.basketplan.ch/showSearchGames.do";
const BASKETPLAN_GAME_BASE_URL = "https://www.basketplan.ch/";
const BASKETPLAN_FEDERATION_ID = process.env.BASKETPLAN_FEDERATION_ID ?? "5";
const BASKETPLAN_CLUB_ID = process.env.BASKETPLAN_CLUB_ID ?? "327";
const BASKETPLAN_CLUB_NAME =
  process.env.BASKETPLAN_CLUB_NAME ?? "Latino Carouge";
const BASKETPLAN_MAX_RESULTS = process.env.BASKETPLAN_MAX_RESULTS ?? "500";
const DEFAULT_CALENDAR_TIME_ZONE = "Europe/Zurich";
const MAX_SCHEDULE_FIXTURES = 80;

export type ResolvedSchedule = {
  fixtures: Fixture[];
  pastFixtures: Fixture[];
  source: "basketplan" | "calendar" | "fallback";
  calendarUrlConfigured: boolean;
};

type ParsedProperty = {
  name: string;
  value: string;
  params: Record<string, string>;
};

type ParsedDate = {
  allDay: boolean;
  displayDate: Date;
  formatTimeZone: string;
  isoDate: string;
  sortValue: string;
};

type ParsedCalendarEvent = {
  summary: string;
  location: string;
  description: string;
  categories: string[];
  start: ParsedDate;
};

type ParsedBasketplanGame = {
  dateLabel: string;
  federation: string;
  league: string;
  round: string;
  gameNumber: string;
  venue: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: string;
  awayScore?: string;
  scoreStatus?: string;
  start: ParsedDate;
  gameUrl?: string;
};

type BasketplanFixtureMode = "future" | "past" | "all";

const clubAliases = [
  clubConfig.name,
  clubConfig.shortName,
  BASKETPLAN_CLUB_NAME,
  "BASKET CLUB LATINO CAROUGE",
  "LATINO",
  "LATINO BASKET",
  "LATINO CAROUGE",
  "LATINO CAROUGE BC",
  "LATINO CAROUGE BASKET CLUB",
].map(normalizeForMatchText);

const calendarCopy = {
  fr: {
    home: "À la maison",
    away: "Déplacement",
    scheduled: "Programmé",
    calendar: "Calendrier",
    league: "Championnat",
    cup: "Coupe",
    friendly: "Amical",
    playoffs: "Playoffs",
    allDay: "Toute la journée",
    round: "Journee",
  },
  es: {
    home: "En casa",
    away: "Desplazamiento",
    scheduled: "Programado",
    calendar: "Calendario",
    league: "Liga",
    cup: "Copa",
    friendly: "Amistoso",
    playoffs: "Playoffs",
    allDay: "Toda la jornada",
    round: "Jornada",
  },
} as const;

export const getResolvedSchedule = cache(
  async (locale: Locale): Promise<ResolvedSchedule> => {
    const calendarUrl = getCalendarFeedUrl();

    if (calendarUrl) {
      try {
        const response = await fetch(calendarUrl, {
          headers: {
            accept: "text/calendar, text/plain;q=0.9, */*;q=0.1",
          },
          next: { revalidate: 900 },
        });

        if (!response.ok) {
          throw new Error(`Calendar feed returned ${response.status}`);
        }

        const rawCalendar = await response.text();
        const fixtures = parseCalendarToFixtures(rawCalendar, locale);

        if (fixtures.length === 0) {
          return {
            fixtures: [],
            pastFixtures: [],
            source: "fallback",
            calendarUrlConfigured: true,
          };
        }

        return {
          fixtures,
          pastFixtures: [],
          source: "calendar",
          calendarUrlConfigured: true,
        };
      } catch (error) {
        console.error("Failed to load calendar feed", error);

        return {
          fixtures: [],
          pastFixtures: [],
          source: "fallback",
          calendarUrlConfigured: true,
        };
      }
    }

    try {
      const schedule = await getBasketplanSchedule(locale);
      return {
        ...schedule,
        source: "basketplan",
        calendarUrlConfigured: false,
      };
    } catch (error) {
      console.error("Failed to load Basketpl@n schedule", error);

      return {
        fixtures: [],
        pastFixtures: [],
        source: "fallback",
        calendarUrlConfigured: false,
      };
    }
  },
);

function getCalendarFeedUrl() {
  for (const key of CALENDAR_ENV_KEYS) {
    const value = process.env[key]?.trim();

    if (value) {
      return value;
    }
  }

  return null;
}

async function getBasketplanSchedule(locale: Locale) {
  const now = new Date();
  const currentRange = {
    from: getBasketplanSeasonStart(now),
    to: getBasketplanSeasonEnd(now),
  };

  const fixtures = await fetchBasketplanFixturesForRange(
    {
      from: now,
      to: currentRange.to,
    },
    locale,
    "future",
  );

  let pastFixtures = await fetchBasketplanFixturesForRange(
    {
      from: currentRange.from,
      to: now,
    },
    locale,
    "past",
  );

  if (pastFixtures.length > 0 || fixtures.length > 0) {
    return { fixtures, pastFixtures };
  }

  const previousSeasonEnd = new Date(
    Date.UTC(currentRange.to.getUTCFullYear() - 1, 5, 30, 12, 0, 0),
  );
  const previousSeasonStart = new Date(
    Date.UTC(previousSeasonEnd.getUTCFullYear() - 1, 6, 1, 12, 0, 0),
  );

  pastFixtures = await fetchBasketplanFixturesForRange(
    {
      from: previousSeasonStart,
      to: previousSeasonEnd,
    },
    locale,
    "past",
  );

  return { fixtures, pastFixtures };
}

async function fetchBasketplanFixturesForRange(
  range: { from: Date; to: Date },
  locale: Locale,
  mode: BasketplanFixtureMode,
) {
  const form = new URLSearchParams({
    actionType: "searchGames",
    gameNumber: "",
    from: formatBasketplanFormDate(range.from),
    to: formatBasketplanFormDate(range.to),
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
      "user-agent": "Latino Carouge Basket Club schedule sync",
    },
    body: form.toString(),
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    throw new Error(`Basketpl@n returned ${response.status}`);
  }

  const html = await response.text();
  return parseBasketplanFixtures(html, locale, mode);
}

function parseCalendarToFixtures(rawCalendar: string, locale: Locale) {
  const nowInCalendarTime = formatComparableInTimeZone(
    new Date(),
    DEFAULT_CALENDAR_TIME_ZONE,
  );

  return getEventBlocks(rawCalendar)
    .map((eventLines) => parseCalendarEvent(eventLines))
    .filter((event): event is ParsedCalendarEvent => event !== null)
    .filter((event) => event.start.sortValue >= nowInCalendarTime)
    .sort((left, right) => left.start.sortValue.localeCompare(right.start.sortValue))
    .slice(0, MAX_SCHEDULE_FIXTURES)
    .map((event) => mapEventToFixture(event, locale));
}

function parseBasketplanFixtures(
  html: string,
  locale: Locale,
  mode: BasketplanFixtureMode,
) {
  const nowInCalendarTime = formatComparableInTimeZone(
    new Date(),
    DEFAULT_CALENDAR_TIME_ZONE,
  );

  return getBasketplanGameRows(html)
    .map((row) => parseBasketplanGame(row))
    .filter((game): game is ParsedBasketplanGame => game !== null)
    .filter((game) => {
      if (mode === "future") {
        return game.start.sortValue >= nowInCalendarTime;
      }

      if (mode === "past") {
        return game.start.sortValue < nowInCalendarTime;
      }

      return true;
    })
    .sort((left, right) =>
      mode === "past"
        ? right.start.sortValue.localeCompare(left.start.sortValue)
        : left.start.sortValue.localeCompare(right.start.sortValue),
    )
    .slice(0, MAX_SCHEDULE_FIXTURES)
    .map((game) => mapBasketplanGameToFixture(game, locale));
}

function getBasketplanGameRows(html: string) {
  return Array.from(html.matchAll(/<tr\b[\s\S]*?<\/tr>/gi))
    .map((match) => match[0])
    .filter((row) => row.includes("showGameOverview.do?gameId="));
}

function parseBasketplanGame(row: string): ParsedBasketplanGame | null {
  const cells = Array.from(row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)).map(
    (match) => cleanHtmlCell(match[1]),
  );

  if (cells.length < 9) {
    return null;
  }

  const start = parseBasketplanDate(cells[0]);

  if (!start) {
    return null;
  }

  const gamePath = row.match(/href="([^"]*showGameOverview\.do\?gameId=\d+)"/i)?.[1];

  return {
    dateLabel: cells[0],
    federation: cells[2],
    league: cells[3],
    round: cells[4],
    gameNumber: cells[5],
    venue: cells[6],
    homeTeam: cleanBasketplanTeamName(cells[7]),
    awayTeam: cleanBasketplanTeamName(cells[8]),
    homeScore: normalizeBasketplanScore(cells[11]),
    awayScore: normalizeBasketplanScore(cells[13]),
    scoreStatus: normalizeBasketplanScoreStatus(cells[14]),
    start,
    gameUrl: gamePath ? new URL(gamePath, BASKETPLAN_GAME_BASE_URL).toString() : undefined,
  };
}

function mapBasketplanGameToFixture(
  game: ParsedBasketplanGame,
  locale: Locale,
): Fixture {
  const labels = calendarCopy[locale];
  const homeIsClub = containsClubAlias(game.homeTeam);
  const awayIsClub = containsClubAlias(game.awayTeam);
  const teamName = homeIsClub
    ? game.homeTeam
    : awayIsClub
      ? game.awayTeam
      : BASKETPLAN_CLUB_NAME;
  const opponent = homeIsClub ? game.awayTeam : game.homeTeam;
  const categoryLabel = getFixtureCategoryLabel(teamName);

  return {
    teamName,
    homeTeam: game.homeTeam,
    awayTeam: game.awayTeam,
    teamLogoSrc: getTeamLogoSrc(teamName),
    opponentLogoSrc: getTeamLogoSrc(opponent),
    categoryId: normalizeForMatchText(categoryLabel),
    categoryLabel,
    categorySort: getFixtureCategorySort(teamName),
    federation: game.federation,
    gameNumber: game.gameNumber,
    roundLabel: game.round ? `${labels.round} ${game.round}` : undefined,
    homeScore: game.homeScore,
    awayScore: game.awayScore,
    scoreStatus: game.scoreStatus,
    opponent,
    dateLabel: formatLongDate(game.start, locale),
    shortDate: formatShortDate(game.start, locale),
    timeLabel: formatTimeLabel(game.start, locale),
    venue: game.venue,
    phase: game.league || labels.league,
    status: homeIsClub ? labels.home : awayIsClub ? labels.away : labels.scheduled,
    isoDate: game.start.isoDate,
    gameUrl: game.gameUrl,
  };
}

function getEventBlocks(rawCalendar: string) {
  const lines = unfoldCalendarLines(rawCalendar);
  const eventBlocks: string[][] = [];
  let currentEvent: string[] | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      currentEvent = [];
      continue;
    }

    if (line === "END:VEVENT") {
      if (currentEvent) {
        eventBlocks.push(currentEvent);
      }

      currentEvent = null;
      continue;
    }

    if (currentEvent) {
      currentEvent.push(line);
    }
  }

  return eventBlocks;
}

function unfoldCalendarLines(rawCalendar: string) {
  const normalizedLines = rawCalendar
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");
  const unfolded: string[] = [];

  for (const line of normalizedLines) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += line.slice(1);
      continue;
    }

    unfolded.push(line);
  }

  return unfolded;
}

function parseCalendarEvent(eventLines: string[]) {
  const properties = eventLines
    .map((line) => parsePropertyLine(line))
    .filter((property): property is ParsedProperty => property !== null);

  const summary = getPropertyValue(properties, "SUMMARY");
  const dtStart = getProperty(properties, "DTSTART");

  if (!summary || !dtStart) {
    return null;
  }

  const start = parseCalendarDate(dtStart);

  if (!start) {
    return null;
  }

  return {
    summary,
    location: getPropertyValue(properties, "LOCATION") ?? clubConfig.venue,
    description: getPropertyValue(properties, "DESCRIPTION") ?? "",
    categories: splitCategories(getPropertyValue(properties, "CATEGORIES")),
    start,
  };
}

function parsePropertyLine(line: string) {
  const separatorIndex = line.indexOf(":");

  if (separatorIndex === -1) {
    return null;
  }

  const header = line.slice(0, separatorIndex);
  const value = line.slice(separatorIndex + 1);
  const [name, ...rawParams] = header.split(";");
  const params = Object.fromEntries(
    rawParams.map((rawParam) => {
      const [key, paramValue = ""] = rawParam.split("=");
      return [key.toUpperCase(), paramValue];
    }),
  );

  return {
    name: name.toUpperCase(),
    value: decodeCalendarText(value),
    params,
  };
}

function getProperty(properties: ParsedProperty[], name: string) {
  return properties.find((property) => property.name === name) ?? null;
}

function getPropertyValue(properties: ParsedProperty[], name: string) {
  return getProperty(properties, name)?.value ?? null;
}

function parseCalendarDate(property: ParsedProperty): ParsedDate | null {
  const rawValue = property.value.trim();
  const isAllDay =
    property.params.VALUE === "DATE" || /^\d{8}$/.test(rawValue);

  if (isAllDay) {
    const parts = parseDateParts(rawValue);

    if (!parts) {
      return null;
    }

    const isoDate = `${parts.year}-${parts.month}-${parts.day}`;

    return {
      allDay: true,
      displayDate: new Date(
        Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)),
      ),
      formatTimeZone: "UTC",
      isoDate,
      sortValue: `${isoDate}T00:00:00`,
    };
  }

  const utcMatch = rawValue.match(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
  );

  if (utcMatch) {
    const isoDate =
      `${utcMatch[1]}-${utcMatch[2]}-${utcMatch[3]}T` +
      `${utcMatch[4]}:${utcMatch[5]}:${utcMatch[6]}Z`;
    const displayDate = new Date(isoDate);
    const timeZone = property.params.TZID || DEFAULT_CALENDAR_TIME_ZONE;

    return {
      allDay: false,
      displayDate,
      formatTimeZone: timeZone,
      isoDate,
      sortValue: formatComparableInTimeZone(displayDate, timeZone),
    };
  }

  const floatingMatch = rawValue.match(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/,
  );

  if (!floatingMatch) {
    return null;
  }

  const isoDate =
    `${floatingMatch[1]}-${floatingMatch[2]}-${floatingMatch[3]}T` +
    `${floatingMatch[4]}:${floatingMatch[5]}:${floatingMatch[6]}`;

  return {
    allDay: false,
    displayDate: new Date(
      Date.UTC(
        Number(floatingMatch[1]),
        Number(floatingMatch[2]) - 1,
        Number(floatingMatch[3]),
        Number(floatingMatch[4]),
        Number(floatingMatch[5]),
        Number(floatingMatch[6]),
      ),
    ),
    formatTimeZone: "UTC",
    isoDate,
    sortValue: isoDate,
  };
}

function parseDateParts(rawValue: string) {
  const match = rawValue.match(/^(\d{4})(\d{2})(\d{2})$/);

  if (!match) {
    return null;
  }

  return {
    year: match[1],
    month: match[2],
    day: match[3],
  };
}

function parseBasketplanDate(value: string): ParsedDate | null {
  const match = value.match(/(\d{2})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2})/);

  if (!match) {
    return null;
  }

  const [, rawDay, rawMonth, rawYear, rawHour, rawMinute] = match;
  const year = 2000 + Number(rawYear);
  const offset = getEuropeZurichOffset(year, Number(rawMonth), Number(rawDay));
  const isoDate =
    `${year}-${rawMonth}-${rawDay}T${rawHour}:${rawMinute}:00${offset}`;

  return {
    allDay: false,
    displayDate: new Date(isoDate),
    formatTimeZone: DEFAULT_CALENDAR_TIME_ZONE,
    isoDate,
    sortValue: `${year}-${rawMonth}-${rawDay}T${rawHour}:${rawMinute}:00`,
  };
}

function formatBasketplanFormDate(date: Date) {
  const parts = getDatePartsInTimeZone(date, DEFAULT_CALENDAR_TIME_ZONE);
  return `${parts.day}.${parts.month}.${parts.year.slice(2)}`;
}

function getBasketplanSeasonEnd(date: Date) {
  const parts = getDatePartsInTimeZone(date, DEFAULT_CALENDAR_TIME_ZONE);
  const seasonEndYear =
    Number(parts.month) >= 7 ? Number(parts.year) + 1 : Number(parts.year);

  return new Date(Date.UTC(seasonEndYear, 5, 30, 12, 0, 0));
}

function getBasketplanSeasonStart(date: Date) {
  const parts = getDatePartsInTimeZone(date, DEFAULT_CALENDAR_TIME_ZONE);
  const seasonStartYear =
    Number(parts.month) >= 7 ? Number(parts.year) : Number(parts.year) - 1;

  return new Date(Date.UTC(seasonStartYear, 6, 1, 12, 0, 0));
}

function getDatePartsInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).formatToParts(date);
  const map = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    year: map.year,
    month: map.month,
    day: map.day,
  };
}

function getEuropeZurichOffset(year: number, month: number, day: number) {
  const dateKey = formatDateKey(year, month, day);
  const dstStart = getLastSundayDateKey(year, 3);
  const dstEnd = getLastSundayDateKey(year, 10);

  return dateKey >= dstStart && dateKey < dstEnd ? "+02:00" : "+01:00";
}

function getLastSundayDateKey(year: number, month: number) {
  const date = new Date(Date.UTC(year, month, 0));
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());

  return formatDateKey(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  );
}

function formatDateKey(year: number, month: number, day: number) {
  return [
    year.toString().padStart(4, "0"),
    month.toString().padStart(2, "0"),
    day.toString().padStart(2, "0"),
  ].join("-");
}

function splitCategories(value: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((category) => category.trim())
    .filter(Boolean);
}

function mapEventToFixture(event: ParsedCalendarEvent, locale: Locale): Fixture {
  const labels = calendarCopy[locale];
  const opponentAndStatus = inferOpponentAndStatus(event, locale);
  const teamName = clubConfig.shortName;
  const categoryLabel = getFixtureCategoryLabel(teamName);

  return {
    teamName,
    teamLogoSrc: getTeamLogoSrc(teamName),
    opponentLogoSrc: getTeamLogoSrc(opponentAndStatus.opponent),
    categoryId: normalizeForMatchText(categoryLabel),
    categoryLabel,
    categorySort: getFixtureCategorySort(teamName),
    opponent: opponentAndStatus.opponent,
    dateLabel: formatLongDate(event.start, locale),
    shortDate: formatShortDate(event.start, locale),
    timeLabel: event.start.allDay
      ? labels.allDay
      : formatTimeLabel(event.start, locale),
    venue: event.location,
    phase: inferPhase(event, locale),
    status: opponentAndStatus.status,
    isoDate: event.start.isoDate,
  };
}

function inferOpponentAndStatus(event: ParsedCalendarEvent, locale: Locale) {
  const labels = calendarCopy[locale];
  const summary = event.summary.trim();
  const location = normalizeForMatchText(event.location);
  const description = normalizeForMatchText(event.description);
  const separators = [
    { token: /\s+@\s+/i, mode: "at" as const },
    { token: /\s+vs\.?\s+/i, mode: "versus" as const },
    { token: /\s+v\.?\s+/i, mode: "versus" as const },
    { token: /\s+contre\s+/i, mode: "versus" as const },
    { token: /\s+contra\s+/i, mode: "versus" as const },
    { token: /\s+[–-]\s+/, mode: "dash" as const },
  ];

  for (const separator of separators) {
    const parts = summary.split(separator.token).map((part) => part.trim());

    if (parts.length !== 2) {
      continue;
    }

    const [left, right] = parts;
    const leftIsClub = containsClubAlias(left);
    const rightIsClub = containsClubAlias(right);

    if (leftIsClub === rightIsClub) {
      continue;
    }

    if (separator.mode === "at") {
      return {
        opponent: leftIsClub ? right : left,
        status: leftIsClub ? labels.away : labels.home,
      };
    }

    return {
      opponent: leftIsClub ? right : left,
      status: leftIsClub ? labels.home : labels.away,
    };
  }

  const cleanedOpponent = cleanOpponentLabel(summary);

  if (location.includes("carouge")) {
    return {
      opponent: cleanedOpponent,
      status: labels.home,
    };
  }

  if (description.includes("domicile") || description.includes("en casa")) {
    return {
      opponent: cleanedOpponent,
      status: labels.home,
    };
  }

  if (
    description.includes("exterieur") ||
    description.includes("extérieur") ||
    description.includes("fuera")
  ) {
    return {
      opponent: cleanedOpponent,
      status: labels.away,
    };
  }

  return {
    opponent: cleanedOpponent,
    status: labels.scheduled,
  };
}

function inferPhase(event: ParsedCalendarEvent, locale: Locale) {
  const labels = calendarCopy[locale];
  const category = event.categories[0];
  const normalizedCategory = normalizeForMatchText(
    [category, event.summary, event.description].filter(Boolean).join(" "),
  );

  if (category) {
    return toPhaseLabel(category);
  }

  if (
    normalizedCategory.includes("playoff") ||
    normalizedCategory.includes("play-off")
  ) {
    return labels.playoffs;
  }

  if (
    normalizedCategory.includes("championnat") ||
    normalizedCategory.includes("liga") ||
    normalizedCategory.includes("league")
  ) {
    return labels.league;
  }

  if (
    normalizedCategory.includes("coupe") ||
    normalizedCategory.includes("copa") ||
    normalizedCategory.includes("cup")
  ) {
    return labels.cup;
  }

  if (
    normalizedCategory.includes("amical") ||
    normalizedCategory.includes("amistoso") ||
    normalizedCategory.includes("friendly")
  ) {
    return labels.friendly;
  }

  return labels.calendar;
}

function formatLongDate(date: ParsedDate, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CH" : "es-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: date.formatTimeZone,
  }).format(date.displayDate);
}

function formatShortDate(date: ParsedDate, locale: Locale) {
  const parts = new Intl.DateTimeFormat(locale === "fr" ? "fr-CH" : "es-CH", {
    day: "2-digit",
    month: "short",
    timeZone: date.formatTimeZone,
  })
    .format(date.displayDate)
    .replace(".", "")
    .toUpperCase()
    .split(" ");

  return parts.join(" ");
}

function formatTimeLabel(date: ParsedDate, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CH" : "es-CH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: date.formatTimeZone,
  }).format(date.displayDate);
}

function formatComparableInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
  }).formatToParts(date);
  const map = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}`;
}

function cleanOpponentLabel(summary: string) {
  const withoutClubName = summary
    .replace(/latino carouge basket club/gi, "")
    .replace(/latino carouge bc/gi, "")
    .replace(/latino carouge/gi, "")
    .replace(/\bvs\.?\b/gi, "")
    .replace(/\bv\.?\b/gi, "")
    .replace(/\bcontre\b/gi, "")
    .replace(/\bcontra\b/gi, "")
    .replace(/[@–-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return withoutClubName || summary;
}

function cleanBasketplanTeamName(value: string) {
  return value.replace(/\s*\([^)]*\)\s*$/g, "").replace(/\s+/g, " ").trim();
}

function normalizeBasketplanScore(value: string | undefined) {
  const score = value?.trim();

  if (!score || !/^\d+$/.test(score)) {
    return undefined;
  }

  return score;
}

function normalizeBasketplanScoreStatus(value: string | undefined) {
  const status = value?.replace(/\u00a0/g, " ").trim();

  return status || undefined;
}

function cleanHtmlCell(value: string) {
  return decodeHtmlEntities(
    value
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  ).trim();
}

function getFixtureCategoryLabel(teamName: string) {
  const normalized = normalizeForMatchText(teamName);

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

function getFixtureCategorySort(teamName: string) {
  const category = getFixtureCategoryLabel(teamName);
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

function containsClubAlias(value: string) {
  const normalized = normalizeForMatchText(value);
  return clubAliases.some((alias) => normalized.includes(alias));
}

function normalizeForMatchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toPhaseLabel(value: string) {
  return value
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function decodeCalendarText(value: string) {
  return value
    .replace(/\\n/gi, " ")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
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
