import Image from "next/image";
import { type Locale, type MediaAsset, type NewsItem } from "@/lib/site";

type NewsShowcaseProps = {
  items: NewsItem[];
  locale: Locale;
  fallbackImage?: MediaAsset;
};

function getNewsBadge(dateLabel: string): string {
  return dateLabel.toUpperCase();
}

function NewsCard({
  item,
  badge,
  image,
  size = "compact",
}: {
  item: NewsItem;
  badge: string;
  image?: MediaAsset;
  size?: "feature" | "compact";
}) {
  const isFeature = size === "feature";

  return (
    <article
      className={`group relative overflow-hidden rounded-xl bg-[var(--color-ink)] shadow-[0_20px_40px_rgba(12,18,28,0.14)] ${
        isFeature ? "min-h-[25rem] sm:min-h-[29rem]" : "min-h-[12rem] sm:min-h-[13.75rem]"
      }`}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={isFeature ? "(min-width: 1024px) 42vw, 100vw" : "(min-width: 1024px) 28vw, 100vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ objectPosition: image.position ?? "center center" }}
        />
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,20,0.08)_0%,rgba(7,12,20,0.14)_26%,rgba(7,12,20,0.82)_100%)]" />

      <div className="relative z-10 flex h-full flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <span className="inline-flex bg-[var(--color-gold)] px-2 py-1 font-condensed text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[var(--color-ink)]">
            {badge}
          </span>
        </div>

        <div className="mt-auto">
          <h3
            className={`max-w-[16ch] font-display uppercase leading-[0.94] text-[var(--color-cream)] ${
              isFeature ? "text-[2.2rem] sm:text-[2.9rem]" : "text-[1.55rem] sm:text-[1.9rem]"
            }`}
          >
            {item.title}
          </h3>
          <p
            className={`mt-3 max-w-[36ch] text-[var(--color-cream)]/78 ${
              isFeature ? "text-sm sm:text-[0.96rem]" : "text-[0.82rem] sm:text-[0.9rem]"
            }`}
          >
            {item.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-[3px] w-10 bg-[var(--color-gold)]" />
            <span className="h-[3px] w-8 bg-[var(--color-cream)]/28" />
          </div>
        </div>
      </div>
    </article>
  );
}

export function NewsShowcase({
  items,
  locale,
  fallbackImage,
}: NewsShowcaseProps) {
  const [lead, ...rest] = items;
  const stackedItems = rest.slice(0, 2);

  if (!lead) {
    return null;
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-[1.12fr_0.88fr]">
      <NewsCard
        item={lead}
        badge={getNewsBadge(lead.dateLabel)}
        image={lead.image ?? fallbackImage}
        size="feature"
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
        {stackedItems.map((item) => (
          <NewsCard
            key={`${locale}-${item.title}`}
            item={item}
            badge={getNewsBadge(item.dateLabel)}
            image={item.image ?? fallbackImage}
          />
        ))}
      </div>
    </div>
  );
}
