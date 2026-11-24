import { Button } from "@/components/Button";

interface AccountSettingsProps {
  planName: string;
  saving: boolean;
  onSave: () => void;
  onExport: () => void;
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-4">
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function AccountSettings({ planName, saving, onSave, onExport }: AccountSettingsProps) {
  return (
    <div className="mx-auto max-w-2xl p-8 text-ink">
      <p className="text-sm font-medium uppercase tracking-wide text-ink-muted">Account settings</p>
      <h1 className="mt-2 text-xl font-semibold leading-tight tracking-tight text-balance">Workspace</h1>
      <p className="mt-2 max-w-prose text-sm text-pretty text-ink-muted">Changes here apply to everyone in this workspace.</p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold leading-snug text-balance">Plan</h2>
        <div className="mt-4 flex items-center justify-between rounded-lg bg-surface-raised p-4">
          <div>
            <p className="text-md font-medium">{planName}</p>
            <p className="text-sm text-pretty text-ink-muted">Billed yearly</p>
          </div>
          <span className="text-sm uppercase tracking-wide text-success">Active</span>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold leading-snug text-balance">Data export</h2>
        <h3 className="mt-4 text-sm font-semibold text-balance">Export format</h3>
        <p className="mt-1 max-w-prose text-sm text-pretty text-ink-muted">
          Download every project and preview as a CSV file.
        </p>
        <a href="/docs/export" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand">
          Read the export docs <ArrowRightIcon />
        </a>
        <div className="mt-6 flex gap-3">
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
          <Button variant="secondary" onClick={onExport}>
            Export as CSV
          </Button>
        </div>
      </section>
    </div>
  );
}
