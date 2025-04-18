
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from 'next-themes';
import App from './App.tsx';
import './index.css';
import './styles/social.css'; // Make sure the social styles are imported

// Create a root once rather than on every render
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);

// Render app with proper provider hierarchy to ensure
// authentication context is always available
root.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);

// Add event listener for unhandled errors to improve debugging
window.addEventListener('error', (event) => {
  console.error('Unhandled error:', event.error);
});
