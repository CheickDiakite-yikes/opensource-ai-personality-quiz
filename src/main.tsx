
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create a root once rather than on every render
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);

// Handle SPA routing - this ensures the app loads correctly on direct URL access
// or page refresh
const renderApp = () => {
  root.render(<App />);
};

// Render the app
renderApp();

// Add event listener for unhandled errors to improve debugging
window.addEventListener('error', (event) => {
  console.error('Unhandled error:', event.error);
});
