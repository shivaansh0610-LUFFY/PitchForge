// components/Results.jsx
// Full feedback display panel

import { useState } from "react";
import { ScoreRing, VERDICT_COLORS } from "./ScoreRing";

const SCORE_META = [
  { key: "clarity",      label: "Clarity",      color: "#38bdf8" },
  { key: "structure",    label: "Structure",    color: "#a78bfa" },
  { key: "storytelling", label: "Story",        color: "#f472b6" },
  { key: "confidence",   label: "Confidence",   color: "#4ade80" },
];

const PRIORITY_BADGE = {
  high:   { label: "High",   bg: "#ff4d4d22", border: "#ff4d4d66", text: "#ff4d4d" },
  medium: { label: "Medium", bg: "#f5a62322", border: "#f5a62366", text: "#f5a623" },
  low:    { label: "Low",    bg: "#4ade8022", border: "#4ade8066", text: "#4ade80" },
};

const VERDICT_LABEL = {
  needs_work:  "Needs Work",
  promising:   "Promising",
  strong:      "Strong",
  exceptional: "Exceptional 🔥",
};

export function Results({ result, editableSuggestions, onUpdateSuggestion, onReset }) {
  const { feedback, wordCount } = result;
  const verdictColor = VERDICT_COLORS[feedback.verdict] || "#fff";
  const [copyState, setCopyState] = useState("idle");

  function copyHook() {
    navigator.clipboard.writeText(feedback.rewrittenHook).then(() => {
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    });
  }

  return (
    <div className="results-panel">

      {/* ── Header bar ───────────────────────────────────────────────── */}
      <div className="results-header">
        <div>
          <p className="results-one-liner">"{feedback.oneLiner}"</p>
          <div className="results-meta">
            <span>{wordCount} words analyzed</span>
            <span className="verdict-badge" style={{ color: verdictColor, borderColor: verdictColor + "44", background: verdictColor + "11" }}>
              {VERDICT_LABEL[feedback.verdict]}
            </span>
          </div>
        </div>
        <button className="btn-ghost" onClick={onReset}>Analyze New Pitch →</button>
      </div>

      {/* ── Score rings ──────────────────────────────────────────────── */}
      <div className="scores-row">
        <ScoreRing score={feedback.scores.overall} label="Overall" color={verdictColor} size={110} delay={0} />
        <div className="scores-divider" />
        {SCORE_META.map((m, i) => (
          <ScoreRing key={m.key} score={feedback.scores[m.key]} label={m.label} color={m.color} size={80} delay={(i + 1) * 100} />
        ))}
      </div>

      {/* ── Strengths & Weaknesses ────────────────────────────────────── */}
      <div className="sw-grid">
        <div className="sw-card strengths">
          <h3>✦ Strengths</h3>
          <ul>
            {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div className="sw-card weaknesses">
          <h3>✦ Areas to Improve</h3>
          <ul>
            {feedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      </div>

      {/* ── Suggestions (editable) ────────────────────────────────────── */}
      <div className="section">
        <h3 className="section-title">Actionable Suggestions</h3>
        <div className="suggestions-list">
          {editableSuggestions.map((s) => {
            const badge = PRIORITY_BADGE[s.priority] || PRIORITY_BADGE.low;
            return (
              <div key={s.id} className="suggestion-card">
                <div className="suggestion-header">
                  <span className="suggestion-category">{s.category}</span>
                  <span className="priority-badge" style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.text }}>
                    {badge.label} priority
                  </span>
                </div>
                <p className="suggestion-issue">⚠ {s.issue}</p>
                <label className="suggestion-fix-label">Suggested Fix (editable):</label>
                <textarea
                  className="suggestion-textarea"
                  value={s.editedFix}
                  onChange={(e) => onUpdateSuggestion(s.id, e.target.value)}
                  rows={3}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Rewritten Hook ────────────────────────────────────────────── */}
      <div className="section">
        <h3 className="section-title">Rewritten Opening Hook</h3>
        <div className="hook-card">
          <p className="hook-text">"{feedback.rewrittenHook}"</p>
          <button className="btn-copy" onClick={copyHook}>
            {copyState === "copied" ? "✓ Copied!" : "Copy"}
          </button>
        </div>
      </div>

    </div>
  );
}
