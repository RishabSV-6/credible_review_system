import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, TrendingUp, Zap, ArrowRight } from 'lucide-react';

interface SearchHeroProps {
  onSearch: (query: string) => void;
}

const SUGGESTIONS = [
  'iPhone 15 Pro 256GB',
  'Samsung Galaxy S24 Ultra',
  'OnePlus 12 256GB',
  'Sony WH-1000XM5',
  'Dell XPS 13 9320',
  'boAt Airdopes 161',
];

export default function SearchHero({ onSearch }: SearchHeroProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    if (focused || query) return;
    const fullText = SUGGESTIONS[placeholderIdx];
    let charIdx = 0;
    const typeInterval = setInterval(() => {
      if (charIdx <= fullText.length) {
        setTypedText(fullText.slice(0, charIdx));
        charIdx++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setPlaceholderIdx((prev) => (prev + 1) % SUGGESTIONS.length);
          setTypedText('');
        }, 2000);
      }
    }, 60);
    return () => clearInterval(typeInterval);
  }, [placeholderIdx, focused, query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* Background decorative blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full opacity-30 blur-3xl animate-float-slow" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-200 rounded-full opacity-30 blur-3xl animate-float" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-cyan-200 rounded-full opacity-20 blur-3xl animate-float-delay" />

      {/* Stickers */}
      <Sticker className="top-20 left-[8%] rotate-[-12deg]" delay="animate-float" emoji="★" label="Best Price" color="bg-blue-100 text-blue-700 border-blue-300" />
      <Sticker className="top-32 right-[10%] rotate-[8deg]" delay="animate-float-delay" emoji="✓" label="Verified" color="bg-sky-100 text-sky-700 border-sky-300" />
      <Sticker className="bottom-32 left-[12%] rotate-[6deg]" delay="animate-float-slow" emoji="⚡" label="Fast Scan" color="bg-cyan-100 text-cyan-700 border-cyan-300" />
      <Sticker className="bottom-24 right-[8%] rotate-[-8deg]" delay="animate-float" emoji="♥" label="Top Rated" color="bg-blue-100 text-blue-700 border-blue-300" />
      <Sticker className="top-1/2 left-[5%] rotate-[15deg]" delay="animate-float-delay" emoji="◎" label="6 Sites" color="bg-sky-100 text-sky-700 border-sky-300" />

      {/* Logo / Title */}
      <div className="relative z-10 text-center mb-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 border border-blue-200 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-700">AI-Powered Review Scanner</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
          <span className="text-gray-900">Review</span>
          <span className="text-gradient">Radar</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium">
          Search any product by name and model number. We scan every major marketplace,
          read thousands of reviews, and find the best seller for you.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-2xl animate-fade-in-up delay-200">
        <div
          className={`relative flex items-center bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
            focused ? 'border-blue-500 shadow-blue-200 scale-[1.02]' : 'border-gray-200 shadow-gray-200'
          }`}
        >
          <Search className={`absolute left-5 w-6 h-6 transition-colors ${focused ? 'text-blue-500' : 'text-gray-400'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={query ? '' : `Try "${typedText}${!focused && !query ? '|' : ''}"`}
            className="w-full pl-14 pr-32 py-5 text-lg bg-transparent rounded-2xl outline-none placeholder-gray-400 font-medium"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="absolute right-2 flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-blue-500 to-sky-500 text-white font-semibold rounded-xl transition-all hover:from-blue-600 hover:to-sky-600 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <Zap className="w-5 h-5" />
            <span>Scan</span>
          </button>
        </div>

        {/* Quick suggestions */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-gray-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> Trending:
          </span>
          {SUGGESTIONS.slice(0, 4).map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                onSearch(s);
              }}
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium"
            >
              {s}
            </button>
          ))}
        </div>
      </form>

      {/* Feature pills */}
      <div className="relative z-10 mt-12 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up delay-300">
        <FeaturePill icon="◎" text="6 Marketplaces" />
        <FeaturePill icon="★" text="10K+ Reviews Scanned" />
        <FeaturePill icon="⚡" text="Instant Results" />
        <FeaturePill icon="✓" text="Authenticity Check" />
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400 animate-fade-in-up delay-500">
        <span className="text-xs font-medium">How it works</span>
        <ArrowRight className="w-4 h-4 rotate-90 animate-bounce" />
      </div>
    </div>
  );
}

function Sticker({
  className,
  delay,
  emoji,
  label,
  color,
}: {
  className: string;
  delay: string;
  emoji: string;
  label: string;
  color: string;
}) {
  return (
    <div className={`absolute hidden md:flex flex-col items-center gap-1 z-0 ${className} ${delay}`}>
      <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 ${color} shadow-md font-bold text-sm`}>
        <span className="text-lg">{emoji}</span>
        <span>{label}</span>
      </div>
    </div>
  );
}

function FeaturePill({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 glass border border-blue-100 rounded-full">
      <span className="text-blue-500 text-lg">{icon}</span>
      <span className="text-sm font-semibold text-gray-600">{text}</span>
    </div>
  );
}
