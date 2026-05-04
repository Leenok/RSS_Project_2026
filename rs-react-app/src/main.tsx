import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
      fallback={
        <div style={{ padding: '40px', textAlign: 'right' }}>
          <h2>Critical application error</h2>
          <p>Please reload the page.</p>
        </div>
      }
    >
      <App />
    </ErrorBoundary>
  </StrictMode>
);
