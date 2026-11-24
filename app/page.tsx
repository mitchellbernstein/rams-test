import Link from "next/link";
import { Button } from "@/components/Button";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-xl font-semibold tracking-tight">Acme helps small teams ship invoices on time.</h1>
      <p className="mt-4 text-md text-ink-muted">
        Send, track and get paid in one place.
      </p>
      <div className="mt-8 flex gap-3">
        <Button>Start free</Button>
        <Link href="/pricing" className="inline-flex h-10 items-center rounded-md px-4 text-sm text-ink hover:bg-surface-raised">
          See pricing
        </Link>
      </div>
    </main>
  );
}
