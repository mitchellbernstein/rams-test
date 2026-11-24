"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { Button } from "@/components/Button";
import { Badge, Icon, PageHeader, cardClass, cn } from "./ui";

const sortOptions = ["Last updated", "Name", "Due date"];

const projects = [
  { id: "p1", title: "Q4 retainer invoices", owner: "Dana", due: "Dec 5", status: "Active" },
  { id: "p2", title: "Lumen Bakery rebrand", owner: "Ravi", due: "Dec 12", status: "Draft" },
  { id: "p3", title: "Harbor & Co onboarding", owner: "Ines", due: "Jan 9", status: "Active" },
];

function Toolbar({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>;
}

function SearchField({ ref, className, ...props }: ComponentProps<"input">) {
  return (
    <div className="relative flex-1">
      <Icon name="search" className="absolute left-3 top-3 text-ink-muted" />
      <input
        ref={ref}
        type="search"
        className={cn(
          "block h-10 w-full rounded-md border border-ink/50 bg-surface pl-9 pr-3 text-md text-ink disabled:cursor-not-allowed disabled:bg-surface-raised disabled:text-ink-muted",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function ProjectCard({ title, children, footer }: { title: string; children?: ReactNode; footer?: ReactNode }) {
  return (
    <article className={cardClass}>
      <h3 className="text-md font-semibold text-ink">{title}</h3>
      {children}
      {footer && <div className="mt-4 border-t border-ink/15 pt-4">{footer}</div>}
    </article>
  );
}

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(sortOptions[0]);

  const visible = projects.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <PageHeader title="Projects" description="Group invoices by client engagement." action={<Button>New project</Button>} />

      <Toolbar className="mt-8">
        <SearchField value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects" aria-label="Search projects" />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort projects"
          className="h-10 rounded-md border border-ink/50 bg-surface px-3 text-sm text-ink"
        >
          {sortOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <Button variant="secondary" aria-label="Archive selected">
          <Icon name="trash" />
        </Button>
      </Toolbar>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {visible.map((p) => (
          <ProjectCard
            key={p.id}
            title={p.title}
            footer={<Badge tone={p.status === "Active" ? "success" : "neutral"}>{p.status}</Badge>}
          >
            <p className="mt-1 text-sm text-ink-muted">
              {p.owner} · due {p.due}
            </p>
          </ProjectCard>
        ))}
      </div>
    </main>
  );
}
