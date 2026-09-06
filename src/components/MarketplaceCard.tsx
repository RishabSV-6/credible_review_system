import { useState } from 'react';
import type { MarketplaceResult, RatingCategory } from '@/types';
import {
  Truck,
  Package,
  BadgeCheck,
  Tag,
  Headphones,
  RotateCcw,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  Info,
} from 'lucide-react';
import RatingBreakdownModal from './RatingBreakdownModal';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Truck,
  Package,
  BadgeCheck,
  Tag,
  Headphones,
  RotateCcw,
};

interface MarketplaceCardProps {
  result: MarketplaceResult;
  rank: number;
  isBestPick: boolean;
}

export default function MarketplaceCard({ result, rank, isBestPick }: MarketplaceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [breakdownRating, setBreakdownRating] = useState<RatingCategory | null>(null);

  return (
    <>
      <div
        className={`relative bg-white rounded-2xl border-2 transition-all duration-300 animate-fade-in-up ${
          isBestPick
            ? 'border-blue-400 shadow-xl shadow-blue-100 scale-[1.02]'
            : 'border-gray-200 shadow-md hover:shadow-lg hover:border-blue-200'
        }`}
        style={{ animationDelay: `${rank * 0.1}s` }}
      >
        {/* Best pick badge */}
        {isBestPick && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-sky-500 text-white text-sm font-bold rounded-full shadow-lg animate-pulse-glow">
              <BadgeCheck className="w-4 h-4" />
              Best Pick
            </div>
          </div>
        )}

        {/* Rank sticker */}
        <div
          className={`absolute -top-3 -left-3 w-10 h-10 flex items-center justify-center rounded-xl font-extrabold text-lg shadow-md rotate-[-8deg] ${
            isBestPick
              ? 'bg-gradient-to-br from-blue-500 to-sky-500 text-white'
              : 'bg-white border-2 border-gray-200 text-gray-500'
          }`}
        >
          #{rank + 1}
        </div>

        <div className="p-6 pt-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${result.color} text-white font-extrabold text-xl shadow-md`}>
                {result.logo}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">{result.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
                    <span className="font-semibold text-gray-700">{result.starRating}</span>
                  </div>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-400">{result.reviewCount.toLocaleString()} reviews</span>
                </div>
              </div>
            </div>
            {/* Overall score circle */}
            <div className="text-right">
              <div className={`text-3xl font-extrabold ${isBestPick ? 'text-blue-600' : 'text-gray-700'}`}>
                {result.overallScore}
              </div>
              <div className="text-xs text-gray-400 font-medium">/ 10 score</div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-5 p-3 bg-blue-50 rounded-xl">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-gray-800">
                  {result.currency} {result.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {result.currency} {result.originalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Tag className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-sm font-semibold text-blue-600">{result.discount}% off</span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-blue-200">
              <Truck className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-600">{result.deliveryDays}</span>
            </div>
          </div>

          {/* Rating bars — clickable */}
          <div className="space-y-2.5">
            {result.ratings.map((r, i) => {
              const Icon = ICON_MAP[r.icon] || Star;
              const isHigh = r.score >= 7.5;
              const isMid = r.score >= 5.5 && r.score < 7.5;
              return (
                <button
                  key={i}
                  onClick={() => setBreakdownRating(r)}
                  className="flex items-center gap-3 w-full group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-1.5 w-36 shrink-0">
                    <Icon className={`w-4 h-4 ${isHigh ? 'text-blue-500' : isMid ? 'text-sky-400' : 'text-gray-400'}`} />
                    <span className="text-xs font-medium text-gray-500 group-hover:text-blue-600 transition-colors">{r.label}</span>
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden group-hover:bg-blue-50 transition-colors">
                    <div
                      className={`h-full rounded-full animate-fill-bar group-hover:brightness-110 transition-all ${
                        isHigh ? 'bg-gradient-to-r from-blue-500 to-sky-400' : isMid ? 'bg-gradient-to-r from-sky-400 to-cyan-400' : 'bg-gray-300'
                      }`}
                      style={{ ['--fill' as string]: `${r.score * 10}%`, animationDelay: `${rank * 0.1 + i * 0.05}s` }}
                    />
                  </div>
                  <div className="flex items-center gap-1 w-14 justify-end">
                    <span className={`text-sm font-bold ${isHigh ? 'text-blue-600' : isMid ? 'text-sky-500' : 'text-gray-400'}`}>
                      {r.score}
                    </span>
                    <Info className="w-3 h-3 text-gray-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-gray-300 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Click any rating to see how it was calculated
          </p>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-5 flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {expanded ? 'Hide details' : 'View pros, cons & reviews'}
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>

          {/* Expanded section */}
          {expanded && (
            <div className="mt-4 space-y-4 animate-fade-in-up">
              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold text-blue-700">Pros</span>
                  </div>
                  <ul className="space-y-1.5">
                    {result.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-sm text-gray-600">
                        <Check className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingDown className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-500">Cons</span>
                  </div>
                  <ul className="space-y-1.5">
                    {result.cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-sm text-gray-500">
                        <Minus className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <button
                  onClick={() => setShowReviews(!showReviews)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors mb-2"
                >
                  <Star className="w-4 h-4 text-blue-400" />
                  {showReviews ? 'Hide' : 'Show'} sample reviews
                </button>
                {showReviews && (
                  <div className="space-y-2 animate-fade-in-up">
                    {result.reviews.map((rev, i) => (
                      <div key={i} className="p-3 bg-white border border-gray-100 rounded-xl">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-700">{rev.author}</span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star
                                key={j}
                                className={`w-3 h-3 ${j < rev.rating ? 'fill-blue-400 text-blue-400' : 'text-gray-200'}`}
                              />
                            ))}
                            <span className="text-xs text-gray-400 ml-1">{rev.date}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{rev.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {result.inStock ? (
                <span className="flex items-center gap-1 text-sm font-semibold text-blue-600">
                  <Check className="w-4 h-4" /> In Stock
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm font-semibold text-gray-400">
                  <X className="w-4 h-4" /> Out of Stock
                </span>
              )}
            </div>
            <a
              href={`https://${result.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Visit <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Rating breakdown modal */}
      {breakdownRating && (
        <RatingBreakdownModal
          rating={breakdownRating}
          marketplaceName={result.name}
          onClose={() => setBreakdownRating(null)}
        />
      )}
    </>
  );
}
