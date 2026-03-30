// App.jsx — root component

import { usePitchAnalyzer } from "./hooks/usePitchAnalyzer";
import { Results } from "./components/Results";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useState, useEffect } from "react";

const PLACEHOLDER = `We're building a SaaS platform that helps small restaurants manage their online orders from multiple platforms (Uber Eats, Swiggy, Zomato) in a single dashboard. 

Currently, restaurant owners have to juggle 3-4 devices simultaneously. We reduce that chaos into one screen, cut order errors by 60%, and save 2+ hours daily per location.

We're targeting the 5 million+ small restaurants in India. Our freemium model converts 12% of users to paid at ₹999/month. We've onboarded 47 restaurants in 3 cities in 6 weeks.`;

const LOADING_MESSAGES = [
  "Parsing your narrative arc…",
  "Scoring clarity and structure…",
  "Generating actionable feedback…",
  "Forging your pitch report…",
];

export default function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "/api"}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        console.error("Login failed:", data.error);
      }
    } catch (err) {
      console.error("Error verifying token:", err);
    }
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
  };

  const {
    pitch, setPitch,
    status, result, error,
    editableSuggestions, updateSuggestion,
    analyze, reset,
  } = usePitchAnalyzer();

  const charCount = pitch.length;
  const isReady = pitch.trim().length >= 50;

  return (
    <div className="app">
      {/* ── Background grid ──────────────────────────────────────── */}
      <div className="bg-grid" aria-hidden />

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav className="nav">
        <div className="nav-logo">
          <span className="logo-icon">⬡</span>
          <span>PitchForge</span>
        </div>
        <div className="nav-auth-container">
          {user ? (
            <div className="user-profile">
              <img src={user.picture} alt="Profile" className="user-avatar" referrerPolicy="no-referrer" />
              <span className="user-name">{user.name}</span>
              <button className="btn-logout" onClick={handleLogout}>Log Out</button>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.error("Login Failed")}
              theme="filled_black"
              shape="pill"
            />
          )}
        </div>
      </nav>

      <main className="main">
        {/* ── Hero ───────────────────────────────────────────────── */}
        {status === "idle" || status === "error" ? (
          <div className="hero">
            <div className="hero-badge">Beta — Free to use</div>
            <h1 className="hero-title">
              Forge a pitch<br />
              <span className="hero-accent">that gets funded.</span>
            </h1>
            <p className="hero-sub">
              Paste your startup pitch below. PitchForge uses AI to score your clarity,
              structure, and storytelling — then gives you specific fixes.
            </p>

            {/* ── Input area ─────────────────────────────────────── */}
            <div className="input-card">
              <div className="input-header">
                <label htmlFor="pitch-input">Your Pitch</label>
                <span className={`char-count ${charCount > 4800 ? "warn" : ""}`}>
                  {charCount} / 5000
                </span>
              </div>

              <textarea
                id="pitch-input"
                className="pitch-textarea"
                placeholder={PLACEHOLDER}
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                maxLength={5000}
                rows={10}
              />

              {error && (
                <div className="error-banner" role="alert">
                  ⚠ {error}
                </div>
              )}

              <div className="input-footer">
                <span className="input-hint">
                  {!isReady
                    ? `${Math.max(0, 50 - pitch.trim().length)} more characters needed`
                    : "✓ Ready to analyze"}
                </span>
                <button
                  className="btn-primary"
                  onClick={analyze}
                  disabled={!isReady}
                >
                  Analyze Pitch →
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* ── Loading ─────────────────────────────────────────────── */}
        {status === "loading" && (
          <div className="loading-panel">
            <div className="forge-spinner" aria-label="Analyzing…">
              <div className="spinner-ring" />
              <span className="spinner-icon">⬡</span>
            </div>
            <LoadingMessage messages={LOADING_MESSAGES} />
            <p className="loading-sub">This takes about 10–15 seconds</p>
          </div>
        )}

        {/* ── Results ─────────────────────────────────────────────── */}
        {status === "success" && result && (
          <Results
            result={result}
            editableSuggestions={editableSuggestions}
            onUpdateSuggestion={updateSuggestion}
            onReset={reset}
          />
        )}
      </main>

      <footer className="footer">
        💡 Built with passion by Shivaansh · PitchForge 2026
      </footer>
    </div>
  );
}

// Cycles through loading messages every 3 seconds
function LoadingMessage({ messages }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 3000);
    return () => clearInterval(id);
  }, [messages.length]);

  return <p className="loading-msg" key={index}>{messages[index]}</p>;
}
