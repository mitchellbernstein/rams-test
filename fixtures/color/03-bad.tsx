"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";

const themeStyles = `
:root { color-scheme: light; }
[data-theme="dark"] {
  --color-ink: #ededed;
  --color-ink-muted: #a3a3a3;
  --color-surface: #141415;
  --color-surface-raised: #0c0c0d;
  --color-brand: #7fa2ff;
  --color-brand-ink: #0b1430;
  --color-success: hsl(142 69% 58%);
}
[data-theme="dark"] .usage-card { filter: invert(1) hue-rotate(180deg); }
`;

const revenue = [12, 18, 15, 22, 27, 24, 31, 35, 33, 41];

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const points = values.map((v, i) => `${(i / (values.length - 1)) * 240},${60 - (v / max) * 56}`).join(" ");
  return (
    <svg viewBox="0 0 240 60" className="mt-4 h-16 w-full" aria-hidden="true">
      <line x1="0" y1="59" x2="240" y2="59" stroke="var(--color-ink)" strokeOpacity={0.15} />
      <line x1="0" y1="30" x2="240" y2="30" stroke="var(--color-ink)" strokeOpacity={0.15} />
      <polyline points={points} fill="none" stroke="#1f4fd1" strokeWidth={2} />
    </svg>
  );
}

export default function Dashboard() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.dataset.theme = localStorage.getItem("theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  }

  return (
    <main className="mx-auto max-w-5xl bg-surface px-6 py-12 text-ink">
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#141415" />
      <style>{themeStyles}</style>

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-ink-muted">Last 10 weeks, all clients</p>
        </div>
        <div className="flex items-center gap-3">
          <details className="relative">
            <summary className="inline-flex h-10 cursor-pointer list-none items-center rounded-md border border-ink/15 px-4 text-sm font-medium">
              Export
            </summary>
            <div role="menu" className="absolute right-0 z-10 mt-2 w-44 rounded-md border border-ink/15 bg-surface-raised p-1 shadow-lg">
              <button role="menuitem" className="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-ink/5">CSV</button>
              <button role="menuitem" className="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-ink/5">PDF report</button>
            </div>
          </details>
          <Button variant="secondary" onClick={toggleTheme}>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </Button>
        </div>
      </header>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-ink/15 bg-surface-raised p-6">
          <h2 className="text-sm font-medium text-ink-muted">Revenue collected</h2>
          <p className="mt-2 text-xl font-semibold">$41,280</p>
          <p className="mt-1 text-sm text-success">+18% vs previous period</p>
          <Sparkline values={revenue} />
        </section>

        <section className="usage-card rounded-lg border border-ink/15 p-6">
          <h2 className="text-sm font-medium text-ink-muted">Invoices sent this month</h2>
          <p className="mt-2 text-xl font-semibold">184 of 250</p>
          <div className="mt-4 h-2 rounded-full bg-ink/10">
            <div className="h-2 w-3/4 rounded-full bg-brand" />
          </div>
          <p className="mt-2 text-sm text-ink-muted">Resets on December 1</p>
        </section>
      </div>

      <section className="mt-6 flex items-center justify-between rounded-lg border border-ink/15 bg-white p-6 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
        <div>
          <h2 className="text-lg font-semibold">Invite your accountant</h2>
          <p className="mt-1 text-sm text-ink-muted">Give read-only access to invoices and exports.</p>
        </div>
        <Button>Send invite</Button>
      </section>

      <aside className="mt-6 rounded-md bg-white p-4 text-sm text-ink">
        Tip: overdue invoices get an automatic reminder three days after the due date.
      </aside>
    </main>
  );
}
