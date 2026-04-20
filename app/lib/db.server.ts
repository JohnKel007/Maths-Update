import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.resolve(__dirname, "../db/migrations");

function resolveDbPath(): string {
  const raw = process.env.DATABASE_PATH ?? "./data/app.db";
  return path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
}

function openDatabase(): Database.Database {
  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  runMigrations(db);
  return db;
}

function runMigrations(db: Database.Database): void {
  db.exec(
    `CREATE TABLE IF NOT EXISTS _migrations (
      id TEXT PRIMARY KEY,
      applied_at INTEGER NOT NULL
    )`,
  );

  const applied = new Set(
    db
      .prepare(`SELECT id FROM _migrations`)
      .all()
      .map((row) => (row as { id: string }).id),
  );

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const insert = db.prepare(
    `INSERT INTO _migrations (id, applied_at) VALUES (?, ?)`,
  );

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
    const apply = db.transaction(() => {
      db.exec(sql);
      insert.run(file, Date.now());
    });
    apply();
    // eslint-disable-next-line no-console
    console.log(`[db] applied migration ${file}`);
  }
}

declare global {
  // Keep one connection across dev HMR reloads.
  // eslint-disable-next-line no-var
  var __mathsDb: Database.Database | undefined;
}

export const db: Database.Database = globalThis.__mathsDb ?? openDatabase();
if (process.env.NODE_ENV !== "production") {
  globalThis.__mathsDb = db;
}
