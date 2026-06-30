import type { MetadataRoute } from "next";
import { getSectionPath, locales, sectionKeys } from "@/lib/site";

const baseUrl = "https://latinocarougebasketclub.example";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...locales.map((locale) => ({
      url: `${baseUrl}/${locale}`,
      changeFrequency: "weekly" as const,
      priority: 1,
    })),
    ...locales.flatMap((locale) =>
      sectionKeys.map((sectionKey) => ({
        url: `${baseUrl}${getSectionPath(locale, sectionKey)}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ),
  ];
}
