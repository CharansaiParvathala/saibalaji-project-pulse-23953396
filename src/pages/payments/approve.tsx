
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
import { Check, Calendar } from "lucide-react";

export default function ApprovePayments() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");

  useEffect(() => {
    // Load approved payment requests
    const approvedRequests = getPaymentRequests().filter(req => req.status === "approved");
    setRequests(approvedRequests);
    setLoading(false);
  }, []);

  const handlePayNow = (request: PaymentRequest) => {
    if (!user) return;
    
    const updatedRequest = {
      ...request,
      status: "paid" as const,
      paymentDate: new Date().toISOString(),
    };
    
    updatePaymentRequest(updatedRequest);
    
    // Update local state
    setRequests(requests.map(req => 
      req.id === request.id ? updatedRequest : req
    ));
    
    toast({
      title: "Payment Completed",
      description: `Payment of ₹${request.amount.toFixed(2)} has been made.`,
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
    };
    
    updatePaymentRequest(updatedRequest);
    
    // Update local state
    setRequests(requests.map(req => 
      req.id === selectedRequest.id ? updatedRequest : req
    ));
    
    toast({
      title: "Payment Scheduled",
      description: `Payment of ₹${selectedRequest.amount.toFixed(2)} has been scheduled for ${new Date(scheduledDate).toLocaleDateString()}.`,
    });
    
    setShowScheduleDialog(false);
  };

  return (
    <Layout requiredRoles={["owner", "admin"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Approve Payments</h1>
        <p className="text-muted-foreground">
          Review and approve payments that have been verified by checkers
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <p>Loading payment requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-4">No payment requests to approve</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>₹{request.amount.toFixed(2)}</span>
                    <div className="text-sm font-normal text-muted-foreground">
                      Project ID: {request.projectId}
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
                          Requested at: {new Date(request.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => openScheduleDialog(request)}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule
                        </Button>
                        <Button onClick={() => handlePayNow(request)}>
                          <Check className="mr-2 h-4 w-4" />
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
