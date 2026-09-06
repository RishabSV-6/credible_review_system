import type { ProductSearchResult } from '@/types';
import {
  Truck,
  Package,
  BadgeCheck,
  Tag,
  Headphones,
  RotateCcw,
  Star,
  Trophy,
} from 'lucide-react';

const RATING_ICONS = [Truck, Package, BadgeCheck, Tag, Headphones, RotateCcw];
const RATING_LABELS = ['Delivery', 'Packaging', 'Authentic', 'Price', 'Service', 'Returns'];

interface ComparisonTableProps {
  result: ProductSearchResult;
}

export default function ComparisonTable({ result }: ComparisonTableProps) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden animate-fade-in-up">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-lg text-gray-800">Side-by-Side Comparison</h3>
        </div>
        <p className="text-sm text-gray-400 mt-1">All ratings out of 10 · sorted by overall score</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-blue-50 z-10">
                Marketplace
              </th>
              {RATING_LABELS.map((label, i) => {
                const Icon = RATING_ICONS[i];
                return (
                  <th key={i} className="px-3 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Icon className="w-4 h-4 text-blue-400" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{label}</span>
                    </div>
                  </th>
                );
              })}
              <th className="px-3 py-3 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Star className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Stars</span>
                </div>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Overall</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {result.results.map((r, idx) => {
              const isBest = idx === 0;
              return (
                <tr
                  key={r.id}
                  className={`border-t border-gray-50 transition-colors hover:bg-blue-50/50 ${
                    isBest ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <td className="px-4 py-3 sticky left-0 bg-inherit z-10">
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${r.color} text-white font-bold text-sm`}>
                        {r.logo}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-gray-700">{r.name}</div>
                        {isBest && (
                          <span className="text-[10px] font-bold text-blue-600">★ Best Pick</span>
                        )}
                      </div>
                    </div>
                  </td>
                  {r.ratings.map((rating, i) => {
                    const isHigh = rating.score >= 7.5;
                    const isMid = rating.score >= 5.5 && rating.score < 7.5;
                    return (
                      <td key={i} className="px-3 py-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-10 h-7 rounded-md text-sm font-bold ${
                            isHigh
                              ? 'bg-blue-100 text-blue-700'
                              : isMid
                              ? 'bg-sky-50 text-sky-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {rating.score}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 fill-blue-400 text-blue-400" />
                      <span className="text-sm font-semibold text-gray-600">{r.starRating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-lg font-extrabold ${isBest ? 'text-blue-600' : 'text-gray-700'}`}>
                      {r.overallScore}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-bold text-gray-700">
                      Rs {r.price.toLocaleString()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
