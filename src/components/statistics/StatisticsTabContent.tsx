
import { Project, ProgressEntry, PaymentRequest } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurposeChart } from "@/components/charts/PurposeChart";
import { ProjectActivityChart } from "@/components/charts/ProjectActivityChart";
import { LeaderPerformanceChart } from "@/components/charts/LeaderPerformanceChart";
import { PaymentStatusChart } from "@/components/charts/PaymentStatusChart";

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
  showLeaderPerformance = true
}: StatisticsTabContentProps) {
  return (
    <div className="space-y-6 pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Purpose ({title})</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <PurposeChart payments={payments} title={title} />
          </CardContent>
        </Card>
        
        {showProjectActivity && (
          <Card>
            <CardHeader>
              <CardTitle>Project Activity ({title})</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ProjectActivityChart entries={entries} projects={projects} title={title} />
            </CardContent>
          </Card>
        )}
        
        {showLeaderPerformance && (
          <Card>
            <CardHeader>
              <CardTitle>Leader Performance ({title})</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <LeaderPerformanceChart entries={entries} title={title} />
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Status ({title})</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <PaymentStatusChart payments={payments} title={title} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
