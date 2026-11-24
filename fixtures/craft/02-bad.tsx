import { Button } from "@/components/Button";

type Plan = { id: string; name: string; price: string; summary: string; features: string[]; highlighted: boolean };
type Faq = { id: string; question: string; answer: string; updatedLabel: string };
type FooterLink = { href: string; label: string };

interface PricingPageProps {
  plans: Plan[];
  faqs: Faq[];
  footerLinks: FooterLink[];
  teamCount: number;
  onSelectPlan: (planId: string) => void;
  onCopyInstall: () => void;
}

export default function PricingPage({ plans, faqs, onSelectPlan }: PricingPageProps) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 text-ink">
      <header className="max-w-2xl">
        <h1 className="text-xl font-semibold">Pricing</h1>
        <p className="mt-3 text-md text-ink-muted">Pay per seat. Preview builds are included on every plan.</p>
        <p className="mt-2 text-sm text-ink-muted">Trusted by 10,000+ teams worldwide</p>
        <pre className="mt-6 rounded-md bg-ink p-4 text-sm text-surface">$ npx relay-turbo --ai</pre>
      </header>

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <li key={plan.id} className="flex flex-col rounded-lg border border-ink/10 bg-surface p-6">
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="mt-2 text-xl font-semibold">{plan.price}</p>
            <p className="mt-2 text-sm text-ink-muted">{plan.summary}</p>
            <div className="mt-3 flex gap-2">{["Fast", "Secure", "Modern"].map((tag) => <span key={tag} className="rounded-full bg-surface-raised px-2 py-1 text-sm">{tag}</span>)}</div>
            <ul className="mt-6 space-y-2 text-sm">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Button
              className={plan.highlighted ? "mt-8 shadow-lg shadow-violet-500/50" : "mt-8"}
              variant={plan.highlighted ? "primary" : "secondary"}
              onClick={() => onSelectPlan(plan.id)}
            >
              Choose {plan.name}
            </Button>
          </li>
        ))}
      </ul>

      <section className="mt-16 rounded-lg bg-surface-raised p-6">
        <div className="flex size-10 items-center justify-center rounded-md bg-brand text-brand-ink">
          <svg aria-hidden viewBox="0 0 16 16" className="size-4">
            <path d="M8 1l6 3v4c0 3.5-2.5 6-6 7-3.5-1-6-3.5-6-7V4z" fill="currentColor" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-medium text-brand">Enterprise</p>
        <h2 className="mt-1 text-lg font-semibold">Need SSO or an audit log?</h2>
        <p className="mt-2 text-sm text-ink-muted">Enterprise adds SAML sign-in, audit export and a named support contact.</p>
        <hr className="my-4 border-ink/10" />
        <p className="text-sm text-ink-muted">Annual billing, invoiced</p>
        <a href="#" className="mt-4 inline-block text-sm font-medium text-brand">
          Talk to sales <span aria-hidden>→</span>
        </a>
      </section>

      <section className="mt-16">
        <h2 className="text-lg font-semibold">Questions</h2>
        <dl className="mt-6 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.id}>
              <dt className="text-md font-medium text-black/90">{faq.question}</dt>
              <dd className="mt-1 text-sm text-black/60">{faq.answer}</dd>
              <dd className="mt-1 text-sm text-black/40">{faq.updatedLabel}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="mt-20">
        <ul className="flex gap-6 text-sm text-ink-muted">
          <li>
            <a href="/docs">Docs</a>
          </li>
          <li>
            <a href="/changelog">Changelog</a>
          </li>
          <li>
            <a href="/status">Status</a>
          </li>
        </ul>
      </footer>
    </main>
  );
}
