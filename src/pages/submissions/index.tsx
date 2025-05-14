
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { getProgressEntries } from "@/lib/storage";
import { ProgressEntry } from "@/types";

export default function Submissions() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load all progress entries
    const allEntries = getProgressEntries();
    // Filter by status = "submitted"
    const submittedEntries = allEntries.filter(entry => entry.status === "submitted");
    setEntries(submittedEntries);
    setLoading(false);
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
        ) : entries.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-4">No submissions to review</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Progress Entry {entry.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(entry.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Photos: {entry.photos.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Payment Requests: {entry.paymentRequests.length}
                      </p>
                    </div>
                    <Link to={`/submissions/${entry.id}`}>
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
