import React, { useState, useEffect } from 'react';
import { getHealthAlerts } from '../lib/alertsFetcher';
import { Globe, ShieldAlert, Activity } from 'lucide-react';

const SOURCE_COLORS = {
  WHO: 'bg-blue-100 text-blue-700 border-blue-200',
  FDA: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  ICMR: 'bg-amber-100 text-amber-700 border-amber-200',
};

const SOURCE_ICONS = {
  WHO: <Globe size={14} />,
  FDA: <ShieldAlert size={14} />,
  ICMR: <Activity size={14} />,
};

export default function AlertsTab() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchAlerts() {
      try {
        const data = await getHealthAlerts();
        if (mounted) setAlerts(data);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchAlerts();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-6 fade-up pb-20">
      <div className="text-center space-y-2 py-4">
        <h2 className="text-2xl font-bold text-navy">Health Alerts</h2>
        <p className="text-sm text-on-surface-v max-w-xs mx-auto">
          Latest food regulations and public health alerts synthesized by Claude AI.
        </p>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-card border border-outline-v/20">
              <div className="flex justify-between mb-3">
                <div className="skeleton w-16 h-6 rounded-full" />
                <div className="skeleton w-20 h-4 rounded" />
              </div>
              <div className="skeleton w-3/4 h-5 rounded mb-2" />
              <div className="skeleton w-full h-4 rounded mb-1" />
              <div className="skeleton w-5/6 h-4 rounded" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-error-c border border-error/20 p-5 rounded-2xl">
          <p className="text-error font-bold mb-1">Failed to fetch alerts</p>
          <p className="text-sm text-error/80">{error}</p>
          <p className="text-xs mt-2 opacity-70">Make sure your ANTHROPIC_API_KEY is configured in .env</p>
        </div>
      )}

      {!loading && !error && alerts.length > 0 && (
        <div className="space-y-4">
          {alerts.map((alert, i) => (
            <div key={alert.id || i} className="bg-white p-5 rounded-2xl shadow-card border border-outline-v/20 hover:shadow-elevated transition-shadow group">
              <div className="flex justify-between items-center mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${SOURCE_COLORS[alert.source] || 'bg-surface-mid text-navy'}`}>
                  {SOURCE_ICONS[alert.source]}
                  {alert.source}
                </span>
                <span className="text-xs font-medium text-on-surface-v">{alert.date}</span>
              </div>
              
              <h3 className="text-lg font-bold text-navy leading-snug mb-2 group-hover:text-teal transition-colors">
                {alert.title}
              </h3>
              
              <p className="text-sm text-on-surface leading-relaxed">
                {alert.summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
