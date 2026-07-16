import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import {
  AgentJobSchema,
  ClaimSchema,
  ResearchRequestSchema,
  ResearchResultSchema,
  SourceRecordSchema,
  TravelerProfileSchema,
  TripSchema,
  ValidationReportSchema,
} from "../packages/domain/src/index.js";

const require = createRequire(import.meta.url);
const { zodToJsonSchema } = require("zod-to-json-schema") as typeof import("zod-to-json-schema");

const outputDir = path.join(process.cwd(), "agents", "contracts");
const schemas = [
  { file: "agent-job.schema.json", name: "AgentJob", schema: AgentJobSchema },
  { file: "claim.schema.json", name: "Claim", schema: ClaimSchema },
  { file: "research-request.schema.json", name: "ResearchRequest", schema: ResearchRequestSchema },
  { file: "research-result.schema.json", name: "ResearchResult", schema: ResearchResultSchema },
  { file: "source-record.schema.json", name: "SourceRecord", schema: SourceRecordSchema },
  { file: "traveler-profile.schema.json", name: "TravelerProfile", schema: TravelerProfileSchema },
  { file: "trip.schema.json", name: "Trip", schema: TripSchema },
  { file: "validation-report.schema.json", name: "ValidationReport", schema: ValidationReportSchema },
];

async function main(): Promise<void> {
  await mkdir(outputDir, { recursive: true });

  for (const contract of schemas) {
    const jsonSchema = zodToJsonSchema(contract.schema, {
      name: contract.name,
      $refStrategy: "none",
    });
    await writeFile(
      path.join(outputDir, contract.file),
      `${JSON.stringify(jsonSchema, null, 2)}\n`,
      "utf8",
    );
  }

  process.stdout.write(`Generated ${schemas.length} schemas in ${outputDir}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
