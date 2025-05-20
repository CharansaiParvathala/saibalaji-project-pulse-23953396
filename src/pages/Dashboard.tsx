import { useEffect, useState } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { getProjects, getPaymentRequests, getPaymentRequestsByStatus } from "@/lib/storage";
import { Layout } from "@/components/Layout";

function LeaderDashboard() {
  const [projects, setProjects] = useState([]);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();
  const [lastProgressDate, setLastProgressDate] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    // Load projects from storage
    const allProjects = getProjects();
    const userProjects = allProjects.filter(project => project.createdBy === user.id);
    setProjects(userProjects);
    
    // Load pending payments
    const userPayments = getPaymentRequests().filter(payment => payment.requestedBy === user.id);
    const pending = userPayments.filter(payment => payment.status === "pending");
    setPendingPayments(pending.length);
    
    // Get last progress update
    // For demo we'll just use a mock date
    setLastProgressDate("2 hours ago");
    
    setLoading(false);
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Projects</CardTitle>
            <CardDescription>Your created projects</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{projects.length}</p>
            <Link to="/projects">
              <Button variant="link" className="px-0">View all projects</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Payments</CardTitle>
            <CardDescription>Awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingPayments}</p>
            <Link to="/payments/history">
              <Button variant="link" className="px-0">View payment requests</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Last Progress Update</CardTitle>
            <CardDescription>Latest activity</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{lastProgressDate || "No updates yet"}</p>
            <Link to="/progress">
              <Button variant="link" className="px-0">Add new progress</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/projects/create">
              <Button className="w-full flex items-center justify-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Project
              </Button>
            </Link>
            
            <Link to="/progress">
              <Button variant="outline" className="w-full flex items-center justify-center">
                <Clock className="mr-2 h-4 w-4" />
                Add Progress Update
              </Button>
            </Link>
            
            <Link to="/payments/request">
              <Button variant="outline" className="w-full flex items-center justify-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                Request Payment
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>My Projects</CardTitle>
            <Link to="/projects">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <p>Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground mb-4">No projects created yet</p>
                <Link to="/projects/create">
                  <Button>Create Your First Project</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.numWorkers} workers · Created {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link to={`/projects/${project.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CheckerDashboard() {
  // Mock data for demonstration
  const pendingReviews = 5;
  const approvedToday = 3;
  const rejectedToday = 1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Reviews</CardTitle>
            <CardDescription>Waiting for your approval</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingReviews}</p>
            <Link to="/submissions">
              <Button variant="link" className="px-0">Review submissions</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Approved Today</CardTitle>
            <CardDescription>Submissions you approved</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{approvedToday}</p>
            <Link to="/history">
              <Button variant="link" className="px-0">View history</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rejected Today</CardTitle>
            <CardDescription>Submissions you rejected</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{rejectedToday}</p>
            <Link to="/history">
              <Button variant="link" className="px-0">View history</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded bg-pale-cyan flex items-center justify-center text-primary-foreground font-medium">
                    P{i}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Project #{100 + i}</p>
                    <p className="text-sm text-muted-foreground">
                      Submitted {i} hour{i !== 1 ? 's' : ''} ago by Leader {i}
                    </p>
                  </div>
                </div>
                
                <Link to={`/submissions/${i}`}>
                  <Button>Review</Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OwnerDashboard() {
  // Mock data for demonstration
  const [pendingPayments, setPendingPayments] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [paymentRequests, setPaymentRequests] = useState([]);
  
  useEffect(() => {
    // Load real data
    const allProjects = getProjects();
    setTotalProjects(allProjects.filter(p => p.status === "active").length);
    
    const pending = getPaymentRequestsByStatus("approved");
    setPendingPayments(pending.length);
    setPaymentRequests(pending.slice(0, 3));
    
    // Calculate total expenses for this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const allPayments = getPaymentRequests();
    
    const thisMonthPayments = allPayments.filter(payment => {
      const paymentDate = new Date(payment.requestedAt);
      return paymentDate.getMonth() === currentMonth && 
             paymentDate.getFullYear() === currentYear;
    });
    
    const totalAmount = thisMonthPayments.reduce((sum, payment) => sum + payment.amount, 0);
    setTotalExpenses(totalAmount);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Payments</CardTitle>
            <CardDescription>Awaiting your approval</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingPayments}</p>
            <Link to="/payments/approve">
              <Button variant="link" className="px-0">Manage payments</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Projects</CardTitle>
            <CardDescription>Currently in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalProjects}</p>
            <Link to="/statistics">
              <Button variant="link" className="px-0">View statistics</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Expenses</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{totalExpenses.toLocaleString()}</p>
            <Link to="/statistics">
              <Button variant="link" className="px-0">View breakdown</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentRequests.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No pending payment requests</p>
              ) : paymentRequests.map((request, i) => (
                <div key={request.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded bg-pale-cyan flex items-center justify-center text-primary-foreground font-medium">
                      P{i+1}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Payment Request #{request.id.substr(-4)}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{request.amount.toLocaleString()} • {new Date(request.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        // Handle schedule payment
                        const date = new Date();
                        date.setDate(date.getDate() + 3); // Schedule for 3 days from now
                        
                        const updatedRequest = {
                          ...request,
                          scheduledDate: date.toISOString(),
                          status: "scheduled"
                        };
                        
                        // Update in storage (would be implemented)
                        // updatePaymentRequest(updatedRequest);
                        
                        // Update UI
                        setPaymentRequests(prev => 
                          prev.filter(item => item.id !== request.id)
                        );
                        
                        // Show toast notification
                        alert(`Payment scheduled for ${date.toLocaleDateString()}`);
                      }}
                    >
                      Schedule
                    </Button>
                    <Button
                      onClick={() => {
                        // Handle immediate payment
                        const updatedRequest = {
                          ...request,
                          status: "paid",
                          paidAt: new Date().toISOString()
                        };
                        
                        // Update in storage (would be implemented)
                        // updatePaymentRequest(updatedRequest);
                        
                        // Update UI
                        setPaymentRequests(prev => 
                          prev.filter(item => item.id !== request.id)
                        );
                        
                        // Show toast notification
                        alert("Payment completed successfully");
                      }}
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminDashboard() {
  // Mock data for demonstration
  const totalUsers = 24;
  const totalVehicles = 15;
  const activeProjects = 8;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Users</CardTitle>
            <CardDescription>Accounts on platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalUsers}</p>
            <Link to="/users">
              <Button variant="link" className="px-0">Manage users</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Vehicles</CardTitle>
            <CardDescription>In registry</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalVehicles}</p>
            <Link to="/vehicles">
              <Button variant="link" className="px-0">Manage vehicles</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Projects</CardTitle>
            <CardDescription>Currently in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeProjects}</p>
            <Link to="/statistics">
              <Button variant="link" className="px-0">View statistics</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/users/add">
              <Button className="w-full flex items-center justify-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New User
              </Button>
            </Link>
            
            <Link to="/vehicles/add">
              <Button variant="outline" className="w-full flex items-center justify-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">User Accounts</p>
                  <p className="text-sm font-medium">{totalUsers}/50</p>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${(totalUsers / 50) * 100}%` }}
                  />
                </div>
                <div className="flex text-xs text-muted-foreground justify-between mt-1">
                  <p>Leaders: 10</p>
                  <p>Checkers: 6</p>
                  <p>Owners: 8</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">Vehicle Registry</p>
                  <p className="text-sm font-medium">{totalVehicles}/30</p>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${(totalVehicles / 30) * 100}%` }}
                  />
                </div>
                <div className="flex text-xs text-muted-foreground justify-between mt-1">
                  <p>Active: 12</p>
                  <p>Maintenance: 3</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useSupabaseAuth();

  if (!user) {
    return null;
  }

  const dashboards = {
    leader: <LeaderDashboard />,
    checker: <CheckerDashboard />,
    owner: <OwnerDashboard />,
    admin: <AdminDashboard />,
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">
            You are logged in as a {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </p>
        </div>
        
        {dashboards[user.role]}
      </div>
    </Layout>
  );
}
