import type { ReactNode } from "react";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600&display=optional" rel="stylesheet" />
        <style>{`
          @font-face { font-family: "IBM Plex Mono"; src: url("/fonts/ibm-plex-mono-400.woff2") format("woff2"); font-weight: 400; font-display: optional; }
          @font-face { font-family: "Brand Sans"; src: url("/fonts/brand-sans-400.woff2") format("woff2"); font-weight: 400; font-display: swap; }
          @font-face { font-family: "Brand Sans"; src: url("/fonts/brand-sans-600.woff2") format("woff2"); font-weight: 600; font-display: swap; }
          @font-face { font-family: "Brand Sans Fallback"; src: local("Arial"); size-adjust: 104%; ascent-override: 92%; descent-override: 24%; }
          html { font-size: 100%; }
          body { font-family: "Brand Sans", "Brand Sans Fallback", ui-sans-serif, system-ui, sans-serif; }
          .serif-display { font-family: "Source Serif 4", Georgia, serif; }
          code, kbd { font-family: "IBM Plex Mono", ui-monospace, monospace; }
        `}</style>
      </head>
      <body className="bg-surface text-ink antialiased">
        <header className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <a href="/" className="serif-display text-lg font-semibold">
              Relay Docs
            </a>
            <span className="text-sm text-ink-muted">Beta</span>
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
          <p className="max-w-prose text-sm text-pretty text-ink-muted">
            Press <kbd>⌘</kbd>&nbsp;<kbd>K</kbd> to search the docs.
          </p>
        </footer>
      </body>
    </html>
  );
}
