import type { ComponentProps, ReactNode } from "react";
import { Bell, Plus, Search, Trash2, X } from "./vendor/lucide-react";

type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

const icons = { bell: Bell, close: X, plus: Plus, search: Search, trash: Trash2 };

export type IconName = keyof typeof icons;

export function Icon({ name, size = 16, ...props }: { name: IconName; size?: number } & Omit<ComponentProps<"svg">, "children">) {
  const Glyph = icons[name];
  return <Glyph size={size} aria-hidden="true" {...props} />;
}

const messages: Record<string, string> = {
  "members.title": "Members",
  "members.description": "People who can create and send invoices in this workspace.",
  "members.invite": "Invite",
  "members.inviteLabel": "Email address",
  "members.remove": "Remove member",
  "members.empty": "No members match this search.",
  "roles.owner": "Owner",
  "roles.admin": "Admin",
  "roles.member": "Member",
};

export function t(key: string) {
  return messages[key] ?? key;
}

export const cardClass = "rounded-lg border border-ink/15 bg-surface p-6";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-md text-ink-muted">{description}</p>}
      </div>
      {action}
    </header>
  );
}

const badgeTone = {
  neutral: "bg-surface-raised text-ink",
  brand: "bg-brand text-brand-ink",
  success: "bg-success text-brand-ink",
};

const badgeSize = {
  md: "h-6 px-2 text-sm",
  lg: "h-8 px-3 text-md",
};

type BadgeProps = {
  tone?: keyof typeof badgeTone;
  size?: keyof typeof badgeSize;
} & ComponentProps<"span">;

export function Badge({ tone = "neutral", size = "md", className, ...props }: BadgeProps) {
  return <span className={cn("inline-flex items-center rounded-sm font-medium", badgeTone[tone], badgeSize[size], className)} {...props} />;
}
