"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/Button";

function InfoIcon(props: { "aria-hidden"?: boolean | "true" }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function Tooltip({ content, children }: { content: ReactNode; children: ReactNode }) {
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
      {children}
      {open && (
        <span role="tooltip" className="absolute left-0 top-full z-10 mt-2 w-64 rounded-md bg-ink p-3 text-sm text-surface">
          {content}
        </span>
      )}
    </span>
  );
}

function Popover({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block" onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls="seat-limits"
        onClick={() => setOpen((v) => !v)}
        className="grid h-11 w-11 place-items-center rounded-full text-ink-muted hover:bg-surface-raised"
      >
        <InfoIcon aria-hidden="true" />
      </button>
      {open && (
        <div id="seat-limits" className="absolute left-0 top-full z-10 mt-2 w-64 rounded-md border border-ink/10 bg-surface p-3 text-sm shadow-lg">
          {children}
        </div>
      )}
    </span>
  );
}

const plans = [
  { id: "starter", name: "Starter", price: 8 },
  { id: "team", name: "Team", price: 12 },
  { id: "business", name: "Business", price: 20 },
];

export default function CheckoutPage() {
  const [planId, setPlanId] = useState("team");
  const [seats] = useState(8);
  const [hold, setHold] = useState(0);
  const [warnOpen, setWarnOpen] = useState(false);
  const [expired, setExpired] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const plan = plans.find((p) => p.id === planId)!;

  function releaseHold() {
    setWarnOpen(false);
    setExpired(true);
  }

  useEffect(() => {
    const t = setTimeout(releaseHold, 10 * 60_000);
    return () => clearTimeout(t);
  }, [hold]);

  return (
    <main className="mx-auto max-w-2xl bg-surface p-8 text-ink">
      <style>{`button, a, [role="button"] { touch-action: manipulation; }`}</style>
      <h1 className="text-xl font-semibold">Checkout</h1>
      <p className="mt-2 text-sm text-ink-muted">We are holding this price for you for 10 minutes.</p>

      <div role="alert" className="mt-4">
        {warnOpen && (
          <div className="flex flex-wrap items-center gap-3 rounded-md border border-ink/15 bg-surface-raised p-4 text-sm">
            <p>Your price hold ends in 1 minute.</p>
            <Button className="min-h-11" onClick={() => { setWarnOpen(false); setHold((h) => h + 1); }}>Keep this price</Button>
            <Button variant="secondary" className="min-h-11" onClick={releaseHold}>Release it</Button>
          </div>
        )}
      </div>
      <p role="status" className="text-sm">{expired ? "Your price hold has ended. Current prices apply." : ""}</p>

      <section className="mt-8 rounded-lg border border-ink/10 p-6">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h4 className="text-md font-medium">{plan.name} plan</h4>
            <p className="text-sm text-ink-muted">${plan.price} per seat, billed monthly</p>
          </div>
          <Button variant="secondary" className="min-h-11" onClick={() => dialogRef.current?.showModal()}>Change plan</Button>
        </div>

        <div className="mt-6 flex items-center gap-1">
          <h3 className="text-md font-medium">{seats} seats</h3>
          <Tooltip content={<>Seats added above your plan limit are billed at the end of the month. <a href="/docs/seat-limits" className="underline">Seat limits guide</a></>}>
            <button type="button" aria-label="About seat limits" className="grid h-11 w-11 place-items-center rounded-full text-ink-muted hover:bg-surface-raised">
              <InfoIcon aria-hidden="true" />
            </button>
          </Tooltip>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4">
          <div>
            <h3 className="text-md font-medium">Payment method</h3>
            <p className="text-sm text-ink/40">Visa ending 4242</p>
          </div>
          <span className="h-2 w-2 rounded-full bg-success" />
        </div>

        <p className="mt-6 text-lg font-semibold">Total ${plan.price * seats} / month</p>
      </section>

      <div className="mt-8 flex justify-end gap-3">
        <Button variant="secondary" className="min-h-11">Back</Button>
        <Button tabIndex={1} className="min-h-11">Pay ${plan.price * seats}</Button>
      </div>

      <dialog ref={dialogRef} className="m-auto w-full max-w-md rounded-lg bg-surface p-6 text-ink backdrop:bg-ink/40">
        <h2 id="plan-title" className="text-lg font-semibold">Change plan</h2>
        <fieldset className="mt-4 space-y-2">
          <legend className="text-sm text-ink-muted">Choose a plan for {seats} seats</legend>
          {plans.map((p) => (
            <label key={p.id} className="flex min-h-11 items-center gap-3 rounded-md border border-ink/10 px-3 text-md">
              <input type="radio" name="plan" value={p.id} checked={planId === p.id} onChange={() => setPlanId(p.id)} />
              {p.name}, ${p.price} per seat
            </label>
          ))}
        </fieldset>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" className="min-h-11" onClick={() => dialogRef.current?.close()}>Cancel</Button>
          <Button className="min-h-11" onClick={() => dialogRef.current?.close()}>Apply</Button>
        </div>
      </dialog>
    </main>
  );
}
