import { Button } from "@/components/Button";

type Feature = { id: string; title: string; body: string };

interface LandingPageProps {
  features: Feature[];
  included: string[];
  onStart: () => void;
  onBookDemo: () => void;
}

function ArrowIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-4">
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-5">
      <path d="M9 1L3 9h4l-1 6 6-8H8z" fill="currentColor" />
    </svg>
  );
}

export default function LandingPage({ features, included, onStart, onBookDemo }: LandingPageProps) {
  return (
    <main className="bg-surface text-ink">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-6 py-24">
        <div aria-hidden className="absolute -top-20 left-1/2 size-96 rounded-full bg-purple-500 opacity-30 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-xl font-semibold text-transparent">Preview every branch before it merges</h1>
          <p className="mt-4 text-md text-ink-muted">
            Supercharge your releases with seamless, next-generation deploy previews.
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
        <div className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
          Your repo <ArrowIcon /> Relay <ArrowIcon /> Preview
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <span className="inline-block rounded-full border border-ink/15 px-3 py-1 text-sm">Why Relay</span>
        <h2 className="text-lg font-semibold">Review the running app, not just the diff</h2>
        <ul className="mt-10 grid gap-8 sm:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.id}>
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand"><BoltIcon /></div>
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
              <span aria-hidden>🚀</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
