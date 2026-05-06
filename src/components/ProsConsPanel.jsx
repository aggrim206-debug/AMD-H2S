/**
 * Pros & Cons panel with icons and colour-coded badges.
 */

function ProItem({ text }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-on-surface">
      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-teal/20 flex items-center justify-center">
        <svg className="w-3 h-3 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
      {text}
    </li>
  );
}

function ConItem({ text }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-on-surface">
      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-error-c flex items-center justify-center">
        <svg className="w-3 h-3 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
      {text}
    </li>
  );
}

export default function ProsConsPanel({ pros, cons }) {
  if (!pros.length && !cons.length) return null;

  return (
    <div id="pros-cons-panel" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Pros */}
      <div className="bg-teal/5 border border-teal/20 rounded-lg p-4">
        <h3 className="text-label-caps text-teal mb-3">Pros</h3>
        {pros.length > 0 ? (
          <ul className="space-y-2">
            {pros.map((p, i) => <ProItem key={i} text={p} />)}
          </ul>
        ) : (
          <p className="text-sm text-on-surface-v italic">No notable pros detected.</p>
        )}
      </div>

      {/* Cons */}
      <div className="bg-error-c/40 border border-error/20 rounded-lg p-4">
        <h3 className="text-label-caps text-error mb-3">Cons</h3>
        {cons.length > 0 ? (
          <ul className="space-y-2">
            {cons.map((c, i) => <ConItem key={i} text={c} />)}
          </ul>
        ) : (
          <p className="text-sm text-on-surface-v italic">No notable cons detected.</p>
        )}
      </div>
    </div>
  );
}
