import { useMemo, useState } from 'react';
import type { ProductSearchResult, ReviewSnippet } from '@/types';
import { Star, Quote, ThumbsUp, ThumbsDown, Minus, MessageCircle, ChevronDown } from 'lucide-react';

interface CustomerReviewsProps {
  result: ProductSearchResult;
}

export default function CustomerReviews({ result }: CustomerReviewsProps) {
  const [expanded, setExpanded] = useState(false);

  const allReviews = useMemo(() => {
    const collected: ReviewSnippet[] = [];
    for (const r of result.results) {
      for (const rev of r.reviews) {
        collected.push(rev);
      }
    }
    const seed = result.query.length;
    for (let i = collected.length - 1; i > 0; i--) {
      const j = (seed * (i + 7) + 13) % (i + 1);
      [collected[i], collected[j]] = [collected[j], collected[i]];
    }
    return collected;
  }, [result]);

  const positiveCount = allReviews.filter((r) => r.sentiment === 'positive').length;
  const negativeCount = allReviews.filter((r) => r.sentiment === 'negative').length;
  const neutralCount = allReviews.filter((r) => r.sentiment === 'neutral').length;

  // Show only 3 reviews when collapsed, all when expanded
  const visibleReviews = expanded ? allReviews : allReviews.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden animate-fade-in-up">
      {/* Header — clickable to toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 border-b border-gray-100 text-left hover:bg-blue-50/30 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-lg text-gray-800">Customer Reviews</h3>
              <span className="text-xs text-gray-400 font-medium">
                ({allReviews.length} from all marketplaces)
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Real reviews collected from all 6 marketplaces — the actual data behind our ratings
            </p>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`} />
        </div>

        {/* Sentiment summary */}
        <div className="mt-4 flex items-center gap-3">
          <SentimentPill icon={<ThumbsUp className="w-3.5 h-3.5" />} count={positiveCount} label="Positive" color="bg-blue-100 text-blue-700 border-blue-200" />
          <SentimentPill icon={<Minus className="w-3.5 h-3.5" />} count={neutralCount} label="Neutral" color="bg-gray-100 text-gray-500 border-gray-200" />
          <SentimentPill icon={<ThumbsDown className="w-3.5 h-3.5" />} count={negativeCount} label="Negative" color="bg-red-50 text-red-500 border-red-100" />
        </div>
      </button>

      {/* Reviews list — only visible when expanded */}
      {expanded && (
        <div className="divide-y divide-gray-50 animate-fade-in-up">
          {visibleReviews.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      )}

      {/* Show more / less button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-center text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-100"
      >
        {expanded ? 'Show less' : `Show all ${allReviews.length} reviews`}
      </button>
    </div>
  );
}

function SentimentPill({
  icon,
  count,
  label,
  color,
}: {
  icon: React.ReactNode;
  count: number;
  label: string;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${color}`}>
      {icon}
      <span className="text-sm font-bold">{count}</span>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewSnippet }) {
  const sentimentColor =
    review.sentiment === 'positive'
      ? 'border-l-blue-400'
      : review.sentiment === 'negative'
      ? 'border-l-red-300'
      : 'border-l-gray-300';

  const sentimentBadge =
    review.sentiment === 'positive'
      ? 'bg-blue-100 text-blue-600'
      : review.sentiment === 'negative'
      ? 'bg-red-50 text-red-500'
      : 'bg-gray-100 text-gray-500';

  return (
    <div className={`p-4 border-l-4 ${sentimentColor} hover:bg-blue-50/30 transition-colors`}>
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-sky-100 text-blue-600 font-bold text-xs">
            {review.author.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-gray-700">{review.author}</span>
              {review.verified && (
                <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">
                  Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{review.marketplace}</span>
              <span>·</span>
              <span>{review.date}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star
                key={j}
                className={`w-3 h-3 ${j < review.rating ? 'fill-blue-400 text-blue-400' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sentimentBadge}`}>
            {review.sentiment}
          </span>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Quote className="w-3.5 h-3.5 text-gray-200 mt-0.5 shrink-0" />
        <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
      </div>
    </div>
  );
}
