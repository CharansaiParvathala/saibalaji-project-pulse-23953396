
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getPaymentRequests } from "@/lib/storage";
import { PaymentRequest } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

export default function PaymentHistory() {
  const { user } = useAuth();
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Get all payment requests for the current user
    const allRequests = getPaymentRequests();
    const userRequests = allRequests.filter(request => request.requestedBy === user.id);
    
    // Sort by date, most recent first
    userRequests.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
    
    setPaymentRequests(userRequests);
    setLoading(false);
  }, [user]);

  const getStatusBadgeStyle = (status: PaymentRequest["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "approved":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "scheduled":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Layout requiredRoles={["leader", "checker", "owner", "admin"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground">
          View the status and history of your payment requests
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <p>Loading payment history...</p>
          </div>
        ) : paymentRequests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-4">No payment requests found</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Payment Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{format(new Date(request.requestedAt), "MMM dd, yyyy")}</TableCell>
                      <TableCell>₹{request.amount.toFixed(2)}</TableCell>
                      <TableCell>{request.purposes.join(", ")}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeStyle(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.reviewedAt ? format(new Date(request.reviewedAt), "MMM dd, yyyy") : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Payment Status Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 mb-2">Pending</Badge>
                <p>Your payment request is waiting for review by a checker</p>
              </div>
              
              <div>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mb-2">Approved</Badge>
                <p>Your request has been approved by a checker and is waiting for payment by an owner</p>
              </div>
              
              <div>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 mb-2">Scheduled</Badge>
                <p>Payment has been scheduled for a future date</p>
              </div>
              
              <div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mb-2">Paid</Badge>
                <p>Payment has been completed</p>
              </div>
              
              <div>
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100 mb-2">Rejected</Badge>
                <p>Your request was rejected. Please check with the checker for reasons</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
