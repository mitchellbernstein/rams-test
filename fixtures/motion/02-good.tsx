"use client";

import { createElement, Fragment, useState, type HTMLAttributes, type ReactNode } from "react";
import { Button } from "@/components/Button";

// Minimal local stand-ins for framer-motion, which is not installed in this repo.
type Target = Record<string, unknown>;
type MotionProps = Omit<HTMLAttributes<HTMLElement>, "style"> & {
  initial?: Target | string | false;
  animate?: Target | string;
  exit?: Target;
  transition?: Target;
  layout?: boolean;
  style?: Record<string, unknown>;
};
function motionTag(tag: string) {
  return function MotionElement({ initial, animate, exit, transition, layout, style, ...rest }: MotionProps) {
    void [initial, animate, exit, transition, layout];
    return createElement(tag, { ...rest, style });
  };
}
const motion = { div: motionTag("div"), aside: motionTag("aside"), section: motionTag("section"), span: motionTag("span") };
function AnimatePresence({ children }: { children: ReactNode; initial?: boolean }) {
  return createElement(Fragment, null, children);
}
function MotionConfig({ children }: { children: ReactNode; reducedMotion?: "user" | "always" | "never" }) {
  return createElement(Fragment, null, children);
}

const lineItems = [
  { label: "Bookkeeping, March", amount: "$1,200.00" },
  { label: "Payroll run (2x)", amount: "$340.00" },
  { label: "Receipt capture add-on", amount: "$49.00" },
];

function SummaryPanel() {
  return (
    <motion.section
      className="rounded-md bg-surface-raised p-4 text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2, ease: "easeOut" } }}
      exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeIn" } }}
    >
      <p className="font-medium">Total due $1,589.00</p>
      <p className="text-ink-muted">Due 30 November · Net 15</p>
    </motion.section>
  );
}

function NotesPanel() {
  return (
    <motion.div
      className="rounded-md border border-ink/10 bg-surface p-4 text-sm shadow-lg"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }}
      exit={{ opacity: 0, y: -4, transition: { duration: 0.15, ease: "easeIn" } }}
    >
      Client asked to split the payroll line across two cost centres.
    </motion.div>
  );
}

export default function InvoiceScreen() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [showSummary, setShowSummary] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [autoRemind, setAutoRemind] = useState(true);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function send() {
    setDialogOpen(false);
    setToast("Invoice INV-2041 sent");
    window.setTimeout(() => setToast(null), 4000);
  }

  return (
    <MotionConfig reducedMotion="user">
      <style>{`
        .backdrop { position: fixed; inset: 0; background: rgb(17 17 17 / 0.4); transition: opacity 200ms ease-out; }
        .backdrop[data-open="false"] { opacity: 0; pointer-events: none; transition-duration: 150ms; transition-timing-function: ease-in; }
        .save-status { transition: opacity 200ms ease-out, transform 200ms ease-out; }
        .save-status[data-visible="false"] { opacity: 0; transform: translateY(4px); }
        @media (prefers-reduced-motion: reduce) {
          .save-status { transform: none; transition: opacity 150ms ease-out; }
        }
        @keyframes hint-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
        .hint { animation: hint-in 200ms cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12 text-ink sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Invoice INV-2041</h1>
            <p className="text-sm text-ink-muted">Northwind Traders · Draft</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="active:scale-[0.97]" onClick={() => setActivityOpen(true)}>
              Activity
            </Button>
            <Button className="active:scale-[0.97]" onClick={() => setDialogOpen(true)}>
              Send invoice
            </Button>
          </div>
        </div>

        <table className="w-full text-sm">
          <tbody>
            {lineItems.map((item) => (
              <tr key={item.label} className="border-b border-ink/10">
                <td className="py-3">{item.label}</td>
                <td className="py-3 text-end tabular-nums">{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col gap-2">
          <button type="button" className="self-start text-sm font-medium text-brand" onClick={() => setShowSummary((s) => !s)}>
            {showSummary ? "Hide summary" : "Show summary"}
          </button>
          <AnimatePresence initial={false}>{showSummary && <SummaryPanel key="summary" />}</AnimatePresence>
        </div>

        <div className="relative flex flex-col gap-2">
          <button type="button" className="self-start text-sm font-medium text-brand" onClick={() => setNotesOpen((o) => !o)}>
            Internal notes
          </button>
          <AnimatePresence>{notesOpen && <NotesPanel key="notes" />}</AnimatePresence>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-md border border-ink/10 p-4">
          <div className="relative flex items-center gap-2 text-sm">
            Auto-send reminders
            <button type="button" aria-label="What are reminders?" className="text-ink-muted" onClick={() => setHintOpen((o) => !o)}>
              ?
            </button>
            {hintOpen && (
              <p role="tooltip" className="hint absolute start-0 top-8 z-10 w-64 rounded-md bg-ink p-3 text-sm text-surface">
                We email the client 3 days before and on the due date.
              </p>
            )}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={autoRemind}
            aria-label="Auto-send reminders"
            onClick={() => { setAutoRemind((v) => !v); setSaved(true); }}
            className={`flex h-6 w-11 rounded-full p-0.5 transition-colors duration-300 ${autoRemind ? "justify-end bg-brand" : "justify-start bg-ink/20"}`}
          >
            <motion.span layout transition={{ type: "spring", duration: 0.3, bounce: 0.1 }} className="size-5 rounded-full bg-surface" />
          </button>
        </div>
        <p className="save-status text-sm text-success" data-visible={saved} aria-live="polite">
          Reminder settings saved
        </p>
      </main>

      <div className="backdrop" data-open={dialogOpen} onClick={() => setDialogOpen(false)} />
      <AnimatePresence>
        {dialogOpen && (
          <motion.div
            key="send-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="send-title"
            className="fixed inset-x-4 top-24 mx-auto max-w-md rounded-lg bg-surface p-6 shadow-lg"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15, ease: "easeIn" } }}
          >
            <h2 id="send-title" className="text-lg font-semibold">Send to Northwind Traders?</h2>
            <p className="mt-2 text-sm text-ink-muted">The invoice goes to billing@northwind.example with a PDF attached.</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" className="active:scale-[0.97]" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="active:scale-[0.97]" onClick={send}>
                Send
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activityOpen && (
          <motion.aside
            key="activity"
            aria-label="Activity"
            className="fixed inset-y-0 end-0 w-80 max-w-full bg-surface p-6 shadow-lg"
            initial={{ x: "100%" }}
            animate={{ x: 0, transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] } }}
            exit={{ x: "100%", transition: { duration: 0.2, ease: "easeIn" } }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Activity</h2>
              <button type="button" className="text-sm text-ink-muted" onClick={() => setActivityOpen(false)}>
                Close
              </button>
            </div>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li>Draft created by Maya · 2 days ago</li>
              <li>Payroll line edited by Jonas · yesterday</li>
            </ul>
          </motion.aside>
        )}
      </AnimatePresence>

      <div aria-live="polite" className="fixed bottom-4 end-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast}
              className="rounded-md bg-ink px-4 py-3 text-sm text-surface shadow-lg"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.15, ease: "easeIn" } }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
