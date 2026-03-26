// middleware/rateLimit.js
// Simple in-memory rate limiter (no Redis needed for MVP)
// Limits each IP to 10 requests per 15-minute window

const requestLog = new Map(); // ip -> [timestamps]

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 10;

export function rateLimiter(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  // Get existing timestamps for this IP, filter out expired ones
  const timestamps = (requestLog.get(ip) || []).filter(
    (t) => now - t < WINDOW_MS
  );

  if (timestamps.length >= MAX_REQUESTS) {
    const retryAfter = Math.ceil(
      (WINDOW_MS - (now - timestamps[0])) / 1000 / 60
    );
    return res.status(429).json({
      error: "Too many requests",
      message: `Slow down! You've hit the rate limit. Try again in ~${retryAfter} minute(s).`,
      retryAfterMinutes: retryAfter,
    });
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);
  next();
}
