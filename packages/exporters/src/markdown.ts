import {
  TripSchema,
  formatMoney,
  type BudgetRange,
  type Trip,
} from "@sidequest-atlas/domain";

export function exportTripToMarkdown(input: Trip): string {
  const trip = TripSchema.parse(input);
  const lines: string[] = [
    `# ${trip.title}`,
    "",
    trip.subtitle ? `_${trip.subtitle}_` : "",
    "",
    `- Slug: \`${trip.slug}\``,
    `- Status: ${trip.status}`,
    `- Dates: ${trip.startDate} to ${trip.endDate}`,
    `- Traveler: ${trip.travelerId}`,
    "",
    "## Thesis",
    "",
    trip.thesis,
    "",
    "## Destinations",
    "",
  ];

  for (const destination of trip.destinations) {
    lines.push(
      `- **${destination.city}, ${destination.country}** (${destination.arrivalDate} to ${destination.departureDate})`,
      `  - Core question: ${destination.coreQuestion}`,
      `  - Themes: ${destination.themes.join(", ") || "none"}`,
    );
  }

  lines.push("", "## Questions", "");
  for (const question of trip.questions) {
    lines.push(`- ${question}`);
  }

  lines.push("", "## Daily Plan", "");
  for (const day of trip.days) {
    lines.push(`### ${day.date}: ${day.title}`, "");
    lines.push(`- City: ${day.city}, ${day.country}`);
    lines.push(`- Theme: ${day.theme}`);
    lines.push(`- Budget: ${formatBudget(day.budget)}`);
    lines.push(`- Sidequest potential: ${day.sidequestPotential}/5`);
    lines.push("");
    for (const block of day.blocks) {
      const time = block.startTime ? ` (${block.startTime}${block.endTime ? `-${block.endTime}` : ""})` : "";
      lines.push(`- **${block.period}${time}: ${block.title}**`);
      lines.push(`  - ${block.description}`);
      lines.push(`  - Why it matters: ${block.whyItMatters}`);
    }
    if (day.fieldworkPrompts.length > 0) {
      lines.push("", "Fieldwork prompts:");
      for (const prompt of day.fieldworkPrompts) {
        lines.push(`- ${prompt}`);
      }
    }
    lines.push("");
  }

  if (trip.sidequests.length > 0) {
    lines.push("## Sidequests", "");
    for (const sidequest of trip.sidequests) {
      lines.push(`- **${sidequest.title}** (${sidequest.city}): ${sidequest.description}`);
    }
    lines.push("");
  }

  if (trip.sources.length > 0) {
    lines.push("## Sources", "");
    for (const source of trip.sources) {
      lines.push(`- [${source.title}](${source.url}) - ${source.publisher}`);
    }
    lines.push("");
  }

  return `${lines.filter((line, index, all) => line !== "" || all[index - 1] !== "").join("\n").trim()}\n`;
}

function formatBudget(budget: BudgetRange): string {
  const low = formatMoney({ amountMinor: budget.lowMinor, currency: budget.currency }, budget.minorUnit);
  const high = formatMoney({ amountMinor: budget.highMinor, currency: budget.currency }, budget.minorUnit);
  return `${low} - ${high}`;
}
