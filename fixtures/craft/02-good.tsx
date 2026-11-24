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

export default function PricingPage({ plans, faqs, footerLinks, teamCount, onSelectPlan, onCopyInstall }: PricingPageProps) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 text-ink">
      <header className="max-w-2xl">
        <h1 className="text-xl font-semibold">Pricing</h1>
        <p className="mt-3 text-md text-ink-muted">Pay per seat. Preview builds are included on every plan.</p>
        <p className="mt-2 text-sm text-ink-muted">Used by {teamCount.toLocaleString()} teams</p>
        <div className="mt-6 flex items-center gap-3">
          <code className="rounded-md bg-surface-raised px-3 py-2 text-sm">npm install @relay/cli</code>
          <Button variant="secondary" onClick={onCopyInstall}>
            Copy
          </Button>
        </div>
      </header>

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <li key={plan.id} className="flex flex-col rounded-lg border border-ink/10 bg-surface p-6">
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="mt-2 text-xl font-semibold">{plan.price}</p>
            <p className="mt-2 text-sm text-ink-muted">{plan.summary}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Button
              className="mt-8"
              variant={plan.highlighted ? "primary" : "secondary"}
              onClick={() => onSelectPlan(plan.id)}
            >
              Choose {plan.name}
            </Button>
          </li>
        ))}
      </ul>

      <section className="mt-16 rounded-lg bg-surface-raised p-6">
        <h2 className="text-lg font-semibold">Need SSO or an audit log?</h2>
        <p className="mt-2 text-sm text-ink-muted">Enterprise adds SAML sign-in, audit export and a named support contact.</p>
        <a href="/contact" className="mt-4 inline-block text-sm font-medium text-brand">
          Talk to sales
        </a>
      </section>

      <section className="mt-16">
        <h2 className="text-lg font-semibold">Questions</h2>
        <dl className="mt-6 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.id}>
              <dt className="text-md font-medium text-ink">{faq.question}</dt>
              <dd className="mt-1 text-sm text-ink-muted">{faq.answer}</dd>
              <dd className="mt-1 text-sm text-ink-muted">{faq.updatedLabel}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="mt-20">
        <ul className="flex gap-6 text-sm text-ink-muted">
          {footerLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </footer>
    </main>
  );
}
