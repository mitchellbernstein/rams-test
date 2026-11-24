"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";

type Account = { name: string; email: string; password: string; updates: boolean };
type Errors = Partial<Record<"name" | "email" | "password", string>>;

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

function validate(a: Account): Errors {
  const errors: Errors = {};
  if (!a.name.trim()) errors.name = "Enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(normalizeEmail(a.email))) errors.email = "Enter an email address like name@example.com.";
  if (a.password.length < 10) errors.password = "Use at least 10 characters.";
  return errors;
}

function safeReturnPath(raw: string | null) {
  return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/projects";
}

const inputClass = "h-10 w-full rounded-md border border-ink/15 bg-surface px-3 text-md text-ink";

export default function SignUp() {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = safeReturnPath(params.get("next"));

  const [step, setStep] = useState<"account" | "verify">("account");
  const [account, setAccount] = useState<Account>({ name: "", email: "", password: "", updates: false });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);

  function set<K extends keyof Account>(key: K, value: Account[K]) {
    setAccount((a) => ({ ...a, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function blurValidate(key: keyof Errors) {
    const found = validate(account);
    setErrors((e) => ({ ...e, [key]: found[key] }));
  }

  async function createAccount(e: React.SyntheticEvent) {
    e.preventDefault();
    const found = validate(account);
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('#sign-up [aria-invalid="true"]')?.focus());
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...account, email: normalizeEmail(account.email) }),
      });
      if (res.status === 422) {
        const body: { fieldErrors?: Errors } = await res.json();
        setErrors(body.fieldErrors ?? {});
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      setStep("verify");
    } catch {
      setFormError("We couldn't create your account. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  function setDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((d) => d.map((v, i) => (i === index ? digit : v)));
    setCodeError(null);
    if (digit && index < 5) digitRefs.current[index + 1]?.focus();
  }

  function pasteCode(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    setDigits(Array.from({ length: 6 }, (_, i) => pasted[i] ?? ""));
    digitRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function verify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) {
      setCodeError("Enter all 6 digits from the email.");
      digitRefs.current[digits.findIndex((d) => !d)]?.focus();
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch("/api/sign-up/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizeEmail(account.email), code }),
      });
      if (res.status === 400) {
        setCodeError("That code didn't match. Check the latest email and try again.");
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      router.replace(returnTo);
    } catch {
      setCodeError("We couldn't check the code. Check your connection and try again.");
    } finally {
      setVerifying(false);
    }
  }

  if (step === "verify") {
    return (
      <main className="mx-auto max-w-sm px-4 py-16 text-ink">
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="mt-2 text-md text-ink-muted">
          We sent a 6-digit code to {normalizeEmail(account.email)}.
        </p>
        <form onSubmit={verify} noValidate className="mt-8 flex flex-col gap-4">
          <fieldset>
            <legend className="text-sm font-medium">Verification code</legend>
            <div className="mt-2 flex gap-2">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    digitRefs.current[i] = el;
                  }}
                  aria-label={`Digit ${i + 1}`}
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={d}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onPaste={pasteCode}
                  className="h-12 w-11 rounded-md border border-ink/15 bg-surface text-center text-lg"
                />
              ))}
            </div>
          </fieldset>
          {codeError && <p role="alert" className="text-sm text-red-700">{codeError}</p>}
          <Button type="submit" disabled={verifying}>
            {verifying ? "Verifying…" : "Verify email"}
          </Button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-16 text-ink">
      <h1 className="text-xl font-semibold">Create your account</h1>
      <form id="sign-up" onSubmit={createAccount} noValidate className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <input
            id="name"
            autoComplete="name"
            value={account.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => blurValidate("name")}
            aria-invalid={errors.name ? true : undefined}
            className={inputClass}
          />
          {errors.name && <p className="text-sm text-red-700">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="none"
            value={account.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => blurValidate("email")}
            aria-invalid={errors.email ? true : undefined}
            className={inputClass}
          />
          {errors.email && <p className="text-sm text-red-700">{errors.email}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={account.password}
              onChange={(e) => set("password", e.target.value)}
              onBlur={() => blurValidate("password")}
              aria-invalid={errors.password ? true : undefined}
              className={`${inputClass} pr-20`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 px-3 text-sm text-ink-muted hover:text-ink"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password ? (
            <p className="text-sm text-red-700">{errors.password}</p>
          ) : (
            <p className="text-sm text-ink-muted">At least 10 characters.</p>
          )}
        </div>

        <label className="flex items-start gap-3 py-1 text-sm">
          <input
            type="checkbox"
            checked={account.updates}
            onChange={(e) => set("updates", e.target.checked)}
            className="mt-0.5 size-4"
          />
          <span>Email me product updates (optional)</span>
        </label>

        {formError && <p role="alert" className="text-sm text-red-700">{formError}</p>}

        <Button type="submit" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </main>
  );
}
