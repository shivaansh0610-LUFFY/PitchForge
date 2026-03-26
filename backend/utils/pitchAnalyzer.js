// utils/pitchAnalyzer.js
// Core AI logic: builds the prompt and calls the Anthropic Claude API

/**
 * Builds a structured system prompt that tells the model exactly
 * what to evaluate and how to format the response.
 */
const SYSTEM_PROMPT = `You are PitchForge, an expert pitch coach for startups, hackathons, and student founders.

Your job is to analyze a pitch and return ONLY a valid JSON object — no markdown, no explanation, no extra text.

Evaluate the pitch on these dimensions:

1. **clarity** (0–100): Is the core idea immediately understandable? Is jargon avoided?
2. **structure** (0–100): Does it follow a logical flow? (Problem → Solution → Why Now → CTA)
3. **storytelling** (0–100): Is there emotional resonance? A narrative arc? A hook?
4. **confidence** (0–100): Does the language project conviction and credibility?
5. **overall** (0–100): Weighted average holistic score.

Return this exact JSON shape:
{
  "scores": {
    "clarity": <number>,
    "structure": <number>,
    "storytelling": <number>,
    "confidence": <number>,
    "overall": <number>
  },
  "oneLiner": "<One sentence summary of what this pitch is about>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "suggestions": [
    {
      "id": "s1",
      "category": "clarity|structure|storytelling|confidence",
      "priority": "high|medium|low",
      "issue": "<what is wrong>",
      "fix": "<specific rewrite or action to take>"
    }
  ],
  "rewrittenHook": "<Rewrite the opening 2–3 sentences to be more compelling>",
  "verdict": "needs_work|promising|strong|exceptional"
}

Rules:
- Return ONLY JSON. No markdown code blocks. No extra commentary.
- suggestions array must have 3–5 items.
- strengths and weaknesses arrays must have exactly 3 items each.
- verdict must be one of: needs_work, promising, strong, exceptional
- All scores must be integers between 0 and 100.`;

/**
 * Calls the Anthropic Messages API with the user's pitch text.
 * @param {string} pitchText - The raw pitch submitted by the user
 * @param {string} apiKey - Anthropic API key
 * @returns {Promise<Object>} Parsed JSON feedback object
 */
export async function analyzePitch(pitchText, apiKey) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyze this pitch:\n\n${pitchText}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.content?.[0]?.text?.trim();

  if (!rawText) throw new Error("Empty response from AI model.");

  // Strip any accidental markdown fences the model might add
  const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI returned malformed JSON. Please try again.");
  }

  // Validate required fields exist
  if (!parsed.scores || !parsed.suggestions || !parsed.verdict) {
    throw new Error("AI response is missing required fields.");
  }

  return parsed;
}
