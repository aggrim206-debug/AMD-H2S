/** Skeleton shimmer cards shown while loading */
export default function SkeletonLoader() {
  return (
    <div id="skeleton-loader" className="space-y-4 fade-up">
      <div className="bg-white rounded-xl shadow-card p-6">
        {/* Header */}
        <div className="flex gap-4 mb-6">
          <div className="skeleton w-16 h-16 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        </div>
        {/* Score + macros row */}
        <div className="flex gap-6">
          <div className="skeleton w-36 h-36 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-3 py-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex gap-3 items-center">
                <div className="skeleton h-3 w-14 rounded-full" />
                <div className="skeleton h-2 flex-1 rounded-full" />
                <div className="skeleton h-3 w-10 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Pros/Cons skeleton */}
      <div className="grid grid-cols-2 gap-4">
        {[0,1].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-card p-4 space-y-2">
            <div className="skeleton h-3 w-12 rounded-full" />
            {[1,2,3].map(j => <div key={j} className="skeleton h-4 w-full rounded" />)}
          </div>
        ))}
      </div>
    </div>
  );
}
