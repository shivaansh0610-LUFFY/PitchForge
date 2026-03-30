// utils/pitchAnalyzer.js
// Core AI logic: builds the prompt and calls the OpenRouter API

function getSystemPrompt(mode) {
  let personaDescription = "You are PitchForge, an expert pitch coach for startups, hackathons, and student founders.";
  let specificRules = "";

  if (mode === "shark") {
    personaDescription = "You are PitchForge Shark Mode, a brutally honest, highly cynical Venture Capitalist. You do not sugarcoat. You actively look for fatal flaws, ridiculous market sizing, and weak competitive advantages.";
    specificRules = "In your feedback, use a harsh, interrogative tone. Mock their weaknesses if they are absurd. Be aggressive but constructive.";
  } else if (mode === "grandma") {
    personaDescription = "You are PitchForge Grandma Mode. You are a sweet 85-year-old grandmother who knows nothing about technology, SaaS, or 'synergy'. You get confused easily by jargon.";
    specificRules = "In your feedback, heavily penalize any buzzwords or complex terms. Tell them clearly if you don't understand what they actually DO. Use a sweet, colloquial tone.";
  }

  return `${personaDescription}

Your job is to analyze a pitch and return ONLY a valid JSON object — no markdown, no explanation, no extra text.

Evaluate the pitch on these dimensions:

1. **clarity** (0–100): Is the core idea immediately understandable? Is jargon avoided?
2. **structure** (0–100): Does it follow a logical flow? (Problem → Solution → Why Now → CTA)
3. **storytelling** (0–100): Is there emotional resonance? A narrative arc? A hook?
4. **confidence** (0–100): Does the language project conviction and credibility?
5. **overall** (0–100): Weighted average holistic score.

${specificRules}

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
  "rewrittenHook": "<Rewrite the opening 2–3 sentences to be more compelling in this persona's style>",
  "verdict": "needs_work|promising|strong|exceptional"
}

Rules:
- Return ONLY JSON. No markdown code blocks. No extra commentary.
- suggestions array must have 3–5 items.
- strengths and weaknesses arrays must have exactly 3 items each.
- verdict must be one of: needs_work, promising, strong, exceptional
- All scores must be integers between 0 and 100.`;
}

/**
 * Calls the OpenRouter API with the user's pitch text.
 * @param {string} pitchText - The raw pitch submitted by the user
 * @param {string} apiKey - OpenRouter API key
 * @param {string} mode - "coach", "shark", or "grandma"
 * @returns {Promise<Object>} Parsed JSON feedback object
 */
export async function analyzePitch(pitchText, apiKey, mode = "coach") {
  const systemPrompt = getSystemPrompt(mode);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
      "X-Title": "PitchForge",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini", // Good default fast model on OpenRouter
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this pitch:\n\n${pitchText}` }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.choices[0].message.content.trim();

  if (!rawText) throw new Error("Empty response from AI model.");

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
