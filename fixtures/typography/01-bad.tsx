import type { ReactNode } from "react";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600&display=optional" rel="stylesheet" />
        <style>{`
          @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=optional");
          @font-face { font-family: "Brand Sans"; src: url("/fonts/brand-sans-300.woff2") format("woff2"); font-weight: 300; font-display: swap; }
          @font-face { font-family: "Brand Sans"; src: url("/fonts/brand-sans-400.woff2") format("woff2"); font-weight: 400; font-display: swap; }
          @font-face { font-family: "Brand Sans"; src: url("/fonts/brand-sans-600.woff2") format("woff2"); font-weight: 600; }
          html { font-size: 15px; }
          body { font-family: "Brand Sans", ui-sans-serif, system-ui, sans-serif; }
          .serif-display { font-family: "Source Serif 4"; }
          .badge-face { font-family: "Poppins", ui-sans-serif, sans-serif; }
          code, kbd { font-family: "IBM Plex Mono", ui-monospace, monospace; }
        `}</style>
      </head>
      <body className="bg-surface text-ink">
        <header className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <a href="/" className="serif-display text-lg font-semibold">
              Relay Docs
            </a>
            <span className="badge-face text-sm text-ink-muted">Beta</span>
          </div>
          <nav>
            <ul className="flex gap-6 text-sm">
              <li>
                <a href="/docs" className="font-semibold">
                  Guides
                </a>
              </li>
              <li>
                <a href="/docs/api">API reference</a>
              </li>
              <li>
                <a href="/changelog">Changelog</a>
              </li>
            </ul>
          </nav>
        </header>
        <main className="mx-auto max-w-3xl px-6 py-12">{children}</main>
        <footer className="mx-auto max-w-3xl px-6 pb-12">
          <p className="max-w-prose text-sm italic text-pretty text-ink-muted">
            Press <kbd>⌘</kbd>&nbsp;<kbd>K</kbd> to search the docs.
          </p>
        </footer>
      </body>
    </html>
  );
}
