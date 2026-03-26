// components/ScoreRing.jsx
// Animated circular score visualizer

import { useEffect, useState } from "react";

const VERDICT_COLORS = {
  needs_work: "#ff4d4d",
  promising: "#f5a623",
  strong: "#4ade80",
  exceptional: "#a78bfa",
};

export function ScoreRing({ score, label, color, size = 90, delay = 0 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1200;
      const start = performance.now();

      function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedScore(Math.round(score * eased));
        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [score, delay]);

  return (
    <div className="score-ring-wrapper">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="6"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.05s linear", filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
        {/* Score number */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill="white"
          fontSize={size * 0.22}
          fontFamily="'Syne', sans-serif"
          fontWeight="700"
        >
          {animatedScore}
        </text>
      </svg>
      <span className="score-label">{label}</span>
    </div>
  );
}

export { VERDICT_COLORS };
