import type { Metadata } from "next";

export const locales = ["fr", "es"] as const;
export type Locale = (typeof locales)[number];

export const sectionKeys = ["team", "news", "matches", "history"] as const;
export type SectionKey = (typeof sectionKeys)[number];

export type NavItem = {
  label: string;
  href: string;
};

export type RosterPlayer = {
  number: string;
  name: string;
  position: string;
  note: string;
};

export type CoachProfile = {
  label: string;
  name: string;
  role: string;
  bio: string;
};

export type MediaAsset = {
  src: string;
  alt: string;
  position?: string;
};

export type NewsItem = {
  title: string;
  excerpt: string;
  dateLabel: string;
  image?: MediaAsset;
};

export type Fixture = {
  opponent: string;
  dateLabel: string;
  shortDate: string;
  timeLabel: string;
  venue: string;
  phase: string;
  status: string;
  isoDate?: string;
};

export type MatchResult = {
  opponent: string;
  dateLabel: string;
  score: string;
};

export type PalmaresItem = {
  year: string;
  title: string;
  description: string;
  type: "trophy" | "cup" | "medal" | "milestone";
};

export type FeaturedPlayer = {
  number: string;
  name: string;
  position: string;
  highlight: string;
  stat?: { label: string; value: string };
  image?: MediaAsset;
};

export type ExternalLinks = {
  ticketingUrl: string | null;
  clubContactUrl: string | null;
  socialLinks: Array<{
    label: string;
    url: string | null;
  }>;
};

export type MediaPlaceholder = {
  label: string;
  note: string;
  caption?: string;
  image?: MediaAsset;
};

type SnapshotItem = {
  label: string;
  value: string;
  detail: string;
};

type LocaleContent = {
  meta: {
    homeTitle: string;
    homeDescription: string;
    sectionDescriptions: Record<SectionKey, string>;
  };
  header: {
    badge: string;
    primaryCta: string;
  };
  nav: NavItem[];
  hero: {
    badge: string;
    claim: string;
    copy: string;
    primaryCta: string;
    secondaryCta: string;
  };
  nextMatch: {
    label: string;
    opponentLabel: string;
    versus: string;
    copy: string;
    cta: string;
  };
  snapshot: {
    kicker: string;
    title: string;
    intro: string;
    items: SnapshotItem[];
  };
  team: {
    kicker: string;
    title: string;
    intro: string;
    viewAll: string;
  };
  coach: CoachProfile;
  roster: RosterPlayer[];
  newsSection: {
    kicker: string;
    title: string;
    intro: string;
    viewAll: string;
  };
  news: NewsItem[];
  fixturesSection: {
    kicker: string;
    title: string;
    intro: string;
    viewAll: string;
  };
  fixtures: Fixture[];
  historySection: {
    kicker: string;
    title: string;
    intro: string;
    viewAll: string;
    table: {
      date: string;
      match: string;
      score: string;
    };
  };
  results: MatchResult[];
  palmares: PalmaresItem[];
  palmaresSection: {
    kicker: string;
    title: string;
    intro: string;
  };
  partnersSection: {
    label: string;
    logos: { name: string; src: string; width: number }[];
  };
  featuredPlayers: FeaturedPlayer[];
  featuredPlayersSection: {
    kicker: string;
    title: string;
    intro: string;
  };
  placeholders: {
    hero: MediaPlaceholder;
    coach: MediaPlaceholder;
    news: MediaPlaceholder;
  };
  sectionLinks: Record<SectionKey, string>;
  sectionPages: Record<
    SectionKey,
    {
      badge: string;
      title: string;
      intro: string;
      comingSoon: string;
      backHome: string;
      jumpLabel: string;
      placeholder: MediaPlaceholder;
    }
  >;
  footer: {
    kicker: string;
    copy: string;
    quickLinksTitle: string;
    homeLabel: string;
    ticketingLabel: string;
    contactTitle: string;
    contactPhone: string;
    contactEmail: string;
    statusTitle: string;
    contactStatus: string;
    ticketingStatus: string;
  };
  recruitmentSection: {
    kicker: string;
    title: string;
    intro: string;
    subtitle: string;
    trialOffer: string;
    cta: string;
    bullets: string[];
    categories: Array<{
      code: string;
      label: string;
    }>;
  };
  contactPage: {
    badge: string;
    title: string;
    intro: string;
    form: {
      name: string;
      email: string;
      phone: string;
      position: string;
      message: string;
      consent: string;
      submit: string;
      successTitle: string;
      successMessage: string;
      errorMessage: string;
    };
  };
};

export const sectionSlugs: Record<SectionKey, Record<Locale, string>> = {
  team: { fr: "equipe", es: "equipo" },
  news: { fr: "actualites", es: "noticias" },
  matches: { fr: "matchs", es: "partidos" },
  history: { fr: "historique", es: "historico" },
};

