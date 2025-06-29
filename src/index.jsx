// src/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import from 'react-dom/client'
import { AppProvider } from './context/AppContext';
import AppRouter from './Router';
import { Provider } from 'react-redux';


const rootElement = document.getElementById('root');
const appRoot = createRoot(rootElement);

appRoot.render(

   <Provider>
  <React.StrictMode>
   
    <AppProvider>
      <AppRouter />
      
    </AppProvider>
  
  </React.StrictMode>,
</Provider>
);
