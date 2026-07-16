import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

interface Check {
  name: string;
  passed: boolean;
  details?: string;
}

const repoRoot = resolveRepoRoot(process.cwd());
const checks: Check[] = [
  checkNodeVersion("20.9.0"),
  {
    name: "package-lock exists",
    passed: existsSync(path.join(repoRoot, "package-lock.json")),
  },
  ...checkRequiredDirs([
    "agents/contracts",
    "content",
    "jobs",
    "packages/domain",
    "packages/content",
    "packages/intelligence",
    "packages/exporters",
    "packages/cli",
    "scripts",
    "vault",
  ]),
  checkNoVaultFilesStaged(),
];

for (const check of checks) {
  process.stdout.write(`${check.passed ? "PASS" : "FAIL"} ${check.name}`);
  if (check.details) {
    process.stdout.write(` - ${check.details}`);
  }
  process.stdout.write("\n");
}

if (checks.some((check) => !check.passed)) {
  process.exitCode = 1;
}

function checkNodeVersion(minimum: string): Check {
  const current = process.versions.node;
  return {
    name: `Node version >= ${minimum}`,
    passed: compareVersions(current, minimum) >= 0,
    details: current,
  };
}

function checkRequiredDirs(requiredDirs: string[]): Check[] {
  return requiredDirs.map((dir) => ({
    name: `required dir ${dir}`,
    passed: existsSync(path.join(repoRoot, dir)),
  }));
}

function checkNoVaultFilesStaged(): Check {
  const staged = stagedFiles();
  const allowed = new Set(["vault/README.md", "vault/.gitkeep"]);
  const blocked = staged.filter((file) => file.startsWith("vault/") && !allowed.has(file));
  return {
    name: "no vault files staged",
    passed: blocked.length === 0,
    details: blocked.length > 0 ? blocked.join(", ") : undefined,
  };
}

function stagedFiles(): string[] {
  try {
    return execFileSync("git", ["diff", "--cached", "--name-only"], {
      cwd: repoRoot,
      encoding: "utf8",
    })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch {
    return [];
  }
}

function compareVersions(left: string, right: string): number {
  const leftParts = left.split(".").map(Number);
  const rightParts = right.split(".").map(Number);
  for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index += 1) {
    const leftPart = leftParts[index] ?? 0;
    const rightPart = rightParts[index] ?? 0;
    if (leftPart !== rightPart) {
      return leftPart - rightPart;
    }
  }
  return 0;
}

function resolveRepoRoot(cwd: string): string {
  let current = path.resolve(cwd);
  while (true) {
    if (
      existsSync(path.join(current, "package.json")) &&
      existsSync(path.join(current, "packages", "domain"))
    ) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return path.resolve(cwd);
    }
    current = parent;
  }
}
