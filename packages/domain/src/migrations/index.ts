export interface Migration<TFrom, TTo> {
  from: string;
  to: string;
  migrate(input: TFrom): TTo;
}

const migrations: Migration<unknown, unknown>[] = [];

export function registerMigration(migration: Migration<unknown, unknown>): void {
  migrations.push(migration);
}

export function listMigrations(): Migration<unknown, unknown>[] {
  return [...migrations];
}

export function migrateDocument<T extends { schemaVersion?: string }>(
  doc: T,
  targetVersion: string,
): T {
  let current: unknown = doc;
  let version = doc.schemaVersion ?? "0.0.0";
  const path = migrations.filter(
    (m) => m.from >= version && m.to <= targetVersion,
  );
  // Simple chain: apply in order while from matches
  let guard = 0;
  while (version !== targetVersion && guard < 50) {
    const next = migrations.find((m) => m.from === version);
    if (!next) break;
    current = next.migrate(current);
    version = next.to;
    if (
      typeof current === "object" &&
      current !== null &&
      "schemaVersion" in current
    ) {
      (current as { schemaVersion: string }).schemaVersion = version;
    }
    guard += 1;
  }
  return current as T;
}

export function checkSchemaVersion(
  version: string | undefined,
  expected: string,
): { ok: boolean; message: string } {
  if (!version) {
    return { ok: false, message: "Missing schemaVersion" };
  }
  if (version !== expected) {
    return {
      ok: false,
      message: `schemaVersion ${version} != expected ${expected}; run atlas schema migrate`,
    };
  }
  return { ok: true, message: "ok" };
}
