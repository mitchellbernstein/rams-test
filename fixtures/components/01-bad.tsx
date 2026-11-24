"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Badge, Icon, cardClass, cn, t } from "./ui";

type Role = "owner" | "admin" | "member";

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const initialMembers: Member[] = [
  { id: "m1", name: "Dana Whitfield", email: "dana@northwind.studio", role: "owner" },
  { id: "m2", name: "Ravi Menon", email: "ravi@northwind.studio", role: "admin" },
  { id: "m3", name: "Ines Duarte", email: "ines@northwind.studio", role: "member" },
];

const roleTone = { owner: "brand", admin: "neutral", member: "neutral" } as const;

function RoleBadge(props: any) {
  return <Badge tone={roleTone[props.role as Role]}>{t(`roles.${props.role}`)}</Badge>;
}

interface MemberRowProps {
  member: Member;
  selected: boolean;
  onToggle: () => void;
  onRemove: () => void;
  removeLabel?: string;
}

function MemberRow({ member, selected, onToggle, onRemove, removeLabel }: MemberRowProps) {
  return (
    <li className={`flex items-center justify-between gap-4 rounded-md px-3 py-2 ${selected ? "bg-surface-raised" : ""}`}>
      <label className="flex items-center gap-3">
        <input type="checkbox" checked={selected} onChange={onToggle} className="size-4 accent-brand" />
        <span>
          <span className="block text-md font-medium text-ink">{member.name}</span>
          <span className="block text-sm text-ink-muted">{member.email}</span>
        </span>
      </label>
      <div className="flex items-center gap-3">
        <RoleBadge role={member.role} />
        <Button variant="secondary" onClick={onRemove} aria-label={removeLabel ?? "Remove member"}>
          <Icon name="close" />
        </Button>
      </div>
    </li>
  );
}

export default function MembersPage() {
  const [members, setMembers] = useState(initialMembers);
  const [selected, setSelected] = useState<string[]>([]);
  const [email, setEmail] = useState("");

  const EmptyState = () => <p className="px-3 py-6 text-center text-sm text-ink-muted">{t("members.empty")}</p>;

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">{t("members.title")}</h1>
          <p className="mt-1 text-md text-ink-muted">{t("members.description")}</p>
        </div>
      </header>

      <form
        className="mt-8 flex items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setEmail("");
        }}
      >
        <label className="flex-1">
          <span className="text-sm font-medium text-ink">{t("members.inviteLabel")}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 block h-10 w-full rounded-md border border-ink/50 bg-surface px-3 text-md text-ink"
          />
        </label>
        <button type="submit" className="inline-flex h-10 items-center rounded-md bg-brand px-4 text-sm font-medium text-brand-ink">
          {t("members.invite")}
        </button>
      </form>

      <section className={cn(cardClass, "mt-8")}>
        {members.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-1">
            {members.map((m) => (
              <MemberRow
                key={m.id}
                member={m}
                selected={selected.includes(m.id)}
                onToggle={() => toggle(m.id)}
                onRemove={() => setMembers((all) => all.filter((x) => x.id !== m.id))}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
