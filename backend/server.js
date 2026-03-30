// server.js — PitchForge backend entry point

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRouter from "./routes/analyze.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "20kb" })); // Reject huge payloads early

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", analyzeRouter);

// Health check — useful for deployment platforms
app.get("/health", (_, res) => {
  res.json({ status: "ok", service: "PitchForge API", timestamp: new Date().toISOString() });
});

// 404 handler for unknown routes
app.use((_, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("[Global error]", err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 PitchForge API running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Analyze endpoint: POST http://localhost:${PORT}/api/analyze-pitch\n`);
});
