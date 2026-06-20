"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  publishingInquirySchema,
  publishingInquiryDefaults,
  type PublishingInquiry,
} from "@/lib/validation";
import { projectRoles } from "@/lib/content";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * The publishing inquiry form. Client island: the ONLY "use client" boundary in
 * the form path. It validates with the SAME zod schema the server uses
 * (lib/validation.ts) via the RHF resolver — but the server re-validates regardless;
 * the client check is UX, not trust.
 *
 * No secrets here. The submit POSTs to /api/publishing; any mail/API key lives
 * server-side only, never NEXT_PUBLIC_.
 */
export function PublishingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PublishingInquiry>({
    resolver: zodResolver(publishingInquirySchema),
    defaultValues: publishingInquiryDefaults,
    mode: "onBlur",
  });

  async function onSubmit(values: PublishingInquiry) {
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/publishing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Something went wrong. Try again.");
      }
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Unexpected error.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="ej-card p-10 text-center"
      >
        <p className="font-display text-3xl font-light text-ej-gold-bright">
          Received.
        </p>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-ej-cream">
          Your inquiry is in. Emmond and the house review every note personally —
          expect a reply to the email you left.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="ej-link mt-8"
        >
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* Honeypot — visually hidden, off the tab order. Bots fill it; humans don't. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company-website">Leave this field empty</label>
        <input
          id="company-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("honeypot")}
        />
      </div>

      <Field label="Name" error={errors.name?.message} htmlFor="name">
        <input
          id="name"
          type="text"
          autoComplete="name"
          className="ej-input"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
      </Field>

      <Field label="Email" error={errors.email?.message} htmlFor="email">
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="ej-input"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </Field>

      <Field
        label="Project / role"
        error={errors.role?.message}
        htmlFor="role"
      >
        <select
          id="role"
          className="ej-input"
          aria-invalid={!!errors.role}
          {...register("role")}
        >
          {projectRoles.map((r) => (
            <option key={r} value={r} className="bg-ej-ink text-ej-bone">
              {r}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Links (optional)"
        error={errors.links?.message}
        htmlFor="links"
        hint="Streaming, socials, a folder — anything that helps."
      >
        <input
          id="links"
          type="text"
          inputMode="url"
          className="ej-input"
          placeholder="https://"
          aria-invalid={!!errors.links}
          {...register("links")}
        />
      </Field>

      <Field label="Message" error={errors.message?.message} htmlFor="message">
        <textarea
          id="message"
          rows={5}
          className="ej-input resize-y"
          placeholder="Tell Emmond what you're working on."
          aria-invalid={!!errors.message}
          {...register("message")}
        />
      </Field>

      {serverError ? (
        <p role="alert" className="text-sm text-ej-rose">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || status === "submitting"}
        className="ej-cta w-full justify-center py-4 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="ej-label mb-3 block !text-ej-cream"
      >
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="mt-2 text-xs text-ej-ash">{hint}</p>
      ) : null}
      {error ? (
        <p className="mt-2 text-xs text-ej-rose" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
