import { Button } from "@/components/Button";

const plans = [
  {
    name: "Starter",
    price: 0,
    blurb: "For freelancers sending a handful of invoices.",
    features: ["5 invoices / month", "Card payments", "Email reminders"],
    tags: ["Solo"],
  },
  {
    name: "Team",
    price: 24,
    blurb: "For small teams that bill every week.",
    features: ["Unlimited invoices", "Recurring billing", "Shared client list"],
    tags: ["Popular", "Teams"],
  },
  {
    name: "Business",
    price: 79,
    blurb: "For finance teams with approvals and audits.",
    features: ["Approval flows", "Audit log", "SSO"],
    tags: ["Finance", "Compliance"],
  },
];

const allTags = plans.flatMap((p) => p.tags);
const tagTones = ["bg-pink-100 text-ink", "bg-teal-100 text-ink", "bg-lime-100 text-ink", "bg-violet-100 text-ink", "bg-orange-100 text-ink", "bg-cyan-100 text-ink", "bg-fuchsia-100 text-ink"];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-brand">Pricing</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-ink">Pay for the invoices you send, nothing more.</h1>
        <p className="mt-4 text-md text-ink-muted">Every plan includes card and bank payments. Switch or cancel any time.</p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const featured = plan.name === "Team";
          return (
            <section key={plan.name} className="relative overflow-hidden rounded-lg border border-ink/15 bg-surface p-6">
              {featured && <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-fuchsia-500 to-orange-400" />}
              {featured && (
                <span className="absolute right-4 top-4 rounded-sm bg-blue-700 px-2 py-1 text-sm font-medium text-brand-ink">
                  Most popular
                </span>
              )}
              <h2 className="text-lg font-semibold text-ink">{plan.name}</h2>
              <p className="mt-2 text-sm text-ink-muted">{plan.blurb}</p>
              <p className="mt-6 text-xl font-semibold text-[#1f4fd1]">
                ${plan.price}
                <span className="text-sm font-normal text-ink-muted"> / month</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {plan.tags.map((tag) => (
                  <span key={tag} className={`rounded-sm px-2 py-1 text-sm ${tagTones[allTags.indexOf(tag) % tagTones.length]}`}>
                    {tag}
                  </span>
                ))}
              </div>
              <ul className="mt-6 space-y-2 text-sm text-ink">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Button className="mt-8 w-full justify-center" variant={featured ? "primary" : "secondary"}>
                Choose {plan.name}
              </Button>
            </section>
          );
        })}
      </div>

      <section className="mt-16 flex items-center justify-between rounded-lg bg-surface-raised p-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-ink">Annual billing</h2>
            <span className="rounded-sm bg-red-600 px-2 py-1 text-sm font-medium text-brand-ink">New</span>
          </div>
          <p className="mt-1 text-sm text-ink-muted">Pay yearly and get two months free on any paid plan.</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">Switch to annual</Button>
      </section>
    </main>
  );
}
