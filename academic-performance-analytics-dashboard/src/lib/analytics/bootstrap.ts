/**
 * Makes sure the analytics tables exist and (only if empty) loads sample data.
 * Runs once per server process, the first time an analytics API is called.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pool } from "@/db";

let ready: Promise<void> | null = null;

async function run(): Promise<void> {
  const dir = path.join(process.cwd(), "analytics_sql");
  const client = await pool.connect();
  try {
    await client.query(await readFile(path.join(dir, "schema.sql"), "utf8"));
    const { rows } = await client.query("SELECT count(*)::int AS n FROM students");
    if (rows[0].n === 0) {
      await client.query("BEGIN");
      await client.query(await readFile(path.join(dir, "seed.sql"), "utf8"));
      await client.query("COMMIT");
    }
  } catch (err) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw err;
  } finally {
    client.release();
  }
}

export function ensureAnalyticsReady(): Promise<void> {
  if (!ready) {
    ready = run().catch((err) => {
      ready = null; // allow retry on next request
      throw err;
    });
  }
  return ready;
}
