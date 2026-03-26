const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export async function analyzePitch(pitchText) {
  const response = await fetch(`${BASE_URL}/analyze-pitch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pitch: pitchText }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Analysis failed.");
  return data;
}