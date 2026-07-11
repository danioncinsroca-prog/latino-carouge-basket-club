"use client";

import { useActionState } from "react";
import { submitContactForm } from "@/app/[locale]/contact/actions";
import type { Locale } from "@/lib/site";

type RecruitmentFormContent = {
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
  categories: Array<{
    code: string;
    label: string;
  }>;
  formCtaSecondary: string;
};

const inputClassName =
  "mt-2 min-h-13 w-full rounded-lg border border-[var(--color-control-border)] bg-[var(--color-control)] px-4 py-3 text-base text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)] hover:border-[var(--color-ink)]/55 focus:border-[var(--color-ink)] focus:ring-4 focus:ring-[var(--color-gold)]/25 disabled:cursor-not-allowed disabled:opacity-60";

export function RecruitmentForm({
  content,
  locale,
}: {
  content: RecruitmentFormContent;
  locale: Locale;
}) {
  const [state, formAction, isPending] = useActionState(submitContactForm, {
    success: false,
    error: undefined,
  });

  return (
    <div>
      {state.success && (
        <div className="mt-6 rounded-lg border border-[var(--color-gold)] bg-[var(--color-gold-soft)] p-6">
          <h4 className="font-display text-2xl uppercase leading-none text-[var(--color-ink)]">
            {content.form.successTitle}
          </h4>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            {content.form.successMessage}
          </p>
        </div>
      )}

      {state.error && !state.success && (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-6">
          <p className="text-sm font-semibold text-red-800">
            {content.form.errorMessage}
          </p>
        </div>
      )}

      {!state.success && (
        <form action={formAction} className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="recruitment-form-name" className="block text-sm font-semibold text-[var(--color-ink)]">
                {content.form.name}
              </label>
              <input
                id="recruitment-form-name"
                type="text"
                autoComplete="name"
                required
                disabled={isPending}
                className={inputClassName}
                name="name"
              />
            </div>
            <div>
              <label htmlFor="recruitment-form-email" className="block text-sm font-semibold text-[var(--color-ink)]">
                {content.form.email}
              </label>
              <input
                id="recruitment-form-email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                className={inputClassName}
                name="email"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="recruitment-form-phone" className="block text-sm font-semibold text-[var(--color-ink)]">
                {content.form.phone}
              </label>
              <input
                id="recruitment-form-phone"
                type="tel"
                autoComplete="tel"
                disabled={isPending}
                className={inputClassName}
                name="phone"
              />
            </div>
            <div>
              <label htmlFor="recruitment-form-category" className="block text-sm font-semibold text-[var(--color-ink)]">
                {content.form.category}
              </label>
              <select
                id="recruitment-form-category"
                name="position"
                required
                disabled={isPending}
                className={`${inputClassName} appearance-auto`}
                defaultValue=""
              >
                <option value="" disabled>
                  {content.form.categoryPlaceholder}
                </option>
                {content.categories.map((cat) => (
                  <option key={cat.code} value={cat.code}>
                    {cat.code} · {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="recruitment-form-message" className="block text-sm font-semibold text-[var(--color-ink)]">
              {content.form.message}
            </label>
            <p id="recruitment-form-message-help" className="mt-1 text-xs leading-relaxed text-[var(--color-muted)]">
              {content.form.messageHelp}
            </p>
            <textarea
              id="recruitment-form-message"
              name="message"
              rows={4}
              aria-describedby="recruitment-form-message-help"
              disabled={isPending}
              className={`${inputClassName} min-h-28 resize-y`}
            />
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-[var(--color-control)] p-4">
            <input
              id="recruitment-form-consent"
              type="checkbox"
              required
              disabled={isPending}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
              name="consent"
            />
            <label htmlFor="recruitment-form-consent" className="text-xs leading-relaxed text-[var(--color-muted)] sm:text-sm">
              {content.form.consent}
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="button-base button-gold min-h-13 w-full px-5 py-4 text-sm disabled:cursor-not-allowed disabled:opacity-65 sm:text-base"
            >
              {isPending
                ? locale === "fr"
                  ? "En cours..."
                  : "Enviando..."
                : content.form.submit}
            </button>
            <p className="mt-3 text-center text-xs font-medium text-[var(--color-muted)]">
              {content.formCtaSecondary}
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
