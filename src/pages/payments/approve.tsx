
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPaymentRequests, updatePaymentRequest } from "@/lib/storage";
import { PaymentRequest } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Check, Calendar, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

export default function ApprovePayments() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<PaymentRequest[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<PaymentRequest[]>([]);
  const [historyRequests, setHistoryRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    // Load payment requests based on their status
    const allRequests = getPaymentRequests();
    const pending = allRequests.filter(req => req.status === "pending");
    const approved = allRequests.filter(req => req.status === "approved");
    const history = allRequests.filter(req => ["scheduled", "paid"].includes(req.status));
    
    setPendingRequests(pending);
    setApprovedRequests(approved);
    setHistoryRequests(history);
    setLoading(false);
  }, []);

  const handleConfirmPayment = (request: PaymentRequest) => {
    if (!user) return;
    
    const updatedRequest = {
      ...request,
      status: "paid" as const,
      paymentDate: new Date().toISOString(),
      reviewedBy: user.id,
      reviewedAt: new Date().toISOString(),
      comments: "Payment confirmed"
    };
    
    updatePaymentRequest(updatedRequest);
    
    // Update local state
    setApprovedRequests(approvedRequests.filter(req => req.id !== request.id));
    setHistoryRequests([updatedRequest, ...historyRequests]);
    
    toast({
      title: "Payment Confirmed",
      description: `Payment of ₹${request.amount.toFixed(2)} has been confirmed.`,
    });
  };

  const openScheduleDialog = (request: PaymentRequest) => {
    setSelectedRequest(request);
    setScheduledDate(new Date().toISOString().split('T')[0]);
    setShowScheduleDialog(true);
  };

  const handleSchedulePayment = () => {
    if (!user || !selectedRequest) return;
    
    const updatedRequest = {
      ...selectedRequest,
      status: "scheduled" as const,
      paymentDate: new Date(scheduledDate).toISOString(),
      reviewedBy: user.id,
      reviewedAt: new Date().toISOString(),
      comments: `Scheduled for payment on ${format(new Date(scheduledDate), "MMM dd, yyyy")}`
    };
    
    updatePaymentRequest(updatedRequest);
    
    // Update local state
    setApprovedRequests(approvedRequests.filter(req => req.id !== selectedRequest.id));
    setHistoryRequests([updatedRequest, ...historyRequests]);
    
    toast({
      title: "Payment Scheduled",
      description: `Payment of ₹${selectedRequest.amount.toFixed(2)} has been scheduled for ${format(new Date(scheduledDate), "MMM dd, yyyy")}.`,
    });
    
    setShowScheduleDialog(false);
  };

  const renderPaymentCard = (request: PaymentRequest, showActions: boolean = true) => (
    <Card key={request.id}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>₹{request.amount.toFixed(2)}</span>
          <div className={`px-3 py-1 rounded-full text-xs ${
            request.status === "approved" ? "bg-amber-100 text-amber-800" :
            request.status === "scheduled" ? "bg-blue-100 text-blue-800" :
            request.status === "paid" ? "bg-green-100 text-green-800" :
            request.status === "rejected" ? "bg-red-100 text-red-800" :
            "bg-gray-100 text-gray-800"
          }`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Description</p>
            <p>{request.description}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Purposes</p>
            <div className="flex flex-wrap gap-2">
              {request.purposes.map((purpose) => (
                <span 
                  key={purpose} 
                  className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs"
                >
                  {purpose.charAt(0).toUpperCase() + purpose.slice(1)}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Supporting Documents</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {request.photos.map((photo) => (
                <div key={photo.id} className="relative">
                  <img
                    src={photo.url}
                    alt="Supporting Document"
                    className="w-full h-16 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Requested by: {request.requestedBy}
              </p>
              <p className="text-sm text-muted-foreground">
                Requested at: {format(new Date(request.requestedAt), "MMM dd, yyyy HH:mm")}
              </p>
              {request.reviewedAt && (
                <p className="text-sm text-muted-foreground">
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)} at: {format(new Date(request.reviewedAt), "MMM dd, yyyy HH:mm")}
                </p>
              )}
            </div>
            
            {showActions && request.status === "approved" && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => openScheduleDialog(request)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
                <Button onClick={() => handleConfirmPayment(request)}>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm Payment
                </Button>
              </div>
            )}
            
            {!showActions && request.statusHistory && request.statusHistory.length > 1 && (
              <Button variant="ghost" size="sm" className="flex items-center">
                <History className="mr-1 h-4 w-4" />
                View History
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout requiredRoles={["owner", "admin"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Payment Management</h1>
        <p className="text-muted-foreground">
          Review, schedule and confirm payments
        </p>

        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="approved">Ready for Payment</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <p>Loading payment requests...</p>
              </div>
            ) : pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground mb-4">No payment requests pending approval</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => renderPaymentCard(request, false))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <p>Loading approved requests...</p>
              </div>
            ) : approvedRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground mb-4">No approved payment requests awaiting payment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {approvedRequests.map((request) => renderPaymentCard(request))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <p>Loading payment history...</p>
              </div>
            ) : historyRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground mb-4">No payment history available</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {historyRequests.map((request) => renderPaymentCard(request, false))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Payment</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <p className="text-muted-foreground mb-1">Amount</p>
              <p className="text-xl font-semibold">₹{selectedRequest?.amount.toFixed(2)}</p>
            </div>
            
            <div>
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input
                id="paymentDate"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedulePayment}>
              Schedule Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
