import { stringify as stringifyYaml } from "yaml";
import { TripSchema, type Trip } from "@sidequest-atlas/domain";

export function exportTripToYaml(input: Trip): string {
  return stringifyYaml(TripSchema.parse(input));
}
