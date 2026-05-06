/**
 * MacroBar – single animated bar for one macro nutrient.
 */

const MACRO_COLORS = {
  calories: '#0b1120',
  protein:  '#00d4aa',
  carbs:    '#60a5fa',
  fat:      '#f59e0b',
  fibre:    '#34d399',
  sugar:    '#f87171',
  salt:     '#a78bfa',
};

// Reference daily values per 100g context (rough % of 2000 kcal diet / 100g)
const DAILY_REF = {
  calories: 500,  // cap bar at 500 kcal/100g
  protein:  50,
  carbs:    130,
  fat:      65,
  fibre:    25,
  sugar:    50,
  salt:     6,
};

export default function MacroBar({ label, value, unit = 'g', macroKey }) {
  const color  = MACRO_COLORS[macroKey] || '#64748b';
  const ref    = DAILY_REF[macroKey]    || 100;
  const pct    = Math.min(100, (value / ref) * 100);

  return (
    <div className="flex items-center gap-3" id={`macro-${macroKey}`}>
      {/* Label */}
      <span className="text-label-caps text-on-surface-v w-16 shrink-0">{label}</span>

      {/* Bar track */}
      <div className="flex-1 bg-surface-mid rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full"
          style={{
            width: `${pct}%`,
            background: color,
            transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>

      {/* Value */}
      <span className="text-sm font-semibold text-on-surface w-16 text-right shrink-0">
        {value % 1 === 0 ? value : value.toFixed(1)}{unit}
      </span>
    </div>
  );
}
