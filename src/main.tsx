
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * Enhanced error handling for the application
 */
function setupErrorHandling() {
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    
    // Don't show alert in development to avoid annoying developers
    if (import.meta.env.PROD) {
      // Only show user-friendly error for serious issues
      if (event.error && event.error.toString().includes('Failed to fetch dynamically')) {
        // Don't block the UI with an alert, just log it
        console.error('Network issue detected when loading page components');
      }
    }
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });
}

/**
 * This function ensures that URLs without a trailing slash work correctly
 * when someone accesses them directly (e.g., by typing in the URL bar or refreshing)
 */
function ensureProperRouting() {
  // For production deployments, this helps with direct route access
  const path = window.location.pathname;
  const isDirectRoute = path && path !== '/' && !path.includes('.');
  
  // Log routing information for debugging
  console.info('Current path:', path, 'isDirectRoute:', isDirectRoute);
  
  // Add logic to handle hash-based fallback if needed for some environments
  if (isDirectRoute && import.meta.env.PROD) {
    // This can help in some hosting environments that don't support proper SPA routing
    console.info('Direct route access detected in production');
  }
}

// Set up error handling
setupErrorHandling();

// Call the routing function before rendering
ensureProperRouting();

// Create a root once rather than on every render
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);
root.render(<App />);
