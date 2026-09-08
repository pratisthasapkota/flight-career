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
        ADD COLUMN IF NOT EXISTS status varchar(50) DEFAULT 'Pending',
        ADD COLUMN IF NOT EXISTS payment_method varchar(50) DEFAULT 'Cash on Delivery',
        ADD COLUMN IF NOT EXISTS is_paid boolean DEFAULT false;
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

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS guide (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        chapters TEXT,
        category VARCHAR(50) NOT NULL DEFAULT 'guide',
        pdf_url VARCHAR(500),
        active BOOLEAN DEFAULT true,
        updated_at VARCHAR(50)
      );
    `);
  } catch (err) {
    console.error("ensureSchema guide skipped:", (err as Error).message);
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_sessions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(100) NOT NULL UNIQUE,
        payment_method VARCHAR(50) NOT NULL,
        amount numeric(10,2) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        customer_email VARCHAR(255),
        customer_name VARCHAR(255),
        gateway_ref VARCHAR(255),
        gateway_txn_id VARCHAR(255),
        used BOOLEAN DEFAULT false,
        created_at VARCHAR(50) NOT NULL,
        completed_at VARCHAR(50)
      );
    `);
    await pool.query(`ALTER TABLE payment_sessions ADD COLUMN IF NOT EXISTS gateway_ref VARCHAR(255);`);
    await pool.query(`ALTER TABLE payment_sessions ADD COLUMN IF NOT EXISTS gateway_txn_id VARCHAR(255);`);
    await pool.query(`ALTER TABLE payment_sessions ADD COLUMN IF NOT EXISTS used BOOLEAN DEFAULT false;`);
  } catch (err) {
    console.error("ensureSchema payment_sessions skipped:", (err as Error).message);
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_settings (
        id SERIAL PRIMARY KEY,
        mode VARCHAR(20) NOT NULL DEFAULT 'demo',
        enabled_methods TEXT NOT NULL DEFAULT 'Cash on Delivery,Khalti,eSewa,FonePay,Card',
        khalti_public_key TEXT,
        khalti_secret_key TEXT,
        esewa_merchant_id TEXT,
        esewa_secret_key TEXT,
        fonepay_merchant_id TEXT,
        fonepay_secret_key TEXT,
        updated_at VARCHAR(50)
      );
    `);
  } catch (err) {
    console.error("ensureSchema payment_settings skipped:", (err as Error).message);
  }

  try {
    await pool.query(`ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS esewa_merchant_id TEXT;`);
    await pool.query(`ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS esewa_secret_key TEXT;`);
    await pool.query(`ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS fonepay_merchant_id TEXT;`);
    await pool.query(`ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS fonepay_secret_key TEXT;`);
  } catch (err) {
    console.error("ensureSchema payment_settings alter skipped:", (err as Error).message);
  }

  try {
    await pool.query(`
      ALTER TABLE guide ADD COLUMN IF NOT EXISTS category VARCHAR(50) NOT NULL DEFAULT 'guide';
    `);
  } catch (err) {
    console.error("ensureSchema guide category alter skipped:", (err as Error).message);
  }

  console.log("Database schema is up to date");
}
