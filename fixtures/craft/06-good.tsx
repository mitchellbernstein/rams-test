type Entry = {
  id: string;
  version: string;
  publishedAt: string;
  publishedLabel: string;
  title: string;
  body: string;
};

export default function Changelog({ entries }: { entries: Entry[] }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20 text-ink">
      <header>
        <h1 className="font-serif text-xl tracking-normal">Changelog</h1>
        <p className="mt-2 text-md text-ink-muted">Product updates, shipped every week.</p>
        <p className="mt-1 text-sm text-ink-muted">Every release of Relay, newest first, with migration notes where they apply.</p>
      </header>
      <ol className="mt-12 space-y-12">
        {entries.map((entry) => (
          <li key={entry.id}>
            <article>
              <p className="text-sm text-ink-muted">
                <time dateTime={entry.publishedAt}>{entry.publishedLabel}</time> · {entry.version}
              </p>
              <h2 className="mt-1 text-lg font-semibold">{entry.title}</h2>
              <p className="mt-2 text-sm text-ink-muted">{entry.body}</p>
            </article>
          </li>
        ))}
      </ol>
      <footer className="mt-20 text-sm text-ink-muted">© {new Date().getFullYear()} Relay Labs</footer>
    </main>
  );
}
