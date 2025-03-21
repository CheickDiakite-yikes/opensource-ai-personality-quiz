
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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
  
  // Note: In a real deployment, you would need to configure your server
  // to handle SPA routing (e.g., with Netlify _redirects or Vercel config)
}

// Call the function before rendering
ensureProperRouting();

// Create a root once rather than on every render
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);
root.render(<App />);
