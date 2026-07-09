import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import {
  isLocale,
  locales,
  siteContent,
  getHomePath,
} from "@/lib/site";
import { ContactForm } from "./contact-form";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const content = siteContent[locale];
  const title = `${content.contactPage.title} | ${locale === "fr" ? "LATINO CAROUGE BASKET CLUB" : "LATINO CAROUGE BASKET CLUB"}`;

  return {
    title,
    description: content.contactPage.intro,
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const content = siteContent[locale];

  return (
    <div className="min-h-screen text-[var(--color-ink)]">
      <SiteHeader locale={locale} />

      <main>
        {/* Hero section */}
        <section className="border-b border-[var(--color-line)] bg-[var(--color-panel)] py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <div className="font-condensed text-[0.72rem] font-bold uppercase tracking-[0.26em] text-[var(--color-muted)]">
                {content.contactPage.badge}
              </div>
              <h1 className="font-display text-4xl uppercase leading-none sm:text-5xl">
                {content.contactPage.title}
              </h1>
              <p className="max-w-2xl text-sm text-[var(--color-muted)] sm:text-base">
                {content.contactPage.intro}
              </p>
            </div>
          </div>
        </section>

        {/* Form section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <ContactForm content={content.contactPage} locale={locale} />

            {/* Back link */}
            <div className="mt-8 text-center">
              <Link
                href={getHomePath(locale)}
                className="text-sm font-condensed uppercase tracking-[0.12em] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
              >
                ← {locale === "fr" ? "Retour à la home" : "Volver a la home"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
