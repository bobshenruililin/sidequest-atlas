import type { Claim, SourceRecord, Trip } from "@sidequest-atlas/domain";

export interface ClaimSourceLink {
  claimId: string;
  sourceIds: string[];
  sources: SourceRecord[];
  missingSourceIds: string[];
}

export interface UnsupportedClaim {
  claim: Claim;
  reason: string;
}

function unique(values: string[]): string[] {
  return [...new Set(values)].sort();
}

export function sourceMapForTrip(trip: Trip): Map<string, SourceRecord> {
  return new Map(trip.sources.map((source) => [source.id, source]));
}

export function buildClaimSourceIndex(trip: Trip): ClaimSourceLink[] {
  const sources = sourceMapForTrip(trip);
  return trip.claims.map((claim) => {
    const linkedSources = claim.sourceIds
      .map((sourceId) => sources.get(sourceId))
      .filter((source): source is SourceRecord => source !== undefined);
    const missingSourceIds = claim.sourceIds.filter((sourceId) => !sources.has(sourceId));
    return {
      claimId: claim.id,
      sourceIds: unique(claim.sourceIds),
      sources: linkedSources,
      missingSourceIds,
    };
  });
}

export function sourcesForClaim(trip: Trip, claimId: string): SourceRecord[] {
  const claim = trip.claims.find((candidate) => candidate.id === claimId);
  if (!claim) {
    return [];
  }
  const sources = sourceMapForTrip(trip);
  return claim.sourceIds
    .map((sourceId) => sources.get(sourceId))
    .filter((source): source is SourceRecord => source !== undefined);
}

export function claimsForSource(trip: Trip, sourceId: string): Claim[] {
  return trip.claims.filter((claim) => claim.sourceIds.includes(sourceId));
}

export function linkClaimToSources(claim: Claim, sourceIds: string[]): Claim {
  return {
    ...claim,
    sourceIds: unique([...claim.sourceIds, ...sourceIds]),
  };
}

export function linkTripClaimToSources(
  trip: Trip,
  claimId: string,
  sourceIds: string[],
): Trip {
  return {
    ...trip,
    claims: trip.claims.map((claim) =>
      claim.id === claimId ? linkClaimToSources(claim, sourceIds) : claim,
    ),
  };
}

export function findUnsupportedClaims(trip: Trip): UnsupportedClaim[] {
  const sourceIds = new Set(trip.sources.map((source) => source.id));
  const unsupported: UnsupportedClaim[] = [];
  for (const claim of trip.claims) {
    if (claim.status === "researched" && claim.sourceIds.length === 0) {
      unsupported.push({ claim, reason: "researched claim has no sourceIds" });
      continue;
    }
    const missing = claim.sourceIds.filter((sourceId) => !sourceIds.has(sourceId));
    if (missing.length > 0) {
      unsupported.push({
        claim,
        reason: `missing sources: ${missing.join(", ")}`,
      });
    }
  }
  return unsupported;
}
