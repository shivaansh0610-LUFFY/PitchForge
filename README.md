# ⬡ PitchForge — AI Pitch Improvement Platform

> "Grammarly for startup pitches" — analyze, score, and improve your pitch with AI.

---

## 🗂 Folder Structure

```
pitchforge/
├── backend/
│   ├── middleware/
│   │   └── rateLimit.js       # IP-based rate limiter (10 req / 15 min)
│   ├── routes/
│   │   └── analyze.js         # POST /api/analyze-pitch endpoint
│   ├── utils/
│   │   └── pitchAnalyzer.js   # AI prompt + Anthropic API call
│   ├── server.js              # Express app entry point
│   ├── package.json
│   └── .env.example           # Copy this to .env and add your API key
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Results.jsx    # Full feedback display (scores, suggestions, hook)
    │   │   └── ScoreRing.jsx  # Animated circular score visualizer
    │   ├── hooks/
    │   │   └── usePitchAnalyzer.js  # All state + API logic
    │   ├── utils/
    │   │   └── api.js         # Fetch wrapper for backend
    │   ├── App.jsx            # Root component
    │   ├── index.css          # Full design system
    │   └── main.jsx           # React DOM entry
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Setup Instructions

### Step 1 — Get an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

---

### Step 2 — Set up the Backend

```bash
cd pitchforge/backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Now open `.env` and paste your key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
# Development (auto-restarts on changes)
npm run dev

# Production
npm start
```

You should see:
```
🚀 PitchForge API running at http://localhost:3001
```

Test it's alive:
```bash
curl http://localhost:3001/health
```

---

### Step 3 — Set up the Frontend

Open a **new terminal**:

```bash
cd pitchforge/frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open your browser at: **http://localhost:5173**

---

### Step 4 — Test an End-to-End Analysis

1. Open the app in your browser
2. Paste or type a pitch (at least 50 characters)
3. Click **Analyze Pitch →**
4. Wait ~10–15 seconds for AI analysis
5. View scores, suggestions, and rewritten hook

---

## 🔌 API Reference

### `POST /api/analyze-pitch`

**Request body:**
```json
{
  "pitch": "Your pitch text here (50–5000 characters)"
}
```

**Success response (200):**
```json
{
  "success": true,
  "wordCount": 87,
  "charCount": 512,
  "feedback": {
    "scores": {
      "clarity": 74,
      "structure": 68,
      "storytelling": 55,
      "confidence": 71,
      "overall": 67
    },
    "oneLiner": "A dashboard for restaurant order management.",
    "strengths": ["Clear problem statement", "Specific metrics cited", "Strong traction"],
    "weaknesses": ["Weak opening hook", "No mention of team", "CTA is vague"],
    "suggestions": [
      {
        "id": "s1",
        "category": "storytelling",
        "priority": "high",
        "issue": "Opens with feature description instead of a story",
        "fix": "Start with: 'Last month, a restaurant owner in Mumbai lost ₹40,000 because orders slipped through three different apps...'"
      }
    ],
    "rewrittenHook": "Every night, restaurant owners in India are losing orders — and money — because they're juggling three screens. We fix that with one.",
    "verdict": "promising"
  }
}
```

**Error responses:**
- `400` — Pitch too short / too long / missing
- `429` — Rate limit exceeded
- `500` — AI error / server error

---

## 🚀 Deploying to Production

### Backend → Railway / Render / Fly.io

1. Push `backend/` to GitHub
2. Connect repo on [railway.app](https://railway.app) or [render.com](https://render.com)
3. Set environment variables: `ANTHROPIC_API_KEY`, `FRONTEND_URL`
4. Deploy!

### Frontend → Vercel / Netlify

1. Push `frontend/` to GitHub
2. Connect on [vercel.com](https://vercel.com)
3. Set `VITE_API_URL=https://your-backend-url.railway.app/api`
4. Deploy!

---

## 🔧 Customization Ideas

| Feature | How |
|---|---|
| Save pitch history | Add localStorage in `usePitchAnalyzer.js` |
| Compare two pitches | Add a second textarea + diff view |
| PDF export | Use `jsPDF` to export the results panel |
| Auth + history | Add Supabase or Firebase |
| Shareable report URL | Hash the pitch and store in a DB |

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, plain CSS |
| Backend | Node.js, Express 4 |
| AI | Anthropic Claude API (claude-opus-4-5) |
| Deployment | Railway + Vercel (recommended) |

---

Built with ☕️ for Revolution.
>>>>>>> 59da374 (Initial commit - PitchForge AI pitch analyzer)
