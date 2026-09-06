import { useState } from 'react';
import type { ProductSearchResult } from '@/types';
import { ArrowLeft, Search, Sparkles, LayoutGrid, List } from 'lucide-react';
import SummaryPanel from './SummaryPanel';
import MarketplaceCard from './MarketplaceCard';
import ComparisonTable from './ComparisonTable';
import CustomerReviews from './CustomerReviews';

interface ResultsViewProps {
  result: ProductSearchResult;
  onBack: () => void;
  onSearch: (query: string) => void;
}

export default function ResultsView({ result, onBack, onSearch }: ResultsViewProps) {
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [newQuery, setNewQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuery.trim()) onSearch(newQuery.trim());
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Top bar */}
      <div className="sticky top-0 z-50 glass border-b border-blue-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> New Search
          </button>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
            <div className="relative flex items-center bg-white rounded-xl border border-gray-200 shadow-sm focus-within:border-blue-400 transition-colors">
              <Search className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={newQuery}
                onChange={(e) => setNewQuery(e.target.value)}
                placeholder="Search another product..."
                className="w-full pl-10 pr-3 py-2 text-sm bg-transparent rounded-xl outline-none font-medium"
              />
              <button
                type="submit"
                className="mr-1.5 flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" /> Scan
              </button>
            </div>
          </form>

          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-gray-200">
            <button
              onClick={() => setView('cards')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                view === 'cards' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Cards
            </button>
            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                view === 'table' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="w-4 h-4" /> Table
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* Summary panel */}
        <SummaryPanel result={result} />

        {/* Section header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-gray-800">
            {view === 'cards' ? 'Marketplace Breakdown' : 'Comparison Table'}
          </h2>
          <span className="text-sm text-gray-400 font-medium">
            {result.results.length} marketplaces analyzed
          </span>
        </div>

        {/* Cards or table */}
        {view === 'cards' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {result.results.map((r, i) => (
              <MarketplaceCard key={r.id} result={r} rank={i} isBestPick={i === 0} />
            ))}
          </div>
        ) : (
          <ComparisonTable result={result} />
        )}

        {/* Customer Reviews */}
        <div className="pt-4">
          <CustomerReviews result={result} />
        </div>

        {/* Footer note */}
        <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-sm text-gray-500 leading-relaxed">
            <span className="font-bold text-gray-700">How we score:</span> Each marketplace is rated
            across 6 categories — delivery speed, packaging quality, product authenticity, price value,
            customer service, and return ease. Scores are derived from verified review patterns, price
            competitiveness, and seller reliability signals. The overall score is a weighted average
            with authenticity carrying the highest weight.
          </p>
        </div>
      </div>
    </div>
  );
}
