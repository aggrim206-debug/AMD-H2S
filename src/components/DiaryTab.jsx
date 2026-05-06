import React, { useState, useEffect } from 'react';
import { Flame, Info } from 'lucide-react';
import { getTodayEntries, getTodayTotals, getStreak } from '../lib/diaryStore';
import HealthScore from './HealthScore';

export default function DiaryTab() {
  const [entries, setEntries] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0 });
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Load local storage data
    setEntries(getTodayEntries());
    setTotals(getTodayTotals());
    setStreak(getStreak());
  }, []);

  return (
    <div className="space-y-6 fade-up pb-20">
      
      {/* Header Dashboard */}
      <div className="bg-gradient-to-br from-navy via-[#0f1e35] to-[#0b2a3a] rounded-3xl p-6 text-white shadow-elevated relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Flame size={120} />
        </div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <p className="text-teal font-medium text-sm mb-1 uppercase tracking-wider">Today's Summary</p>
            <h2 className="text-3xl font-bold mb-4">{totals.calories.toFixed(0)} <span className="text-lg font-normal text-teal">kcal</span></h2>
          </div>
          
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-1 text-amber">
              <Flame size={20} fill="currentColor" />
              <span className="font-bold text-xl">{streak}</span>
            </div>
            <span className="text-xs text-white/70">Day Streak</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
           <div>
             <p className="text-xs text-white/70">Protein</p>
             <p className="font-bold">{totals.protein.toFixed(1)}g</p>
           </div>
           <div>
             <p className="text-xs text-white/70">Carbs</p>
             <p className="font-bold">{totals.carbs?.toFixed(1) || 0}g</p>
           </div>
           <div>
             <p className="text-xs text-white/70">Fat</p>
             <p className="font-bold">{totals.fat?.toFixed(1) || 0}g</p>
           </div>
        </div>
      </div>

      {/* Entries List */}
      <div>
        <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
          Logged Today
          <span className="bg-surface-mid text-navy px-2 py-0.5 rounded-full text-xs">{entries.length} items</span>
        </h3>
        
        {entries.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-card border border-outline-v/20">
            <div className="w-16 h-16 bg-surface-mid rounded-full flex items-center justify-center mx-auto mb-3">
              <Info className="text-outline" size={24} />
            </div>
            <p className="font-semibold text-navy">No foods logged yet</p>
            <p className="text-sm text-on-surface-v mt-1">Scan a barcode or search to add your first meal.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map(entry => (
              <div key={entry.id} className="bg-white rounded-2xl p-4 shadow-card border border-outline-v/20 flex gap-4 items-center">
                {entry.image_url ? (
                  <img src={entry.image_url} alt={entry.name} className="w-14 h-14 object-contain rounded-lg bg-surface-low" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-surface-low flex items-center justify-center">
                    <span className="text-xs text-outline font-medium">No img</span>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-teal mb-0.5">{entry.time}</p>
                  <h4 className="font-bold text-navy truncate">{entry.name}</h4>
                  <p className="text-xs text-on-surface-v truncate">{entry.brands || 'Unknown Brand'}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-navy">{entry.calories.toFixed(0)}</p>
                  <p className="text-xs text-on-surface-v">kcal</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
