// hooks/usePitchAnalyzer.js
// Encapsulates all state and logic for pitch analysis

import { useState, useCallback } from "react";
import { analyzePitch } from "../utils/api";

export function usePitchAnalyzer() {
  const [pitch, setPitch] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [editableSuggestions, setEditableSuggestions] = useState([]);

  const analyze = useCallback(async (mode = "coach") => {
    if (!pitch.trim() || pitch.trim().length < 50) {
      setError("Your pitch needs at least 50 characters.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError(null);
    setResult(null);

    try {
      const data = await analyzePitch(pitch, mode);
      setResult(data);

      // Initialize editable suggestions from the AI response
      setEditableSuggestions(
        data.feedback.suggestions.map((s) => ({ ...s, editedFix: s.fix }))
      );

      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }, [pitch]);

  const updateSuggestion = useCallback((id, newText) => {
    setEditableSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, editedFix: newText } : s))
    );
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
    setEditableSuggestions([]);
  }, []);

  return {
    pitch,
    setPitch,
    status,
    result,
    error,
    editableSuggestions,
    updateSuggestion,
    analyze,
    reset,
  };
}
