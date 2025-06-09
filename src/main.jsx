import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Suppression de l'extension .tsx
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);