import { describe, expect, it } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { CaptureRecordSchema } from "@sidequest-atlas/domain";

const root = path.resolve(import.meta.dirname, "../../..");
const capturesDir = path.join(root, "content", "captures");

describe("contract: content/captures", () => {
  it("every CaptureRecord YAML parses", async () => {
    const names = (await readdir(capturesDir)).filter((name) => name.endsWith(".yaml"));
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      const raw = parse(await readFile(path.join(capturesDir, name), "utf8"));
      const record = CaptureRecordSchema.parse(raw);
      expect(name).toBe(`${record.id}.yaml`);
    }
  });
});
