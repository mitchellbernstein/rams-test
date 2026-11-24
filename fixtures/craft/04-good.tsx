"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/Button";

type Profile = { firstName: string; lastName: string; email: string };

const PREFS_KEY = "settings-prefs";
const SAVED_NOTICE_MS = 3000;

function readCompactPref(raw: string | null): boolean {
  if (raw === null) return false;
  try {
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null && "compact" in parsed && parsed.compact === true;
  } catch {
    return false;
  }
}

function FieldLabel({ htmlFor, text }: { htmlFor: string; text: string }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {text}
    </label>
  );
}

interface SettingsFormProps {
  initial: Profile;
  onSave: (profile: Profile) => Promise<void>;
  onDeleteAccount: () => void;
}

export default function SettingsForm({ initial, onSave, onDeleteAccount }: SettingsFormProps) {
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [email, setEmail] = useState(initial.email);
  const [compact, setCompact] = useState(false);
  const [saved, setSaved] = useState(false);
  const fullName = `${firstName} ${lastName}`.trim();

  useEffect(() => {
    setCompact(readCompactPref(localStorage.getItem(PREFS_KEY)));
  }, []);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), SAVED_NOTICE_MS);
    return () => clearTimeout(timer);
  }, [saved]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const profile = { firstName, lastName, email };
    await onSave(profile);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "max-w-xl space-y-4 p-6 text-ink" : "max-w-xl space-y-6 p-8 text-ink"}>
      <h1 className="text-xl font-semibold">Profile</h1>
      <p className="text-sm text-ink-muted">Shown to teammates as {fullName}.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="first-name" text="First name" />
          <input
            id="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-10 rounded-md border border-ink/15 px-3 text-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="last-name" text="Last name" />
          <input
            id="last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="h-10 rounded-md border border-ink/15 px-3 text-sm"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor="email" text="Email" />
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 rounded-md border border-ink/15 px-3 text-sm"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button type="submit">Save changes</Button>
        {saved && (
          <p role="status" className="text-sm text-success">
            Saved
          </p>
        )}
      </div>
      <section className="rounded-lg border border-ink/15 p-4">
        <h2 className="text-md font-semibold">Delete account</h2>
        <p className="mt-1 text-sm text-ink-muted">Removes your projects and every preview URL.</p>
        <Button variant="secondary" className="mt-4" onClick={onDeleteAccount}>
          Delete account
        </Button>
      </section>
    </form>
  );
}
