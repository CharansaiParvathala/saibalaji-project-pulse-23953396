
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Providers
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";

// Layouts
import { Layout } from "@/components/Layout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected routes with Layout */}
              <Route 
                path="/" 
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                } 
              />
              
              {/* Leader specific routes */}
              <Route
                path="/projects/create"
                element={
                  <Layout requiredRoles={["leader", "admin"]}>
                    <div className="panel">
                      <h1>Create Project</h1>
                      <p>This page will be implemented in future iterations.</p>
                    </div>
                  </Layout>
                }
              />
              <Route
                path="/progress"
                element={
                  <Layout requiredRoles={["leader", "admin"]}>
                    <div className="panel">
                      <h1>Add Progress</h1>
                      <p>This page will be implemented in future iterations.</p>
                    </div>
                  </Layout>
                }
              />
              <Route
                path="/payments/request"
                element={
                  <Layout requiredRoles={["leader", "admin"]}>
                    <div className="panel">
                      <h1>Request Payment</h1>
                      <p>This page will be implemented in future iterations.</p>
                    </div>
                  </Layout>
                }
              />
              
              {/* Checker specific routes */}
              <Route
                path="/submissions"
                element={
                  <Layout requiredRoles={["checker", "admin"]}>
                    <div className="panel">
                      <h1>Review Submissions</h1>
                      <p>This page will be implemented in future iterations.</p>
                    </div>
                  </Layout>
                }
              />
              <Route
                path="/submissions/:id"
                element={
                  <Layout requiredRoles={["checker", "admin"]}>
                    <div className="panel">
                      <h1>Submission Details</h1>
                      <p>This page will be implemented in future iterations.</p>
                    </div>
                  </Layout>
                }
              />
              <Route
                path="/history"
                element={
                  <Layout requiredRoles={["checker", "admin"]}>
                    <div className="panel">
                      <h1>Review History</h1>
                      <p>This page will be implemented in future iterations.</p>
                    </div>
                  </Layout>
                }
              />
              
              {/* Owner specific routes */}
              <Route
                path="/payments/approve"
                element={
                  <Layout requiredRoles={["owner", "admin"]}>
                    <div className="panel">
                      <h1>Approve Payments</h1>
                      <p>This page will be implemented in future iterations.</p>
                    </div>
                  </Layout>
                }
              />
              <Route
                path="/statistics"
                element={
                  <Layout requiredRoles={["owner", "admin"]}>
                    <div className="panel">
                      <h1>Statistics</h1>
                      <p>This page will be implemented in future iterations.</p>
                    </div>
                  </Layout>
                }
              />
              
              {/* Admin specific routes */}
              <Route
                path="/users"
                element={
                  <Layout requiredRoles={["admin"]}>
                    <div className="panel">
                      <h1>Manage Users</h1>
                      <p>This page will be implemented in future iterations.</p>
                    </div>
                  </Layout>
                }
              />
              <Route
                path="/vehicles"
                element={
                  <Layout requiredRoles={["admin"]}>
                    <div className="panel">
                      <h1>Vehicle Registry</h1>
                      <p>This page will be implemented in future iterations.</p>
                    </div>
                  </Layout>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
