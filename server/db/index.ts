import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "login",
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

pool
  .connect()
  .then((client) => {
    console.log("Database connected successfully");
    client.release();
  })
  .catch((err) => console.error("Database connection error:", err));

export const db = drizzle(pool, { schema });
export { pool };