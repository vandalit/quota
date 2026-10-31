// DB service — SQLite wrapper via tauri-plugin-sql.
// Fully implemented in Task 2.
// This stub exports the db instance and migration runner.

import Database from "@tauri-apps/plugin-sql";

let _db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!_db) {
    _db = await Database.load("sqlite:quota.db");
  }
  return _db;
}

export async function runMigrations(): Promise<void> {
  const db = await getDb();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS services (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT    NOT NULL,
      icon         TEXT,
      color_accent TEXT,
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS accounts (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      service_id   INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
      label        TEXT    NOT NULL,
      is_collapsed BOOLEAN DEFAULT 0,
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS entries (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id     INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      label          TEXT    NOT NULL,
      cooldown_hours REAL    NOT NULL,
      window_hours   REAL,
      status         TEXT    NOT NULL DEFAULT 'available'
                             CHECK(status IN ('available', 'cooling')),
      burned_at      DATETIME,
      created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS ui_settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}
