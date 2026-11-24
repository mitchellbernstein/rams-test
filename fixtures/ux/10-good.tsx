"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";

type Activity = {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
  likes: number;
  liked: boolean;
};

const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

function relative(iso: string) {
  const minutes = Math.round((new Date(iso).getTime() - Date.now()) / 60000);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  return rtf.format(Math.round(hours / 24), "day");
}

function absolute(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" });
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

export default function ActivityFeed() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const pages = Math.max(1, Number(params.get("pages") ?? "1"));

  const [items, setItems] = useState<Activity[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState<string | null>(null);
  const [likePending, setLikePending] = useState<Set<string>>(new Set());
  const [likeError, setLikeError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    fetch(`/api/activity?through=${pages}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((body: { items: Activity[]; hasMore: boolean }) => {
        setItems(body.items);
        setHasMore(body.hasMore);
        setState("ready");
      })
      .catch((err: Error) => {
        if (err.name !== "AbortError") setState("error");
      });
    return () => controller.abort();
  }, [attempt]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setMoreError(null);
    try {
      const res = await fetch(`/api/activity?page=${pages + 1}`);
      if (!res.ok) throw new Error(String(res.status));
      const body: { items: Activity[]; hasMore: boolean } = await res.json();
      setItems((current) => [...current, ...body.items]);
      setHasMore(body.hasMore);
      router.replace(`${pathname}?pages=${pages + 1}`, { scroll: false });
    } catch {
      setMoreError("We couldn't load older activity. Try again.");
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, pages, pathname, router]);

  async function toggleLike(item: Activity) {
    if (likePending.has(item.id)) return;
    const previous = { liked: item.liked, likes: item.likes };
    const nextLiked = !item.liked;
    setLikeError(null);
    setLikePending((s) => new Set(s).add(item.id));
    setItems((list) =>
      list.map((a) => (a.id === item.id ? { ...a, liked: nextLiked, likes: a.likes + (nextLiked ? 1 : -1) } : a)),
    );
    try {
      const res = await fetch(`/api/activity/${item.id}/like`, { method: nextLiked ? "PUT" : "DELETE" });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setItems((list) => list.map((a) => (a.id === item.id ? { ...a, ...previous } : a)));
      setLikeError("We couldn't update your like. Try again.");
    } finally {
      setLikePending((s) => {
        const next = new Set(s);
        next.delete(item.id);
        return next;
      });
    }
  }

  return (
    <div className="bg-surface text-ink">
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-xl font-semibold">Activity</h1>
        {likeError && <p role="alert" className="mt-4 text-sm text-red-700">{likeError}</p>}

        {state === "loading" && (
          <ul aria-busy="true" className="mt-6 divide-y divide-ink/10">
            {Array.from({ length: 6 }, (_, i) => (
              <li key={i} className="flex h-20 items-center">
                <div className="h-5 w-72 animate-pulse rounded-sm bg-ink/10" />
              </li>
            ))}
          </ul>
        )}

        {state === "error" && (
          <div className="mt-6 text-md">
            <p>We couldn't load activity.</p>
            <Button variant="secondary" className="mt-3" onClick={() => setAttempt((a) => a + 1)}>Try again</Button>
          </div>
        )}

        {state === "ready" && items.length === 0 && (
          <div className="mt-6 text-md text-ink-muted">
            <p>Nothing has happened in your projects yet. Edits, comments and new members show up here.</p>
            <Link href="/projects" className="mt-3 inline-block text-ink underline">Go to projects</Link>
          </div>
        )}

        {state === "ready" && items.length > 0 && (
          <>
            <ul className="mt-6 divide-y divide-ink/10">
              {items.map((a) => (
                <li key={a.id} className="flex min-h-20 items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-md">
                      <span className="font-medium">{a.actor}</span> {a.action} <span className="font-medium">{a.target}</span>
                    </p>
                    <time dateTime={a.at} title={absolute(a.at)} className="text-sm text-ink-muted">
                      {relative(a.at)}
                    </time>
                  </div>
                  <button
                    type="button"
                    aria-pressed={a.liked}
                    onClick={() => toggleLike(a)}
                    className={`h-10 shrink-0 rounded-md px-3 text-sm ${a.liked ? "bg-surface-raised text-ink" : "text-ink-muted hover:bg-surface-raised"}`}
                  >
                    {a.liked ? "Liked" : "Like"} · {plural(a.likes, "like", "likes")}
                  </button>
                </li>
              ))}
            </ul>

            {hasMore ? (
              <div className="mt-6 flex flex-col items-center gap-2">
                <Button variant="secondary" disabled={loadingMore} onClick={loadMore}>
                  {loadingMore ? "Loading older activity…" : "Load older activity"}
                </Button>
                {moreError && <p role="alert" className="text-sm text-red-700">{moreError}</p>}
              </div>
            ) : (
              <p className="mt-6 text-center text-sm text-ink-muted">You&apos;re all caught up.</p>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-ink/10 px-4 py-6 text-sm text-ink-muted">
        <nav aria-label="Footer" className="mx-auto flex max-w-2xl gap-4">
          <Link href="/privacy" className="hover:text-ink">Privacy</Link>
          <Link href="/terms" className="hover:text-ink">Terms</Link>
          <Link href="/status" className="hover:text-ink">Status</Link>
        </nav>
      </footer>
    </div>
  );
}
