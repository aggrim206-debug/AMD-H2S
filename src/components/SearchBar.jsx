import { useState, useRef } from 'react';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) onSearch(q);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex gap-2"
      role="search"
      aria-label="Food search"
    >
      <div className="relative flex-1">
        {/* Search icon */}
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7 7 0 1 0 6.65 16.65 7 7 0 0 0 16.65 16.65z" />
        </svg>
        <input
          ref={inputRef}
          id="food-search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any food — e.g. Nutella, Greek Yogurt…"
          aria-label="Search food"
          disabled={loading}
          className="
            w-full pl-12 pr-4 py-3.5
            bg-white border border-outline-v rounded-full
            text-base font-medium text-on-surface placeholder:text-outline
            focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20
            disabled:opacity-60 transition-all duration-200
            shadow-card
          "
        />
      </div>
      <button
        id="food-search-btn"
        type="submit"
        disabled={loading || !query.trim()}
        className="
          px-6 py-3.5
          bg-navy text-white font-semibold rounded-full
          hover:bg-teal hover:text-navy
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 shadow-card whitespace-nowrap
          focus:outline-none focus:ring-2 focus:ring-teal/40
        "
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Analyzing…
          </span>
        ) : 'Analyze'}
      </button>
    </form>
  );
}
