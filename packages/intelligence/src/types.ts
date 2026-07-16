import type { ResearchRequest, ResearchResult, Trip } from "@sidequest-atlas/domain";

export interface TripIntelligenceProvider {
  readonly id: string;
  createTrip(request: ResearchRequest): Promise<Trip>;
  research(request: ResearchRequest): Promise<ResearchResult>;
}
