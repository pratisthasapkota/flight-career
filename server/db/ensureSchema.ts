import { pool } from "./index.js";

export async function ensureSchema(): Promise<void> {
  try {
    await pool.query(`
      ALTER TABLE product
        ADD COLUMN IF NOT EXISTS price numeric(10,2) DEFAULT '0',
        ADD COLUMN IF NOT EXISTS size varchar(50),
        ADD COLUMN IF NOT EXISTS order_id varchar(100),
        ADD COLUMN IF NOT EXISTS order_date varchar(50),
        ADD COLUMN IF NOT EXISTS status varchar(50) DEFAULT 'Pending';
    `);
    await pool.query(`
      ALTER TABLE apply
        ADD COLUMN IF NOT EXISTS created_at varchar(50);
    `);
    console.log("Database schema is up to date");
  } catch (err) {
    console.error("ensureSchema skipped:", (err as Error).message);
  }
}