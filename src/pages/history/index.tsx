
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getProgressEntries } from "@/lib/storage";
import { format } from "date-fns";
import { ProgressEntry } from "@/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReviewHistory() {
  const { user } = useAuth();
  const [approvedEntries, setApprovedEntries] = useState<ProgressEntry[]>([]);
  const [rejectedEntries, setRejectedEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Load progress entries
    const allEntries = getProgressEntries();
    
    // Filter entries reviewed by the current user
    const userApproved = allEntries.filter(
      entry => entry.reviewedBy === user.id && entry.status === "approved"
    );
    
    const userRejected = allEntries.filter(
      entry => entry.reviewedBy === user.id && entry.status === "rejected"
    );
    
    setApprovedEntries(userApproved);
    setRejectedEntries(userRejected);
    setLoading(false);
  }, [user]);

  const renderEntriesTable = (entries: ProgressEntry[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Project</TableHead>
          <TableHead>Submitted By</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No entries found
            </TableCell>
          </TableRow>
        ) : (
          entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                {format(new Date(entry.date), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>{entry.projectName || "Unknown Project"}</TableCell>
              <TableCell>{entry.userName || "Unknown User"}</TableCell>
              <TableCell>
                <Badge variant={entry.status === "rejected" ? "destructive" : "default"}>
                  {entry.status?.charAt(0).toUpperCase() + (entry.status?.slice(1) || "Unknown")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link to={`/progress/view/${entry.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <Layout requiredRoles={["checker"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Review History</h1>
        <p className="text-muted-foreground">
          Track your progress submission reviews
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <p>Loading history...</p>
          </div>
        ) : (
          <Tabs defaultValue="approved">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="approved">Approved ({approvedEntries.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedEntries.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="approved" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Approved Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderEntriesTable(approvedEntries)}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rejected" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Rejected Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderEntriesTable(rejectedEntries)}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
