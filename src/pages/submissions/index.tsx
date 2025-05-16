
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { getProgressEntries, getProjects, getPaymentRequests } from "@/lib/storage";
import { ProgressEntry, Project, PaymentRequest } from "@/types";

interface SubmissionItem {
  id: string;
  type: 'progress' | 'payment';
  date: string;
  projectName: string;
  details: string;
}

export default function Submissions() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load all progress entries and payment requests
    const loadSubmissions = () => {
      const allEntries = getProgressEntries();
      const allProjects = getProjects();
      const allPayments = getPaymentRequests();
      
      const projectMap = new Map<string, Project>();
      allProjects.forEach(project => {
        projectMap.set(project.id, project);
      });
      
      // Get submissions from progress entries
      const progressSubmissions = allEntries
        .filter(entry => entry.status === "submitted")
        .map(entry => ({
          id: entry.id,
          type: 'progress' as const,
          date: entry.date,
          projectName: projectMap.get(entry.projectId)?.name || 'Unknown Project',
          details: `Photos: ${entry.photos.length}`
        }));
      
      // Get submissions from payment requests
      const paymentSubmissions = allPayments
        .filter(payment => payment.status === "pending")
        .map(payment => ({
          id: payment.id,
          type: 'payment' as const,
          date: payment.requestedAt,
          projectName: projectMap.get(payment.projectId)?.name || 'Unknown Project',
          details: `Amount: ₹${payment.amount.toFixed(2)}`
        }));
      
      // Combine submissions and sort by date (newest first)
      const combinedSubmissions = [...progressSubmissions, ...paymentSubmissions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      console.log("Found submissions:", combinedSubmissions.length);
      setSubmissions(combinedSubmissions);
      setLoading(false);
    };

    loadSubmissions();
  }, []);

  return (
    <Layout requiredRoles={["checker", "admin"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Review Submissions</h1>
        <p className="text-muted-foreground">
          Review and validate submissions from leaders
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <p>Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-4">No submissions to review</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className="overflow-hidden">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{submission.type === 'progress' ? 'Progress Entry' : 'Payment Request'}</p>
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                          {submission.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Project: {submission.projectName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(submission.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {submission.details}
                      </p>
                    </div>
                    <Link to={`/submissions/${submission.id}`} state={{ type: submission.type }}>
                      <Button>
                        <Eye className="mr-2 h-4 w-4" />
                        Review
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
