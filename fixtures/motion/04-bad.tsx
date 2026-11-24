"use client";

import { createElement, Fragment, useState, type HTMLAttributes, type ReactNode } from "react";
import { Button } from "@/components/Button";

// Minimal local stand-ins for framer-motion and next-themes, which are not installed in this repo.
type Target = Record<string, unknown>;
type MotionProps = Omit<HTMLAttributes<HTMLElement>, "style"> & {
  initial?: Target | string | false;
  animate?: Target | string;
  exit?: Target;
  layoutId?: string;
  style?: Record<string, unknown>;
};
function motionTag(tag: string) {
  return function MotionElement({ initial, animate, exit, layoutId, style, ...rest }: MotionProps) {
    void [initial, animate, exit, layoutId];
    return createElement(tag, { ...rest, style });
  };
}
const motion = { div: motionTag("div"), span: motionTag("span") };
function AnimatePresence({ children }: { children: ReactNode; initial?: boolean; mode?: "wait" | "sync" }) {
  return createElement(Fragment, null, children);
}
function MotionConfig({ children }: { children: ReactNode; reducedMotion?: "user" | "always" | "never" }) {
  return createElement(Fragment, null, children);
}
function ThemeProvider({ children }: { children: ReactNode; attribute: "class" | "data-theme"; disableTransitionOnChange?: boolean }) {
  return createElement(Fragment, null, children);
}

const motionTokens = { fast: 0.15, faster: 0.1, md: 0.25, ease: [0.22, 1, 0.36, 1], easeIn: [0.4, 0, 1, 1] };

const paths = {
  copy: "M8 8h11v11H8zM5 16V5h11",
  check: "M5 12l5 5 9-10",
};

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="size-4">
      <path d={path} />
    </svg>
  );
}

const tabs = ["General", "Billing", "API"] as const;
const plans = [
  { id: "starter", name: "Starter", price: "$0" },
  { id: "team", name: "Team", price: "$24" },
  { id: "business", name: "Business", price: "$79" },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("General");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [plan, setPlan] = useState("team");
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [copied, setCopied] = useState(false);
  const [noticeHidden, setNoticeHidden] = useState(false);
  const [dirty, setDirty] = useState(false);

  function copyKey() {
    navigator.clipboard.writeText("lk_live_4f9a2c");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <ThemeProvider attribute="class">
      <>
        <style>{`
          .settings { --duration-fast: 150ms; --duration-md: 250ms; --ease-standard: cubic-bezier(0.22, 1, 0.36, 1); }
          .switch-track { transition: background-color var(--duration-fast) var(--ease-standard); }
          .switch-thumb { transition: transform var(--duration-md) var(--ease-standard); }
          .switch-track[aria-checked="true"] .switch-thumb { transform: translateX(20px); }
          .notice { transition: opacity 370ms cubic-bezier(.2,.9,.3,1); }
          .notice[data-hidden="true"] { opacity: 0; pointer-events: none; }
        `}</style>

        <div className={`settings min-h-screen bg-surface text-ink ${theme}`}>
          <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-xl font-semibold">Settings</h1>
              <Button variant="secondary" className="active:scale-[0.97]" onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
                {theme === "light" ? "Dark mode" : "Light mode"}
              </Button>
            </div>

            <p className="notice rounded-md bg-surface-raised px-4 py-3 text-sm" data-hidden={noticeHidden}>
              Your trial ends in 9 days.{" "}
              <button type="button" className="font-medium text-brand" onClick={() => setNoticeHidden(true)}>
                Dismiss
              </button>
            </p>

            <div role="tablist" aria-label="Settings sections" className="flex gap-4 border-b border-ink/10">
              {tabs.map((t) => {
                const active = t === tab;
                return (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTab(t)}
                    className={`relative py-3 text-sm font-medium transition-colors duration-(--duration-fast) ${active ? "text-ink" : "text-ink-muted hover:text-ink"}`}
                  >
                    {t}
                    {active && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-brand" />}
                  </button>
                );
              })}
            </div>

            {tab === "General" && (
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4 rounded-md border border-ink/10 p-4">
                  <span className="text-sm">Weekly digest email</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={weeklyDigest}
                    aria-label="Weekly digest email"
                    onClick={() => { setWeeklyDigest((v) => !v); setDirty(true); }}
                    className={`switch-track h-6 w-11 rounded-full p-0.5 ${weeklyDigest ? "bg-brand" : "bg-ink/20"}`}
                  >
                    <span className="switch-thumb block size-5 rounded-full bg-surface" />
                  </button>
                </div>
                <label className="flex flex-col gap-1.5 text-sm">
                  Company name
                  <input
                    defaultValue="Ledgerly AB"
                    onChange={() => setDirty(true)}
                    className="h-10 rounded-md border border-ink/15 px-3 transition-colors duration-(--duration-fast) focus:border-brand"
                  />
                </label>
              </section>
            )}

            {tab === "Billing" && (
              <section className="grid gap-4 sm:grid-cols-3">
                {plans.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={plan === p.id}
                    onClick={() => { setPlan(p.id); setDirty(true); }}
                    className={`flex flex-col gap-1 rounded-lg border p-4 text-start transition-transform duration-(--duration-fast) hover:scale-110 active:scale-[0.98] ${plan === p.id ? "border-brand" : "border-ink/10"}`}
                  >
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="text-lg font-semibold">{p.price}</span>
                  </button>
                ))}
              </section>
            )}

            {tab === "API" && (
              <section className="flex flex-col gap-2">
                <span className="text-sm font-medium">Live key</span>
                <div className="flex items-center gap-2 rounded-md border border-ink/10 px-3 py-2">
                  <code className="flex-1 text-sm">lk_live_4f9a2c••••••••</code>
                  <button
                    type="button"
                    aria-label={copied ? "Copied" : "Copy key"}
                    onClick={copyKey}
                    className="rounded-md p-2 text-ink-muted transition-colors duration-(--duration-fast) hover:bg-surface-raised hover:text-ink"
                  >
                    {copied ? <Icon path={paths.check} /> : <Icon path={paths.copy} />}
                  </button>
                </div>
              </section>
            )}
          </main>

          <AnimatePresence>
            {dirty && (
              <motion.div
                key="save-bar"
                className="fixed inset-x-4 bottom-4 mx-auto flex max-w-md items-center justify-between gap-4 rounded-lg bg-ink px-4 py-3 text-sm text-surface shadow-lg"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: motionTokens.md, ease: motionTokens.ease } }}
                exit={{ opacity: 0, y: 8, transition: { duration: motionTokens.fast, ease: motionTokens.easeIn } }}
              >
                Unsaved changes
                <Button className="active:scale-[0.85]" onClick={() => setDirty(false)}>
                  Save
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    </ThemeProvider>
  );
}
