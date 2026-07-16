"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  appendNoteRevision,
  listNoteRevisions,
  type NoteRevision,
} from "@/lib/notes-db";

export default function FieldNotesPage() {
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("fieldwork");
  const [revisions, setRevisions] = useState<NoteRevision[]>([]);
  const [status, setStatus] = useState("IndexedDB will store append-only revisions on this device.");

  useEffect(() => {
    listNoteRevisions()
      .then(setRevisions)
      .catch(() => {
        setStatus("IndexedDB is unavailable here; the editor shell still renders.");
      });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) {
      return;
    }

    try {
      const revision = await appendNoteRevision({
        body: body.trim(),
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
      setRevisions((current) => [revision, ...current]);
      setBody("");
      setStatus("Revision saved locally.");
    } catch {
      setStatus("Could not write to IndexedDB in this environment.");
    }
  }

  return (
    <div className="space-y-8">
      <header className="border-b border-rule pb-8">
        <p className="eyebrow">field notes</p>
        <h1 className="mt-3 font-serif text-5xl md:text-7xl">
          Append-only notebook shell
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Draft observations here. A later IndexedDB layer can sync media,
          places, and revisions; this static app already keeps local revision
          stubs without a server.
        </p>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1fr_24rem]">
        <form className="notebook-card rounded-[2rem] p-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="eyebrow">note body</span>
            <textarea
              className="mt-3 min-h-72 w-full rounded-[1.5rem] border border-rule bg-paper-elevated p-4 leading-7 text-ink outline-none focus:border-[var(--accent-se)]"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="What did the system reveal before it explained itself?"
            />
          </label>
          <label className="mt-4 block">
            <span className="eyebrow">tags</span>
            <input
              className="field-input mt-3"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="food, transit, trust"
            />
          </label>
          <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-muted">{status}</p>
            <button type="submit" className="ink-button">
              Save revision
            </button>
          </div>
        </form>

        <aside className="notebook-card rounded-[2rem] p-5">
          <p className="eyebrow">local revisions</p>
          <div className="mt-4 space-y-4">
            {revisions.map((revision) => (
              <article key={revision.id} className="border-t border-rule pt-4 first:border-t-0 first:pt-0">
                <p className="text-xs uppercase tracking-[0.16em] text-muted">
                  {new Date(revision.createdAt).toLocaleString()}
                </p>
                <p className="mt-2 line-clamp-4 text-sm leading-6">{revision.body}</p>
                <p className="mt-2 text-xs text-muted">{revision.tags.join(", ")}</p>
              </article>
            ))}
            {revisions.length === 0 && (
              <p className="text-sm leading-6 text-muted">
                No local note revisions yet.
              </p>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
