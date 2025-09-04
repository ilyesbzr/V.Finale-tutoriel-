import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './i18n';

const container = document.getElementById('root');
const root = createRoot(container);

// Montage immédiat de l'application
root.render(<App />);

// Supprimer le loader une fois que l'app est montée
const loader = document.querySelector('.loading-container');
if (loader) {
  loader.style.opacity = '0';
  setTimeout(() => loader.remove(), 200);
}