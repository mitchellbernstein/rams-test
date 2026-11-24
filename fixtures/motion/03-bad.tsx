"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/Button";

// Minimal local stand-ins for Radix HoverCard and Tooltip, which are not installed in this repo.
const HoverCard = {
  Root: ({ children }: { children: ReactNode; openDelay?: number; closeDelay?: number }) => <span className="relative">{children}</span>,
  Trigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  Content: ({ children, className }: { children: ReactNode; className?: string }) => <div className={className}>{children}</div>,
};
const Tooltip = {
  Provider: ({ children }: { children: ReactNode; delayDuration?: number; skipDelayDuration?: number }) => <>{children}</>,
  Root: ({ children }: { children: ReactNode }) => <span className="relative">{children}</span>,
  Trigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  Content: ({ children }: { children: ReactNode }) => <span role="tooltip" className="tooltip-content">{children}</span>,
};

const paths = {
  chevronDown: "M6 9l6 6 6-6",
  chevronUp: "M18 15l-6-6-6 6",
  arrow: "M5 12h14m-6-6l6 6-6 6",
  link: "M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1",
  print: "M6 9V3h12v6M6 18H4v-7h16v7h-2M8 14h8v7H8z",
  share: "M4 12v7h16v-7M12 3v12m-4-8l4-4 4 4",
};

function Icon({ path, className = "size-4" }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className={className}>
      <path d={path} />
    </svg>
  );
}

const navLinks = ["Guides", "API", "Community"];
const products = ["Ledger", "Payroll", "Receipts", "Reports"];
const tools = [
  { label: "Copy link", path: paths.link },
  { label: "Print", path: paths.print },
  { label: "Share", path: paths.share },
];
const faqs = [
  { q: "How do I invite my accountant?", a: "Open Team, choose Invite and pick the Accountant role. They get read access to every ledger." },
  { q: "Can I undo a reconciliation?", a: "Yes. Open the period, choose Reopen and the matched entries return to the queue." },
  { q: "Which banks are supported?", a: "Over 2,400 banks in Europe and North America connect through our feed partners." },
];

export default function HelpCenter() {
  const [productsOpen, setProductsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-surface text-ink">
      <style>{`
        .menu { transform-origin: top left; opacity: 0; transform: scale(0.96); visibility: hidden; transition: opacity 150ms ease-out, transform 150ms ease-out, visibility 150ms; }
        @keyframes menu-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: none; } }
        .menu[data-open="true"] { visibility: visible; animation: menu-in 150ms ease-out forwards; }
        @keyframes pop-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: none; } }
        .popover { animation: pop-in 150ms ease-out both; }
        .hovercard { transform-origin: top left; animation: pop-in 150ms ease-out both; }
        .more-panel { display: none; opacity: 0; transition: opacity 150ms ease-out; }
        .more-panel[data-open="true"] { display: block; opacity: 1; }
        .tooltip-content { position: absolute; top: 100%; left: 50%; translate: -50% 8px; white-space: nowrap; transform-origin: top center; animation: pop-in 150ms ease-out both; }
        .faq-panel { max-height: 0; overflow: hidden; transition: max-height 200ms ease-out; }
        .faq-panel[data-open="true"] { max-height: 1000px; }
      `}</style>

      <header className="border-b border-ink/10">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="text-md font-semibold">Ledgerly Help</span>
            <div className="relative hidden md:block">
              <button
                type="button"
                aria-expanded={productsOpen}
                onClick={() => setProductsOpen((o) => !o)}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
              >
                Products
                <Icon path={paths.chevronDown} className={`size-4 transition-transform duration-150 ${productsOpen ? "rotate-180" : ""}`} />
              </button>
              <ul className="menu absolute start-0 top-12 z-10 w-48 rounded-lg bg-surface p-1 shadow-lg ring-1 ring-ink/5" data-open={productsOpen}>
                {products.map((p) => (
                  <li key={p}>
                    <a href={`/help/${p.toLowerCase()}`} className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-surface-raised">
                      {p}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <nav aria-label="Main" className="hidden items-center md:flex">
              {navLinks.map((label) => (
                <a key={label} href={`/${label.toLowerCase()}`} className="rounded-md px-3 py-2 text-sm text-ink-muted transition-all hover:text-ink">
                  {label}
                </a>
              ))}
              <a href="/changelog" className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink">
                Changelog
                <Icon path={paths.arrow} className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" aria-expanded={moreOpen} onClick={() => setMoreOpen((o) => !o)} className="rounded-md px-3 py-2 text-sm md:hidden">
              More
            </button>
            <div className="relative">
              <button type="button" aria-expanded={accountOpen} onClick={() => setAccountOpen((o) => !o)} className="rounded-md px-3 py-2 text-sm">
                Maya
              </button>
              {accountOpen && (
                <div className="popover absolute end-0 top-12 z-10 w-56 rounded-lg bg-surface p-3 text-sm shadow-lg ring-1 ring-ink/5">
                  <p className="font-medium">Maya Lindqvist</p>
                  <p className="text-ink-muted">maya@ledgerly.app</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <nav aria-label="More" className="more-panel border-t border-ink/10 px-4 py-2 md:hidden" data-open={moreOpen}>
          {navLinks.map((label) => (
            <a key={label} href={`/${label.toLowerCase()}`} className="block py-2 text-sm">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-12 sm:px-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-xl font-semibold">Closing your first month</h1>
          <p className="text-sm text-ink-muted">
            Written by{" "}
            <HoverCard.Root openDelay={0} closeDelay={150}>
              <HoverCard.Trigger>
                <a href="/authors/jonas" className="font-medium text-ink underline">Jonas Berg</a>
              </HoverCard.Trigger>
              <HoverCard.Content className="hovercard absolute start-0 top-6 z-10 w-64 rounded-lg bg-surface p-3 shadow-lg ring-1 ring-ink/5">
                Jonas leads onboarding and has helped 300 teams through their first close.
              </HoverCard.Content>
            </HoverCard.Root>
          </p>
          <Tooltip.Provider delayDuration={600} skipDelayDuration={0}>
            <div role="toolbar" aria-label="Article tools" className="flex gap-1">
              {tools.map((t) => (
                <Tooltip.Root key={t.label}>
                  <Tooltip.Trigger>
                    <button type="button" aria-label={t.label} className="rounded-md p-2 text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink">
                      <Icon path={t.path} />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Content>{t.label}</Tooltip.Content>
                </Tooltip.Root>
              ))}
            </div>
          </Tooltip.Provider>
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Frequently asked</h2>
          {faqs.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={item.q} className="border-b border-ink/10">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-start text-md font-medium"
                >
                  {item.q}
                  {open ? <Icon path={paths.chevronUp} className="size-4 shrink-0" /> : <Icon path={paths.chevronDown} className="size-4 shrink-0" />}
                </button>
                <div className="faq-panel" data-open={open}>
                  <div>
                    <p className="pb-4 text-sm text-ink-muted">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <div>
          <Button className="active:scale-[0.97]">Contact support</Button>
        </div>
      </main>
    </div>
  );
}
