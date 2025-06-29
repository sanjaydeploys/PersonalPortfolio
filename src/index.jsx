// src/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import from 'react-dom/client'
import { AppProvider } from './context/AppContext';
import AppRouter from './Router';


const rootElement = document.getElementById('root');
const appRoot = createRoot(rootElement);

appRoot.render(
  <React.StrictMode>
   
    <AppProvider>
      <AppRouter />
      
    </AppProvider>
  
  </React.StrictMode>,

);
