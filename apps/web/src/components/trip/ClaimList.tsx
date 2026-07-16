import type { Claim, SourceRecord } from "@sidequest-atlas/domain";
import { SourceBadge } from "./SourceBadge";

export function ClaimList({
  claims,
  sources,
}: {
  claims: Claim[];
  sources: SourceRecord[];
}) {
  if (claims.length === 0) {
    return (
      <p className="text-sm leading-6 text-muted">
        No sourced claims are attached to this section yet.
      </p>
    );
  }

  const sourceById = new Map(sources.map((source) => [source.id, source]));

  return (
    <div className="rule-y">
      {claims.map((claim) => (
        <article key={claim.id} className="py-4 first:pt-0 last:pb-0">
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <p className="font-serif text-lg leading-7">{claim.statement}</p>
            <span className="h-fit rounded-full border border-rule px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted">
              {claim.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted">
            {claim.subjectType} / {claim.fieldPath} / confidence {claim.confidence}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {claim.sourceIds
              .map((sourceId) => sourceById.get(sourceId))
              .filter((source): source is SourceRecord => source !== undefined)
              .map((source) => (
                <SourceBadge key={source.id} source={source} />
              ))}
          </div>
        </article>
      ))}
    </div>
  );
}
