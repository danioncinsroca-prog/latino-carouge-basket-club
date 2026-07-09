type TeamLogoMatch = {
  src: string;
  aliases: string[];
};

const teamLogoMatches: TeamLogoMatch[] = [
  {
    src: "/latino-carouge-logo.png",
    aliases: [
      "basket club latino carouge",
      "latino carouge basket club",
      "latino carouge bc",
      "latino carouge",
      "latino basket",
    ],
  },
  {
    src: "/teams/bernex-basket.png",
    aliases: ["bernex basket", "bernex"],
  },
  {
    src: "/teams/chene-bbc.png",
    aliases: ["chene basketball club", "chene bbc", "chene"],
  },
  {
    src: "/teams/cologny-basket.png",
    aliases: ["cologny basket", "cologny"],
  },
  {
    src: "/teams/es-vernier.png",
    aliases: ["es vernier basket", "es vernier", "vernier"],
  },
  {
    src: "/teams/geneve-paquis-seujet.png",
    aliases: ["geneve paquis seujet", "paquis seujet", "paquis"],
  },
  {
    src: "/teams/international-bbc.png",
    aliases: ["international bbc", "international geneva", "international"],
  },
  {
    src: "/teams/basketball-puplinge.png",
    aliases: ["basketball puplinge", "puplinge", "bbp"],
  },
  {
    src: "/teams/lions-carouge.png",
    aliases: ["lions carouge basket", "lions carouge"],
  },
  {
    src: "/teams/lions-geneve-grand-saconnex.png",
    aliases: [
      "lions de geneve grand saconnex",
      "lions de geneve gd saconnex",
      "lions de geneve",
      "grand saconnex",
      "gd saconnex",
    ],
  },
  {
    src: "/teams/meyrin-basket.png",
    aliases: ["meyrin basket", "meyrin"],
  },
  {
    src: "/teams/onex-basket.png",
    aliases: ["onex basket", "onex"],
  },
  {
    src: "/teams/st-jean-basket.png",
    aliases: ["st jean basket", "saint jean basket", "st jean", "saint jean"],
  },
  {
    src: "/teams/versoix-basket.png",
    aliases: ["versoix basket", "versoix"],
  },
  {
    src: "/teams/veyrier-saleve.png",
    aliases: ["veyrier saleve basket", "veyrier saleve", "veyrier"],
  },
];

export function getTeamLogoSrc(teamName: string | undefined) {
  if (!teamName) {
    return undefined;
  }

  const normalizedName = normalizeTeamLogoName(teamName);
  const match = teamLogoMatches.find((entry) =>
    entry.aliases.some((alias) => normalizedName.includes(alias)),
  );

  return match?.src;
}

function normalizeTeamLogoName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
