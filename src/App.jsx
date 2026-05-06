import { useState, useCallback } from 'react';
import { Search, ScanLine, BookOpen, Bell, PlusCircle } from 'lucide-react';
import SearchBar from './components/SearchBar';
import ProductPicker from './components/ProductPicker';
import SkeletonLoader from './components/SkeletonLoader';
import ResultCard from './components/ResultCard';
import ClaudeAnalysis from './components/ClaudeAnalysis';
import ScannerTab from './components/ScannerTab';
import DiaryTab from './components/DiaryTab';
import AlertsTab from './components/AlertsTab';
import { searchProducts, getProduct } from './lib/openfoodfacts';
import { getClaudeAnalysis } from './lib/claudeAnalyzer';
import { addFoodToDiary } from './lib/diaryStore';
import {
  computeHealthScore,
  buildProscons,
  detectHarmfulIngredients,
  extractMacros,
} from './lib/analyzer';

function analyzeProduct(product) {
  return {
    score:   computeHealthScore(product),
    macros:  extractMacros(product),
    ...buildProscons(product),
    harmful: detectHarmfulIngredients(product),
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState('analyzer'); // analyzer, scanner, diary, alerts
  
  // Analyzer State
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [products, setProducts] = useState([]);   
  const [result,   setResult]   = useState(null); 
  
  // Claude specific state
  const [claudeAnalysis, setClaudeAnalysis] = useState(null);
  const [claudeLoading, setClaudeLoading] = useState(false);
  const [claudeError, setClaudeError] = useState(null);

  const performClaudeAnalysis = async (product) => {
    setClaudeLoading(true);
    setClaudeError(null);
    setClaudeAnalysis(null);
    try {
      const aiData = await getClaudeAnalysis(product);
      setClaudeAnalysis(aiData);
    } catch (err) {
      setClaudeError(err.message);
    } finally {
      setClaudeLoading(false);
    }
  };

  const handleSearch = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    setProducts([]);
    setResult(null);
    setActiveTab('analyzer');

    try {
      const found = await searchProducts(query);
      if (found.length === 0) {
        setError(`No results found for "${query}". Try a different search term.`);
      } else if (found.length === 1) {
        const selected = found[0];
        setResult({ product: selected, ...analyzeProduct(selected) });
        performClaudeAnalysis(selected);
      } else {
        setProducts(found);
      }
    } catch (e) {
      setError('Failed to reach Open Food Facts. Check your connection and try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelect = useCallback((product) => {
    setProducts([]);
    setResult({ product, ...analyzeProduct(product) });
    performClaudeAnalysis(product);
  }, []);

  const handleScan = useCallback(async (barcode) => {
    setActiveTab('analyzer');
    setLoading(true);
    setError(null);
    setProducts([]);
    setResult(null);

    try {
      const product = await getProduct(barcode);
      if (!product || !product.product_name) {
        setError(`No product found for barcode: ${barcode}`);
      } else {
        setResult({ product, ...analyzeProduct(product) });
        performClaudeAnalysis(product);
      }
    } catch (e) {
      setError(`Failed to lookup barcode: ${barcode}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddToDiary = useCallback((product, macros, healthScore) => {
    addFoodToDiary(product, macros, healthScore);
    // Switch to diary tab immediately to see it added
    setActiveTab('diary');
  }, []);

  return (
    <div className="min-h-screen bg-bg font-inter pb-20">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 glass shadow-sm">
        <div className="max-w-2xl mx-auto px-container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center shadow-card">
              <PlusCircle className="w-6 h-6 text-teal" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-navy leading-none tracking-tight">NutriWise</h1>
              <p className="text-xs text-on-surface-v leading-none mt-1 font-medium uppercase tracking-wider">Premium Edition</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="max-w-2xl mx-auto px-container pt-6 space-y-6" id="main-content">
        
        {/* TAB: ANALYZER */}
        <div className={activeTab === 'analyzer' ? 'block' : 'hidden'}>
          {/* Hero search section */}
          <section className="bg-gradient-to-br from-navy via-[#0f1e35] to-[#0b2a3a] p-8 rounded-3xl shadow-elevated mb-6 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 text-center space-y-4">
              <h2 className="text-2xl font-bold text-white leading-tight">
                Analyze Any Food
              </h2>
              <div className="mt-4">
                <SearchBar onSearch={handleSearch} loading={loading} />
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-error-c border border-error/20 rounded-2xl fade-up mb-6">
              <p className="text-sm text-error font-medium">{error}</p>
            </div>
          )}

          {/* Loading */}
          {loading && <SkeletonLoader />}

          {/* Product picker */}
          {!loading && products.length > 0 && (
             <ProductPicker products={products} onSelect={handleSelect} />
          )}

          {/* Result */}
          {!loading && result && (
            <div className="space-y-6 pb-6">
              <ResultCard
                product={result.product}
                score={result.score}
                macros={result.macros}
                pros={result.pros}
                cons={result.cons}
                harmful={result.harmful}
                onAddToDiary={handleAddToDiary}
              />
              <ClaudeAnalysis 
                analysis={claudeAnalysis} 
                isLoading={claudeLoading} 
                error={claudeError} 
              />
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && !result && products.length === 0 && (
            <div className="text-center py-12 space-y-4 fade-up">
              <div className="w-16 h-16 rounded-full bg-surface-mid mx-auto flex items-center justify-center shadow-card">
                 <Search className="w-8 h-8 text-outline" />
              </div>
              <p className="font-semibold text-on-surface">Ready to analyze</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['Nutella', 'Greek Yogurt', 'Oat Milk'].map((s) => (
                  <button
                    key={s} onClick={() => handleSearch(s)}
                    className="px-4 py-2 text-sm font-medium rounded-full bg-white border border-outline-v/30 text-on-surface hover:border-teal hover:text-teal transition-all shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TAB: SCANNER */}
        {activeTab === 'scanner' && (
          <ScannerTab onScan={handleScan} isScanning={activeTab === 'scanner'} />
        )}

        {/* TAB: DIARY */}
        {activeTab === 'diary' && (
          <DiaryTab />
        )}

        {/* TAB: ALERTS */}
        {activeTab === 'alerts' && (
          <AlertsTab />
        )}

      </main>

      {/* ── Bottom Navigation Bar ── */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-outline-v/20 pb-safe z-40">
        <div className="max-w-2xl mx-auto flex justify-around p-2">
          
          <button 
            onClick={() => setActiveTab('analyzer')}
            className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'analyzer' ? 'text-teal' : 'text-on-surface-v hover:text-navy'}`}
          >
            <Search size={24} strokeWidth={activeTab === 'analyzer' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Analyze</span>
          </button>

          <button 
            onClick={() => setActiveTab('scanner')}
            className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'scanner' ? 'text-teal' : 'text-on-surface-v hover:text-navy'}`}
          >
            <ScanLine size={24} strokeWidth={activeTab === 'scanner' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Scan</span>
          </button>

          <button 
            onClick={() => setActiveTab('diary')}
            className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'diary' ? 'text-teal' : 'text-on-surface-v hover:text-navy'}`}
          >
            <BookOpen size={24} strokeWidth={activeTab === 'diary' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Diary</span>
          </button>

          <button 
            onClick={() => setActiveTab('alerts')}
            className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'alerts' ? 'text-teal' : 'text-on-surface-v hover:text-navy'}`}
          >
            <Bell size={24} strokeWidth={activeTab === 'alerts' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Alerts</span>
          </button>

        </div>
      </nav>
    </div>
  );
}
