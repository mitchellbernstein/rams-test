"use client";

import { useState, type ComponentProps, type InputHTMLAttributes } from "react";
import { Button } from "@/components/Button";
import { PageHeader, cardClass, cn } from "./ui";

interface NotificationItemProps {
  title: string;
  body: string;
  time: string;
  unread: boolean;
  avatarUrl?: string;
}

function NotificationItem({ title, body, time, unread, avatarUrl }: NotificationItemProps) {
  return (
    <li className="flex items-start justify-between gap-4 py-4">
      <div>
        <p className={cn("text-md text-ink", unread && "font-semibold")}>{title}</p>
        <p className="mt-1 text-sm text-ink-muted">{body}</p>
      </div>
      <span className="shrink-0 text-sm text-ink-muted">{time}</span>
    </li>
  );
}

function FilterInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "block h-10 w-full rounded-md border border-ink/50 bg-surface px-3 text-md text-ink disabled:cursor-not-allowed disabled:bg-surface-raised",
        className,
      )}
      {...props}
    />
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex h-6 items-center rounded-sm bg-surface-raised px-2 text-sm text-ink">
      {label}
    </span>
  );
}

const notifications = [
  { id: 1, title: "Northwind Studio paid INV-1042", body: "$1,240.00 will arrive in your account on Friday.", time: "2h", unread: true },
  { id: 2, title: "Invoice INV-1039 is overdue", body: "Lumen Bakery has not paid. A reminder goes out tomorrow.", time: "1d", unread: true },
  { id: 3, title: "Ravi joined the workspace", body: "Ravi Menon accepted your invite as an admin.", time: "3d", unread: false },
];

const activeFilters = ["Payments", "Overdue"];

export default function NotificationsPage() {
  const [query, setQuery] = useState("");
  const visible = notifications.filter((n) => n.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <PageHeader title="Notifications" action={<Button variant="secondary">Mark all as read</Button>} />

      <div className="mt-8 space-y-3">
        <FilterInput value={query} placeholder="Filter notifications" aria-label="Filter notifications" />
        <div className="flex gap-2">
          {activeFilters.map((f) => (
            <Chip key={f} label={f} />
          ))}
        </div>
      </div>

      <section className={cn(cardClass, "mt-6")}>
        {visible.length > 0 ? (
          <ul className="divide-y divide-ink/15">
            {visible.map((n) => (
              <NotificationItem key={n.id} title={n.title} body={n.body} time={n.time} unread={n.unread} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center py-10 text-center">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} className="text-ink-muted" aria-hidden="true">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <p className="mt-3 text-sm text-ink-muted">Nothing matches that filter.</p>
          </div>
        )}
      </section>
    </main>
  );
}
