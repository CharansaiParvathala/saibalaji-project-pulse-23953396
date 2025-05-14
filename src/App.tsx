
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
import CreateProject from "./pages/projects/create";
import Projects from "./pages/projects/index";
import ProjectDetails from "./pages/projects/[id]";
import AddProgress from "./pages/progress/add";
import RequestPayment from "./pages/payments/request";
import ApprovePayments from "./pages/payments/approve";
import PaymentHistory from "./pages/payments/history";
import Submissions from "./pages/submissions/index";
import SubmissionDetails from "./pages/submissions/[id]";
import Statistics from "./pages/statistics";
import VehicleRegistry from "./pages/vehicles/index";
import VehicleDetails from "./pages/vehicles/[id]";
import EditVehicle from "./pages/vehicles/edit/[id]";
import AddVehicle from "./pages/vehicles/add";
import ManageUsers from "./pages/users/index";
import EditUser from "./pages/users/edit/[id]";
import AddUser from "./pages/users/add";

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
              
              {/* Project routes */}
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              
              {/* Leader specific routes */}
              <Route
                path="/projects/create"
                element={
                  <Layout requiredRoles={["leader", "admin"]}>
                    <CreateProject />
                  </Layout>
                }
              />
              <Route
                path="/progress/add/:projectId"
                element={<AddProgress />}
              />
              <Route
                path="/payments/request"
                element={<RequestPayment />}
              />
              <Route
                path="/payments/history"
                element={<PaymentHistory />}
              />
              
              {/* Checker specific routes */}
              <Route
                path="/submissions"
                element={<Submissions />}
              />
              <Route
                path="/submissions/:id"
                element={<SubmissionDetails />}
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
                element={<ApprovePayments />}
              />
              <Route
                path="/statistics"
                element={<Statistics />}
              />
              
              {/* Admin specific routes */}
              <Route
                path="/users"
                element={<ManageUsers />}
              />
              <Route
                path="/users/add"
                element={<AddUser />}
              />
              <Route
                path="/users/edit/:id"
                element={<EditUser />}
              />
              <Route
                path="/vehicles"
                element={<VehicleRegistry />}
              />
              <Route
                path="/vehicles/:id"
                element={<VehicleDetails />}
              />
              <Route
                path="/vehicles/edit/:id"
                element={<EditVehicle />}
              />
              <Route
                path="/vehicles/add"
                element={<AddVehicle />}
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
