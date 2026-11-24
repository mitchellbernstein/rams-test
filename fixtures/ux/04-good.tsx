"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

type Member = { id: string; name: string; email: string; role: "Owner" | "Admin" | "Member" };
type Invite = { id: string; email: string };

type Toast = {
  id: string;
  message: string;
  tone: "success" | "error";
  duration: number | null;
  action?: { label: string; onClick: () => void };
};
type ToastInput = Omit<Toast, "id"> & { id?: string };

const initialMembers: Member[] = [
  { id: "m1", name: "Ana Lima", email: "ana@example.com", role: "Owner" },
  { id: "m2", name: "Kofi Mensah", email: "kofi@example.com", role: "Admin" },
  { id: "m3", name: "Mei Tanaka", email: "mei@example.com", role: "Member" },
];
const initialInvites: Invite[] = [
  { id: "i1", email: "sam@example.com" },
  { id: "i2", email: "lee@example.com" },
];

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, number>());

  function dismiss(id: string) {
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }

  function show(input: ToastInput) {
    const id = input.id ?? crypto.randomUUID();
    setToasts((ts) => [...ts.filter((t) => t.id !== id), { ...input, id }]);
    window.clearTimeout(timers.current.get(id));
    if (input.duration !== null) timers.current.set(id, window.setTimeout(() => dismiss(id), input.duration));
  }

  return { toasts, show, dismiss };
}

