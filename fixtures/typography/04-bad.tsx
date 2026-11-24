import { Button } from "@/components/Button";

interface AccountSettingsProps {
  planName: string;
  saving: boolean;
  onSave: () => void;
  onExport: () => void;
}

export default function AccountSettings({ planName, saving, onSave, onExport }: AccountSettingsProps) {
  return (
    <div className="mx-auto max-w-2xl p-8 text-ink">
      <p className="text-sm font-medium tracking-wide text-ink-muted">ACCOUNT SETTINGS</p>
      <h1 className="mt-2 text-xl font-semibold leading-tight tracking-tight text-balance">Workspace</h1>
      <p className="mt-2 max-w-prose text-[13px] text-pretty text-ink-muted">Changes here apply to everyone in this workspace.</p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold leading-snug text-balance">Plan</h2>
        <div className="mt-4 flex items-center justify-between rounded-lg bg-surface-raised p-4">
          <div>
            <p className="text-md font-bold">{planName}</p>
            <p className="text-sm tracking-tight text-pretty text-ink-muted">Billed yearly</p>
          </div>
          <span className="text-sm uppercase text-success">Active</span>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold leading-snug text-balance">Data export</h2>
        <h6 className="mt-4 font-semibold text-balance">Export format</h6>
        <p className="mt-1 max-w-prose text-sm text-pretty text-ink-muted">
          Download every project and preview as a CSV file.
        </p>
        <a href="/docs/export" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand">
          Read the export docs -&gt;
        </a>
        <div className="mt-6 flex gap-3">
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
          <Button variant="secondary" onClick={onExport}>
            Export as CSV
          </Button>
        </div>
      </section>
    </div>
  );
}
