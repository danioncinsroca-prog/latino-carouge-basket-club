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
import { SiteMobileMenu } from "./site-mobile-menu";

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
      <div className="flex w-full flex-col px-3 py-3 sm:px-5 sm:py-4 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <Link
            href={getHomePath(locale)}
            className="flex shrink-0 items-center gap-2 sm:gap-3"
            aria-label={clubConfig.name}
          >
            <Image
              src="/latino-carouge-logo.png"
              alt={clubConfig.name}
              width={56}
              height={56}
              priority
              className="sm:h-[76px] sm:w-[76px]"
            />
            <div className="space-y-0.5">
              <div className="font-condensed text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)] sm:text-[0.72rem]">
                {content.header.badge}
              </div>
              <div className="font-display text-lg uppercase leading-none whitespace-nowrap sm:text-2xl lg:text-3xl">
                {clubConfig.shortName}
              </div>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <nav className="hidden items-center gap-x-8 2xl:flex">
              {content.nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="top-nav-link px-1 text-sm sm:px-2 sm:text-base"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="inline-flex shrink-0 gap-1 rounded-lg bg-white/5 p-1">
              {localeLinks.map((option) =>
                option.code === locale ? (
                  <span
                    key={option.code}
                    className="rounded-md bg-[var(--color-gold)] px-2 py-1.5 font-condensed text-[0.65rem] font-bold uppercase tracking-[0.24em] text-[var(--color-ink)] sm:px-4 sm:py-2 sm:text-xs"
                  >
                    {option.code.toUpperCase()}
                  </span>
                ) : (
                  <Link
                    key={option.code}
                    href={option.href}
                    className="rounded-md px-2 py-1.5 font-condensed text-[0.65rem] font-bold uppercase tracking-[0.24em] text-white/60 transition hover:bg-white/10 sm:px-4 sm:py-2 sm:text-xs"
                  >
                    {option.code.toUpperCase()}
                  </Link>
                ),
              )}
            </div>

            {/* Mobile menu button */}
            <div className="2xl:hidden">
              <SiteMobileMenu items={content.nav} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
