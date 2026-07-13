"use client";

import { useState } from "react";
import { RecruitmentForm } from "@/components/site/recruitment-form";
import type { Locale } from "@/lib/site";

type RecruitmentSectionContent = {
  kicker: string;
  title: string;
  intro: string;
  ctaButton: string;
  ctaSecondary: string;
  whyJoinKicker: string;
  bullets: string[];
  categoriesKicker: string;
  categoriesIntro: string;
  categoriesAvailable: string;
  categories: Array<{
    code: string;
    label: string;
  }>;
  formBadge: string;
  formTitle: string;
  formIntro: string;
  formCtaSecondary: string;
  form: {
    name: string;
    email: string;
    phone: string;
    category: string;
    categoryPlaceholder: string;
    message: string;
    messageHelp: string;
    consent: string;
    submit: string;
    successTitle: string;
    successMessage: string;
    errorMessage: string;
  };
};

export function RecruitmentSection({
  content,
  locale,
}: {
  content: RecruitmentSectionContent;
  locale: Locale;
}) {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(25rem,5fr)] lg:items-start lg:gap-12">
      {/* Left column: Content */}
      <div>
        <div className="max-w-2xl">
          <div className="meta-kicker text-[var(--color-gold-deep)]">
            {content.kicker}
          </div>
          <h2 className="mt-5 font-display text-5xl uppercase leading-[0.9] text-[var(--color-ink)] sm:text-6xl lg:text-7xl">
            {content.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            {content.intro}
          </p>
          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
            <a
              href="#recruitment-form"
              className="button-base button-gold min-h-13 w-full px-6 py-4 text-sm sm:w-auto sm:text-base"
            >
              {content.ctaButton}
            </a>
            <p className="max-w-xs text-sm font-semibold leading-relaxed text-[var(--color-ink)]">
              {content.ctaSecondary}
            </p>
          </div>
        </div>

        {/* Why Join Us section */}
        <div className="mt-10 border-t border-[var(--color-border-soft)] pt-8">
          <h3 className="font-condensed text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            {content.whyJoinKicker}
          </h3>
          <ul className="mt-5 grid gap-x-7 gap-y-4 sm:grid-cols-2">
            {content.bullets.map((bullet, idx) => (
              <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-[var(--color-ink)]">
                <span className="font-condensed text-xs font-bold tracking-[0.12em] text-[var(--color-gold-deep)]">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories section */}
        <fieldset id="recruitment-categories" className="mt-10">
          <legend className="w-full">
            <span className="block font-condensed text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {content.categoriesKicker}
            </span>
            <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">
              {content.categoriesIntro}
            </span>
          </legend>
          <div className="mt-5 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-3">
            {content.categories.map((cat) => (
              <label
                key={cat.code}
                className="group relative flex min-h-32 cursor-pointer flex-col justify-between rounded-xl p-4 transition duration-200 focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-[var(--color-gold)] bg-white text-[var(--color-ink)] shadow-[0_10px_26px_rgba(16,33,58,0.06)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(16,33,58,0.11)] has-[:checked]:bg-[var(--color-ink)] has-[:checked]:shadow-[0_16px_34px_rgba(16,33,58,0.18)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-3xl uppercase leading-none text-[var(--color-ink)] group-has-[:checked]:text-[var(--color-gold)]">
                    {cat.code}
                  </span>
                  <input
                    type="radio"
                    className="h-4 w-4 shrink-0 accent-[var(--color-gold)]"
                    name="recruitment-category"
                    value={cat.code}
                    checked={selectedCategory === cat.code}
                    onChange={() => setSelectedCategory(cat.code)}
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-snug text-[var(--color-ink)] group-has-[:checked]:text-white">
                    {cat.label}
                  </div>
                  <div className="mt-2 font-condensed text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[var(--color-gold-deep)] group-has-[:checked]:text-[var(--color-gold)]">
                    {content.categoriesAvailable}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Right column: Form card */}
      <div
        id="recruitment-form"
        className="scroll-mt-16 rounded-2xl bg-white p-5 shadow-[0_22px_60px_rgba(16,33,58,0.10)] sm:p-7 lg:p-8"
      >
        <div className="border-b border-[var(--color-border-soft)] pb-6">
          <div className="inline-flex rounded-full bg-[var(--color-gold-soft)] px-3 py-1.5 font-condensed text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--color-gold-deep)]">
            {content.formBadge}
          </div>
          <h3 className="mt-4 font-display text-3xl uppercase leading-none text-[var(--color-ink)] sm:text-4xl">
            {content.formTitle}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
            {content.formIntro}
          </p>
        </div>

        <RecruitmentForm
          content={content}
          locale={locale}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>
    </div>
  );
}