export const clubConfig: {
  name: string;
  shortName: string;
  city: string;
  areaServed: string;
  sport: string;
  venue: string;
  league: string;
  externalLinks: ExternalLinks;
} = {
  name: "LATINO CAROUGE BASKET CLUB",
  shortName: "LATINO CAROUGE BC",
  city: "Carouge, Genève",
  areaServed: "Carouge, Geneva, Switzerland",
  sport: "Basketball",
  venue: "École de la Vigne rouge, Carouge",
  league: "Compétition locale et communauté bilingue",
  externalLinks: {
    ticketingUrl: null,
    clubContactUrl: null,
    socialLinks: [
      { label: "Instagram", url: "https://instagram.com/latinocarougebasket" },
      { label: "Facebook", url: null },
      { label: "YouTube", url: null },
    ],
  },
};

const frNav = (locale: Locale): NavItem[] => [
  { label: "Club", href: `/${locale}#club` },
  { label: "Équipe", href: `/${locale}#effectif` },
  { label: "Actualités", href: getSectionPath(locale, "news") },
  { label: "Calendrier", href: `/${locale}#next-match` },
  { label: "Historique", href: getSectionPath(locale, "history") },
];

const esNav = (locale: Locale): NavItem[] => [
  { label: "Club", href: `/${locale}#club` },
  { label: "Equipo", href: `/${locale}#effectif` },
  { label: "Noticias", href: getSectionPath(locale, "news") },
  { label: "Calendario", href: `/${locale}#next-match` },
  { label: "Histórico", href: getSectionPath(locale, "history") },
];

