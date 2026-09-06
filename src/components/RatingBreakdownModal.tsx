import type { RatingCategory } from '@/types';
import {
  Truck,
  Package,
  BadgeCheck,
  Tag,
  Headphones,
  RotateCcw,
  X,
  Calculator,
  TrendingUp,
  TrendingDown,
  Info,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Truck,
  Package,
  BadgeCheck,
  Tag,
  Headphones,
  RotateCcw,
};

interface RatingBreakdownModalProps {
  rating: RatingCategory;
  marketplaceName: string;
  onClose: () => void;
}

export default function RatingBreakdownModal({
  rating,
  marketplaceName,
  onClose,
}: RatingBreakdownModalProps) {
  const Icon = ICON_MAP[rating.icon] || BadgeCheck;

  const positiveContributions = rating.breakdown.filter((f) => f.contribution >= 0);
  const negativeContributions = rating.breakdown.filter((f) => f.contribution < 0);
  const totalPositive = positiveContributions.reduce((s, f) => s + f.contribution, 0);
  const totalNegative = negativeContributions.reduce((s, f) => s + f.contribution, 0);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-900/20 backdrop-blur-sm px-4 py-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-blue-200 overflow-hidden animate-scale-in my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gradient strip */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400 animate-gradient" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 text-white shadow-lg">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-800">{rating.label}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{marketplaceName}</span>
                <span>·</span>
                <span className="font-bold text-blue-600">{rating.score}/10</span>
                <span>·</span>
                <span>{rating.detail}</span>
              </div>
            </div>
          </div>

          {/* Score visualization */}
          <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-600">Final Score</span>
              <span className="text-3xl font-extrabold text-blue-600">{rating.score}<span className="text-base text-gray-400">/10</span></span>
            </div>
            <div className="h-3 bg-white rounded-full overflow-hidden border border-blue-100">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full animate-fill-bar"
                style={{ ['--fill' as string]: `${rating.score * 10}%` }}
              />
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
              <Info className="w-3.5 h-3.5" />
              <span>This category carries <span className="font-bold text-blue-500">{Math.round(rating.weight * 100)}%</span> weight in the overall score</span>
            </div>
          </div>

          {/* Calculation breakdown */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-gray-700">How we calculated this</h3>
            </div>
          </div>

          {/* Factors */}
          <div className="space-y-3">
            {rating.breakdown.map((factor, i) => {
              const isPositive = factor.contribution >= 0;
              return (
                <div
                  key={i}
                  className="p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-700">{factor.label}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-extrabold text-gray-800">
                          {factor.value}
                          <span className="text-sm font-medium text-gray-400 ml-1">{factor.unit}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Info className="w-3 h-3 text-gray-300" />
                        <span className="text-xs text-gray-400">{factor.source}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-blue-600' : 'text-gray-400'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {isPositive ? '+' : ''}{Math.round(factor.contribution * 100) / 100}
                      </div>
                      <span className="text-xs text-gray-400">points</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary calculation */}
          <div className="mt-5 p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl border border-blue-200">
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Positive factors</span>
                <span className="font-bold text-blue-600">+{Math.round(totalPositive * 100) / 100}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Negative factors</span>
                <span className="font-bold text-gray-400">{Math.round(totalNegative * 100) / 100}</span>
              </div>
              <div className="border-t border-blue-200 pt-1.5 flex items-center justify-between">
                <span className="text-gray-700 font-bold">Normalized to 10</span>
                <span className="font-extrabold text-blue-600 text-lg">{rating.score}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
