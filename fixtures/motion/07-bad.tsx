"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/Button";

// Minimal local stand-in for a cmdk-style CommandDialog, which is not installed in this repo.
function CommandDialog({ open, className, children }: { open: boolean; className?: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-20 flex items-start justify-center bg-ink/30 px-4 pt-24">
      <div role="dialog" aria-modal="true" aria-label="Command palette" className={className}>
        {children}
      </div>
    </div>
  );
}

const projects = [
  { name: "March close", client: "Northwind", status: "In review" },
  { name: "Payroll Q1", client: "Globex", status: "Open" },
  { name: "VAT return", client: "Initech", status: "Open" },
  { name: "Audit prep", client: "Umbrella", status: "Blocked" },
  { name: "Cash forecast", client: "Hooli", status: "Open" },
  { name: "Expense policy", client: "Acme", status: "Done" },
  { name: "Year-end", client: "Northwind", status: "Open" },
  { name: "Grant report", client: "Globex", status: "In review" },
  { name: "Bank migration", client: "Initech", status: "Open" },
];

const filters = ["All", "Open", "In review", "Blocked", "Done"];
const commands = ["New project", "Invite teammate", "Import bank file", "Open settings"];

export default function ProjectsPage() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visible = projects.filter((p) => filter === "All" || p.status === filter);
  const matches = commands.filter((c) => c.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-surface-raised text-ink">
      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes palette-in { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: none; } }
        .project { position: relative; }
        @media (prefers-reduced-motion: no-preference) {
          .project { animation: rise 250ms ease-out; }
          .palette { animation: palette-in 400ms ease-out both; }
        }
        .project { transition: box-shadow 150ms ease-out; }
        @media (hover: hover) and (pointer: fine) {
          .project:hover { box-shadow: 0 8px 24px rgb(17 17 17 / 0.12); }
        }
      `}</style>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Projects</h1>
            <p className="text-sm text-ink-muted">Press ⌘K to jump anywhere.</p>
          </div>
          <Button className="active:scale-[0.97] motion-safe:animate-bounce">New project</Button>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors duration-700 ${filter === f ? "bg-ink text-surface" : "bg-surface text-ink-muted hover:text-ink"}`}
            >
              {f}
            </button>
          ))}
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <li key={p.name} className="project rounded-lg bg-surface shadow-sm" style={{ animationDelay: `${i * 120}ms` }}>
              <a href={`/projects/${i}`} className="flex flex-col gap-1 p-4">
                <span className="text-md font-medium">{p.name}</span>
                <span className="text-sm text-ink-muted">
                  {p.client} · {p.status}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </main>

      <CommandDialog open={paletteOpen} className="palette w-full max-w-lg rounded-lg bg-surface p-2 shadow-lg">
        <input
          autoFocus
          aria-label="Search commands"
          placeholder="Type a command"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
          className="h-10 w-full rounded-md px-3 text-sm outline-none"
        />
        <ul role="listbox" aria-label="Commands" className="mt-2 flex flex-col">
          {matches.map((c, i) => (
            <li
              key={c}
              role="option"
              aria-selected={i === selected}
              onMouseEnter={() => setSelected(i)}
              className={`rounded-md px-3 py-2 text-sm ${i === selected ? "bg-surface-raised" : ""}`}
            >
              {c}
            </li>
          ))}
        </ul>
      </CommandDialog>
    </div>
  );
}
