
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProjects, getProgressEntries, getPaymentRequests } from "@/lib/storage";
import { Project, ProgressEntry, PaymentRequest } from "@/types";
import { generateDemoData } from "@/lib/demoData";
import { toast } from "sonner";
import { getRecentPayments, getRecentEntries } from "@/lib/statisticsHelpers";
import { StatisticsTabContent } from "@/components/statistics/StatisticsTabContent";

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
    
    const allPayments = getPaymentRequests();
    const allEntries = getProgressEntries();
    
    // Filter data by time periods
    const now = new Date();
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(now.getDate() - 1);
    
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    // Filter payments
    setTodayPayments(allPayments.filter(p => new Date(p.requestedAt) >= oneDayAgo));
    setWeekPayments(allPayments.filter(p => new Date(p.requestedAt) >= sevenDaysAgo));
    setMonthPayments(allPayments.filter(p => new Date(p.requestedAt) >= thirtyDaysAgo));
    
    // Filter entries
    setTodayEntries(allEntries.filter(e => new Date(e.date) >= oneDayAgo));
    setWeekEntries(allEntries.filter(e => new Date(e.date) >= sevenDaysAgo));
    
    setLoading(false);
  }, []);

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
          
          <TabsContent value="today">
            <StatisticsTabContent
              title="Today"
              payments={todayPayments}
              entries={todayEntries}
              projects={projects}
            />
          </TabsContent>
          
          <TabsContent value="week">
            <StatisticsTabContent
              title="Last 7 Days"
              payments={weekPayments}
              entries={weekEntries}
              projects={projects}
            />
          </TabsContent>
          
          <TabsContent value="month">
            <StatisticsTabContent
              title="Last 30 Days"
              payments={monthPayments}
              entries={[]}
              projects={projects}
              showProjectActivity={false}
              showLeaderPerformance={false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
