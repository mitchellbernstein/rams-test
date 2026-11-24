"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";

type Project = { id: string; name: string; owner: string; status: "active" | "archived" };
type Page = { items: Project[]; total: number; pageCount: number };
type Usage = { seatsUsed: number; seatsTotal: number; storageGb: number };

const statuses = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
] as const;

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

function UsageCard() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");

  const load = useCallback(async (signal?: AbortSignal) => {
    setState("loading");
    try {
      const res = await fetch("/api/usage", { signal });
      if (!res.ok) throw new Error(String(res.status));
      setUsage(await res.json());
      setState("ready");
    } catch (err) {
      if ((err as Error).name !== "AbortError") setState("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return (
    <section className="h-36 rounded-lg bg-surface-raised p-4">
      <h2 className="text-md font-semibold">Usage</h2>
      {state === "loading" && (
        <div aria-busy="true" className="mt-3 flex flex-col gap-2">
          <div className="h-5 w-32 animate-pulse rounded-sm bg-ink/10" />
          <div className="h-5 w-24 animate-pulse rounded-sm bg-ink/10" />
        </div>
      )}
      {state === "error" && (
        <div className="mt-3 flex flex-col items-start gap-2 text-sm">
          <p>We couldn't load usage right now.</p>
          <Button variant="secondary" onClick={() => load()}>Try again</Button>
        </div>
      )}
      {state === "ready" && usage && usage.seatsTotal === 0 && (
        <p className="mt-3 text-sm text-ink-muted">No seats on this plan yet. Usage appears once you add members.</p>
      )}
      {state === "ready" && usage && usage.seatsTotal > 0 && (
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <dt className="text-ink-muted">Seats</dt>
          <dd>{usage.seatsUsed} of {usage.seatsTotal}</dd>
          <dt className="text-ink-muted">Storage</dt>
          <dd>{usage.storageGb.toFixed(1)} GB</dd>
        </dl>
      )}
    </section>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const status = params.get("status") ?? "all";
  const sort = params.get("sort") ?? "updated";
  const page = Number(params.get("page") ?? "1");

  const [draft, setDraft] = useState(q);
  const [data, setData] = useState<Page | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "error" | "ready">("loading");
  const [reloadKey, setReloadKey] = useState(0);

  const updateParams = useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const setStatus = (value: string) => updateParams({ status: value === "all" ? null : value, page: null });

  useEffect(() => {
    if (draft === q) return;
    const timer = setTimeout(() => updateParams({ q: draft, page: null }), 300);
    return () => clearTimeout(timer);
  }, [draft, q, updateParams]);

  useEffect(() => {
    const controller = new AbortController();
    setLoadState("loading");
    const query = new URLSearchParams({ q, status, sort, page: String(page) });
    fetch(`/api/projects?${query}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((body: Page) => {
        setData(body);
        setLoadState("ready");
      })
      .catch((err: Error) => {
        if (err.name !== "AbortError") setLoadState("error");
      });
    return () => controller.abort();
  }, [q, status, sort, page, reloadKey]);

  const filtered = q !== "" || status !== "all";

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-ink lg:grid-cols-[1fr_16rem]">
      <div>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">Projects</h1>
          <Link href="/projects/new" className="inline-flex h-10 items-center rounded-md bg-brand px-4 text-sm font-medium text-brand-ink hover:bg-brand/90">
            New project
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label htmlFor="project-search" className="sr-only">Search projects</label>
          <input
            id="project-search"
            type="search"
            placeholder="Search projects"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="h-10 w-64 rounded-md border border-ink/15 bg-surface px-3 text-md"
          />
          <div role="group" aria-label="Status" className="flex gap-1">
            {statuses.map((s) => (
              <button
                key={s.value}
                type="button"
                aria-pressed={status === s.value}
                onClick={() => setStatus(s.value)}
                className={`h-10 rounded-md px-3 text-sm ${status === s.value ? "bg-ink text-surface" : "text-ink-muted hover:bg-surface-raised"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            Sort by
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value, page: null })}
              className="h-10 rounded-md border border-ink/15 bg-surface px-2 text-md text-ink"
            >
              <option value="updated">Last updated</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>

        {loadState === "loading" && (
          <ul aria-busy="true" className="mt-6 divide-y divide-ink/10">
            {Array.from({ length: 8 }, (_, i) => (
              <li key={i} className="flex h-16 items-center">
                <div className="h-5 w-48 animate-pulse rounded-sm bg-ink/10" />
              </li>
            ))}
          </ul>
        )}

        {loadState === "error" && (
          <div className="mt-6 rounded-lg border border-ink/10 p-6 text-md">
            <p>We couldn't load your projects.</p>
            <Button variant="secondary" className="mt-3" onClick={() => setReloadKey((k) => k + 1)}>
              Try again
            </Button>
          </div>
        )}

        {loadState === "ready" && data && data.total === 0 && !filtered && (
          <div className="mt-6 rounded-lg border border-dashed border-ink/20 p-8 text-center">
            <h2 className="text-lg font-semibold">No projects yet</h2>
            <p className="mt-1 text-md text-ink-muted">Projects group your documents and the people working on them.</p>
            <Link href="/projects/new" className="mt-4 inline-flex h-10 items-center rounded-md border border-ink/15 px-4 text-sm font-medium hover:bg-surface-raised">
              Create your first project
            </Link>
          </div>
        )}

        {loadState === "ready" && data && data.total === 0 && filtered && (
          <div className="mt-6 rounded-lg border border-ink/10 p-8 text-center">
            <p className="text-md">
              No projects match {q ? `“${q}”` : "these filters"}
              {status !== "all" ? ` in ${status}` : ""}.
            </p>
            <Button
              variant="secondary"
              className="mt-3"
              onClick={() => {
                setDraft("");
                updateParams({ q: null, status: null, page: null });
              }}
            >
              Clear search and filters
            </Button>
          </div>
        )}

        {loadState === "ready" && data && data.total > 0 && (
          <>
            <p className="mt-6 text-sm text-ink-muted">{plural(data.total, "project", "projects")}</p>
            <ul className="mt-2 divide-y divide-ink/10">
              {data.items.map((p) => (
                <li key={p.id} className="flex h-16 items-center justify-between">
                  <Link href={`/projects/${p.id}`} className="text-md font-medium hover:underline">
                    {p.name}
                  </Link>
                  <span className="text-sm text-ink-muted">{p.owner}</span>
                </li>
              ))}
            </ul>
            <nav aria-label="Pagination" className="mt-4 flex items-center justify-between">
              <Button variant="secondary" disabled={page <= 1} onClick={() => updateParams({ page: String(page - 1) })}>
                Previous page
              </Button>
              <span className="text-sm text-ink-muted">
                Page {page} of {data.pageCount}
              </span>
              <Button variant="secondary" disabled={page >= data.pageCount} onClick={() => updateParams({ page: String(page + 1) })}>
                Next page
              </Button>
            </nav>
          </>
        )}
      </div>

      <aside>
        <UsageCard />
      </aside>
    </main>
  );
}
