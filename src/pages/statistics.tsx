
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProjects, getProgressEntries, getPaymentRequests } from "@/lib/storage";
import { Project, ProgressEntry, PaymentRequest } from "@/types";
import { generateDemoData } from "@/lib/demoData";
import { toast } from "sonner";
import { 
  PieChart, Pie, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer 
} from "recharts";

// Helper to get payments from the last N days
const getRecentPayments = (days: number) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return getPaymentRequests().filter(payment => {
    const paymentDate = new Date(payment.requestedAt);
    return paymentDate >= cutoffDate;
  });
};

// Helper to get progress entries from the last N days
const getRecentEntries = (days: number) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return getProgressEntries().filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= cutoffDate;
  });
};

// Colors for charts
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'
];

export default function Statistics() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [todayPayments, setTodayPayments] = useState<PaymentRequest[]>([]);
  const [weekPayments, setWeekPayments] = useState<PaymentRequest[]>([]);
  const [todayEntries, setTodayEntries] = useState<ProgressEntry[]>([]);
  const [weekEntries, setWeekEntries] = useState<ProgressEntry[]>([]);
  const [monthPayments, setMonthPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate demo data if needed
    const demoData = generateDemoData();
    
    if (demoData) {
      toast.success("Demo data generated for statistics");
    }
    
    // Load data
    setProjects(getProjects());
    setTodayPayments(getRecentPayments(1));
    setWeekPayments(getRecentPayments(7));
    setMonthPayments(getRecentPayments(30));
    setTodayEntries(getRecentEntries(1));
    setWeekEntries(getRecentEntries(7));
    setLoading(false);
  }, []);

  // Prepare data for expense by purpose chart
  const preparePurposeData = (payments: PaymentRequest[]) => {
    const purposeTotals: Record<string, number> = {
      food: 0,
      fuel: 0,
      labour: 0,
      vehicle: 0,
      water: 0,
      other: 0,
    };
    
    payments.forEach(payment => {
      payment.purposes.forEach(purpose => {
        // Divide the amount by the number of purposes to avoid double counting
        purposeTotals[purpose] += payment.amount / payment.purposes.length;
      });
    });
    
    return Object.keys(purposeTotals).map(purpose => ({
      name: purpose.charAt(0).toUpperCase() + purpose.slice(1),
      value: purposeTotals[purpose]
    }));
  };

  // Prepare data for project completion chart
  const prepareProjectData = (entries: ProgressEntry[]) => {
    const projectCounts: Record<string, number> = {};
    
    entries.forEach(entry => {
      if (!projectCounts[entry.projectId]) {
        projectCounts[entry.projectId] = 0;
      }
      projectCounts[entry.projectId]++;
    });
    
    return Object.keys(projectCounts).map(projectId => {
      const project = projects.find(p => p.id === projectId);
      return {
        name: project ? project.name : `Project ${projectId}`,
        count: projectCounts[projectId]
      };
    });
  };

  // Prepare data for leader performance chart
  const prepareLeaderData = (entries: ProgressEntry[]) => {
    const leaderCounts: Record<string, number> = {};
    
    entries.forEach(entry => {
      if (!leaderCounts[entry.submittedBy]) {
        leaderCounts[entry.submittedBy] = 0;
      }
      leaderCounts[entry.submittedBy]++;
    });
    
    return Object.keys(leaderCounts).map(leaderId => ({
      name: `Leader ${leaderId}`,
      entries: leaderCounts[leaderId]
    }));
  };

  // Prepare data for payment status chart
  const prepareStatusData = (payments: PaymentRequest[]) => {
    const statusCounts: Record<string, number> = {
      "pending": 0,
      "approved": 0,
      "rejected": 0,
      "scheduled": 0,
      "paid": 0
    };
    
    payments.forEach(payment => {
      statusCounts[payment.status]++;
    });
    
    return Object.keys(statusCounts).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      count: statusCounts[status]
    }));
  };

  if (loading) {
    return (
      <Layout requiredRoles={["owner", "admin"]}>
        <div className="flex justify-center py-8">
          <p>Loading statistics...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout requiredRoles={["owner", "admin"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Statistics</h1>

        <Tabs defaultValue="today">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">Last 7 Days</TabsTrigger>
            <TabsTrigger value="month">Last 30 Days</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Purpose (Today)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {todayPayments.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={preparePurposeData(todayPayments)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {preparePurposeData(todayPayments).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => `₹${value.toFixed(2)}`}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Project Activity (Today)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {todayEntries.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareProjectData(todayEntries)}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Progress Entries">
                          {prepareProjectData(todayEntries).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Leader Performance (Today)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {todayEntries.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareLeaderData(todayEntries)}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="entries" fill="#82ca9d" name="Progress Entries">
                          {prepareLeaderData(todayEntries).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Status (Today)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {todayPayments.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareStatusData(todayPayments)}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Payment Requests">
                          {prepareStatusData(todayPayments).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="week" className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Purpose (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {weekPayments.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={preparePurposeData(weekPayments)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {preparePurposeData(weekPayments).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => `₹${value.toFixed(2)}`}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Project Activity (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {weekEntries.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareProjectData(weekEntries)}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Progress Entries">
                          {prepareProjectData(weekEntries).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Leader Performance (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {weekEntries.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareLeaderData(weekEntries)}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="entries" fill="#82ca9d" name="Progress Entries">
                          {prepareLeaderData(weekEntries).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Status (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {weekPayments.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareStatusData(weekPayments)}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Payment Requests">
                          {prepareStatusData(weekPayments).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="month" className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Purpose (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {monthPayments.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={preparePurposeData(monthPayments)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {preparePurposeData(monthPayments).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => `₹${value.toFixed(2)}`}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Status (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {monthPayments.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareStatusData(monthPayments)}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Payment Requests">
                          {prepareStatusData(monthPayments).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
