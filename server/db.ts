import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: Number(process.env.PG_PORT) || 5432,
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD || "",
  database: process.env.PG_DATABASE || "tododb",
});

const initDB = async () => {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password_hash TEXT,
        auth_provider TEXT NOT NULL DEFAULT 'email',
        avatar_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT users_auth_provider_check CHECK (auth_provider IN ('email', 'google'))
      )
    `);

    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx
      ON users (LOWER(email))
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await pool.query(`ALTER TABLE todos ADD COLUMN IF NOT EXISTS user_id UUID`);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS todos_user_created_idx
      ON todos (user_id, created_at DESC)
    `);

    console.log("✅ PostgreSQL connected, users table ready, and todos table ready.");
  } catch (err) {
    console.error("❌ Failed to initialize database:", err);
    process.exit(1);
  }
};

void initDB();

export default pool;
