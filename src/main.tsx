
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create a root once rather than on every render
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);
root.render(<App />);
