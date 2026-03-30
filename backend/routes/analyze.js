// routes/analyze.js
// POST /analyze-pitch — the core endpoint

import { Router } from "express";
import { analyzePitch } from "../utils/pitchAnalyzer.js";
import { rateLimiter } from "../middleware/rateLimit.js";

const router = Router();

// Validation constants
const MIN_PITCH_LENGTH = 50;   // characters
const MAX_PITCH_LENGTH = 5000; // characters

router.post("/analyze-pitch", rateLimiter, async (req, res) => {
  const { pitch } = req.body;

  // ── Input validation ──────────────────────────────────────────────────────
  if (!pitch || typeof pitch !== "string") {
    return res.status(400).json({
      error: "Missing pitch",
      message: "Please provide a pitch in the request body as { pitch: '...' }",
    });
  }

  const trimmed = pitch.trim();

  if (trimmed.length < MIN_PITCH_LENGTH) {
    return res.status(400).json({
      error: "Pitch too short",
      message: `Your pitch needs at least ${MIN_PITCH_LENGTH} characters. Give us more to work with!`,
    });
  }

  if (trimmed.length > MAX_PITCH_LENGTH) {
    return res.status(400).json({
      error: "Pitch too long",
      message: `Please keep your pitch under ${MAX_PITCH_LENGTH} characters.`,
    });
  }

  // ── AI Analysis ───────────────────────────────────────────────────────────
  try {
    const apiKey = process.env.OPEN_ROUTER_API_KEY;
    if (!apiKey) throw new Error("Server misconfiguration: API key not set.");

    const feedback = await analyzePitch(trimmed, apiKey);

    return res.status(200).json({
      success: true,
      wordCount: trimmed.split(/\s+/).length,
      charCount: trimmed.length,
      feedback,
    });
  } catch (err) {
    console.error("[/analyze-pitch] Error:", err.message);

    // Don't leak internal errors to client
    const isUserFacing =
      err.message.includes("too short") ||
      err.message.includes("malformed") ||
      err.message.includes("missing required");

    return res.status(500).json({
      error: "Analysis failed",
      message: isUserFacing
        ? err.message
        : "Something went wrong on our end. Please try again.",
    });
  }
});

export default router;
