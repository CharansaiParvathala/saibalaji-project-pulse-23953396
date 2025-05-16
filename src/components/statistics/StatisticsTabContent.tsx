
import { BarChart, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project, ProgressEntry, PaymentRequest } from "@/types";
import { PurposeChart } from "@/components/charts/PurposeChart";
import { PaymentStatusChart } from "@/components/charts/PaymentStatusChart";
import { ProjectActivityChart } from "@/components/charts/ProjectActivityChart";
import { LeaderPerformanceChart } from "@/components/charts/LeaderPerformanceChart";

interface StatisticsTabContentProps {
  title: string;
  payments: PaymentRequest[];
  entries: ProgressEntry[];
  projects: Project[];
  showProjectActivity?: boolean;
  showLeaderPerformance?: boolean;
}

export function StatisticsTabContent({
  title,
  payments,
  entries,
  projects,
  showProjectActivity = true,
  showLeaderPerformance = true,
}: StatisticsTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Purpose Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PurposeChart payments={payments} title="Payment Purpose Distribution" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentStatusChart payments={payments} title="Payment Status Distribution" />
          </CardContent>
        </Card>
      </div>
      
      {showProjectActivity && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Project Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ProjectActivityChart entries={entries} projects={projects} />
            </div>
          </CardContent>
        </Card>
      )}
      
      {showLeaderPerformance && entries.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Team Leader Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <LeaderPerformanceChart entries={entries} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
