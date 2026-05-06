import HealthScore from './HealthScore';
import MacroBar from './MacroBar';
import ProsConsPanel from './ProsConsPanel';
import IngredientFlags from './IngredientFlags';
import { NOVA_LABELS } from '../lib/analyzer';
import { Plus } from 'lucide-react';

const NUTRISCORE_BG = {
  a: 'bg-teal/15 text-teal',
  b: 'bg-cyan-100 text-cyan-700',
  c: 'bg-yellow-100 text-yellow-700',
  d: 'bg-orange-100 text-orange-700',
  e: 'bg-red-100 text-red-700',
};

export default function ResultCard({ product, score, macros, pros, cons, harmful, onAddToDiary }) {
  const grade = (product.nutriscore_grade || '').toLowerCase();
  const nova  = parseInt(product.nova_group);

  return (
    <div id="result-card" className="space-y-4 fade-up">

      {/* ── Product header ── */}
      <div className="bg-white rounded-xl shadow-card p-5 flex gap-4">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.product_name}
            className="w-20 h-20 object-contain rounded-lg bg-surface-low flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-surface-mid flex items-center justify-center flex-shrink-0">
            <svg className="w-9 h-9 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h2 className="text-lg font-bold text-on-surface leading-snug line-clamp-2">
                {product.product_name}
              </h2>
              {product.brands && (
                <p className="text-sm text-on-surface-v mt-0.5">{product.brands}</p>
              )}
            </div>
            {onAddToDiary && (
              <button 
                onClick={() => onAddToDiary(product, macros, score)}
                className="bg-navy hover:bg-teal text-white hover:text-navy p-2 rounded-full shadow-card transition-colors flex-shrink-0"
                aria-label="Add to Diary"
                title="Add to Diary"
              >
                <Plus size={20} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {grade && (
              <span className={`text-label-caps px-2.5 py-1 rounded-full ${NUTRISCORE_BG[grade] || 'bg-surface-mid text-on-surface-v'}`}>
                Nutri-Score {grade.toUpperCase()}
              </span>
            )}
            {nova && (
              <span className="text-label-caps px-2.5 py-1 rounded-full bg-surface-mid text-on-surface-v">
                NOVA {nova}
              </span>
            )}
            {product.quantity && (
              <span className="text-label-caps px-2.5 py-1 rounded-full bg-surface-low text-on-surface-v">
                {product.quantity}
              </span>
            )}
          </div>
          {nova && NOVA_LABELS[nova] && (
            <p className="text-xs text-on-surface-v mt-1.5">{NOVA_LABELS[nova]}</p>
          )}
        </div>
      </div>

      {/* ── Score + Macros ── */}
      <div className="bg-white rounded-xl shadow-card p-5">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Ring */}
          <div className="flex-shrink-0 self-center sm:self-start">
            <HealthScore score={score} />
          </div>

          {/* Macro bars */}
          <div className="flex-1 w-full space-y-3">
            <p className="text-label-caps text-on-surface-v mb-1">Nutrition per 100g</p>
            <MacroBar label="Calories" value={macros.calories} unit=" kcal" macroKey="calories" />
            <MacroBar label="Protein"  value={macros.protein}  unit="g"     macroKey="protein"  />
            <MacroBar label="Carbs"    value={macros.carbs}    unit="g"     macroKey="carbs"    />
            <MacroBar label="Fat"      value={macros.fat}      unit="g"     macroKey="fat"      />
            <MacroBar label="Fibre"    value={macros.fibre}    unit="g"     macroKey="fibre"    />
            <MacroBar label="Sugar"    value={macros.sugar}    unit="g"     macroKey="sugar"    />
            <MacroBar label="Salt"     value={macros.salt}     unit="g"     macroKey="salt"     />
          </div>
        </div>
      </div>

      {/* ── Pros / Cons ── */}
      <div className="bg-white rounded-xl shadow-card p-5 space-y-3">
        <h3 className="text-label-caps text-on-surface-v">Nutritional Assessment</h3>
        <ProsConsPanel pros={pros} cons={cons} />
      </div>

      {/* ── Ingredient Flags ── */}
      <div className="bg-white rounded-xl shadow-card p-5 space-y-3">
        <h3 className="text-label-caps text-on-surface-v">Ingredient Safety</h3>
        <IngredientFlags harmful={harmful} />
        {product.ingredients_text && (
          <details className="mt-2">
            <summary className="text-xs text-on-surface-v cursor-pointer hover:text-navy transition-colors">
              View full ingredients list
            </summary>
            <p className="text-xs text-on-surface-v mt-2 leading-relaxed border-t border-outline-v/40 pt-2">
              {product.ingredients_text}
            </p>
          </details>
        )}
      </div>

    </div>
  );
}
