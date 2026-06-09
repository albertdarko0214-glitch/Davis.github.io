import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import pool from "../db.js";

dotenv.config();

type SafeUser = {
  id: string;
  name: string;
  email: string;
  auth_provider: "email" | "google";
  avatar_url: string | null;
  created_at: string;
};

const router = Router();
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

const toSafeUser = (row: Record<string, unknown>): SafeUser => ({
  id: String(row.id),
  name: String(row.name),
  email: String(row.email),
  auth_provider: (row.auth_provider === "google" ? "google" : "email") as "email" | "google",
  avatar_url: row.avatar_url ? String(row.avatar_url) : null,
  created_at: String(row.created_at),
});

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      res.status(400).json({ error: "Name, email, and password are required." });
      return;
    }

    if (password.trim().length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters long." });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      res.status(409).json({ error: "An account with that email already exists." });
      return;
    }

    const passwordHash = await bcrypt.hash(password.trim(), 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, auth_provider)
       VALUES ($1, $2, $3, 'email')
       RETURNING id, name, email, auth_provider, avatar_url, created_at`,
      [name.trim(), normalizedEmail, passwordHash]
    );

    res.status(201).json({
      user: toSafeUser(result.rows[0]),
      message: "Account created successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create account." });
  }
});

router.post("/google", async (req: Request, res: Response) => {
  try {
    if (!googleClient || !googleClientId) {
      res.status(503).json({
        error: "Google sign up is not configured yet. Add GOOGLE_CLIENT_ID on the server and VITE_GOOGLE_CLIENT_ID on the frontend.",
      });
      return;
    }

    const { credential } = req.body as { credential?: string };

    if (!credential) {
      res.status(400).json({ error: "Google credential is required." });
      return;
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    const email = payload?.email?.trim().toLowerCase();

    if (!payload || !email || !payload.email_verified) {
      res.status(400).json({ error: "Google account could not be verified." });
      return;
    }

    const name = payload.name?.trim() || email.split("@")[0] || "Google User";
    const avatarUrl = payload.picture || null;

    const existingUser = await pool.query(
      `SELECT id, name, email, auth_provider, avatar_url, created_at
       FROM users
       WHERE LOWER(email) = LOWER($1)
       LIMIT 1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      const existing = existingUser.rows[0];

      if (existing.auth_provider !== "google" || existing.avatar_url !== avatarUrl || existing.name !== name) {
        const updated = await pool.query(
          `UPDATE users
           SET name = $1,
               auth_provider = 'google',
               avatar_url = $2,
               password_hash = NULL
           WHERE id = $3
           RETURNING id, name, email, auth_provider, avatar_url, created_at`,
          [name, avatarUrl, existing.id]
        );

        res.json({
          user: toSafeUser(updated.rows[0]),
          message: "Signed in with Google.",
        });
        return;
      }

      res.json({
        user: toSafeUser(existing),
        message: "Signed in with Google.",
      });
      return;
    }

    const result = await pool.query(
      `INSERT INTO users (name, email, auth_provider, avatar_url)
       VALUES ($1, $2, 'google', $3)
       RETURNING id, name, email, auth_provider, avatar_url, created_at`,
      [name, email, avatarUrl]
    );

    res.status(201).json({
      user: toSafeUser(result.rows[0]),
      message: "Google account connected successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to sign up with Google." });
  }
});

export default router;
