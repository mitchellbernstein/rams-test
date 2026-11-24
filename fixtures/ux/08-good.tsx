"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";

type SaveState = "idle" | "saving" | "saved" | "error";
type PublishErrors = Partial<Record<"slug" | "seoTitle" | "description", string>>;

function normalizeSlug(raw: string) {
  return raw.trim().toLowerCase();
}

function validateSlug(raw: string) {
  const slug = normalizeSlug(raw);
  if (!slug) return "Enter a URL for the page.";
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return "Use lowercase letters, numbers and single dashes.";
  return undefined;
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const fieldClass = "w-full rounded-md border border-ink/15 bg-surface px-3 text-md text-ink";

export default function PublishPage() {
  const [title, setTitle] = useState("Release notes: November");
  const [body, setBody] = useState("Faster search, shared templates and a new import flow.");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveAttempt, setSaveAttempt] = useState(0);
  const firstRender = useRef(true);

  const formRef = useRef<HTMLFormElement>(null);
  const [slug, setSlug] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allowComments, setAllowComments] = useState(true);
  const [listed, setListed] = useState(false);
  const [errors, setErrors] = useState<PublishErrors>({});
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSaveState("saving");
      try {
        const res = await fetch("/api/pages/release-notes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, body }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        setSaveState("saved");
      } catch (err) {
        if ((err as Error).name !== "AbortError") setSaveState("error");
      }
    }, 800);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [title, body, saveAttempt]);

  function focusFirstError() {
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
  }

  async function publish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const slugError = validateSlug(slug);
    setErrors({ slug: slugError });
    setResult(null);
    if (slugError) {
      focusFirstError();
      return;
    }
    setPublishing(true);
    try {
      const res = await fetch("/api/pages/release-notes/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: normalizeSlug(slug), seoTitle, description, allowComments, listed }),
      });
      if (res.status === 422) {
        const data: { fieldErrors?: PublishErrors } = await res.json();
        setErrors(data.fieldErrors ?? {});
        focusFirstError();
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      setResult({ ok: true, text: `Published at example.com/p/${normalizeSlug(slug)}` });
    } catch {
      setResult({ ok: false, text: "We couldn't publish the page. Your settings are kept, so try again." });
    } finally {
      setPublishing(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-10 px-4 py-10 text-ink lg:grid-cols-[1fr_20rem]">
      <section>
        <div className="flex h-6 items-center justify-end gap-2 text-sm text-ink-muted" aria-live="polite">
          {saveState === "saving" && <span>Saving…</span>}
          {saveState === "saved" && <span>All changes saved</span>}
          {saveState === "error" && (
            <>
              <span className="text-red-700">Changes not saved</span>
              <button type="button" onClick={() => setSaveAttempt((n) => n + 1)} className="underline">
                Retry save
              </button>
            </>
          )}
        </div>
        <label htmlFor="page-title" className="sr-only">Page title</label>
        <input
          id="page-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 w-full border-0 bg-transparent text-xl font-semibold"
        />
        <label htmlFor="page-body" className="sr-only">Page content</label>
        <textarea
          id="page-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={16}
          className="mt-4 w-full resize-none border-0 bg-transparent text-md leading-relaxed"
        />
      </section>

      <aside>
        <h2 className="text-lg font-semibold">Publish to the web</h2>
        <p className="mt-1 text-sm text-ink-muted">Anyone with the link can read the page. Members of your workspace can still edit it here.</p>

        <form ref={formRef} onSubmit={publish} noValidate className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="slug" className="text-sm font-medium">Page URL</label>
            <div className="flex gap-2">
              <input
                id="slug"
                value={slug}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="none"
                aria-invalid={errors.slug ? true : undefined}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setErrors((er) => ({ ...er, slug: undefined }));
                }}
                onBlur={() => setErrors((er) => ({ ...er, slug: validateSlug(slug) }))}
                className={`${fieldClass} h-10`}
              />
              <Button type="button" variant="secondary" onClick={() => setSlug(slugify(title))}>
                Use title
              </Button>
            </div>
            {errors.slug && <p className="text-sm text-red-700">{errors.slug}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="seo-title" className="text-sm font-medium">
              Search title <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <input
              id="seo-title"
              value={seoTitle}
              aria-invalid={errors.seoTitle ? true : undefined}
              onChange={(e) => {
                setSeoTitle(e.target.value);
                setErrors((er) => ({ ...er, seoTitle: undefined }));
              }}
              className={`${fieldClass} h-10`}
            />
            {errors.seoTitle && <p className="text-sm text-red-700">{errors.seoTitle}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm font-medium">
              Description <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              aria-invalid={errors.description ? true : undefined}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((er) => ({ ...er, description: undefined }));
              }}
              className={`${fieldClass} py-2`}
            />
            {errors.description && <p className="text-sm text-red-700">{errors.description}</p>}
          </div>

          <label className="flex items-center gap-3 py-1 text-sm">
            <input type="checkbox" checked={allowComments} onChange={(e) => setAllowComments(e.target.checked)} className="size-4" />
            Allow comments
          </label>
          <label className="flex items-center gap-3 py-1 text-sm">
            <input type="checkbox" checked={listed} onChange={(e) => setListed(e.target.checked)} className="size-4" />
            List in the workspace directory
          </label>

          <Button type="submit" disabled={publishing}>
            {publishing ? "Publishing…" : "Publish page"}
          </Button>
          {result && (
            <p role={result.ok ? "status" : "alert"} className={`text-sm ${result.ok ? "text-success" : "text-red-700"}`}>
              {result.text}
            </p>
          )}
        </form>
      </aside>
    </main>
  );
}