export const siteContent: Record<Locale, LocaleContent> = {
  fr: {
    meta: {
      homeTitle: "Club de basket à Carouge",
      homeDescription:
        "Landing bilingue FR/ES pour LATINO CAROUGE BASKET CLUB : prochain match, effectif, actualités, matchs et historique.",
      sectionDescriptions: {
        team: "Effectif, coach principal et structure sportive du club.",
        news: "Actualités du club et rythme éditorial matchday.",
        matches: "Calendrier, prochain match et future billetterie.",
        history: "Historique court des résultats et mémoire des matchs.",
      },
    },
    header: {
      badge: "Carouge · Genève · FR / ES",
      primaryCta: "Calendrier",
    },
    nav: frNav("fr"),
    hero: {
      badge: "Basket local. Identité forte. Structure prête.",
      claim: "Club bilingue. Matchday direct. Présence nette.",
      copy:
        "Le club pose une base claire : prochain match en haut, effectif visible, actualités lisibles et navigation prête pour grandir sans refaire la structure.",
      primaryCta: "Voir le prochain match",
      secondaryCta: "Voir l’équipe",
    },
    nextMatch: {
      label: "Prochain match",
      opponentLabel: "Adversaire",
      versus: "vs",
      copy:
        "Le bloc matchday reste prioritaire. Le calendrier partagé peut alimenter cette zone sans casser la home.",
      cta: "Voir les matchs",
    },
    snapshot: {
      kicker: "Base du club",
      title: "Une landing prête pour le terrain",
      intro:
        "Le site prend une direction simple : être utile le jour du match, lisible pour les familles et immédiatement identifiable comme un club de basket basé à Carouge.",
      items: [
        {
          label: "Base",
          value: "Carouge",
          detail: "Ancrage local à Genève avec une lecture claire côté club et supporters.",
        },
        {
          label: "Langues",
          value: "FR / ES",
          detail: "Architecture bilingue propre, avec URLs séparées et contenu prêt à évoluer.",
        },
        {
          label: "Focus",
          value: "Matchday",
          detail: "Prochain match, effectif, actualités et historique visibles dès la home.",
        },
        {
          label: "Calendrier",
          value: "Connectable",
          detail: "Le site peut recevoir automatiquement les prochains matchs depuis un agenda partagé.",
        },
      ],
    },
    team: {
      kicker: "Coach + effectif",
      title: "Une structure nette pour présenter le groupe",
      intro:
        "Le système est pensé pour accueillir un coach principal, la rotation et les profils joueurs sans transformer la home en base de données froide.",
      viewAll: "Voir la page équipe",
    },
    coach: {
      label: "Coach principal",
      name: "Coach principal",
      role: "Direction sportive",
      bio:
        "Bloc éditorial prévu pour présenter la vision du coach, le style de jeu et le cadre compétitif sans dépendre d’un portrait final.",
    },
    roster: [
      {
        number: "4",
        name: "Marco Reyes",
        position: "Meneur",
        note: "Gestion du tempo et premières lectures.",
      },
      {
        number: "7",
        name: "Diego Fuentes",
        position: "Arrière",
        note: "Pression sur la première ligne et spacing extérieur.",
      },
      {
        number: "9",
        name: "Carlos Méndez",
        position: "Ailier",
        note: "Coupe, transition et duel sur les ailes.",
      },
      {
        number: "11",
        name: "Luis Herrera",
        position: "Ailier fort",
        note: "Présence intérieure et écrans hauts.",
      },
      {
        number: "13",
        name: "Rafael Torres",
        position: "Pivot",
        note: "Protection du cercle et rebond défensif.",
      },
      {
        number: "18",
        name: "Andrés Vega",
        position: "Rotation",
        note: "Énergie de banc et intensité sur plusieurs postes.",
      },
    ],
    newsSection: {
      kicker: "Actualités",
      title: "Des cartes éditoriales simples et sportives",
      intro:
        "Les actualités existent déjà en preview sur la home, mais la structure redirige aussi vers une page dédiée sans lien cassé.",
      viewAll: "Voir les actualités",
    },
    news: [
      {
        dateLabel: "Août 2026",
        title: "Une base visuelle carrée pour lancer la saison",
        excerpt:
          "Le site est conçu pour accueillir les vrais visuels du club plus tard, sans refaire la grille ni les proportions.",
        image: {
          src: "/stock/team-huddle.jpg",
          alt: "Joueurs de basket rassemblés en cercle avant un match.",
          position: "center center",
        },
      },
      {
        dateLabel: "Septembre 2026",
        title: "Le groupe prend forme à Carouge",
        excerpt:
          "La section effectif est prête à recevoir le coach, les joueurs et les premiers profils matchday.",
        image: {
          src: "/stock/indoor-practice.jpg",
          alt: "Séance d'entraînement de basket en salle avec coach et joueuses.",
          position: "center 38%",
        },
      },
      {
        dateLabel: "Septembre 2026",
        title: "Calendrier et matchs : la couche utile d’abord",
        excerpt:
          "Le prochain match reste visible en haut de page pour garder une logique claire et locale.",
        image: {
          src: "/stock/dunk-action.jpg",
          alt: "Action de dunk pendant un match de basket devant le public.",
          position: "center 26%",
        },
      },
    ],
    fixturesSection: {
      kicker: "À venir",
      title: "Les prochains rendez-vous restent visibles",
      intro:
        "Le visiteur n’a pas à chercher où l’équipe joue ensuite. Le site rend le calendrier court lisible immédiatement.",
      viewAll: "Voir tous les matchs",
    },
    fixtures: [
      {
        opponent: "Équipe invitée",
        dateLabel: "20 septembre 2026",
        shortDate: "20 SEP",
        timeLabel: "18:00",
        venue: "Salle de quartier à confirmer · Carouge",
        phase: "Ouverture",
        status: "À la maison",
        isoDate: "2026-09-20T18:00:00+02:00",
      },
      {
        opponent: "Collectif Genève",
        dateLabel: "27 septembre 2026",
        shortDate: "27 SEP",
        timeLabel: "16:30",
        venue: "Genève · Extérieur",
        phase: "Championnat",
        status: "Déplacement",
      },
      {
        opponent: "Rivière Basket",
        dateLabel: "04 octobre 2026",
        shortDate: "04 OCT",
        timeLabel: "19:30",
        venue: "Carouge · Salle à confirmer",
        phase: "Championnat",
        status: "À la maison",
      },
    ],
    historySection: {
      kicker: "Historique court",
      title: "Un historique déjà prêt à s’allonger",
      intro:
        "La table résultats existe dès maintenant pour accueillir les scores, les adversaires et la mémoire du club.",
      viewAll: "Voir l’historique",
      table: {
        date: "Date",
        match: "Match",
        score: "Score",
      },
    },
    results: [
      {
        dateLabel: "12 juin 2026",
        opponent: "Collectif Rhône",
        score: "71 — 66",
      },
      {
        dateLabel: "05 juin 2026",
        opponent: "Équipe locale B",
        score: "64 — 68",
      },
      {
        dateLabel: "29 mai 2026",
        opponent: "Union Ville",
        score: "79 — 72",
      },
      {
        dateLabel: "22 mai 2026",
        opponent: "Rivière Basket",
        score: "58 — 61",
      },
    ],
    palmares: [
      {
        year: "2009",
        title: "Fondation",
        description: "Naissance du club à Carouge. Identité bilingue posée dès le départ.",
        type: "milestone",
      },
      {
        year: "2023",
        title: "Premier tournoi",
        description: "Première participation au tournoi communautaire de Genève.",
        type: "cup",
      },
      {
        year: "2024",
        title: "Coupe locale",
        description: "Premier titre remporté — victoire en coupe de quartier.",
        type: "trophy",
      },
      {
        year: "2025",
        title: "Record saison",
        description: "Meilleure performance en saison régulière depuis la fondation.",
        type: "medal",
      },
    ],
    palmaresSection: {
      kicker: "",
      title: "Palmarès & Histoire",
      intro: "Les étapes clés du club depuis sa fondation à Carouge.",
    },
    partnersSection: {
      label: "Nos partenaires",
      logos: [
        { name: "Swiss Basketball", src: "/partners/swiss-basketball.png", width: 160 },
        { name: "République et Canton de Genève", src: "/partners/canton-geneve.webp", width: 56 },
        { name: "ACGBA", src: "/partners/acgba.png", width: 120 },
        { name: "Ville de Carouge", src: "/partners/ville-carouge.png", width: 140 },
      ],
    },
    featuredPlayers: [
      {
        number: "4",
        name: "Marco Reyes",
        position: "Meneur",
        highlight: "Chef d'orchestre du jeu offensif. Tempo, lecture et passes premières.",
        stat: { label: "passes clés / match", value: "7.2" },
      },
      {
        number: "7",
        name: "Diego Fuentes",
        position: "Arrière",
        highlight: "Scoring extérieur et pression constante sur la première ligne adverse.",
        stat: { label: "points / match", value: "15.4" },
      },
      {
        number: "11",
        name: "Luis Herrera",
        position: "Ailier fort",
        highlight: "Présence intérieure dominante. Écrans hauts et rebond défensif.",
        stat: { label: "rebonds / match", value: "9.1" },
      },
    ],
    featuredPlayersSection: {
      kicker: "Joueurs en vue",
      title: "Ceux qui font le collectif",
      intro: "Trois profils clés dans la construction du jeu du club.",
    },
    recruitmentSection: {
      kicker: "Rejoins le club",
      title: "On recrute",
      intro: "Tu veux jouer au basket à Carouge ? On cherche des joueurs motivés, tous niveaux confondus. Envoie-nous un message.",
      subtitle: "Toutes les catégories du mouvement jeunes, places disponibles pour la rentrée scolaire.",
      trialOffer: "Deux séances d'essai gratuites pour découvrir le club, sans engagement.",
      cta: "Nous contacter",
      bullets: [
        "Encadrement qualifié, formateur diplômé",
        "Valeurs fortes : respect, solidarité, engagement",
        "Entraînements adaptés à chaque âge et niveau",
        "Ambiance familiale et conviviale",
        "Championnats et tournois toute la saison",
      ],
      categories: [
        { code: "U8", label: "Mini Basket" },
        { code: "U10", label: "Apprentissage et plaisir" },
        { code: "U12", label: "Progression et équipe" },
        { code: "U14", label: "Développement et intensité" },
        { code: "U16", label: "Compétition et rigueur" },
        { code: "U18+", label: "Seniors et loisirs" },
      ],
    },
    contactPage: {
      badge: "Contact",
      title: "Rejoins l'équipe",
      intro: "Remplis le formulaire et on revient vers toi rapidement.",
      form: {
        name: "Nom complet",
        email: "Adresse e-mail",
        phone: "Téléphone (optionnel)",
        position: "Poste souhaité",
        message: "Message",
        consent: "J'autorise le club à conserver et utiliser les informations de ce formulaire pour traiter ma demande d'inscription.",
        submit: "Envoyer",
        successTitle: "Message envoyé !",
        successMessage: "On revient vers toi dès que possible.",
        errorMessage: "Une erreur s'est produite. Réessaie.",
      },
    },
    placeholders: {
      hero: {
        label: "MATCHDAY VISUAL",
        note: "Bloc solide prêt pour la future image principale du club.",
        caption: "Placeholder principal",
        image: {
          src: "/stock/hero-matchday.jpg",
          alt: "Photo de match de basket dans une grande salle.",
          position: "center center",
        },
      },
      coach: {
        label: "COACH PORTRAIT",
        note: "Slot prévu pour le portrait officiel du coach.",
      },
      news: {
        label: "NEWS IMAGE",
        note: "Slot éditorial prêt pour photo ou affiche matchday.",
        image: {
          src: "/stock/indoor-practice.jpg",
          alt: "Séance de basket en salle avec groupe et coach.",
          position: "center 34%",
        },
      },
    },
    sectionLinks: {
      team: "Équipe",
      news: "Actualités",
      matches: "Matchs",
      history: "Historique",
    },
    sectionPages: {
      team: {
        badge: "Page équipe",
        title: "Équipe",
        intro:
          "Cette page est déjà routée pour accueillir l’effectif complet, le coach et les fiches joueurs dès que les contenus finaux arrivent.",
        comingSoon: "Version détaillée en préparation.",
        backHome: "Retour à la home",
        jumpLabel: "Retour à l’aperçu équipe",
        placeholder: {
          label: "PHOTO ÉQUIPE",
          note: "Emplacement prévu pour visuel collectif ou portrait principal.",
          image: {
            src: "/stock/team-huddle.jpg",
            alt: "Groupe de joueurs réuni avant un match de basket.",
            position: "center center",
          },
        },
      },
      news: {
        badge: "Page actualités",
        title: "Actualités",
        intro:
          "La page actualités est prête à devenir un vrai hub éditorial, mais elle existe déjà sans casser la navigation.",
        comingSoon: "Version éditoriale longue en préparation.",
        backHome: "Retour à la home",
        jumpLabel: "Retour aux actualités home",
        placeholder: {
          label: "ACTU FEATURE",
          note: "Emplacement prévu pour la prochaine image éditoriale forte.",
          image: {
            src: "/stock/dunk-action.jpg",
            alt: "Action forte de basket avec dunk et public en arrière-plan.",
            position: "center 24%",
          },
        },
      },
      matches: {
        badge: "Page matchs",
        title: "Matchs",
        intro:
          "La page matchs prépare la couche opérationnelle : calendrier et prochains rendez-vous du club.",
        comingSoon: "Version calendrier complet en préparation.",
        backHome: "Retour à la home",
        jumpLabel: "Retour au prochain match",
        placeholder: {
          label: "CALENDRIER SLOT",
          note: "Zone prête pour intégration calendrier ou visuel matchday.",
          image: {
            src: "/stock/hero-matchday.jpg",
            alt: "Photo d'un match de basket dans une grande arène.",
            position: "center center",
          },
        },
      },
      history: {
        badge: "Page historique",
        title: "Historique",
        intro:
          "La page historique gardera la mémoire des matchs et pourra s’étendre en tableau plus complet par saison.",
        comingSoon: "Version archivage complet en préparation.",
        backHome: "Retour à la home",
        jumpLabel: "Retour au bloc historique",
        placeholder: {
          label: "ARCHIVE PANEL",
          note: "Zone prévue pour futures stats, saisons ou filtres.",
          image: {
            src: "/stock/news-2.jpg",
            alt: "Photo de basket en salle avec public.",
            position: "center center",
          },
        },
      },
    },
    footer: {
      kicker: "LATINO CAROUGE BASKET CLUB",
      copy:
        "Base bilingue FR / ES, architecture prête pour images réelles, calendrier partagé, pages détaillées et croissance éditoriale.",
      quickLinksTitle: "Liens rapides",
      homeLabel: "Home",
      ticketingLabel: "Calendrier / matchs",
      contactTitle: "Nous contacter",
      contactPhone: "+41 78 758 71 54",
      contactEmail: "basket-club-latino-carouge@bluewin.ch",
      statusTitle: "Statut du projet",
      contactStatus: "Rejoins-nous : places disponibles pour toutes les catégories.",
      ticketingStatus:
        "Un calendrier partagé peut alimenter automatiquement les prochains matchs du club.",
    },
  },
  es: {
    meta: {
      homeTitle: "Club de baloncesto en Carouge",
      homeDescription:
        "Landing bilingüe FR/ES para LATINO CAROUGE BASKET CLUB: próximo partido, plantilla, noticias, partidos e histórico.",
      sectionDescriptions: {
        team: "Plantilla, entrenador principal y base deportiva del club.",
        news: "Noticias del club y ritmo editorial matchday.",
        matches: "Calendario, próximo partido y futura billetterie.",
        history: "Histórico corto de resultados y memoria de partidos.",
      },
    },
    header: {
      badge: "Carouge · Ginebra · FR / ES",
      primaryCta: "Calendario",
    },
    nav: esNav("es"),
    hero: {
      badge: "Basket local. Identidad fuerte. Estructura lista.",
      claim: "Club bilingüe. Matchday directo. Presencia clara.",
      copy:
        "El club arranca con una base clara: próximo partido arriba, plantilla visible, noticias legibles y navegación preparada para crecer sin rehacer la estructura.",
      primaryCta: "Ver el próximo partido",
      secondaryCta: "Ver el equipo",
    },
    nextMatch: {
      label: "Próximo partido",
      opponentLabel: "Rival",
      versus: "vs",
      copy:
        "El bloque de matchday sigue siendo prioritario. El calendario compartido puede alimentar esta zona sin romper la home.",
      cta: "Ver partidos",
    },
    snapshot: {
      kicker: "Base del club",
      title: "Una landing preparada para la pista",
      intro:
        "La web toma una dirección simple: ser útil el día de partido, legible para familias y reconocible al instante como club de baloncesto de Carouge.",
      items: [
        {
          label: "Base",
          value: "Carouge",
          detail: "Anclaje local en Ginebra con lectura clara para club y afición.",
        },
        {
          label: "Idiomas",
          value: "FR / ES",
          detail: "Arquitectura bilingüe limpia, con URLs separadas y contenido escalable.",
        },
        {
          label: "Foco",
          value: "Matchday",
          detail: "Próximo partido, plantilla, noticias e histórico visibles desde la home.",
        },
        {
          label: "Calendario",
          value: "Conectable",
          detail: "La web puede recibir automáticamente los próximos partidos desde un calendario compartido.",
        },
      ],
    },
    team: {
      kicker: "Entrenador + plantilla",
      title: "Una estructura clara para presentar el grupo",
      intro:
        "El sistema está pensado para alojar entrenador principal, rotación y perfiles de jugadores sin convertir la home en una base fría.",
      viewAll: "Ver la página de equipo",
    },
    coach: {
      label: "Entrenador principal",
      name: "Entrenador principal",
      role: "Dirección deportiva",
      bio:
        "Bloque editorial preparado para presentar la visión del entrenador, el estilo de juego y el marco competitivo sin depender aún del retrato final.",
    },
    roster: [
      {
        number: "4",
        name: "Marco Reyes",
        position: "Base",
        note: "Control del ritmo y primeras lecturas.",
      },
      {
        number: "7",
        name: "Diego Fuentes",
        position: "Escolta",
        note: "Presión sobre primera línea y spacing exterior.",
      },
      {
        number: "9",
        name: "Carlos Méndez",
        position: "Alero",
        note: "Cortes, transición y duelo en alas.",
      },
      {
        number: "11",
        name: "Luis Herrera",
        position: "Ala-pívot",
        note: "Presencia interior y bloqueos altos.",
      },
      {
        number: "13",
        name: "Rafael Torres",
        position: "Pívot",
        note: "Protección del aro y rebote defensivo.",
      },
      {
        number: "18",
        name: "Andrés Vega",
        position: "Rotación",
        note: "Energía desde el banquillo y intensidad multi-posición.",
      },
    ],
    newsSection: {
      kicker: "Noticias",
      title: "Tarjetas editoriales simples y deportivas",
      intro:
        "Las noticias ya existen en preview dentro de la home, pero la estructura también redirige a una página dedicada sin enlaces rotos.",
      viewAll: "Ver noticias",
    },
    news: [
      {
        dateLabel: "Agosto 2026",
        title: "Una base visual dura para lanzar la temporada",
        excerpt:
          "La web está pensada para recibir más tarde las imágenes reales del club sin rehacer ni la grilla ni las proporciones.",
        image: {
          src: "/stock/team-huddle.jpg",
          alt: "Jugadores de baloncesto reunidos en círculo antes de un partido.",
          position: "center center",
        },
      },
      {
        dateLabel: "Septiembre 2026",
        title: "El grupo empieza a tomar forma en Carouge",
        excerpt:
          "La sección de plantilla ya está lista para recibir entrenador, jugadores y primeros perfiles matchday.",
        image: {
          src: "/stock/indoor-practice.jpg",
          alt: "Entrenamiento de baloncesto en pabellón con entrenador y jugadoras.",
          position: "center 38%",
        },
      },
      {
        dateLabel: "Septiembre 2026",
        title: "Calendario y partidos: primero la capa útil",
        excerpt:
          "El próximo partido sigue visible arriba para mantener una lógica clara y local.",
        image: {
          src: "/stock/dunk-action.jpg",
          alt: "Acción de mate durante un partido de baloncesto con público.",
          position: "center 26%",
        },
      },
    ],
    fixturesSection: {
      kicker: "Próximamente",
      title: "Los siguientes partidos siempre a la vista",
      intro:
        "El visitante no tiene que buscar dónde juega el equipo después. La web hace que el calendario corto sea visible de inmediato.",
      viewAll: "Ver todos los partidos",
    },
    fixtures: [
      {
        opponent: "Equipo invitado",
        dateLabel: "20 septiembre 2026",
        shortDate: "20 SEP",
        timeLabel: "18:00",
        venue: "Sala por confirmar · Carouge",
        phase: "Apertura",
        status: "En casa",
        isoDate: "2026-09-20T18:00:00+02:00",
      },
      {
        opponent: "Colectivo Ginebra",
        dateLabel: "27 septiembre 2026",
        shortDate: "27 SEP",
        timeLabel: "16:30",
        venue: "Ginebra · Fuera",
        phase: "Liga",
        status: "Desplazamiento",
      },
      {
        opponent: "Rivière Basket",
        dateLabel: "04 octubre 2026",
        shortDate: "04 OCT",
        timeLabel: "19:30",
        venue: "Carouge · Sala por confirmar",
        phase: "Liga",
        status: "En casa",
      },
    ],
    historySection: {
      kicker: "Histórico corto",
      title: "Un histórico listo para crecer",
      intro:
        "La tabla de resultados existe desde ya para recibir marcadores, rivales y memoria del club.",
      viewAll: "Ver histórico",
      table: {
        date: "Fecha",
        match: "Partido",
        score: "Marcador",
      },
    },
    results: [
      {
        dateLabel: "12 junio 2026",
        opponent: "Colectivo Rhône",
        score: "71 — 66",
      },
      {
        dateLabel: "05 junio 2026",
        opponent: "Equipo local B",
        score: "64 — 68",
      },
      {
        dateLabel: "29 mayo 2026",
        opponent: "Unión Ville",
        score: "79 — 72",
      },
      {
        dateLabel: "22 mayo 2026",
        opponent: "Rivière Basket",
        score: "58 — 61",
      },
    ],
    palmares: [
      {
        year: "2009",
        title: "Fundación",
        description: "Nacimiento del club en Carouge. Identidad bilingüe establecida desde el principio.",
        type: "milestone",
      },
      {
        year: "2023",
        title: "Primer torneo",
        description: "Primera participación en el torneo comunitario de Ginebra.",
        type: "cup",
      },
      {
        year: "2024",
        title: "Copa local",
        description: "Primer título — victoria en la copa de barrio.",
        type: "trophy",
      },
      {
        year: "2025",
        title: "Récord temporada",
        description: "Mejor rendimiento en temporada regular desde la fundación.",
        type: "medal",
      },
    ],
    palmaresSection: {
      kicker: "Palmarés & Historia",
      title: "La memoria del club",
      intro: "Las etapas clave del club desde su fundación en Carouge.",
    },
    partnersSection: {
      label: "Nuestros socios",
      logos: [
        { name: "Swiss Basketball", src: "/partners/swiss-basketball.png", width: 160 },
        { name: "République et Canton de Genève", src: "/partners/canton-geneve.webp", width: 56 },
        { name: "ACGBA", src: "/partners/acgba.png", width: 120 },
        { name: "Ville de Carouge", src: "/partners/ville-carouge.png", width: 140 },
      ],
    },
    featuredPlayers: [
      {
        number: "4",
        name: "Marco Reyes",
        position: "Base",
        highlight: "Director del juego ofensivo. Ritmo, lectura y primeros pases.",
        stat: { label: "asistencias / partido", value: "7.2" },
      },
      {
        number: "7",
        name: "Diego Fuentes",
        position: "Escolta",
        highlight: "Anotador exterior y presión constante sobre la primera línea rival.",
        stat: { label: "puntos / partido", value: "15.4" },
      },
      {
        number: "11",
        name: "Luis Herrera",
        position: "Ala-pívot",
        highlight: "Dominio interior. Bloqueos altos y rebote defensivo.",
        stat: { label: "rebotes / partido", value: "9.1" },
      },
    ],
    featuredPlayersSection: {
      kicker: "Jugadores destacados",
      title: "Los que construyen el colectivo",
      intro: "Tres perfiles clave en la construcción del juego del club.",
    },
    recruitmentSection: {
      kicker: "Únete al club",
      title: "Buscamos jugadores",
      intro: "¿Quieres jugar al baloncesto en Carouge? Buscamos jugadores motivados, todos los niveles bienvenidos.",
      subtitle: "Todas las categorías del movimiento juvenil, plazas disponibles para el inicio de curso.",
      trialOffer: "Dos sesiones de prueba gratuitas para conocer el club, sin compromiso.",
      cta: "Contactarnos",
      bullets: [
        "Formador cualificado y titulado",
        "Valores fuertes: respeto, solidaridad, compromiso",
        "Entrenamientos adaptados a cada edad y nivel",
        "Ambiente familiar y cercano",
        "Campeonatos y torneos durante toda la temporada",
      ],
      categories: [
        { code: "U8", label: "Mini Baloncesto" },
        { code: "U10", label: "Aprendizaje y diversión" },
        { code: "U12", label: "Progresión y equipo" },
        { code: "U14", label: "Desarrollo e intensidad" },
        { code: "U16", label: "Competición y rigor" },
        { code: "U18+", label: "Séniors y ocio" },
      ],
    },
    contactPage: {
      badge: "Contacto",
      title: "Únete al equipo",
      intro: "Rellena el formulario y te respondemos lo antes posible.",
      form: {
        name: "Nombre completo",
        email: "Correo electrónico",
        phone: "Teléfono (opcional)",
        position: "Posición deseada",
        message: "Mensaje",
        consent: "Autorizo al club a conservar y utilizar la información de este formulario para tramitar mi solicitud de inscripción.",
        submit: "Enviar",
        successTitle: "¡Mensaje enviado!",
        successMessage: "Nos pondremos en contacto contigo pronto.",
        errorMessage: "Ha ocurrido un error. Inténtalo de nuevo.",
      },
    },
    placeholders: {
      hero: {
        label: "MATCHDAY VISUAL",
        note: "Bloque sólido preparado para la futura imagen principal del club.",
        caption: "Placeholder principal",
        image: {
          src: "/stock/hero-matchday.jpg",
          alt: "Foto de partido de baloncesto en un pabellón grande.",
          position: "center center",
        },
      },
      coach: {
        label: "RETRATO ENTRENADOR",
        note: "Slot reservado para el retrato oficial del entrenador.",
      },
      news: {
        label: "IMAGEN NOTICIA",
        note: "Slot editorial preparado para foto o cartel matchday.",
        image: {
          src: "/stock/indoor-practice.jpg",
          alt: "Entrenamiento de baloncesto en pabellón con grupo y entrenador.",
          position: "center 34%",
        },
      },
    },
    sectionLinks: {
      team: "Equipo",
      news: "Noticias",
      matches: "Partidos",
      history: "Histórico",
    },
    sectionPages: {
      team: {
        badge: "Página equipo",
        title: "Equipo",
        intro:
          "Esta página ya está conectada para alojar la plantilla completa, el entrenador y las fichas de jugadores cuando lleguen los contenidos finales.",
        comingSoon: "Versión detallada en preparación.",
        backHome: "Volver a la home",
        jumpLabel: "Volver al preview del equipo",
        placeholder: {
          label: "FOTO EQUIPO",
          note: "Espacio previsto para imagen colectiva o retrato principal.",
          image: {
            src: "/stock/team-huddle.jpg",
            alt: "Grupo de jugadores reunido antes de un partido de baloncesto.",
            position: "center center",
          },
        },
      },
      news: {
        badge: "Página noticias",
        title: "Noticias",
        intro:
          "La página de noticias está lista para convertirse en un hub editorial real, pero ya existe sin romper la navegación.",
        comingSoon: "Versión editorial larga en preparación.",
        backHome: "Volver a la home",
        jumpLabel: "Volver a noticias en home",
        placeholder: {
          label: "ACTU FEATURE",
          note: "Espacio previsto para la próxima imagen editorial fuerte.",
          image: {
            src: "/stock/dunk-action.jpg",
            alt: "Acción potente de baloncesto con mate y público al fondo.",
            position: "center 24%",
          },
        },
      },
      matches: {
        badge: "Página partidos",
        title: "Partidos",
        intro:
          "La página de partidos prepara la capa operativa: calendario y próximos encuentros del club.",
        comingSoon: "Versión completa de calendario en preparación.",
        backHome: "Volver a la home",
        jumpLabel: "Volver al próximo partido",
        placeholder: {
          label: "CALENDARIO SLOT",
          note: "Zona lista para integración de calendario o visual de matchday.",
          image: {
            src: "/stock/hero-matchday.jpg",
            alt: "Foto de partido de baloncesto en una gran arena.",
            position: "center center",
          },
        },
      },
      history: {
        badge: "Página histórico",
        title: "Histórico",
        intro:
          "La página histórico guardará la memoria de los partidos y podrá crecer en una tabla más completa por temporada.",
        comingSoon: "Versión completa de archivo en preparación.",
        backHome: "Volver a la home",
        jumpLabel: "Volver al bloque histórico",
        placeholder: {
          label: "ARCHIVE PANEL",
          note: "Zona prevista para futuras stats, temporadas o filtros.",
          image: {
            src: "/stock/news-2.jpg",
            alt: "Foto de baloncesto en sala con público.",
            position: "center center",
          },
        },
      },
    },
    footer: {
      kicker: "LATINO CAROUGE BASKET CLUB",
      copy:
        "Base bilingüe FR / ES, arquitectura lista para imágenes reales, calendario compartido, páginas detalladas y crecimiento editorial.",
      quickLinksTitle: "Enlaces rápidos",
      homeLabel: "Home",
      ticketingLabel: "Calendario / partidos",
      contactTitle: "Contactarnos",
      contactPhone: "+41 78 758 71 54",
      contactEmail: "basket-club-latino-carouge@bluewin.ch",
      statusTitle: "Estado del proyecto",
      contactStatus: "Únete: plazas disponibles para todas las categorías.",
      ticketingStatus:
        "Un calendario compartido puede alimentar automáticamente los próximos partidos del club.",
    },
  },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getHomePath(locale: Locale) {
  return `/${locale}`;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "fr" ? "es" : "fr";
}

export function getSectionPath(locale: Locale, sectionKey: SectionKey) {
  return `/${locale}/${sectionSlugs[sectionKey][locale]}`;
}

export function getSectionAnchor(sectionKey: SectionKey) {
  const anchorMap: Record<SectionKey, string> = {
    team: "effectif",
    news: "news",
    matches: "matches",
    history: "history",
  };

  return anchorMap[sectionKey];
}

export function getSectionKeyFromSlug(
  locale: Locale,
  slug: string,
): SectionKey | null {
  const match = sectionKeys.find((sectionKey) => sectionSlugs[sectionKey][locale] === slug);
  return match ?? null;
}

export function buildHomeMetadata(locale: Locale): Metadata {
  const content = siteContent[locale];

  return {
    title: content.meta.homeTitle,
    description: content.meta.homeDescription,
    keywords: [
      "club de basket Carouge",
      "basket Genève",
      "club de baloncesto Carouge",
      "LATINO CAROUGE BASKET CLUB",
    ],
  };
}

export function buildSectionMetadata(
  locale: Locale,
  sectionKey: SectionKey,
): Metadata {
  const content = siteContent[locale];
  const title = `${content.sectionLinks[sectionKey]} | ${clubConfig.name}`;

  return {
    title,
    description: content.meta.sectionDescriptions[sectionKey],
  };
}

export function buildSportsOrganizationJsonLd(locale: Locale) {
  const content = siteContent[locale];

  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: clubConfig.name,
    sport: clubConfig.sport,
    areaServed: clubConfig.areaServed,
    description: content.meta.homeDescription,
    location: {
      "@type": "Place",
      name: clubConfig.venue,
      address: clubConfig.city,
    },
  };
}

export function buildSportsEventJsonLd(locale: Locale, fixtures?: Fixture[]) {
  const nextFixture = (fixtures ?? siteContent[locale].fixtures).find(
    (fixture) => fixture.isoDate,
  );

  if (!nextFixture?.isoDate) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${clubConfig.shortName} vs ${nextFixture.opponent}`,
    startDate: nextFixture.isoDate,
    eventAttendanceMode:
      "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: nextFixture.venue,
      address: clubConfig.city,
    },
    organizer: {
      "@type": "SportsOrganization",
      name: clubConfig.name,
    },
  };
}
