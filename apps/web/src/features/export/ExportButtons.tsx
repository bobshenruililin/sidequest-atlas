"use client";

import type { Trip } from "@sidequest-atlas/domain";
import { stringify as stringifyYaml } from "yaml";

const exportFormats = [
  { label: "Markdown", extension: "md", type: "text/markdown" },
  { label: "YAML", extension: "yaml", type: "application/yaml" },
  { label: "JSON", extension: "json", type: "application/json" },
  { label: "ICS", extension: "ics", type: "text/calendar" },
] as const;

export function ExportButtons({ trip }: { trip: Trip }) {
  function handleExport(extension: (typeof exportFormats)[number]["extension"]) {
    const payload = createPayload(trip, extension);
    const format = exportFormats.find((item) => item.extension === extension);
    if (!format) {
      return;
    }

    const blob = new Blob([payload], { type: `${format.type};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${trip.slug}.${extension}`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="notebook-card rounded-[2rem] p-5 print:hidden">
      <p className="eyebrow">offline exports</p>
      <h2 className="mt-2 font-serif text-3xl">Download trip dossier</h2>
      <div className="mt-5 flex flex-wrap gap-3">
        {exportFormats.map((format) => (
          <button
            key={format.extension}
            type="button"
            className="ghost-button"
            onClick={() => handleExport(format.extension)}
          >
            {format.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function createPayload(
  trip: Trip,
  extension: (typeof exportFormats)[number]["extension"],
): string {
  switch (extension) {
    case "md":
      return exportTripToMarkdownClient(trip);
    case "yaml":
      return stringifyYaml(trip);
    case "json":
      return `${JSON.stringify(trip, null, 2)}\n`;
    case "ics":
      return exportTripToIcsClient(trip);
  }
}

function exportTripToMarkdownClient(trip: Trip): string {
  const lines = [
    `# ${trip.title}`,
    "",
    trip.subtitle ? `_${trip.subtitle}_` : "",
    "",
    `Dates: ${trip.startDate} to ${trip.endDate}`,
    "",
    "## Thesis",
    "",
    trip.thesis,
    "",
    "## Days",
    "",
    ...trip.days.flatMap((day) => [
      `### ${day.date}: ${day.title}`,
      "",
      `- City: ${day.city}, ${day.country}`,
      `- Theme: ${day.theme}`,
      `- Question: ${day.thesisQuestion}`,
      "",
    ]),
  ];

  return `${lines.filter((line, index, all) => line !== "" || all[index - 1] !== "").join("\n").trim()}\n`;
}

function exportTripToIcsClient(trip: Trip): string {
  const dtstamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sidequest Atlas//Static Web Export//EN",
    "CALSCALE:GREGORIAN",
    ...trip.days.flatMap((day) => [
      "BEGIN:VEVENT",
      `UID:${escapeIcs(`${trip.slug}-${day.id}@sidequest-atlas`)}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${day.date.replace(/-/g, "")}`,
      `DTEND;VALUE=DATE:${addDays(day.date).replace(/-/g, "")}`,
      `SUMMARY:${escapeIcs(day.title)}`,
      `DESCRIPTION:${escapeIcs(day.thesisQuestion)}`,
      `LOCATION:${escapeIcs(`${day.city}, ${day.country}`)}`,
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];

  return `${lines.join("\r\n")}\r\n`;
}

function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function addDays(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}
