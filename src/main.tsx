
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider'; 
import { SupabaseAuthProvider } from '@/hooks/useSupabaseAuth';
import { Toaster } from '@/components/ui/toaster';
import '@/index.css';
import App from '@/App';

// Import translation service 
import '@/services/i18n';

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light">
          <SupabaseAuthProvider>
            <App />
            <Toaster />
          </SupabaseAuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>
);
