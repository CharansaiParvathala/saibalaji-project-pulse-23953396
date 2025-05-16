import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './hooks/useAuth';

// Create a function to render the app to handle any potential errors
const renderApp = () => {
  try {
    const root = createRoot(document.getElementById("root")!);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Error rendering application:", error);
    // Display a fallback error UI instead of white screen
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; font-family: sans-serif;">
        <h1>Something went wrong</h1>
        <p>Please refresh the page to try again.</p>
      </div>
    `;
  }
};

renderApp(); 
