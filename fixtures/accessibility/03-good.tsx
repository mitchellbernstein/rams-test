"use client";

import { useRef, useState, type SVGProps } from "react";
import { Button } from "@/components/Button";

function Icon({ d, ...props }: SVGProps<SVGSVGElement> & { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <path d={d} />
    </svg>
  );
}

const PLUS = "M12 5v14M5 12h14";
const SORT = "M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4";
const TRASH = "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3";
const LEFT = "M15 18l-6-6 6-6";
const RIGHT = "M9 6l6 6-6 6";

type Project = { id: string; name: string; updated: string };

const initialProjects: Project[] = [
  { id: "p1", name: "Spring launch", updated: "Edited 2 hours ago" },
  { id: "p2", name: "Onboarding refresh", updated: "Edited yesterday" },
  { id: "p3", name: "Billing migration", updated: "Edited 4 days ago" },
];

const archived = [
  { id: "a1", name: "2025 brand audit" },
  { id: "a2", name: "Partner portal" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [showArchived, setShowArchived] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  function remove(id: string) {
    setProjects((list) => list.filter((p) => p.id !== id));
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function sortByName() {
    setProjects((list) => [...list].sort((a, b) => a.name.localeCompare(b.name)));
  }

  return (
    <main className="mx-auto max-w-3xl bg-surface p-8 text-ink">
      <style>{`button, a, [role="button"] { touch-action: manipulation; }`}</style>

      <header className="flex items-center justify-between gap-4">
        <h1 ref={headingRef} tabIndex={-1} className="text-xl font-semibold">Projects</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={sortByName}
            aria-label="Sort by name"
            className="grid h-11 w-11 place-items-center rounded-md hover:bg-surface-raised"
          >
            <Icon d={SORT} aria-hidden="true" />
          </button>
          <Button className="min-h-11 gap-2">
            <Icon d={PLUS} aria-hidden="true" />
            New project
          </Button>
        </div>
      </header>

      <ul className="mt-6 divide-y divide-ink/10 rounded-lg border border-ink/10">
        {projects.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-4 px-4 py-2">
            <div>
              <a href={`/projects/${p.id}`} className="inline-flex min-h-11 items-center text-md font-medium underline-offset-4 hover:underline">{p.name}</a>
              <p className="text-sm text-ink-muted">{p.updated}</p>
            </div>
            <button
              type="button"
              onClick={() => remove(p.id)}
              aria-label={`Delete ${p.name}`}
              className="grid h-11 w-11 place-items-center rounded-md text-ink-muted hover:bg-surface-raised"
            >
              <Icon d={TRASH} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <nav aria-label="Pagination" className="mt-6 flex items-center justify-between">
        <p className="text-sm text-ink-muted">Page 1 of 3</p>
        <div className="flex gap-4">
          <button type="button" aria-label="Previous page" className="relative grid h-11 w-11 place-items-center rounded-md before:absolute before:-inset-2 hover:bg-surface-raised">
            <Icon d={LEFT} aria-hidden="true" />
          </button>
          <button type="button" aria-label="Next page" className="relative grid h-11 w-11 place-items-center rounded-md before:absolute before:-inset-2 hover:bg-surface-raised">
            <Icon d={RIGHT} aria-hidden="true" />
          </button>
        </div>
      </nav>

      <section className="mt-10">
        <h2>
          <button
            type="button"
            aria-expanded={showArchived}
            aria-controls="archived-list"
            onClick={() => setShowArchived((v) => !v)}
            className="flex min-h-11 w-full items-center text-left text-lg font-semibold"
          >
            Archived projects ({archived.length})
          </button>
        </h2>
        <div
          id="archived-list"
          inert={!showArchived}
          className={`grid transition-[grid-template-rows] ${showArchived ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
          <ul className="overflow-hidden">
            {archived.map((a) => (
              <li key={a.id}>
                <a href={`/projects/${a.id}`} className="flex min-h-11 items-center text-md">{a.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <aside className="mt-10 grid gap-6 rounded-lg bg-surface-raised p-6 sm:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold">Templates are coming</h2>
          <p className="mt-2 text-sm text-ink-muted">Start a project from a saved structure of tasks and docs. Rolling out in December.</p>
        </div>
        <div aria-hidden="true" inert className="rounded-md border border-ink/10 bg-surface p-4">
          <p className="text-md font-medium">Product launch</p>
          <p className="text-sm text-ink-muted">14 tasks, 3 docs</p>
          <Button className="mt-4 min-h-11">Use template</Button>
        </div>
      </aside>
    </main>
  );
}