function ToastViewport({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  return (
    <div role="status" aria-live="polite" className="fixed bottom-4 right-4 flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm shadow-lg ${t.tone === "error" ? "bg-red-700 text-white" : "bg-ink text-surface"}`}
        >
          <span className="flex-1">{t.message}</span>
          {t.action && (
            <button
              type="button"
              onClick={() => {
                t.action?.onClick();
                dismiss(t.id);
              }}
              className="font-medium underline"
            >
              {t.action.label}
            </button>
          )}
          <button type="button" aria-label="Dismiss notification" onClick={() => dismiss(t.id)} className="px-1">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

type ConfirmProps = {
  title: string;
  body: string;
  confirmLabel: string;
  pendingLabel: string;
  errorText: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
};

function ConfirmDialog({ title, body, confirmLabel, pendingLabel, errorText, onConfirm, onCancel }: ConfirmProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onCancel]);

  async function confirm() {
    setPending(true);
    setError(null);
    try {
      await onConfirm();
    } catch {
      setError(errorText);
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 grid place-items-center bg-ink/40 px-4">
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-md rounded-lg bg-surface p-6">
        <h2 id="confirm-title" className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-md text-ink-muted">{body}</p>
        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" autoFocus onClick={onCancel}>
            Cancel
          </Button>
          <Button className="bg-red-700 hover:bg-red-800" disabled={pending} onClick={confirm}>
            {pending ? pendingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

type DialogState = { kind: "remove"; member: Member } | { kind: "reset" } | { kind: "leave" } | null;

export default function TeamMembers() {
  const router = useRouter();
  const { toasts, show, dismiss } = useToasts();
  const [members, setMembers] = useState(initialMembers);
  const [invites, setInvites] = useState(initialInvites);
  const [inviteLink, setInviteLink] = useState("https://app.example.com/join/7f3k2");
  const [dialog, setDialog] = useState<DialogState>(null);
  const closeDialog = useCallback(() => setDialog(null), []);

  async function removeMember(member: Member) {
    const res = await fetch(`/api/team/members/${member.id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(String(res.status));
    setMembers((ms) => ms.filter((m) => m.id !== member.id));
    setDialog(null);
    show({ id: `remove-${member.id}`, message: `${member.name} removed from the team`, tone: "success", duration: 5000 });
  }

  function revokeInvite(invite: Invite) {
    setInvites((is) => is.filter((i) => i.id !== invite.id));
    const commit = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/team/invites/${invite.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(String(res.status));
      } catch {
        setInvites((is) => [...is, invite]);
        show({ id: `revoke-${invite.id}`, message: `Couldn't revoke the invite to ${invite.email}. It's still active.`, tone: "error", duration: null });
      }
    }, 6000);
    show({
      id: `revoke-${invite.id}`,
      message: `Invite to ${invite.email} revoked`,
      tone: "success",
      duration: 6000,
      action: {
        label: "Undo",
        onClick: () => {
          window.clearTimeout(commit);
          setInvites((is) => [...is, invite]);
        },
      },
    });
  }

  async function resetLink() {
    const res = await fetch("/api/team/invite-link", { method: "POST" });
    if (!res.ok) throw new Error(String(res.status));
    const body: { url: string } = await res.json();
    setInviteLink(body.url);
    setDialog(null);
    show({ id: "reset-link", message: "Invite link reset", tone: "success", duration: 5000 });
  }

  async function leaveTeam() {
    const res = await fetch("/api/team/leave", { method: "POST" });
    if (!res.ok) throw new Error(String(res.status));
    router.replace("/projects");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(inviteLink);
      show({ id: "copy-invite-link", message: "Invite link copied", tone: "success", duration: 4000 });
    } catch {
      show({ id: "copy-invite-link", message: "Couldn't copy the link. Select it and copy it manually.", tone: "error", duration: null });
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-ink">
      <h1 className="text-xl font-semibold">Team</h1>

      <section className="mt-8 rounded-lg bg-surface-raised p-4">
        <h2 className="text-md font-semibold">Invite link</h2>
        <p className="mt-1 break-all font-mono text-sm">{inviteLink}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={copyLink}>Copy invite link</Button>
          <Button variant="secondary" onClick={() => setDialog({ kind: "reset" })}>Reset invite link</Button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-md font-semibold">{plural(members.length, "member", "members")}</h2>
        <ul className="mt-2 divide-y divide-ink/10">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-md font-medium">{m.name}</p>
                <p className="text-sm text-ink-muted">{m.email} · {m.role}</p>
              </div>
              {m.role !== "Owner" && (
                <Button variant="secondary" onClick={() => setDialog({ kind: "remove", member: m })}>
                  Remove
                </Button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-md font-semibold">{plural(invites.length, "pending invite", "pending invites")}</h2>
        <ul className="mt-2 divide-y divide-ink/10">
          {invites.map((i) => (
            <li key={i.id} className="flex items-center justify-between py-3">
              <p className="text-md">{i.email}</p>
              <Button variant="secondary" onClick={() => revokeInvite(i)}>Revoke</Button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 border-t border-ink/10 pt-6">
        <Button variant="secondary" onClick={() => setDialog({ kind: "leave" })}>Leave team</Button>
      </section>

      {dialog?.kind === "remove" && (
        <ConfirmDialog
          title={`Remove ${dialog.member.name}?`}
          body={`${dialog.member.name} loses access to every project in this team. You can invite them again later.`}
          confirmLabel={`Remove ${dialog.member.name}`}
          pendingLabel="Removing…"
          errorText={`Couldn't remove ${dialog.member.name}. Try again.`}
          onConfirm={() => removeMember(dialog.member)}
          onCancel={closeDialog}
        />
      )}
      {dialog?.kind === "reset" && (
        <ConfirmDialog
          title="Reset invite link?"
          body="The current link stops working right away. Anyone who hasn't joined yet needs the new link."
          confirmLabel="Reset link"
          pendingLabel="Resetting…"
          errorText="Couldn't reset the link. Try again."
          onConfirm={resetLink}
          onCancel={closeDialog}
        />
      )}
      {dialog?.kind === "leave" && (
        <ConfirmDialog
          title="Leave this team?"
          body="You lose access to its projects until someone invites you again."
          confirmLabel="Leave team"
          pendingLabel="Leaving…"
          errorText="Couldn't leave the team. Try again."
          onConfirm={leaveTeam}
          onCancel={closeDialog}
        />
      )}

      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </main>
  );
}
