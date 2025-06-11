import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import '@ant-design/v5-patch-for-react-19';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <App />
    </div>
  </StrictMode>
);
