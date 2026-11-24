"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";

export default function AccountSettings() {
  const [name, setName] = useState("Dana Whitfield");
  const [email, setEmail] = useState("dana@acme.co");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    if (!email.includes("@")) {
      setError("Enter an email address like name@example.com.");
      return;
    }
    setError("");
    setSaved(true);
  }

  return (
    <main className="mx-auto max-w-xl bg-surface p-8 text-ink">
      <style>{`button, a, [role="button"] { cursor: pointer; }`}</style>
      <h1 className="text-xl font-semibold">Account</h1>
      <p className="mt-2 text-sm text-ink-muted">Update how your name and email appear to teammates.</p>

      <form onSubmit={save} noValidate className="mt-8 space-y-6">
        <div>
          <input
            id="name"
            placeholder="Display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-ink/20 px-3 text-md"
          />
          <p className="mt-2 text-[10px] text-ink-muted">Shown on comments and shared projects.</p>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-ink/20 px-3 text-md"
          />
          {error && <p id="email-error" className="mt-2 text-sm text-red-700">{error}</p>}
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" aria-label="Submit form" className="min-h-11">Save changes</Button>
          {saved && <p className="text-sm text-success">Changes saved</p>}
        </div>
      </form>

      <section className="mt-12 border-t border-ink/10 pt-8">
        <h2 className="text-lg font-semibold">Close account</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Your projects move to the workspace owner. This takes effect after 30 days.
        </p>
        <button
          type="button"
          className="mt-4 min-h-11 rounded-md border border-red-700 px-4 text-sm font-medium text-red-700 outline-none"
        >
          Close account
        </button>
      </section>
    </main>
  );
}
