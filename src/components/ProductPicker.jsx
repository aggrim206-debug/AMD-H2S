/** Horizontal scrollable list of search result candidates to pick from */
export default function ProductPicker({ products, onSelect }) {
  if (!products || products.length === 0) return null;

  return (
    <div id="product-picker" className="space-y-2">
      <p className="text-label-caps text-on-surface-v">
        {products.length} result{products.length > 1 ? 's' : ''} found — select one to analyze
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
        {products.map((p, i) => (
          <button
            key={p.code || i}
            id={`product-pick-${i}`}
            onClick={() => onSelect(p)}
            className="
              snap-start flex-shrink-0 w-52 text-left
              bg-white border border-outline-v rounded-xl p-3
              hover:border-teal hover:shadow-elevated
              focus:outline-none focus:ring-2 focus:ring-teal/40
              transition-all duration-200 group
            "
          >
            {p.image_url ? (
              <img
                src={p.image_url}
                alt={p.product_name}
                className="w-full h-28 object-contain rounded-lg mb-2 bg-surface-low"
              />
            ) : (
              <div className="w-full h-28 rounded-lg mb-2 bg-surface-mid flex items-center justify-center">
                <svg className="w-10 h-10 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
              </div>
            )}
            <p className="text-sm font-semibold text-on-surface line-clamp-2 group-hover:text-navy">
              {p.product_name}
            </p>
            {p.brands && (
              <p className="text-xs text-on-surface-v mt-0.5 truncate">{p.brands}</p>
            )}
            {p.nutriscore_grade && (
              <span className={`
                mt-1.5 inline-block text-label-caps px-2 py-0.5 rounded-full
                ${p.nutriscore_grade.toLowerCase() === 'a' ? 'bg-teal/15 text-teal' :
                  p.nutriscore_grade.toLowerCase() === 'b' ? 'bg-cyan-100 text-cyan-700' :
                  p.nutriscore_grade.toLowerCase() === 'c' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'}
              `}>
                Nutri-Score {p.nutriscore_grade.toUpperCase()}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
