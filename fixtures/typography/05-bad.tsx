interface ReleaseCardProps {
  version: string;
  summary: string;
  notes: string;
}

export default function ReleaseCard({ version, summary, notes }: ReleaseCardProps) {
  return (
    <section className="release-card mx-auto max-w-prose rounded-lg bg-surface-raised p-6 text-ink">
      <style>{`
        .release-card h2 { font-size: 1.5rem; line-height: 1.2; font-weight: 600; }
        .release-card h3 { font-size: 1.5rem; line-height: 1.2; font-weight: 600; }
        .release-card .eyebrow { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; }
        .release-card .body { font-size: 1rem; line-height: 24px; }
        .release-card .caption { font-size: 0.875rem; font-weight: 300; }
        .release-card .headline { word-spacing: -0.05em; }
      `}</style>
      <p className="eyebrow text-ink-muted">Release</p>
      <h2 className="headline mt-1 text-balance">
        Version <span className="font-mono">{version}</span>
      </h2>
      <h3 className="mt-4 text-balance">Highlights</h3>
      <p className="body mt-2 text-pretty">{summary}</p>
      <p className="caption mt-4 text-pretty text-ink-muted">{notes}</p>
    </section>
  );
}
