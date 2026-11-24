"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

const icons = {
  home: "M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z",
  chart: "M4 20V10m6 10V4m6 16v-8m4 8H2",
  inbox: "M3 13h5l2 3h4l2-3h5M5 5h14l2 8v6H3v-6l2-8z",
  users: "M16 19v-1a4 4 0 00-4-4H6a4 4 0 00-4 4v1M9 10a3 3 0 100-6 3 3 0 000 6zm13 9v-1a4 4 0 00-3-3.9",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zm7.4-3a7.4 7.4 0 00-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 00-2-1.2L14.5 3h-5l-.4 2.6a7 7 0 00-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 000 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 002 1.2l.4 2.6h5l.4-2.6a7 7 0 002-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z",
};

function Icon({ path, className = "" }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className={className}>
      <path d={path} />
    </svg>
  );
}

const nav = [
  { label: "Overview", icon: icons.home },
  { label: "Reports", icon: icons.chart },
  { label: "Inbox", icon: icons.inbox },
  { label: "Team", icon: icons.users },
];

const stats = [
  { label: "Unreconciled", value: "128" },
  { label: "Receipts missing", value: "34" },
  { label: "Days to close", value: "4.2" },
  { label: "Entries reviewed", value: "92%" },
];

const recent = [
  { title: "March P&L", owner: "Maya" },
  { title: "Q1 cash flow", owner: "Jonas" },
  { title: "Vendor spend", owner: "Ana" },
  { title: "Payroll accruals", owner: "Maya" },
];

const accounts = [
  { name: "Operating account", tags: ["USD", "Primary", "Auto-match", "Daily sync", "Needs review"] },
  { name: "Payroll account", tags: ["USD", "Restricted", "Weekly sync"] },
];

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-screen bg-surface-raised text-ink">
      <aside className="hidden w-60 shrink-0 flex-col gap-1 border-e border-ink/10 bg-surface p-4 md:flex">
        <span className="px-3 py-2 text-md font-semibold">Ledgerly</span>
        <nav aria-label="Main" className="flex flex-col gap-1">
          {nav.map((item) => (
            <a key={item.label} href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-surface-raised">
              <Icon path={item.icon} className="size-5 shrink-0" />
              {item.label}
            </a>
          ))}
          <a href="/settings" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-surface-raised">
            <Icon path={icons.settings} className="size-4 shrink-0" />
            Settings
          </a>
        </nav>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col gap-8 p-4 pb-24 sm:p-8 md:pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">Overview</h1>
          <div className="flex items-center gap-3">
            <Button>New report</Button>
            <div className="relative">
              <button
                type="button"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-surface"
              >
                Maya
              </button>
              {menuOpen && (
                <div className="absolute end-0 top-12 z-10 flex w-56 flex-col rounded-lg border border-ink/15 bg-surface p-1">
                  <a href="/profile" className="rounded-md px-3 py-2 text-sm hover:bg-surface-raised">Profile</a>
                  <a href="/billing" className="rounded-md px-3 py-2 text-sm hover:bg-surface-raised">Billing</a>
                  <a href="/logout" className="rounded-md px-3 py-2 text-sm hover:bg-surface-raised">Sign out</a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1 rounded-lg bg-surface p-6 shadow-2xl">
              <span className="text-sm text-ink-muted">{s.label}</span>
              <span className="text-xl font-semibold">{s.value}</span>
            </div>
          ))}
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Recent reports</h2>
          <div className="flex gap-4 overflow-x-auto">
            {recent.map((r) => (
              <a key={r.title} href="#" className="flex w-64 shrink-0 flex-col gap-1 rounded-lg bg-surface p-4 shadow-sm">
                <span className="text-sm font-medium">{r.title}</span>
                <span className="text-sm text-ink-muted">Owner: {r.owner}</span>
              </a>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-2">
          <section className="flex flex-col gap-4 rounded-lg bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Bank accounts</h2>
            <ul className="flex flex-col gap-4">
              {accounts.map((a) => (
                <li key={a.name} className="flex flex-col gap-2">
                  <span className="text-sm font-medium">{a.name}</span>
                  <div className="flex gap-2">
                    {a.tags.map((t) => (
                      <span key={t} className="rounded-full bg-surface-raised px-2 py-1 text-sm text-ink-muted">{t}</span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-4 rounded-lg bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Filter entries</h2>
            <form className="flex w-[480px] flex-col gap-3">
              <input aria-label="Search entries" placeholder="Search entries" className="h-10 rounded-md border border-ink/15 bg-surface px-3 text-sm" />
              <select aria-label="Status" className="h-10 rounded-md border border-ink/15 bg-surface px-3 text-sm">
                <option>All statuses</option>
                <option>Unreconciled</option>
              </select>
            </form>
          </section>
        </div>
      </main>

      <nav aria-label="Mobile" className="fixed inset-x-0 bottom-0 border-t border-ink/10 bg-surface md:hidden">
        <div className="flex h-16">
          {nav.map((item) => (
            <a key={item.label} href="#" className="flex flex-1 flex-col items-center justify-center gap-1 text-sm">
              <Icon path={item.icon} className="size-5 shrink-0" />
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
