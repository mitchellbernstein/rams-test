import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Acme Planner",
  description: "Plan projects with your team.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body className="min-h-screen bg-surface font-sans text-ink">
        <style>{`button, a, [role="button"] { touch-action: manipulation; }`}</style>
        {children}
      </body>
    </html>
  );
}
