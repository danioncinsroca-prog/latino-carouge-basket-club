import { cache } from "react";
import { clubConfig, siteContent, type Fixture, type Locale } from "@/lib/site";

const CALENDAR_ENV_KEYS = [
  "INFOMANIAK_CALENDAR_ICS_URL",
  "CALENDAR_ICS_URL",
] as const;
const DEFAULT_CALENDAR_TIME_ZONE = "Europe/Zurich";
const MAX_CALENDAR_FIXTURES = 12;

type ResolvedSchedule = {
  fixtures: Fixture[];
  source: "calendar" | "fallback";
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

const clubAliases = [
  clubConfig.name,
  clubConfig.shortName,
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
  },
} as const;

export const getResolvedSchedule = cache(
  async (locale: Locale): Promise<ResolvedSchedule> => {
    const fallbackFixtures = siteContent[locale].fixtures;
    const calendarUrl = getCalendarFeedUrl();

    if (!calendarUrl) {
      return {
        fixtures: fallbackFixtures,
        source: "fallback",
        calendarUrlConfigured: false,
      };
    }

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
          fixtures: fallbackFixtures,
          source: "fallback",
          calendarUrlConfigured: true,
        };
      }

      return {
        fixtures,
        source: "calendar",
        calendarUrlConfigured: true,
      };
    } catch (error) {
      console.error("Failed to load calendar feed", error);

      return {
        fixtures: fallbackFixtures,
        source: "fallback",
        calendarUrlConfigured: true,
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
    .slice(0, MAX_CALENDAR_FIXTURES)
    .map((event) => mapEventToFixture(event, locale));
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

  return {
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
