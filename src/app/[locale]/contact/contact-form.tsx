"use client";

import { useActionState } from "react";
import { submitContactForm } from "./actions";
import type { Locale } from "@/lib/site";

const positions = [
  { value: "meneur", label: { fr: "Meneur", es: "Base" } },
  { value: "arriere", label: { fr: "Arrière", es: "Escolta" } },
  { value: "ailier", label: { fr: "Ailier", es: "Alero" } },
  { value: "ailier-fort", label: { fr: "Ailier fort", es: "Ala-pívot" } },
  { value: "pivot", label: { fr: "Pivot", es: "Pívot" } },
  { value: "autre", label: { fr: "Autre", es: "Otro" } },
];

type ContactPageContent = {
  badge: string;
  title: string;
  intro: string;
  form: {
    name: string;
    email: string;
    phone: string;
    position: string;
    message: string;
    consent: string;
    submit: string;
    successTitle: string;
    successMessage: string;
    errorMessage: string;
  };
};

export function ContactForm({
  content,
  locale,
}: {
  content: ContactPageContent;
  locale: Locale;
}) {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    { success: false, error: undefined }
  );

  return (
    <div>
      {/* Success state */}
      {state.success && (
        <div className="mb-8 rounded-lg border border-[var(--color-gold)] bg-[var(--color-panel)] p-6">
          <h3 className="font-display text-2xl uppercase leading-none text-[var(--color-ink)]">
            {content.form.successTitle}
          </h3>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            {content.form.successMessage}
          </p>
        </div>
      )}

      {/* Error state */}
      {state.error && !state.success && (
        <div className="mb-8 rounded-lg border border-red-300 bg-red-50 p-6">
          <p className="text-sm font-semibold text-red-800">
            {content.form.errorMessage}
          </p>
        </div>
      )}

      {/* Form */}
      {!state.success && (
        <form action={formAction} className="space-y-6">
          {/* Name field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-[var(--color-ink)]"
            >
              {content.form.name}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              disabled={isPending}
              className="mt-2 w-full rounded border border-[var(--color-line)] bg-white px-4 py-3 text-[var(--color-ink)] placeholder-[var(--color-muted)]/50 focus:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20 disabled:bg-[var(--color-surface)]"
              placeholder={content.form.name}
            />
          </div>

          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[var(--color-ink)]"
            >
              {content.form.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              disabled={isPending}
              className="mt-2 w-full rounded border border-[var(--color-line)] bg-white px-4 py-3 text-[var(--color-ink)] placeholder-[var(--color-muted)]/50 focus:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20 disabled:bg-[var(--color-surface)]"
              placeholder={content.form.email}
            />
          </div>

          {/* Phone field */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-[var(--color-ink)]"
            >
              {content.form.phone}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              disabled={isPending}
              className="mt-2 w-full rounded border border-[var(--color-line)] bg-white px-4 py-3 text-[var(--color-ink)] placeholder-[var(--color-muted)]/50 focus:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20 disabled:bg-[var(--color-surface)]"
              placeholder={content.form.phone}
            />
          </div>

          {/* Position field */}
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-semibold text-[var(--color-ink)]"
            >
              {content.form.position}
            </label>
            <select
              id="position"
              name="position"
              disabled={isPending}
              className="mt-2 w-full rounded border border-[var(--color-line)] bg-white px-4 py-3 text-[var(--color-ink)] focus:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20 disabled:bg-[var(--color-surface)]"
            >
              <option value="">
                {locale === "fr"
                  ? "Sélectionne une position"
                  : "Selecciona una posición"}
              </option>
              {positions.map((pos) => (
                <option key={pos.value} value={pos.value}>
                  {pos.label[locale]}
                </option>
              ))}
            </select>
          </div>

          {/* Message field */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-[var(--color-ink)]"
            >
              {content.form.message}
            </label>
            <textarea
              id="message"
              name="message"
              required
              disabled={isPending}
              rows={6}
              className="mt-2 w-full rounded border border-[var(--color-line)] bg-white px-4 py-3 text-[var(--color-ink)] placeholder-[var(--color-muted)]/50 focus:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20 disabled:bg-[var(--color-surface)]"
              placeholder={content.form.message}
            />
          </div>

          {/* Consent checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              required
              disabled={isPending}
              className="mt-1 h-4 w-4 rounded border border-[var(--color-line)] bg-white accent-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 disabled:bg-[var(--color-surface)]"
            />
            <label
              htmlFor="consent"
              className="text-sm text-[var(--color-ink)]"
            >
              {content.form.consent}
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending}
            className="button-base button-gold w-full text-base py-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending
              ? locale === "fr"
                ? "En cours..."
                : "Enviando..."
              : content.form.submit}
          </button>
        </form>
      )}
    </div>
  );
}
