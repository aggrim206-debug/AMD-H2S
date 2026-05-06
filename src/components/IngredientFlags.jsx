export default function IngredientFlags({ harmful }) {
  if (!harmful || harmful.length === 0) {
    return (
      <div id="ingredient-flags" className="flex items-center gap-2 p-3 bg-teal/5 border border-teal/20 rounded-lg">
        <svg className="w-4 h-4 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm text-teal font-medium">No harmful ingredients detected</span>
      </div>
    );
  }

  return (
    <div id="ingredient-flags" className="space-y-2">
      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber/30 rounded-lg">
        <svg className="w-4 h-4 text-amber flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <span className="text-sm font-semibold text-amber">
          {harmful.length} harmful ingredient{harmful.length > 1 ? 's' : ''} flagged
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {harmful.map((ingredient, i) => (
          <span key={i} id={`flag-${i}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber border border-amber/30">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {ingredient.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </span>
        ))}
      </div>
    </div>
  );
}
