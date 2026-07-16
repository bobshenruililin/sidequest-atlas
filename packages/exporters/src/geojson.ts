import { TripSchema, type Place, type Trip } from "@sidequest-atlas/domain";

export interface GeoJsonFeature {
  type: "Feature";
  id: string;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: Record<string, string | number | boolean | null>;
}

export interface GeoJsonFeatureCollection {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}

export function exportTripToGeoJson(input: Trip): GeoJsonFeatureCollection {
  const trip = TripSchema.parse(input);
  const features: GeoJsonFeature[] = [];

  for (const sidequest of trip.sidequests) {
    if (hasCoordinates(sidequest.location)) {
      features.push(
        makeFeature(`sidequest:${sidequest.id}`, sidequest.location, {
          kind: "sidequest",
          title: sidequest.title,
          city: sidequest.city,
          placeSpecificity: sidequest.placeSpecificity,
          storyPotential: sidequest.storyPotential,
        }),
      );
    }
  }

  for (const day of trip.days) {
    for (const block of day.blocks) {
      if (hasCoordinates(block.location)) {
        features.push(
          makeFeature(`block:${block.id}`, block.location, {
            kind: "event-block",
            title: block.title,
            date: day.date,
            city: day.city,
            period: block.period,
            fixed: block.fixed,
          }),
        );
      }
    }
  }

  return { type: "FeatureCollection", features };
}

function hasCoordinates(place: Place | undefined): place is Place & { lat: number; lon: number } {
  return place?.lat !== undefined && place.lon !== undefined;
}

function makeFeature(
  id: string,
  place: Place & { lat: number; lon: number },
  properties: Record<string, string | number | boolean | null>,
): GeoJsonFeature {
  return {
    type: "Feature",
    id,
    geometry: {
      type: "Point",
      coordinates: [place.lon, place.lat],
    },
    properties: {
      ...properties,
      placeId: place.id,
      name: place.name,
      address: place.address ?? null,
      country: place.country,
      countryCode: place.countryCode,
      locationPrecision: place.locationPrecision,
    },
  };
}
