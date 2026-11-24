"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { Button } from "@/components/Button";
import { TrashIcon } from "./vendor/heroicons-outline";
import { Badge, Icon, cardClass, cn } from "./ui";

const sortOptions = ["Last updated", "Name", "Due date"];

const projects = [
  { id: "p1", title: "Q4 retainer invoices", owner: "Dana", due: "Dec 5", status: "Active" },
  { id: "p2", title: "Lumen Bakery rebrand", owner: "Ravi", due: "Dec 12", status: "Draft" },
  { id: "p3", title: "Harbor & Co onboarding", owner: "Ines", due: "Jan 9", status: "Active" },
];

function Toolbar({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn(className, "flex flex-wrap items-center gap-2")}>{children}</div>;
}

function SearchField({ ref, className, ...props }: ComponentProps<"input">) {
  return (
    <div className="relative flex-1">
      <Icon name="search" className="absolute left-3 top-3 text-ink-muted" />
      <input
        ref={ref}
        type="search"
        className={cn(
          "block h-10 w-full rounded-md border border-ink/50 bg-surface pl-9 pr-3 text-md text-ink",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function ProjectCard({
  title,
  meta,
  status,
  showMeta,
  showStatus,
  hasFooter,
}: {
  title: string;
  meta?: string;
  status?: string;
  showMeta?: boolean;
  showStatus?: boolean;
  hasFooter?: boolean;
}) {
  return (
    <article className={cardClass}>
      <h3 className="text-md font-semibold text-ink">{title}</h3>
      {showMeta && <p className="mt-1 text-sm text-ink-muted">{meta}</p>}
      {hasFooter && (
        <div className="mt-4 border-t border-ink/15 pt-4">
          {showStatus && <Badge tone={status === "Active" ? "success" : "neutral"}>{status}</Badge>}
        </div>
      )}
    </article>
  );
}

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(sortOptions[0]);
  const [sortOpen, setSortOpen] = useState(false);

  const visible = projects.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Projects</h1>
          <p className="mt-1 text-md text-ink-muted">Group invoices by client engagement.</p>
        </div>
        <Button>New project</Button>
      </header>

      <Toolbar className="mt-8">
        <SearchField value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects" aria-label="Search projects" />
        <div className="relative">
          <Button variant="secondary" onClick={() => setSortOpen(!sortOpen)}>
            Sort: {sort}
          </Button>
          {sortOpen && (
            <div className="absolute right-0 z-10 mt-2 w-44 rounded-md border border-ink/15 bg-surface p-1 shadow-lg">
              {sortOptions.map((o) => (
                <div
                  key={o}
                  onClick={() => {
                    setSort(o);
                    setSortOpen(false);
                  }}
                  className="cursor-pointer rounded-sm px-3 py-2 text-sm text-ink hover:bg-surface-raised"
                >
                  {o}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button variant="secondary" aria-label="Archive selected">
          <TrashIcon className="size-4" />
        </Button>
      </Toolbar>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {visible.map((p) => (
          <ProjectCard
            key={p.id}
            title={p.title}
            meta={`${p.owner} · due ${p.due}`}
            status={p.status}
            showMeta
            showStatus
            hasFooter
          />
        ))}
      </div>
    </main>
  );
}
