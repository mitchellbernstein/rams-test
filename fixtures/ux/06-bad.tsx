"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";

type Comment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  editedBy?: { name: string };
};

const initialComments: Comment[] = [
  { id: "c1", author: "Kofi Mensah", body: "Can we move the beta date to the 14th? QA needs two more days.", createdAt: "2026-11-20T09:12:00Z" },
  { id: "c2", author: "Mei Tanaka", body: "Works for design. I'll update the timeline slide.", createdAt: "2026-11-20T10:40:00Z", editedBy: { name: "Mei Tanaka" } },
  { id: "c3", author: "Ana Lima", body: "Agreed. Moving it now and pinging support.", createdAt: "2026-11-21T08:05:00Z" },
];

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function CommentsPanel() {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !menuFor) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, menuFor]);

  useEffect(() => {
    if (!copyStatus?.ok) return;
    const timer = setTimeout(() => setCopyStatus(null), 3000);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  async function copyLink(id: string) {
    setMenuFor(null);
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#comment-${id}`);
    setCopyStatus({ ok: true, text: "Link to comment copied" });
  }

  function quote(comment: Comment) {
    setMenuFor(null);
    setDraft((d) => `> ${comment.body}\n\n${d}`);
    textareaRef.current?.focus();
  }

  async function post(e?: React.SyntheticEvent) {
    e?.preventDefault();
    const body = draft.trim();
    if (!body || posting) return;
    setPosting(true);
    setPostError(null);
    try {
      const res = await fetch("/api/docs/q3-launch/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const created: Comment = await res.json();
      setComments((cs) => [...cs, created]);
      setDraft("");
    } catch {
      setPostError("Your comment wasn't posted. It's still in the box, so you can try again.");
    } finally {
      setPosting(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) post(e);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-ink">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Q3 launch plan</h1>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Comments ({comments.length})
        </Button>
      </div>
      <article className="mt-6 space-y-4 text-md leading-relaxed">
        <p>The beta opens to the waitlist first, then to all workspaces two weeks later.</p>
        <p>Support gets the help center draft one week before the beta opens.</p>
      </article>

      {open && (
        <div className="fixed inset-0 bg-ink/30">
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="comments-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface shadow-xl"
          >
            <header className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
              <h2 id="comments-title" className="text-md font-semibold">{plural(comments.length, "comment", "comments")}</h2>
              <button type="button" aria-label="Close comments" onClick={() => setOpen(false)} className="size-10 rounded-md hover:bg-surface-raised">
                ×
              </button>
            </header>

            <ol className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {comments.map((c) => (
                <li key={c.id} id={`comment-${c.id}`} className="relative rounded-md bg-surface-raised p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{c.author}</p>
                      <time dateTime={c.createdAt} className="text-sm text-ink-muted">{formatDate(c.createdAt)}</time>
                    </div>
                    <div ref={menuFor === c.id ? menuRef : undefined} className="relative">
                      <button
                        type="button"
                        aria-label="Comment actions"
                        aria-haspopup="menu"
                        aria-expanded={menuFor === c.id}
                        onClick={() => setMenuFor(menuFor === c.id ? null : c.id)}
                        className="size-8 rounded-md hover:bg-ink/5"
                      >
                        ⋯
                      </button>
                      {menuFor === c.id && (
                        <div role="menu" className="absolute right-0 z-10 mt-1 w-44 rounded-md border border-ink/10 bg-surface py-1 shadow-lg">
                          <button role="menuitem" type="button" onClick={() => copyLink(c.id)} className="block w-full px-3 py-2 text-left text-sm hover:bg-surface-raised">
                            Copy link
                          </button>
                          <button role="menuitem" type="button" onClick={() => quote(c)} className="block w-full px-3 py-2 text-left text-sm hover:bg-surface-raised">
                            Quote in reply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 select-none whitespace-pre-wrap text-md">{c.body}</p>
                  <p className="mt-1 text-xs text-ink-muted">Edited by {c.editedBy?.name}</p>
                </li>
              ))}
            </ol>

            {copyStatus && (
              <p role={copyStatus.ok ? "status" : "alert"} className={`px-4 py-2 text-sm ${copyStatus.ok ? "text-success" : "text-red-700"}`}>
                {copyStatus.text}
              </p>
            )}

            <form onSubmit={post} className="border-t border-ink/10 p-4">
              <label htmlFor="new-comment" className="sr-only">Add a comment</label>
              <textarea
                id="new-comment"
                ref={textareaRef}
                rows={3}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Add a comment"
                className="w-full rounded-md border border-ink/15 bg-surface px-3 py-2 text-md"
              />
              {postError && <p role="alert" className="mt-2 text-sm text-red-700">{postError}</p>}
              <div className="mt-2 flex justify-end">
                <Button type="submit" disabled={posting}>
                  {posting ? "Posting…" : "Post comment"}
                </Button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </main>
  );
}
