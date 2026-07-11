import Link from "next/link";
import {
  clubConfig,
  getHomePath,
  getSectionPath,
  siteContent,
  type Locale,
} from "@/lib/site";

const socialIcons: Record<string, React.FC<{ className?: string }>> = {
  Facebook: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Instagram: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  ),
  YouTube: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="var(--color-ink)" />
    </svg>
  ),
  Twitter: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  ),
  X: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
};

type SiteFooterProps = {
  locale: Locale;
};

export function SiteFooter({ locale }: SiteFooterProps) {
  const content = siteContent[locale];
  const ticketHref =
    clubConfig.externalLinks.ticketingUrl ?? getSectionPath(locale, "matches");

  return (
    <footer
      id="footer"
      className="border-t border-[var(--color-line)] bg-[var(--color-ink)] text-[var(--color-cream)]"
    >
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:gap-8 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <div className="font-display text-4xl uppercase leading-none">
            {clubConfig.name}
          </div>
          <p className="max-w-xl text-sm text-[var(--color-cream)]/78">
            {content.footer.copy}
          </p>
        </div>

        <div className="space-y-4">
          <div className="font-condensed text-[0.72rem] font-bold uppercase tracking-[0.26em] text-[var(--color-gold)]">
            {content.footer.quickLinksTitle}
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href={getHomePath(locale)}
              className="border border-[var(--color-cream)]/30 px-3 py-2 font-condensed text-xs font-bold uppercase tracking-[0.22em] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
            >
              {content.footer.homeLabel}
            </Link>
            <Link
              href={ticketHref}
              className="border border-[var(--color-cream)]/30 px-3 py-2 font-condensed text-xs font-bold uppercase tracking-[0.22em] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
            >
              {content.footer.ticketingLabel}
            </Link>
            <Link
              href={getSectionPath(locale, "team")}
              className="border border-[var(--color-cream)]/30 px-3 py-2 font-condensed text-xs font-bold uppercase tracking-[0.22em] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
            >
              {content.sectionLinks.team}
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="font-condensed text-[0.72rem] font-bold uppercase tracking-[0.26em] text-[var(--color-gold)]">
            {content.footer.contactTitle}
          </div>
          <div className="space-y-2 text-sm text-[var(--color-cream)]/82">
            <p className="text-[var(--color-cream)]/90 font-semibold">
              <a href={`tel:${content.footer.contactPhone}`} className="hover:text-[var(--color-gold)] transition-colors">
                {content.footer.contactPhone}
              </a>
            </p>
            <p className="text-[var(--color-cream)]/90 font-semibold">
              <a href={`mailto:${content.footer.contactEmail}`} className="hover:text-[var(--color-gold)] transition-colors">
                {content.footer.contactEmail}
              </a>
            </p>
            <p className="text-xs">{content.footer.contactStatus}</p>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            {clubConfig.externalLinks.socialLinks.map((social) => {
              const Icon = socialIcons[social.label];
              if (!Icon) return null;
              return social.url ? (
                <Link
                  key={social.label}
                  href={social.url}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-gold)] text-[var(--color-ink)] transition-transform duration-150 hover:scale-110 hover:brightness-90"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ) : (
                <span
                  key={social.label}
                  title={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-gold)]/30 text-[var(--color-gold)]/50 cursor-not-allowed"
                >
                  <Icon className="h-5 w-5" />
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
