/**
 * Animated SVG ring showing health score 1–10.
 * Color transitions: red (1) → amber (5) → teal (8+)
 */

const SIZE = 140;
const STROKE = 12;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

function scoreColor(score) {
  if (score >= 8)  return '#00d4aa'; // teal
  if (score >= 6)  return '#22d3ee'; // cyan
  if (score >= 4)  return '#f59e0b'; // amber
  return '#ef4444';                   // red
}

function scoreLabel(score) {
  if (score >= 8) return 'Excellent';
  if (score >= 6) return 'Good';
  if (score >= 4) return 'Fair';
  return 'Poor';
}

export default function HealthScore({ score }) {
  const pct = score / 10;
  const dash = CIRCUMFERENCE * (1 - pct);
  const color = scoreColor(score);

  return (
    <div
      id="health-score-ring"
      className="flex flex-col items-center gap-2"
      role="img"
      aria-label={`Health score: ${score} out of 10 — ${scoreLabel(score)}`}
    >
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90 block">
          {/* Track */}
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            fill="none" stroke="#e5eeff" strokeWidth={STROKE}
          />
          {/* Score arc */}
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dash}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease' }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color, lineHeight: 1 }}>
            {score.toFixed(1)}
          </span>
          <span className="text-label-caps text-on-surface-v mt-0.5">/10</span>
        </div>
      </div>
      <span
        className="text-sm font-semibold rounded-full px-3 py-0.5"
        style={{ background: color + '22', color }}
      >
        {scoreLabel(score)}
      </span>
      <p className="text-label-caps text-on-surface-v">Health Score</p>
    </div>
  );
}
