import { useState } from 'react';
import SearchHero from '@/components/SearchHero';
import LoadingScreen from '@/components/LoadingScreen';
import ResultsView from '@/components/ResultsView';
import AuthModal from '@/components/AuthModal';
import Questionnaire from '@/components/Questionnaire';
import ScrollWidgets from '@/components/ScrollWidgets';
import CursorIcons from '@/components/CursorIcons';
import { searchProduct } from '@/lib/searchEngine';
import { detectCategory, getCategoryConfig } from '@/lib/questionnaire';
import type { ProductSearchResult } from '@/types';
import type { QuestionnaireAnswers, CategoryConfig } from '@/lib/questionnaire';
import { useAuth } from '@/hooks/useAuth';
import { User, LogOut } from 'lucide-react';

type AppState = 'search' | 'questionnaire' | 'loading' | 'results';

function App() {
  const [state, setState] = useState<AppState>('search');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ProductSearchResult | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [questionnaireConfig, setQuestionnaireConfig] = useState<CategoryConfig | null>(null);
  const [pendingAnswers, setPendingAnswers] = useState<QuestionnaireAnswers | undefined>(undefined);
  const [detectedCat, setDetectedCat] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  const doSearch = (q: string, answers?: QuestionnaireAnswers, category?: string) => {
    setQuery(q);
    setState('loading');
    setTimeout(() => {
      const res = searchProduct(q, answers, category || undefined);
      setResult(res);
      setState('results');
    }, 2800);
  };

  const handleSearch = (q: string) => {
    setQuery(q);

    // Check if this is a broad category that needs a questionnaire
    const cat = detectCategory(q);
    const config = cat ? getCategoryConfig(cat) : null;

    if (config) {
      setDetectedCat(cat);
      setQuestionnaireConfig(config);
      setState('questionnaire');
    } else {
      // Specific product — search directly
      setPendingAnswers(undefined);
      doSearch(q);
    }
  };

  const handleQuestionnaireComplete = (answers: QuestionnaireAnswers) => {
    setPendingAnswers(answers);
    doSearch(query, answers, detectedCat || undefined);
    setQuestionnaireConfig(null);
  };

  const handleQuestionnaireBack = () => {
    setState('search');
    setQuestionnaireConfig(null);
    setDetectedCat(null);
  };

  const handleBack = () => {
    setState('search');
    setQuery('');
    setResult(null);
    setPendingAnswers(undefined);
    setDetectedCat(null);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ScrollWidgets />
      <CursorIcons />

      {/* Auth button — only on the home/search page */}
      {state === 'search' && (
        <div className="fixed top-4 right-4 z-[90]">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 glass border border-blue-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 text-white font-bold text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gray-600 hidden sm:block">
                  {user.email}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/80 glass border border-gray-200 rounded-xl shadow-sm text-sm font-semibold text-gray-500 hover:text-red-500 hover:border-red-200 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white/80 glass border border-blue-200 rounded-xl shadow-sm text-sm font-bold text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md transition-all active:scale-95"
            >
              <User className="w-4 h-4" />
              Login / Sign Up
            </button>
          )}
        </div>
      )}

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}

      {state === 'questionnaire' && questionnaireConfig && (
        <Questionnaire
          config={questionnaireConfig}
          searchQuery={query}
          onComplete={handleQuestionnaireComplete}
          onBack={handleQuestionnaireBack}
        />
      )}

      {state === 'loading' && <LoadingScreen query={query} />}

      {state === 'results' && result && (
        <ResultsView result={result} onBack={handleBack} onSearch={handleSearch} />
      )}

      {state === 'search' && <SearchHero onSearch={handleSearch} />}
    </div>
  );
}

export default App;
