import { Button } from "@/components/Button";

type Feature = { id: string; title: string; body: string };

interface LandingPageProps {
  features: Feature[];
  included: string[];
  onStart: () => void;
  onBookDemo: () => void;
}

function CheckIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-4 shrink-0 text-success">
      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function LandingPage({ features, included, onStart, onBookDemo }: LandingPageProps) {
  return (
    <main className="bg-surface text-ink">
      <section className="relative overflow-hidden bg-surface px-6 py-24">
        <div className="relative mx-auto max-w-3xl">
          <h1 className="text-xl font-semibold text-ink">Preview every branch before it merges</h1>
          <p className="mt-4 text-md text-ink-muted">
            Every pull request gets a preview URL your reviewers can open from the comment thread.
          </p>
          <div className="mt-8 flex gap-3">
            <Button onClick={onStart}>Start a project</Button>
            <Button variant="secondary" onClick={onBookDemo}>
              Book a demo
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-lg font-semibold">How it works</h2>
        <p className="mt-3 text-sm text-ink-muted">
          Connect a GitHub repository and Relay builds each branch into its own URL, then posts the link on the pull request.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-lg font-semibold">Review the running app, not just the diff</h2>
        <ul className="mt-10 grid gap-8 sm:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.id}>
              <h3 className="text-md font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{feature.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-lg font-semibold">Included on every plan</h2>
        <ul className="mt-6 space-y-3 text-sm">
          {included.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckIcon />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
