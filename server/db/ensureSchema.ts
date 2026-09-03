import { pool } from "./index.js";

export async function ensureSchema(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS login (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        verified BOOLEAN DEFAULT false,
        verificationlink TEXT
      );
    `);
  } catch (err) {
    console.error("ensureSchema login table skipped:", (err as Error).message);
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255),
        provider VARCHAR(50),
        completed BOOLEAN DEFAULT false,
        google_refresh_token TEXT
      );
    `);
  } catch (err) {
    console.error("ensureSchema users table skipped:", (err as Error).message);
  }

  try {
    await pool.query(`
      ALTER TABLE product
        ADD COLUMN IF NOT EXISTS price numeric(10,2) DEFAULT '0',
        ADD COLUMN IF NOT EXISTS size varchar(50),
        ADD COLUMN IF NOT EXISTS order_id varchar(100),
        ADD COLUMN IF NOT EXISTS order_date varchar(50),
        ADD COLUMN IF NOT EXISTS status varchar(50) DEFAULT 'Pending';
    `);
  } catch (err) {
    console.error("ensureSchema product alter skipped:", (err as Error).message);
  }

  try {
    await pool.query(`
      ALTER TABLE apply
        ADD COLUMN IF NOT EXISTS created_at varchar(50);
    `);
  } catch (err) {
    console.error("ensureSchema apply alter skipped:", (err as Error).message);
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vacancy_application (
        id SERIAL PRIMARY KEY,
        vacancy_id INTEGER REFERENCES vacancy(id),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        resume_url TEXT,
        cover_letter TEXT,
        created_at VARCHAR(50)
      );
    `);
  } catch (err) {
    console.error("ensureSchema vacancy_application skipped:", (err as Error).message);
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS college (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        image VARCHAR(500),
        description TEXT,
        features TEXT,
        active BOOLEAN DEFAULT true
      );
    `);
  } catch (err) {
    console.error("ensureSchema college skipped:", (err as Error).message);
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employee_interest (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        role VARCHAR(100),
        message TEXT,
        created_at VARCHAR(50)
      );
    `);
  } catch (err) {
    console.error("ensureSchema employee_interest skipped:", (err as Error).message);
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notify (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255)
      );
    `);
  } catch (err) {
    console.error("ensureSchema notify skipped:", (err as Error).message);
  }

  console.log("Database schema is up to date");
}
