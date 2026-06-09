import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import os from "os";
import authRouter from "./routes/auth.js";
import todosRouter from "./routes/todos.js";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

const getNetworkUrls = () => {
  const interfaces = os.networkInterfaces();
  const urls = new Set<string>();

  for (const network of Object.values(interfaces)) {
    for (const address of network || []) {
      if (address.family === "IPv4" && !address.internal) {
        urls.add(`http://${address.address}:${PORT}`);
      }
    }
  }

  return [...urls];
};

app.use(
  cors({
    origin: true,
  })
);
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/todos", todosRouter);

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "ok",
      message: "TodoFlow API is running 🚀",
      db: "PostgreSQL connected ✅",
      auth: {
        emailSignup: true,
        googleSignupConfigured: Boolean(process.env.GOOGLE_CLIENT_ID),
      },
      host: HOST,
      port: PORT,
      networkUrls: getNetworkUrls(),
    });
  } catch {
    res.status(500).json({ status: "error", message: "Database not connected ❌" });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`\n🚀 TodoFlow Backend running`);
  console.log(`   Local:   http://localhost:${PORT}`);
  for (const url of getNetworkUrls()) {
    console.log(`   Network: ${url}`);
  }
  console.log(`   Health:  /api/health`);
  console.log(`   Auth:    /api/auth`);
  console.log(`   Todos:   /api/todos\n`);
});

process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  await pool.end();
  console.log("✅ PostgreSQL pool closed.");
  process.exit(0);
});
