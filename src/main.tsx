import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-4">The app encountered an error. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      }
    >
      <App />
    </ErrorBoundary>
  </StrictMode>
);
