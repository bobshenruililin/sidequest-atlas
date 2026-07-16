import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { resolveContentDir } from "./loaders.js";

export type PrivacyFindingKind = "email" | "booking-reference" | "phone";

export interface PrivacyPattern {
  kind: PrivacyFindingKind;
  regex: RegExp;
  replacement: string;
}

export interface PrivacyFinding {
  filePath: string;
  kind: PrivacyFindingKind;
  line: number;
  column: number;
  match: string;
  redacted: string;
}

export interface PrivacyScanReport {
  scannedFiles: number;
  findings: PrivacyFinding[];
  passed: boolean;
}

export const PRIVACY_PATTERNS: PrivacyPattern[] = [
  {
    kind: "email",
    regex: /\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g,
    replacement: "[REDACTED_EMAIL]",
  },
  {
    kind: "booking-reference",
    regex: /\b(?:PNR|BOOKING|CONFIRMATION|CONF|REF)[-_:\s]*[A-Z0-9]{5,12}\b/gi,
    replacement: "[REDACTED_BOOKING_REF]",
  },
  {
    kind: "phone",
    regex: /\b(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}\b/g,
    replacement: "[REDACTED_PHONE]",
  },
];

const SCANNABLE_EXTENSIONS = new Set([
  ".yaml",
  ".yml",
  ".json",
  ".md",
  ".mdx",
  ".txt",
]);

function cloneRegex(regex: RegExp): RegExp {
  return new RegExp(regex.source, regex.flags);
}

export function redactText(text: string, patterns = PRIVACY_PATTERNS): string {
  return patterns.reduce(
    (current, pattern) => current.replace(cloneRegex(pattern.regex), pattern.replacement),
    text,
  );
}

export function sanitizePublicText(text: string): string {
  return redactText(text);
}

export function sanitizePublicObject<T>(value: T): T {
  if (typeof value === "string") {
    return sanitizePublicText(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizePublicObject(item)) as T;
  }
  if (typeof value === "object" && value !== null) {
    const sanitizedEntries = Object.entries(value).map(([key, item]) => [
      key,
      sanitizePublicObject(item),
    ]);
    return Object.fromEntries(sanitizedEntries) as T;
  }
  return value;
}

function lineColumnForIndex(text: string, index: number): { line: number; column: number } {
  const before = text.slice(0, index);
  const lines = before.split(/\r\n|\n|\r/);
  const lastLine = lines.at(-1) ?? "";
  return { line: lines.length, column: lastLine.length + 1 };
}

export function scanTextForPrivatePatterns(
  text: string,
  filePath = "<memory>",
  patterns = PRIVACY_PATTERNS,
): PrivacyFinding[] {
  const findings: PrivacyFinding[] = [];
  for (const pattern of patterns) {
    const regex = cloneRegex(pattern.regex);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const value = match[0];
      const position = lineColumnForIndex(text, match.index);
      findings.push({
        filePath,
        kind: pattern.kind,
        ...position,
        match: value,
        redacted: pattern.replacement,
      });
      if (value.length === 0) {
        regex.lastIndex += 1;
      }
    }
  }
  return findings.sort((a, b) => a.line - b.line || a.column - b.column);
}

async function listScannableFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true }).catch((error: unknown) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }
    throw error;
  });

  const files: string[] = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listScannableFiles(absolute)));
    } else if (entry.isFile() && SCANNABLE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(absolute);
    }
  }
  return files.sort();
}

export async function scanPublicContent(
  contentDir = resolveContentDir(),
): Promise<PrivacyScanReport> {
  const files = await listScannableFiles(contentDir);
  const findings: PrivacyFinding[] = [];
  for (const filePath of files) {
    const text = await readFile(filePath, "utf8");
    findings.push(...scanTextForPrivatePatterns(text, filePath));
  }
  return {
    scannedFiles: files.length,
    findings,
    passed: findings.length === 0,
  };
}
