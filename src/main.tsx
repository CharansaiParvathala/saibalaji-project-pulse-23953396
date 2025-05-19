
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { Toaster } from "./components/ui/toaster";
import "./index.css";
import { AuthProvider } from "@/hooks/useAuth";
import { SupabaseAuthProvider } from "@/hooks/useSupabaseAuth";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SupabaseAuthProvider>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </SupabaseAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
