
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">
          You are logged in as a {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </p>
      </div>
      
      {dashboards[user.role]}
    </div>
  );
}

function LeaderDashboard() {
  // Mock data for demonstration
  const activeProjects = 3;
  const pendingPayments = 2;
  const lastUpload = "2 hours ago";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Projects</CardTitle>
            <CardDescription>Your ongoing work</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeProjects}</p>
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
            <Link to="/payments">
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
            <p className="text-lg">{lastUpload}</p>
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
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                </div>
                <div>
                  <p className="font-medium">Project #123 Progress Updated</p>
                  <p className="text-sm text-muted-foreground">Today at 10:30 AM</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                </div>
                <div>
                  <p className="font-medium">Payment Request Pending</p>
                  <p className="text-sm text-muted-foreground">Yesterday at 4:15 PM</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                </div>
                <div>
                  <p className="font-medium">New Project Created</p>
                  <p className="text-sm text-muted-foreground">May 12, 2025</p>
                </div>
              </div>
            </div>
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
  const pendingPayments = 7;
  const totalProjects = 12;
  const totalExpenses = "₹29,450";

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
            <p className="text-3xl font-bold">{totalExpenses}</p>
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
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded bg-pale-cyan flex items-center justify-center text-primary-foreground font-medium">
                      P{i}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Payment Request #{200 + i}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{i * 2000} • Approved by Checker {i} • {i} day{i !== 1 ? 's' : ''} ago
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline">Schedule</Button>
                    <Button>Pay Now</Button>
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
