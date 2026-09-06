import { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Check, ChevronRight } from 'lucide-react';
import type { CategoryConfig, QuestionnaireAnswers } from '@/lib/questionnaire';

interface QuestionnaireProps {
  config: CategoryConfig;
  searchQuery: string;
  onComplete: (answers: QuestionnaireAnswers) => void;
  onBack: () => void;
}

export default function Questionnaire({ config, searchQuery, onComplete, onBack }: QuestionnaireProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});

  const question = config.questions[step];
  const isLast = step === config.questions.length - 1;
  const progress = ((step + 1) / config.questions.length) * 100;

  const handleAnswer = (value: string | number) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (isLast) {
      setTimeout(() => onComplete(newAnswers), 300);
    } else {
      setTimeout(() => setStep(step + 1), 250);
    }
  };

  const handleBack = () => {
    if (step === 0) {
      onBack();
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* Background blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full opacity-30 blur-3xl animate-float-slow" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-200 rounded-full opacity-30 blur-3xl animate-float" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 border border-blue-200 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">{config.category} Finder</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">{config.title}</h1>
          <p className="text-gray-400 font-medium">{config.description}</p>
          <p className="text-sm text-blue-400 mt-2">
            Searching for: <span className="font-bold">"{searchQuery}"</span>
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400">
              Question {step + 1} of {config.questions.length}
            </span>
            <span className="text-xs font-bold text-blue-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div key={step} className="bg-white rounded-3xl border-2 border-blue-200 shadow-xl shadow-blue-100 p-6 md:p-8 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-1.5">
              {config.questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === step ? 'bg-blue-500 w-6' : i < step ? 'bg-blue-300' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-700 mb-5">{question.label}</h2>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options?.map((opt) => {
              const isSelected = answers[question.id] === opt.value;
              return (
                <button
                  key={String(opt.value)}
                  onClick={() => handleAnswer(opt.value)}
                  className={`flex items-center justify-between px-4 py-4 rounded-xl border-2 font-semibold text-sm transition-all text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md scale-[1.02]'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/50 active:scale-[0.98]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected ? (
                    <Check className="w-5 h-5 text-blue-500 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skip button */}
        <div className="text-center mt-4">
          <button
            onClick={() => onComplete(answers)}
            className="text-sm font-medium text-gray-400 hover:text-blue-500 transition-colors"
          >
            Skip and search with what I have <ArrowRight className="w-3.5 h-3.5 inline" />
          </button>
        </div>
      </div>
    </div>
  );
}
