import { TripSchema, type Trip } from "@sidequest-atlas/domain";

export function exportTripToIcs(input: Trip): string {
  const trip = TripSchema.parse(input);
  const dtstamp = formatDateTimeUtc(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sidequest Atlas//Trip Export//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...trip.days.flatMap((day) => [
      "BEGIN:VEVENT",
      `UID:${escapeIcs(`${trip.slug}-${day.id}@sidequest-atlas`)}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${formatDate(day.date)}`,
      `DTEND;VALUE=DATE:${formatDate(addDays(day.date))}`,
      `SUMMARY:${escapeIcs(day.title)}`,
      `DESCRIPTION:${escapeIcs(day.thesisQuestion)}`,
      `LOCATION:${escapeIcs(`${day.city}, ${day.country}`)}`,
      "END:VEVENT",
      ...day.blocks
        .filter((block) => block.startTime !== undefined)
        .flatMap((block) => [
          "BEGIN:VEVENT",
          `UID:${escapeIcs(`${trip.slug}-${block.id}@sidequest-atlas`)}`,
          `DTSTAMP:${dtstamp}`,
          `DTSTART:${formatFloatingDateTime(day.date, block.startTime ?? "00:00")}`,
          block.endTime ? `DTEND:${formatFloatingDateTime(day.date, block.endTime)}` : "",
          `SUMMARY:${escapeIcs(block.title)}`,
          `DESCRIPTION:${escapeIcs(block.description)}`,
          block.location ? `LOCATION:${escapeIcs(block.location.name)}` : "",
          "END:VEVENT",
        ])
        .filter(Boolean),
    ]),
    "END:VCALENDAR",
  ];

  return `${lines.filter(Boolean).map(foldLine).join("\r\n")}\r\n`;
}

function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function formatDate(date: string): string {
  return date.replace(/-/g, "");
}

function formatFloatingDateTime(date: string, time: string): string {
  return `${formatDate(date)}T${time.replace(":", "")}00`;
}

function formatDateTimeUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function addDays(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function foldLine(line: string): string {
  if (line.length <= 75) {
    return line;
  }
  const chunks: string[] = [];
  let remaining = line;
  while (remaining.length > 75) {
    chunks.push(remaining.slice(0, 75));
    remaining = ` ${remaining.slice(75)}`;
  }
  chunks.push(remaining);
  return chunks.join("\r\n");
}
