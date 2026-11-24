"use client";

import { useEffect, useRef, useState, type InputHTMLAttributes } from "react";
import { Button } from "@/components/Button";

type Values = { name: string; username: string; email: string; phone: string; bio: string };
type Errors = Partial<Record<keyof Values, string>>;

const saved: Values = {
  name: "Ana Lima",
  username: "analima",
  email: "ana@example.com",
  phone: "",
  bio: "",
};

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (!v.name.trim()) errors.name = "Enter your full name.";
  if (!/^[a-z0-9_]{3,20}$/.test(v.username.trim().toLowerCase()))
    errors.username = "Use 3 to 20 letters, numbers or underscores.";
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) errors.email = "Enter an email address like name@example.com.";
  if (v.phone.trim() && v.phone.replace(/[\s()+-]/g, "").length < 7) errors.phone = "Enter a phone number with at least 7 digits.";
  return errors;
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: keyof Values;
  error?: string;
  optional?: boolean;
};

function Field({ label, name, error, optional, ...input }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className="h-10 rounded-md border border-ink/15 bg-surface px-3 text-md text-ink"
        {...input}
      />
    </div>
  );
}

export default function ProfileSettings() {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(saved);
  const [lastSaved, setLastSaved] = useState<Values>(saved);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const resendInFlight = useRef(false);

  const dirty = JSON.stringify(values) !== JSON.stringify(lastSaved);

  function update(name: keyof Values, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  function focusFirstError() {
    requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setStatus(null);
    if (Object.keys(found).length > 0) {
      focusFirstError();
      return;
    }
    setValues(lastSaved);
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, email: values.email.trim().toLowerCase() }),
      });
      if (res.status === 422) {
        const body: { fieldErrors?: Errors } = await res.json();
        setErrors(body.fieldErrors ?? {});
        focusFirstError();
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      setLastSaved(values);
      setStatus({ tone: "success", text: "Profile saved." });
    } catch {
      setStatus({ tone: "error", text: "We couldn't save your profile. Check your connection and try again." });
    } finally {
      setSaving(false);
    }
  }

  async function resendVerification() {
    if (resendInFlight.current) return;
    resendInFlight.current = true;
    setResending(true);
    setResendStatus(null);
    try {
      const res = await fetch("/api/profile/verify-email", { method: "POST" });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setResendStatus("We couldn't send the email. Try again in a minute.");
    } finally {
      resendInFlight.current = false;
      setResending(false);
    }
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <main className="mx-auto max-w-xl px-4 py-10 text-ink">
      <h1 className="text-xl font-semibold">Profile</h1>
      <p className="mt-1 text-md text-ink-muted">This information appears on your public profile.</p>

      <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-5">
        {errorCount > 0 && (
          <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {Object.values(errors).filter(Boolean).join(" ")}
          </div>
        )}

        <Field
          label="Full name"
          name="name"
          autoComplete="name"
          value={values.name}
          error={errors.name}
          onChange={(e) => update("name", e.target.value)}
        />
        <Field
          label="Username"
          name="username"
          autoComplete="username"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="none"
          value={values.username}
          error={errors.username}
          onChange={(e) => update("username", e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <Field
            label="Email"
            name="email"
            type="email"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="none"
            value={values.email}
            error={errors.email}
            onChange={(e) => update("email", e.target.value)}
          />
          <div className="flex items-center gap-3">
            <Button type="button" variant="secondary" onClick={resendVerification}>
              Resend verification email
            </Button>
            {resendStatus && <p role="status" className="text-sm text-ink-muted">{resendStatus}</p>}
          </div>
        </div>
        <Field
          label="Phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          optional
          value={values.phone}
          error={errors.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="bio" className="text-sm font-medium text-ink">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            className="rounded-md border border-ink/15 bg-surface px-3 py-2 text-sm text-ink"
            value={values.bio}
            onChange={(e) => update("bio", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit">
            {saving ? "Saving…" : "Save profile"}
          </Button>
          {status && (
            <p role={status.tone === "error" ? "alert" : "status"} className={status.tone === "error" ? "text-sm text-red-700" : "text-sm text-success"}>
              {status.text}
            </p>
          )}
        </div>
      </form>
    </main>
  );
}
