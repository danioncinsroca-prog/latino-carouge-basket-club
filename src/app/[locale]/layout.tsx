import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Oswald, Roboto, Roboto_Condensed } from "next/font/google";
import "../globals.css";
import {
  clubConfig,
  getAlternateLocale,
  isLocale,
  locales,
  siteContent,
} from "@/lib/site";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const current = siteContent[locale];
  const alternate = getAlternateLocale(locale);

  return {
    metadataBase: new URL("https://latinocarougebasketclub.example"),
    title: {
      default: current.meta.homeTitle,
      template: `%s | ${clubConfig.name}`,
    },
    description: current.meta.homeDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        es: "/es",
        "x-default": "/fr",
      },
    },
    openGraph: {
      title: current.meta.homeTitle,
      description: current.meta.homeDescription,
      type: "website",
      locale: locale === "fr" ? "fr_CH" : "es_ES",
      alternateLocale: [alternate === "fr" ? "fr_CH" : "es_ES"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`${roboto.variable} ${robotoCondensed.variable} ${oswald.variable} h-full`}
    >
      <body className="min-h-full bg-[var(--color-cream)] text-[var(--color-ink)] font-body">
        {children}
      </body>
    </html>
  );
}
