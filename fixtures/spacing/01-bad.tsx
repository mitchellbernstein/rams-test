import { Button } from "@/components/Button";

const plans = [
  {
    name: "Starter",
    price: "$0",
    blurb: "For trying things out on a single project.",
    features: ["1 project", "Community support"],
  },
  {
    name: "Team",
    price: "$24",
    blurb: "For small teams closing the books every month, with shared review queues and full history.",
    features: ["10 projects", "Review queues", "Email support"],
  },
  {
    name: "Business",
    price: "$79",
    blurb: "For finance orgs with audit and compliance needs.",
    features: ["Unlimited projects", "SSO", "Audit log", "Priority support"],
  },
];

const faqs = [
  { q: "Can I switch plans later?", a: "Yes. Upgrades apply right away and downgrades at the end of the billing period." },
  { q: "Do you offer annual billing?", a: "Annual plans get two months free. Switch from the billing page at any time." },
  { q: "Is my data exported if I cancel?", a: "You can export every ledger as CSV for 90 days after cancelling." },
];

const footerLinks = ["Docs", "Changelog", "Status", "Privacy"];

export default function PricingPage() {
  return (
    <div className="bg-surface text-ink">
      <header className="border-b border-ink/10">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-8">
          <span className="text-md font-semibold">Ledgerly</span>
          <Button variant="secondary">Sign in</Button>
        </div>
      </header>

      <main>
        <section className="flex h-screen items-center bg-surface-raised py-24">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-4 sm:px-8">
            <h1 className="text-xl font-semibold">Close the books in days, not weeks</h1>
            <p className="text-md text-ink-muted">Reconcile accounts, chase receipts and review entries in one place.</p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Button>Start free trial</Button>
              <Button variant="secondary">Book a demo</Button>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="flex flex-col gap-8 px-4 sm:px-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Simple pricing</h2>
              <p className="text-md text-ink-muted">Every plan includes unlimited users.</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {plans.map((plan) => (
                <article key={plan.name} className="flex flex-col gap-4 rounded-lg border border-ink/10 p-6">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-md font-semibold">{plan.name}</h3>
                    <p className="text-xl font-semibold">
                      {plan.price}
                      <span className="text-sm font-normal text-ink-muted"> / month</span>
                    </p>
                  </div>
                  <p className="text-sm text-ink-muted">{plan.blurb}</p>
                  <ul className="flex flex-col gap-2 text-sm">
                    {plan.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <Button className="justify-center">Choose {plan.name}</Button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-ink/10 py-14">
          <div className="mx-auto flex max-w-5xl flex-col gap-8 sm:px-8">
            <h2 className="text-lg font-semibold">Questions</h2>
            <dl className="flex flex-col gap-6">
              {faqs.map((item) => (
                <div key={item.q} className="flex flex-col gap-1">
                  <dt className="text-md font-medium">{item.q}</dt>
                  <dd className="text-sm text-ink-muted">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="bg-surface-raised py-20">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 text-center sm:px-8">
            <h2 className="text-lg font-semibold">Ready for month-end?</h2>
            <p className="text-md text-ink-muted">Start free. No card needed.</p>
            <Button>Start free trial</Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-8">
          <span className="text-sm text-ink-muted">© 2026 Ledgerly</span>
          <nav aria-label="Footer" className="flex flex-wrap gap-4">
            {footerLinks.map((label) => (
              <a key={label} href={`/${label.toLowerCase()}`} className="text-sm text-ink-muted hover:text-ink">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
