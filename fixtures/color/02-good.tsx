"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";

const digestOptions = ["Daily", "Weekly", "Never"];
const topics = ["Invoice paid", "Invoice overdue", "New client added"];

export default function NotificationSettings() {
  const [name, setName] = useState("Dana Whitfield");
  const [email, setEmail] = useState("");
  const [digest, setDigest] = useState("Weekly");
  const [pushOn, setPushOn] = useState(true);

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-ink">Notifications</h1>
        <span className="rounded-sm bg-success px-2 py-1 text-sm font-medium text-brand-ink">Saved</span>
      </div>
      <p className="mt-2 text-md text-ink-muted">Choose how Acme tells you about invoices and payments.</p>

      <form className="mt-10 space-y-8">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-ink">Display name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block h-10 w-full rounded-md border border-ink/50 bg-surface px-3 text-md text-ink"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Send copies to</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="accounts@yourcompany.com"
              className="mt-2 block h-10 w-full rounded-md border border-ink/50 bg-surface px-3 text-md text-ink placeholder:text-ink-muted"
            />
          </label>
        </div>

        <hr className="border-ink/15" />

        <fieldset>
          <legend className="text-sm font-medium text-ink">Email me when</legend>
          <div className="mt-3 space-y-3">
            {topics.map((topic) => (
              <label key={topic} className="flex items-center gap-3 text-md text-ink">
                <input type="checkbox" defaultChecked className="size-4 accent-brand" />
                {topic}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-ink">Summary digest</legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {digestOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDigest(option)}
                aria-pressed={digest === option}
                className="h-10 rounded-md border border-ink/50 text-sm font-medium text-ink"
                style={digest === option ? { background: "var(--color-surface-raised)" } : undefined}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-md font-medium text-ink">Push notifications</p>
            <p className="text-sm text-ink-muted">Alerts on your phone when a client pays.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={pushOn}
            aria-label="Push notifications"
            onClick={() => setPushOn(!pushOn)}
            className={`relative h-6 w-11 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${pushOn ? "bg-brand" : "bg-ink/50"}`}
          >
            <span className={`absolute top-0.5 size-5 rounded-full bg-surface transition-transform ${pushOn ? "left-5.5" : "left-0.5"}`} />
          </button>
        </div>

        <div className="rounded-md bg-surface-raised p-4 text-sm text-ink-muted">
          Reminders to your clients are configured per invoice and are not affected by these settings.
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="/settings" className="text-sm font-medium text-ink-muted hover:text-ink">
            Cancel
          </Link>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </main>
  );
}
