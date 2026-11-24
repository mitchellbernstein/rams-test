import { Button } from "@/components/Button";

const locale = { code: "ar", dir: "rtl" as const };

const toc = [
  { id: "install", label: "Install the bank feed" },
  { id: "match", label: "Set matching rules" },
  { id: "review", label: "Review exceptions" },
];

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className={className}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export default function HelpArticle() {
  return (
    <div lang={locale.code} dir={locale.dir} className="bg-surface text-ink">
      <header className="sticky top-0 z-10 border-b border-ink/10 bg-surface pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-16 max-w-[680px] items-center px-4 sm:px-8">
          <a href="/help" className="-mx-2 flex items-center px-2 py-2 text-sm font-medium">
            <ArrowIcon className="mr-2 size-4 shrink-0 rtl:rotate-180" />
            Help center
          </a>
        </div>
      </header>

      <main className="mx-auto flex max-w-[680px] flex-col gap-8 px-4 py-12 sm:px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">Reconciling a bank account</h1>
          <p className="text-sm text-ink-muted">Updated 12 November · 6 minute read</p>
        </div>

        <nav aria-label="On this page" className="flex flex-col gap-1 border-s-2 border-ink/10 ps-4">
          {toc.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="-mx-2 px-2 py-1.5 text-sm text-ink-muted hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>

        <article className="text-md">
          <p className="mb-3">
            Reconciliation compares what your books say against what the bank says. Ledgerly does most of the matching
            for you, so the work left is reviewing the handful of entries it could not pair.
          </p>
          <h2 id="install" className="mt-9 mb-1 scroll-mt-20 text-lg font-semibold">Install the bank feed</h2>
          <p className="mb-4">Open Settings, choose Bank feeds and pick your bank. Most feeds connect in under a minute.</p>
          <pre className="overflow-x-auto rounded-md bg-surface-raised p-4 text-sm">
            <code>ledgerly feeds add --bank seb --account 5402-118 --sync daily</code>
          </pre>
          <h2 id="match" className="scroll-mt-20 text-lg font-semibold">Set matching rules</h2>
          <p>Rules pair transactions by amount, date window and reference. Start with these three:</p>
          <ul className="my-5 list-disc space-y-1 ps-5">
            <li>Exact amount within three days</li>
            <li>Reference contains the invoice number</li>
            <li>Recurring vendor with a fixed amount</li>
          </ul>
          <h2 id="review" className="text-lg font-semibold">Review exceptions</h2>
          <p>Anything unmatched lands in the Exceptions queue. Approve, split or create an entry from each row.</p>
        </article>
      </main>

      <footer className="border-t border-ink/10">
        <div className="mx-auto flex max-w-[680px] flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-8">
          <p className="text-sm text-ink-muted">Was this article helpful?</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">Yes</Button>
            <Button variant="secondary">No</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
