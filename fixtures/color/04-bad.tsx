import Link from "next/link";
import { Button } from "@/components/Button";

const activity = [
  { id: 1, who: "Northwind Studio", what: "paid invoice #1042", when: "2 hours ago" },
  { id: 2, who: "Lumen Bakery", what: "viewed invoice #1039", when: "Yesterday" },
  { id: 3, who: "Harbor & Co", what: "was added as a client", when: "Monday" },
];

export default function ActivityPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-ink">Activity</h1>
        <Link href="/activity?read=all" className="text-sm font-medium text-brand hover:opacity-70">
          Mark all as read
        </Link>
      </div>

      <div role="alert" className="mt-8 rounded-md border border-ink/15 bg-surface p-4">
        <p className="text-sm font-medium text-brand">Payment failed</p>
        <p className="mt-1 text-sm text-ink-muted">The card on file for Lumen Bakery was declined. We will retry tomorrow.</p>
      </div>

      <div role="status" className="mt-4 rounded-md border border-ink/15 bg-surface p-4">
        <p className="text-sm font-medium text-success">Bank account verified</p>
        <p className="mt-1 text-sm text-ink-muted">Payouts will now arrive in 2 business days.</p>
      </div>

      <ul className="mt-8 divide-y divide-ink/15 rounded-lg border border-ink/15 bg-surface shadow-lg shadow-brand/40">
        {activity.map((item) => (
          <li key={item.id} className="flex items-center justify-between p-4">
            <p className="text-sm text-ink">
              <span className="font-medium">{item.who}</span> {item.what}
            </p>
            <span className="text-sm text-ink-muted">{item.when}</span>
          </li>
        ))}
      </ul>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-ink/40">What&apos;s new in Acme</h2>
        <article className="mt-4 space-y-4 text-md leading-relaxed text-black">
          <p>
            Recurring invoices can now be paused instead of cancelled. Your client keeps their payment method on file,
            and the schedule picks up again from the next billing date when you resume it.
          </p>
          <p>
            We also rebuilt the client list. Search now matches company names, contact names and invoice numbers, and
            the list remembers the filters you used last time you visited.
          </p>
          <p>
            Finally, exports include a tax summary per client, so year-end paperwork no longer needs a spreadsheet of
            its own.
          </p>
        </article>
        <Button variant="secondary" className="mt-6">
          Read the full changelog
        </Button>
      </section>
    </main>
  );
}
