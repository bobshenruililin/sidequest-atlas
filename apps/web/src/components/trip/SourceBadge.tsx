import type { SourceRecord } from "@sidequest-atlas/domain";

export function SourceBadge({ source }: { source: SourceRecord }) {
  return (
    <a
      href={source.url}
      className="inline-flex items-center gap-2 rounded-full border border-rule px-3 py-1 text-xs text-muted hover:border-[var(--accent-se)] hover:text-[var(--accent-se)]"
      target="_blank"
      rel="noreferrer"
    >
      <span className="font-bold uppercase tracking-[0.14em]">
        {source.sourceType}
      </span>
      <span>{source.publisher}</span>
    </a>
  );
}
