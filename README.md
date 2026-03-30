# ⬡ PitchForge — AI Pitch Improvement Platform

> “Grammarly for startup pitches” — analyze, score, and improve your pitch using AI.

---

## ✨ Features

* 🎯 AI-powered pitch analysis (clarity, structure, storytelling, confidence)
* 🎭 **Dynamic AI Personas:** Choose between Coach (helpful), Shark (brutal VC roast), or Grandma (jargon-free clarity)
* 📊 Visual scoring system with glassmorphism UI
* 🧠 Smart suggestions with actionable fixes
* ✍️ AI-generated improved hook for your pitch
* ⚡ Fast analysis (~10–15 seconds) using OpenRouter / Gemini 1.5 Flash
* 🛡 Rate-limited backend for stability

---

## 🧱 Tech Stack

| Layer      | Tech                 |
| ---------- | -------------------- |
| Frontend   | React 18, Vite, CSS  |
| Backend    | Node.js, Express     |
| AI         | OpenRouter API       |
| Deployment | Vercel + Render      |

---

## 📁 Project Structure

```
pitchforge/
├── backend/
│   ├── middleware/       # Rate limiting
│   ├── routes/           # API endpoints
│   ├── utils/            # AI logic
│   └── server.js         # Entry point
│
└── frontend/
    ├── components/       # UI components
    ├── hooks/            # Custom hooks
    ├── utils/            # API layer
    └── App.jsx
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/PitchForge.git
cd PitchForge
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Add your key in `.env`:

```
OPEN_ROUTER_API_KEY=your-openrouter-key
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Open → http://localhost:5173

---

## 🔌 API Endpoint

### POST `/api/analyze-pitch`

```json
{
  "pitch": "Your pitch here"
}
```

Returns:

* Scores
* Suggestions
* Rewritten hook
* Verdict

---

## 🚀 Deployment

### Backend

* Render / Railway
* Set env: `OPEN_ROUTER_API_KEY`, `FRONTEND_URL`

### Frontend

* Vercel / Netlify
* Set:

```
VITE_API_URL=https://your-backend-url/api
```

---

## 🧠 Future Improvements

* Save pitch history to a database (MongoDB/Supabase)
* Compare multiple pitches
* Export results as PDF
* Shareable report links

---

## 📸 Demo

*(Screenshots coming soon)*

---

## 🌟 Why this project?

Pitching is hard. Most founders struggle to communicate ideas clearly.

PitchForge helps:

* Students
* Founders
* Hackathon participants

…craft better, sharper, high-impact pitches using AI.

---

## 🤝 Contributing

Pull requests are welcome. Feel free to fork and improve!

---

## 📜 License

MIT License

---

## 💡 Built with passion by Shivaansh
