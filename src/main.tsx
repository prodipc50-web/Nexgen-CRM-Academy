import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

// Safe global handlers for unhandled promises and benign browser errors
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Prevent benign unhandled promise rejections from crashing the UI
    console.warn('Unhandled Promise Rejection caught safely:', event.reason);
    event.preventDefault();
  });

  window.addEventListener('error', (event) => {
    // Filter out benign script / websocket errors
    if (event.message?.includes('ResizeObserver') || event.message?.includes('websocket')) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

