import type { ReactNode } from "react";

type Entry = {
  id: string;
  version: string;
  publishedAt: string;
  publishedLabel: string;
  title: string;
  body: string;
};

function FadeInOnScroll({ children }: { children: ReactNode }) {
  return <div data-reveal="fade-up">{children}</div>;
}

export default function Changelog({ entries }: { entries: Entry[] }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20 text-ink">
      <header>
        <h1 className="font-serif text-xl tracking-tighter">Changelog</h1>
        <p className="mt-2 text-md text-ink-muted">Product updates, <em className="font-serif italic">shipped</em> every week.</p>
        <p className="mt-1 text-sm text-ink-muted">Get started by editing <code>app/changelog/page.tsx</code>. The page auto-updates as you edit the file.</p>
      </header>
      <ol className="mt-12 space-y-12">
        {entries.map((entry) => (
          <li key={entry.id}>
            <FadeInOnScroll>
            <article>
              <p className="text-sm text-ink-muted">
                <time dateTime={entry.publishedAt}>{entry.publishedLabel}</time> · {entry.version}
              </p>
              <h2 className="mt-1 text-lg font-semibold">{entry.title}</h2>
              <p className="mt-2 text-sm text-ink-muted">{entry.body}</p>
            </article>
            </FadeInOnScroll>
          </li>
        ))}
      </ol>
      <footer className="mt-20 text-sm text-ink-muted">© 2023 Relay Labs</footer>
    </main>
  );
}
