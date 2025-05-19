import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { SupabaseAuthProvider } from "@/hooks/useSupabaseAuth";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";
import Projects from "@/pages/projects";
import ProjectDetails from "@/pages/projects/[id]";
import CreateProject from "@/pages/projects/create";
import AddProgress from "@/pages/progress/add";
import ViewProgress from "@/pages/progress/view";
import RequestPayment from "@/pages/payments/request";
import ApprovePayments from "@/pages/payments/approve";
import PaymentHistory from "@/pages/payments/history";
import Statistics from "@/pages/statistics";
import UsersList from "@/pages/users";
import AddUser from "@/pages/users/add";
import EditUser from "@/pages/users/edit/[id]";
import VehiclesList from "@/pages/vehicles";
import VehicleDetails from "@/pages/vehicles/[id]";
import AddVehicle from "@/pages/vehicles/add";
import EditVehicle from "@/pages/vehicles/edit/[id]";
import Submissions from "@/pages/submissions";
import ReviewSubmission from "@/pages/submissions/[id]";
import ReviewHistory from "@/pages/history";
import Credentials from "@/pages/users/credentials";
import BackupPage from "@/pages/backup";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="sai-balaji-theme">
      <SupabaseAuthProvider>
        <Routes>
          {/* Make sure the index route is the first one */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Projects */}
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/create" element={<CreateProject />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          
          {/* Progress */}
          <Route path="/progress" element={<Projects showProgressButton={true} />} />
          <Route path="/progress/add/:projectId" element={<AddProgress />} />
          <Route path="/progress/view/:id" element={<ViewProgress />} />
          
          {/* Payments */}
          <Route path="/payments/request" element={<RequestPayment />} />
          <Route path="/payments/approve" element={<ApprovePayments />} />
          <Route path="/payments/history" element={<PaymentHistory />} />
          
          {/* Statistics */}
          <Route path="/statistics" element={<Statistics />} />
          
          {/* Users */}
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
          <Route path="/users/credentials" element={<Credentials />} />
          
          {/* Checker history */}
          <Route path="/history" element={<ReviewHistory />} />
          
          {/* Vehicles */}
          <Route path="/vehicles" element={<VehiclesList />} />
          <Route path="/vehicles/add" element={<AddVehicle />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
          <Route path="/vehicles/edit/:id" element={<EditVehicle />} />
          
          {/* Submissions */}
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/submissions/:id" element={<ReviewSubmission />} />
          
          {/* Backup & Data Management */}
          <Route path="/backup" element={<BackupPage />} />
          
          {/* 404 - Always keep this as the last route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </SupabaseAuthProvider>
    </ThemeProvider>
  );
}

export default App;
