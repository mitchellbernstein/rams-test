"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/Button";

const contacts = [
  { id: "c1", name: "Priya Raman", email: "priya@acme.co" },
  { id: "c2", name: "Priscilla Okafor", email: "priscilla@northwind.io" },
  { id: "c3", name: "Marco Bianchi", email: "marco@acme.co" },
];

const messages = [
  { id: "m1", subject: "Q4 roadmap draft", from: "Priya Raman" },
  { id: "m2", subject: "Invoice 2291 is ready", from: "Northwind Billing" },
  { id: "m3", subject: "Design review moved to Thursday", from: "Marco Bianchi" },
  { id: "m4", subject: "Welcome to the beta", from: "Acme Team" },
  { id: "m5", subject: "Your export is ready", from: "Acme Team" },
  { id: "m6", subject: "Lunch on Friday?", from: "Priscilla Okafor" },
];

function HoverCard({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const show = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), 200);
  };
  const hide = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 150);
  };
  return (
    <span
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      {trigger}
      {open && <span className="absolute left-0 top-full z-10 block w-64 pt-2">{children}</span>}
    </span>
  );
}

function ProfileCard() {
  return (
    <span className="block rounded-md border border-ink/10 bg-surface p-4 text-sm shadow-lg">
      <span className="block font-medium">Priya Raman</span>
      <span className="block text-ink-muted">Product lead, Acme</span>
    </span>
  );
}

export default function InboxPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1);
  const [to, setTo] = useState<string | null>(null);
  const [pages, setPages] = useState(1);
  const [cardOpen, setCardOpen] = useState(false);
  const [archivedIds, setArchivedIds] = useState<string[]>([]);
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);

  const hits = q && !to ? contacts.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())) : [];
  const open = hits.length > 0;
  const visible = messages.filter((m) => !archivedIds.includes(m.id)).slice(0, pages * 3);

  function pick(name: string) {
    setTo(name);
    setQ(name);
    setActive(-1);
  }

  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "e" && visible[0]) {
        e.preventDefault();
        setArchivedIds((ids) => [...ids, visible[0].id]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  return (
    <main className="mx-auto max-w-3xl bg-surface p-8 text-ink">
      <style>{`button, a, [role="button"] { touch-action: manipulation; }`}</style>
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Inbox</h1>
        <nav aria-label="Account" className="flex items-center gap-2">
          <Button variant="secondary" className="min-h-11" onClick={() => setHelpOpen(true)}>Keyboard shortcuts</Button>
          <button type="button" onClick={() => router.push("/settings")} className="flex min-h-11 items-center rounded-md px-4 text-sm font-medium hover:bg-surface-raised">Settings</button>
        </nav>
      </header>

      <section className="mt-8 rounded-lg border border-ink/10 p-6">
        <h2 className="text-lg font-semibold">New message</h2>
        <div className="relative mt-4">
          <label htmlFor="to" className="block text-sm font-medium">To</label>
          <input
            id="to"
            value={q}
            onChange={(e) => { setQ(e.target.value); setTo(null); setActive(-1); }}
            autoComplete="off"
            className="mt-2 h-11 w-full rounded-md border border-ink/20 px-3 text-md"
          />
          {open && (
            <div className="absolute inset-x-0 top-full z-10 mt-1 rounded-md border border-ink/10 bg-surface shadow-lg">
              {hits.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => pick(c.name)}
                  className="flex min-h-11 w-full flex-col justify-center px-3 text-left text-sm hover:bg-surface-raised"
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-ink-muted">{c.email}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Messages</h2>
        <ul className="mt-4 divide-y divide-ink/10">
          {visible.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-4 py-2">
              <a href={`/inbox/${m.id}`} className="flex min-h-11 items-center text-md font-medium">{m.subject}</a>
              {m.from === "Priya Raman" ? (
                <span className="relative inline-block" onMouseEnter={() => setCardOpen(true)} onMouseLeave={() => setCardOpen(false)}>
                  <a href="/people/priya" className="inline-flex min-h-11 items-center text-sm text-ink-muted underline">{m.from}</a>
                  {cardOpen && <span className="absolute left-0 top-full z-10 block w-64 pt-2"><ProfileCard /></span>}
                </span>
              ) : (
                <span className="text-sm text-ink-muted">{m.from}</span>
              )}
            </li>
          ))}
        </ul>
        <div
          onClick={() => setPages((p) => p + 1)}
          className="mt-4 flex min-h-11 w-full items-center justify-center rounded-md border border-ink/15 text-sm font-medium hover:bg-surface-raised"
        >
          Load older messages
        </div>
      </section>

      {helpOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="help-title" className="fixed inset-0 z-20 grid place-items-center bg-ink/40">
          <div className="w-full max-w-sm rounded-lg bg-surface p-6 text-ink">
            <h2 id="help-title" className="text-lg font-semibold">Keyboard shortcuts</h2>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              <dt className="font-mono">E</dt>
              <dd>Archive the top message</dd>
            </dl>
            <Button className="mt-6 min-h-11" onClick={() => setHelpOpen(false)}>Close</Button>
          </div>
        </div>
      )}
    </main>
  );
}
