import Image from "next/image";
import Link from "next/link";
import {
  clubConfig,
  getHomePath,
  getSectionPath,
  locales,
  siteContent,
  type Locale,
  type SectionKey,
} from "@/lib/site";

type SiteHeaderProps = {
  locale: Locale;
  currentSection?: SectionKey;
};

export function SiteHeader({ locale, currentSection }: SiteHeaderProps) {
  const content = siteContent[locale];
  const localeLinks = locales.map((targetLocale) => ({
    code: targetLocale,
    href: currentSection
      ? getSectionPath(targetLocale, currentSection)
      : getHomePath(targetLocale),
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a2c52] text-[var(--color-cream)]">
      <div className="flex w-full flex-col gap-4 px-3 py-4 sm:px-5 lg:px-8 xl:px-12">
        <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center">
          <Link
            href={getHomePath(locale)}
            className="flex items-center gap-4 xl:justify-self-start"
            aria-label={clubConfig.name}
          >
            <Image
              src="/latino-carouge-logo.png"
              alt={clubConfig.name}
              width={76}
              height={76}
              priority
            />
            <div className="space-y-1">
              <div className="font-condensed text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                {content.header.badge}
              </div>
              <div className="font-display text-2xl uppercase leading-none sm:text-3xl">
                {clubConfig.shortName}
              </div>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 xl:justify-self-center xl:gap-x-8">
            {content.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="top-nav-link px-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:justify-self-end">
            <div className="inline-flex border border-white/30">
              {localeLinks.map((option) =>
                option.code === locale ? (
                  <span
                    key={option.code}
                    className="bg-[var(--color-gold)] px-4 py-2 font-condensed text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-ink)]"
                  >
                    {option.code.toUpperCase()}
                  </span>
                ) : (
                  <Link
                    key={option.code}
                    href={option.href}
                    className="px-4 py-2 font-condensed text-xs font-bold uppercase tracking-[0.24em] text-white/60 hover:bg-white/10"
                  >
                    {option.code.toUpperCase()}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
