import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionPage } from "@/components/site/section-page";
import {
  buildSectionMetadata,
  getSectionKeyFromSlug,
  getSectionPath,
  isLocale,
  locales,
  sectionKeys,
} from "@/lib/site";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    sectionKeys.map((sectionKey) => ({
      locale,
      slug: getSectionPath(locale, sectionKey).split("/").pop(),
    })),
  );
}

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const sectionKey = getSectionKeyFromSlug(locale, slug);

  if (!sectionKey) {
    return {};
  }

  return buildSectionMetadata(locale, sectionKey);
}

export default async function LocalizedSectionPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const sectionKey = getSectionKeyFromSlug(locale, slug);

  if (!sectionKey) {
    notFound();
  }

  return <SectionPage locale={locale} sectionKey={sectionKey} />;
}
