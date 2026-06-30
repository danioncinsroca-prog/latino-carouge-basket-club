import Link from "next/link";
import {
  clubConfig,
  getHomePath,
  getSectionPath,
  siteContent,
  type Locale,
} from "@/lib/site";

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
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <div className="font-condensed text-[0.72rem] font-bold uppercase tracking-[0.26em] text-[var(--color-gold)]">
            {content.footer.kicker}
          </div>
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
            {content.footer.statusTitle}
          </div>
          <div className="space-y-3 text-sm text-[var(--color-cream)]/82">
            <p>{content.footer.contactStatus}</p>
            <p>{content.footer.ticketingStatus}</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {clubConfig.externalLinks.socialLinks.map((social) =>
              social.url ? (
                <Link
                  key={social.label}
                  href={social.url}
                  className="border border-[var(--color-cream)]/30 px-3 py-2 font-condensed text-xs font-bold uppercase tracking-[0.22em] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                >
                  {social.label}
                </Link>
              ) : (
                <span
                  key={social.label}
                  className="border border-[var(--color-cream)]/20 px-3 py-2 font-condensed text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-cream)]/48"
                >
                  {social.label}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
