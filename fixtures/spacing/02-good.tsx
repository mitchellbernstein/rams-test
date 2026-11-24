import type { ReactNode } from "react";
import { Button } from "@/components/Button";

const connectedApps = [
  { name: "Slack", logo: "/logos/slack.png", detail: "Posts close reminders to #finance" },
  { name: "Google Drive", logo: "/logos/drive.png", detail: "Imports receipts from Finance/Receipts" },
  { name: "Stripe", logo: "/logos/stripe.png", detail: "Syncs payouts every hour" },
];

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className={className}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    </svg>
  );
}

export default function AccountSettings() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12 sm:px-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Account</h1>
        <p className="text-sm text-ink-muted">Manage your profile, security and connected apps.</p>
      </header>

      <p className="rounded-md bg-surface-raised px-4 py-3 text-sm text-ink-muted">
        Changes to your email address need to be confirmed from your inbox.
      </p>

      <section className="flex flex-col gap-6 rounded-lg border border-ink/10 p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-surface-raised p-1">
            <img
              src="/avatars/maya.jpg"
              alt=""
              width={64}
              height={64}
              className="size-16 rounded-md object-cover outline outline-1 -outline-offset-1 outline-ink/10"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-md font-semibold">Maya Lindqvist</p>
            <p className="text-sm text-ink-muted">Controller · Joined March 2024</p>
          </div>
        </div>

        <img
          src="/banners/maya-cover.jpg"
          alt="Profile cover"
          width={1200}
          height={300}
          className="h-auto w-full rounded-md outline outline-1 -outline-offset-1 outline-ink/10"
        />

        <form className="flex flex-col gap-6">
          <Field label="Full name" htmlFor="name">
            <input id="name" defaultValue="Maya Lindqvist" className="h-10 rounded-md border border-ink/15 bg-surface px-3 text-sm" />
          </Field>
          <Field label="Email" htmlFor="email">
            <input id="email" type="email" defaultValue="maya@ledgerly.app" className="h-10 rounded-md border border-ink/15 bg-surface px-3 text-sm" />
          </Field>
          <Field label="Time zone" htmlFor="tz">
            <select id="tz" className="h-10 rounded-md border border-ink/15 bg-surface px-3 text-sm">
              <option>Europe/Stockholm</option>
              <option>Europe/London</option>
            </select>
          </Field>
          <div className="flex flex-wrap justify-end gap-3 border-t border-ink/10 pt-6">
            <Button variant="secondary" type="button">Cancel</Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-ink/10 p-6">
        <h2 className="text-lg font-semibold">Security</h2>
        <p className="flex items-center gap-2 text-sm text-success">
          <ShieldIcon className="size-4 shrink-0" />
          Two-factor authentication is on
        </p>
        <div>
          <Button variant="secondary">Manage devices</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-ink/10 p-6">
        <h2 className="text-lg font-semibold">Connected apps</h2>
        <ul className="flex flex-col gap-3">
          {connectedApps.map((app) => (
            <li key={app.name} className="flex items-center gap-3">
              <img src={app.logo} alt="" width={32} height={32} className="size-8 rounded-md outline outline-1 -outline-offset-1 outline-ink/10" />
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-medium">{app.name}</span>
                <span className="truncate text-sm text-ink-muted">{app.detail}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-ink/10 p-6">
        <h2 className="text-lg font-semibold">Delete account</h2>
        <p className="text-sm text-ink-muted">This removes every ledger and cannot be undone.</p>
        <div>
          <Button variant="secondary">Delete account</Button>
        </div>
      </section>
    </main>
  );
}
