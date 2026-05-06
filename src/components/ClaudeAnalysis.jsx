import React from 'react';
import HealthScore from './HealthScore';
import ProsConsPanel from './ProsConsPanel';

export default function ClaudeAnalysis({ analysis, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-card p-6 space-y-4 fade-up">
        <div className="flex items-center gap-2 mb-4">
           <svg className="w-5 h-5 text-teal animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          <h3 className="text-sm font-bold text-navy">Claude AI Analysis in progress...</h3>
        </div>
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-card p-5 fade-up border border-error-c">
        <h3 className="text-sm font-bold text-error mb-2">AI Analysis Failed</h3>
        <p className="text-xs text-on-surface-v">{error}</p>
        <p className="text-xs text-on-surface-v mt-2">Did you add your ANTHROPIC_API_KEY to the .env file?</p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-4 fade-up">
      {/* AI Score & Pros/Cons */}
      <div className="bg-white rounded-xl shadow-card p-5 flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0 self-center sm:self-start flex flex-col items-center">
           <p className="text-label-caps text-teal mb-2">AI Score</p>
           <HealthScore score={analysis.health_score} />
        </div>
        <div className="flex-1 w-full">
           <p className="text-label-caps text-on-surface-v mb-3">AI Nutritional Assessment</p>
           <ProsConsPanel pros={analysis.pros || []} cons={analysis.cons || []} />
        </div>
      </div>

      {/* Guidelines & Alternatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-low border border-outline-v/30 rounded-xl p-5 shadow-card">
          <h3 className="text-sm font-bold text-navy mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Guidelines Context
          </h3>
          <p className="text-sm text-on-surface leading-relaxed">
            {analysis.guideline_context}
          </p>
        </div>

        <div className="bg-white border border-teal/20 rounded-xl p-5 shadow-card">
          <h3 className="text-sm font-bold text-teal mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Healthier Alternatives
          </h3>
          <ul className="space-y-2">
            {(analysis.healthier_alternatives || []).map((alt, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                <span className="text-teal font-bold mt-0.5">•</span>
                {alt}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
