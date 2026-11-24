import Link from "next/link";
import { Button } from "@/components/Button";
import { Badge, cardClass, cn } from "./ui";

const invoices = [
  { id: "INV-2025-011", date: "Nov 1, 2025", amount: 24 },
  { id: "INV-2025-010", date: "Oct 1, 2025", amount: 24 },
  { id: "INV-2025-009", date: "Sep 1, 2025", amount: 24 },
];

function PlanPrice({ amount, tone }: { amount: number; tone: string }) {
  return (
    <p className={cn("text-xl font-semibold", tone === "brand" ? "text-brand" : "text-ink")}>
      ${amount}
      <span className="text-sm font-normal text-ink-muted"> / month</span>
    </p>
  );
}

const meterHeight = { sm: "h-1", md: "h-2" };

function UsageMeter({ label, used, limit, size }: { label: string; used: number; limit: number; size: "sm" | "md" }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-ink">{label}</span>
        <span className="text-ink-muted">
          {used} of {limit}
        </span>
      </div>
      <div className={cn("mt-2 rounded-full bg-surface-raised", meterHeight[size])}>
        <div className={cn("rounded-full bg-brand", meterHeight[size])} style={{ width: `${(used / limit) * 100}%` }} />
      </div>
    </div>
  );
}

function StatusDot({ tone }: { tone: "brand" | "success" }) {
  return <span className={`inline-block size-2 rounded-full bg-${tone}`} aria-hidden="true" />;
}

export default function BillingPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Billing</h1>
          <p className="mt-1 text-md text-ink-muted">Your plan, usage and past invoices.</p>
        </div>
        <Button variant="secondary">Update card</Button>
      </header>

      <section className={cn(cardClass, "mt-8")}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-ink">Team plan</h2>
              <Badge tone="brand" className="h-8 px-3 text-md">Current plan</Badge>
            </div>
            <p className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
              <StatusDot tone="success" /> Renews on December 1
            </p>
          </div>
          <PlanPrice amount={24} tone="brand" />
        </div>

        <div className="mt-6 space-y-4">
          <UsageMeter label="Invoices sent" used={184} limit={250} size="md" />
          <UsageMeter label="Team seats" used={3} limit={5} size="md" />
        </div>

        <div className="mt-6 flex gap-3">
          <Button style={{ borderRadius: 9999, paddingInline: 24 }}>Upgrade to Business</Button>
          <Button variant="secondary">Cancel plan</Button>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-ink/15 bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Invoices</h2>
          <Link href="/billing/invoices">
            <Button variant="secondary">View all invoices</Button>
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-ink/15">
          {invoices.map((inv) => (
            <li key={inv.id} className="flex items-center justify-between py-3 text-sm">
              <span className="text-ink">{inv.id}</span>
              <span className="text-ink-muted">{inv.date}</span>
              <span className="font-medium text-ink">${inv.amount}.00</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
