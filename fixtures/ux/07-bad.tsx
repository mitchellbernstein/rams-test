"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/Button";

const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/docs", label: "Docs" },
  { href: "/team", label: "Team" },
  { href: "/settings/profile", label: "Settings" },
];

function NavLinks({ pathname, vertical = false }: { pathname: string; vertical?: boolean }) {
  return (
    <>
      {nav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-3 py-2 text-sm font-medium hover:font-semibold ${vertical ? "block" : ""} ${
              "text-ink-muted hover:bg-surface-raised hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export default function AppShell() {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (pathname === "/settings") router.push("/settings/profile");
  }, [pathname, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-surface text-ink">
      <header className="flex items-center gap-4 border-b border-ink/10 px-4 py-3">
        <span className="cursor-pointer text-md font-semibold">Acme Inc</span>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          <NavLinks pathname={pathname} />
        </nav>

        <form action="/search" role="search" className="ml-auto flex items-center gap-2">
          <label htmlFor="global-search" className="sr-only">Search</label>
          <input
            id="global-search"
            ref={searchRef}
            name="q"
            type="search"
            placeholder="Search"
            className="h-10 w-40 rounded-md border border-ink/15 bg-surface px-3 text-md"
          />
          <kbd className="rounded-sm border border-ink/15 px-1.5 text-xs text-ink-muted">{isMac ? "⌘K" : "Ctrl K"}</kbd>
        </form>

        <Link href="/projects/new" className="inline-flex h-10 items-center rounded-md bg-brand px-4 text-sm font-medium text-brand-ink hover:bg-brand/90">
          New project
        </Link>
      </header>

      <main className="flex-1 px-4 py-10">
        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-md text-ink-muted">Pick up where you left off, or start from one of the team&apos;s templates.</p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => router.push("/templates")}>
            Browse templates
          </Button>
        </div>
      </main>

      <footer className="flex flex-wrap gap-4 border-t border-ink/10 px-4 py-4 text-sm text-ink-muted">
        <Link href="/settings/billing" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
          Billing <span aria-hidden="true">↗</span>
          <span className="sr-only">(opens in a new tab)</span>
        </Link>
        <a href="https://help.example.com" target="_blank" className="hover:text-ink">
          Help center <span aria-hidden="true">↗</span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </footer>
    </div>
  );
}
