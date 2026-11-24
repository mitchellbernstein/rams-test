import { Button } from "@/components/Button";

interface ShareDialogProps {
  open: boolean;
  shareUrl: string;
  onCopy: () => void;
  onClose: () => void;
}

export default function ShareDialog({ open, shareUrl, onCopy, onClose }: ShareDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <style>{`
        @keyframes share-dialog-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .share-dialog { animation: share-dialog-in 160ms ease-out; }
        .share-dialog-url { font-variant-numeric: tabular-nums; }
      `}</style>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
        className="share-dialog w-full max-w-md rounded-lg bg-surface p-6 text-ink shadow-xl"
      >
        <div className="flex items-center gap-3">
          <svg aria-hidden viewBox="0 0 24 24" className="size-6 text-brand">
            <path d="M18 8a3 3 0 1 0-2.8-4L8.8 7.2a3 3 0 1 0 0 3.6l6.4 3.2A3 3 0 1 0 16 12l-6.4-3.2.1-.8-.1-.8L16 4" fill="currentColor" />
          </svg>
          <h2 id="share-title" className="text-lg font-semibold">
            Share preview
          </h2>
        </div>
        <p className="mt-2 text-sm text-ink-muted">Anyone with the link can open this preview until the branch is merged.</p>
        <div className="mt-4 flex items-center gap-2">
          <input
            readOnly
            value={shareUrl}
            aria-label="Preview link"
            className="share-dialog-url h-10 flex-1 rounded-md border border-ink/15 px-3 text-sm"
          />
          <Button onClick={onCopy}>Copy link</Button>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
