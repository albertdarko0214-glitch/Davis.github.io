import { Router, Request, Response } from "express";
import pool from "../db.js";

const router = Router();

const resolveUserId = async (req: Request, res: Response) => {
  const userId = req.header("x-user-id")?.trim();

  if (!userId) {
    res.status(401).json({ error: "Missing user session. Please sign up first." });
    return null;
  }

  const userResult = await pool.query("SELECT id FROM users WHERE id = $1 LIMIT 1", [userId]);
  if (userResult.rows.length === 0) {
    res.status(401).json({ error: "User not found. Please sign up again." });
    return null;
  }

  return userId;
};

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = await resolveUserId(req, res);
    if (!userId) return;

    const result = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = await resolveUserId(req, res);
    if (!userId) return;

    const { text } = req.body as { text?: string };

    if (!text || !text.trim()) {
      res.status(400).json({ error: "Text is required" });
      return;
    }

    const result = await pool.query(
      "INSERT INTO todos (user_id, text) VALUES ($1, $2) RETURNING *",
      [userId, text.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const userId = await resolveUserId(req, res);
    if (!userId) return;

    const { id } = req.params;
    const { text, completed } = req.body as {
      text?: string;
      completed?: boolean;
    };

    if (text === undefined && completed === undefined) {
      res.status(400).json({ error: "Provide text and/or completed to update" });
      return;
    }

    if (text !== undefined && !text.trim()) {
      res.status(400).json({ error: "Text cannot be empty" });
      return;
    }

    if (completed !== undefined && typeof completed !== "boolean") {
      res.status(400).json({ error: "Completed must be true or false" });
      return;
    }

    const existing = await pool.query(
      "SELECT * FROM todos WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    if (existing.rows.length === 0) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    const current = existing.rows[0];
    const newText = text !== undefined ? text.trim() : current.text;
    const newCompleted = completed !== undefined ? completed : current.completed;

    const result = await pool.query(
      "UPDATE todos SET text = $1, completed = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [newText, newCompleted, id, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

router.delete("/completed/clear", async (req: Request, res: Response) => {
  try {
    const userId = await resolveUserId(req, res);
    if (!userId) return;

    const result = await pool.query(
      "DELETE FROM todos WHERE user_id = $1 AND completed = TRUE RETURNING *",
      [userId]
    );
    res.json({
      message: `${result.rowCount} completed todo(s) cleared`,
      clearedCount: result.rowCount ?? 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to clear completed todos" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = await resolveUserId(req, res);
    if (!userId) return;

    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    res.json({ message: "Todo deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

export default router;
