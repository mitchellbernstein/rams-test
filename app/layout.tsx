import type { ReactNode } from "react";
import "./globals.css";

export const metadata = { title: "Acme", description: "A small test app" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
