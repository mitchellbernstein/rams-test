"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";

type ImportJob = { id: string; fileName: string; rows: number; failedRows: number; createdAt: string };

const MAX_BYTES = 50 * 1024 * 1024;
const ACCEPTED = [".csv", ".xlsx"];

function plural(n: number, one: string, many: string) {
  return `${n.toLocaleString()} ${n === 1 ? one : many}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function ImportDetail({ id }: { id: string }) {
  const [job, setJob] = useState<ImportJob | null>(null);
  const [state, setState] = useState<"loading" | "error" | "missing" | "ready">("loading");
  const [attempt, setAttempt] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    fetch(`/api/imports/${id}`, { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 404) return setState("missing");
        if (!res.ok) throw new Error(String(res.status));
        setJob(await res.json());
        setState("ready");
      })
      .catch((err: Error) => {
        if (err.name !== "AbortError") setState("error");
      });
    return () => controller.abort();
  }, [id, attempt]);

  async function downloadReport() {
    setDownloading(true);
    setDownloadError(null);
    try {
      const res = await fetch(`/api/imports/${id}/errors.csv`);
      if (!res.ok) throw new Error(String(res.status));
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = `import-${id}-errors.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  }

  if (state === "loading") return null;
  if (state === "missing") {
    return <p className="h-40 rounded-lg bg-surface-raised p-4 text-md">This import was deleted or never finished uploading.</p>;
  }
  if (state === "error" || !job) {
    return (
      <div className="h-40 rounded-lg bg-surface-raised p-4 text-md">
        <p>We couldn't load this import.</p>
        <Button variant="secondary" className="mt-3" onClick={() => setAttempt((a) => a + 1)}>Try again</Button>
      </div>
    );
  }
  return (
    <div className="h-40 rounded-lg bg-surface-raised p-4">
      <h3 className="text-md font-semibold">{job.fileName}</h3>
      <p className="mt-1 text-sm text-ink-muted">
        {plural(job.rows, "row", "rows")} imported, {plural(job.failedRows, "row", "rows")} skipped · {formatDate(job.createdAt)}
      </p>
      {job.failedRows > 0 && (
        <div className="mt-3 flex items-center gap-3">
          <Button variant="secondary" disabled={downloading} onClick={downloadReport}>
            {downloading ? "Preparing report…" : "Download error report"}
          </Button>
          {downloadError && <p role="alert" className="text-sm text-red-700">{downloadError}</p>}
        </div>
      )}
    </div>
  );
}

export default function ImportData() {
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [listState, setListState] = useState<"loading" | "error" | "ready">("loading");
  const [selected, setSelected] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<{ message: string; code: number } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const loadJobs = useCallback(async (signal?: AbortSignal) => {
    setListState("loading");
    try {
      const res = await fetch("/api/imports", { signal });
      if (!res.ok) throw new Error(String(res.status));
      setJobs(await res.json());
      setListState("ready");
    } catch (err) {
      if ((err as Error).name !== "AbortError") setListState("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadJobs(controller.signal);
    return () => controller.abort();
  }, [loadJobs]);

  function pickFile(next: File | null) {
    setFile(null);
    setNotice(null);
    setUploadError(null);
    if (!next) return setFileError(null);
    setFileError(null);
    setFile(next);
  }

  function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (xhrRef.current) return;
    if (!file) return setFileError("Choose a spreadsheet to import.");
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    setProgress(0);
    setUploadError(null);
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
    };
    xhr.onload = () => {
      xhrRef.current = null;
      setProgress(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        window.alert(`Import started for ${file.name}.`);
        setFile(null);
        loadJobs();
      } else {
        setUploadError({ message: `Upload failed: HTTP ${xhr.status} ${xhr.statusText}`, code: xhr.status });
      }
    };
    xhr.onerror = () => {
      xhrRef.current = null;
      setProgress(null);
      setUploadError({ message: "The upload stopped because the connection dropped. Try again.", code: 0 });
    };
    xhr.onabort = () => {
      xhrRef.current = null;
      setProgress(null);
      setNotice("Upload cancelled.");
    };
    const body = new FormData();
    body.append("file", file);
    xhr.open("POST", "/api/imports");
    xhr.send(body);
  }

  const uploading = progress !== null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-ink">
      <h1 className="text-xl font-semibold">Import contacts</h1>

      <form onSubmit={upload} className="mt-6 rounded-lg border border-ink/10 p-4">
        <label htmlFor="import-file" className="text-sm font-medium">Spreadsheet</label>
        <input
          id="import-file"
          type="file"
          disabled={uploading}
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          className="mt-2 block text-md"
        />
        {fileError && <p role="alert" className="mt-2 text-sm text-red-700">{fileError}</p>}

        {uploading && (
          <div className="mt-4 flex items-center gap-3">
            <span aria-label="Uploading" className="size-4 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
            <span className="flex-1 text-sm">Uploading…</span>
          </div>
        )}

        {uploadError && (
          <div role="alert" className="mt-3 text-sm text-red-700">
            <p>{uploadError.message}</p>
            {uploadError.code > 0 && <p className="text-xs text-ink-muted">Error {uploadError.code}</p>}
          </div>
        )}
        {notice && <p role="status" className="mt-3 text-sm text-success">{notice}</p>}

        <Button type="submit" className="mt-4" disabled={uploading}>
          {uploading ? "Uploading…" : "Upload and import"}
        </Button>
      </form>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-md font-semibold">Past imports</h2>
          {listState === "loading" && (
            <ul aria-busy="true" className="mt-2 flex flex-col gap-2">
              {[0, 1, 2].map((i) => (
                <li key={i} className="h-12 animate-pulse rounded-md bg-ink/10" />
              ))}
            </ul>
          )}
          {listState === "error" && (
            <div className="mt-2 text-md">
              <p>We couldn't load your past imports.</p>
            </div>
          )}
          {listState === "ready" && jobs.length === 0 && (
            <p className="mt-2 text-md text-ink-muted">No imports yet. Upload a spreadsheet above to bring in your contacts.</p>
          )}
          {listState === "ready" && jobs.length > 0 && (
            <ul className="mt-2 flex flex-col gap-2">
              {jobs.map((j) => (
                <li key={j.id}>
                  <button
                    type="button"
                    aria-pressed={selected === j.id}
                    onClick={() => setSelected(j.id)}
                    className={`flex h-12 w-full items-center rounded-md px-3 text-left text-md ${selected === j.id ? "bg-surface-raised" : "hover:bg-surface-raised"}`}
                  >
                    {j.fileName}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="text-md font-semibold">Details</h2>
          <div className="mt-2">
            {selected ? (
              <ImportDetail id={selected} />
            ) : (
              <p className="h-40 rounded-lg border border-dashed border-ink/20 p-4 text-md text-ink-muted">
                Select an import to see how many rows came through.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
