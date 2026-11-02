import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;
const useSsl = process.env.DB_SSL === "true";

if (!databaseUrl && !process.env.DB_PASSWORD) {
  console.warn(
    "[db] DB_PASSWORD is not set. Set DATABASE_URL or DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME in the environment."
  );
}

const pool = new Pool(
  databaseUrl
    ? {
        connectionString: databaseUrl,
        ssl: useSsl ? { rejectUnauthorized: false } : undefined,
        max: Number(process.env.DB_POOL_MAX || 10),
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 5_000,
        allowExitOnIdle: false,
      }
    : {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "login",
        port: parseInt(process.env.DB_PORT || "5432", 10),
        ssl: useSsl ? { rejectUnauthorized: false } : undefined,
        max: Number(process.env.DB_POOL_MAX || 10),
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 5_000,
        allowExitOnIdle: false,
      }
);

pool
  .connect()
  .then((client) => {
    console.log("Database connected successfully");
    client.release();
  })
  .catch((err) => console.error("Database connection error:", err.message));

pool.on("error", (err) => {
  console.error("[db] Unexpected idle client error:", err.message);
});

export const db = drizzle(pool, { schema });
export { pool };
