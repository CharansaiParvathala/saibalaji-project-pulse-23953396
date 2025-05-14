
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getProgressEntry, getProject, updateProgressEntry, getPaymentRequests, updatePaymentRequest } from "@/lib/storage";
import { ProgressEntry, Project, PaymentRequest } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";

export default function SubmissionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [entry, setEntry] = useState<ProgressEntry | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [correctionMessage, setCorrectionMessage] = useState("");
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);

  useEffect(() => {
    if (!id) return;

    const entryData = getProgressEntry(id);
    if (entryData) {
      setEntry(entryData);
      
      const projectData = getProject(entryData.projectId);
      setProject(projectData || null);
      
      // Get all payment requests associated with this entry
      const allPaymentRequests = getPaymentRequests();
      const relatedRequestIds = entryData.paymentRequests || [];
      const requests = allPaymentRequests.filter(
        request => relatedRequestIds.includes(request.id)
      );
      setPaymentRequests(requests);
    }
    setLoading(false);
  }, [id]);

  const handleApprovePayment = (paymentId: string) => {
    if (!user) return;
    
    const requestToUpdate = paymentRequests.find(req => req.id === paymentId);
    if (requestToUpdate) {
      const updatedRequest = {
        ...requestToUpdate,
        status: "approved" as const,
        reviewedBy: user.id,
        reviewedAt: new Date().toISOString(),
      };
      
      updatePaymentRequest(updatedRequest);
      
      // Update local state
      setPaymentRequests(paymentRequests.map(req => 
        req.id === paymentId ? updatedRequest : req
      ));
      
      toast({
        title: "Payment Approved",
        description: "The payment request has been approved",
      });
    }
  };

  const handleRejectPayment = (paymentId: string) => {
    if (!user) return;
    
    const requestToUpdate = paymentRequests.find(req => req.id === paymentId);
    if (requestToUpdate) {
      const updatedRequest = {
        ...requestToUpdate,
        status: "rejected" as const,
        reviewedBy: user.id,
        reviewedAt: new Date().toISOString(),
      };
      
      updatePaymentRequest(updatedRequest);
      
      // Update local state
      setPaymentRequests(paymentRequests.map(req => 
        req.id === paymentId ? updatedRequest : req
      ));
      
      toast({
        title: "Payment Rejected",
        description: "The payment request has been rejected",
      });
    }
  };

  const handleSubmitCorrection = () => {
    if (!user || !entry) return;
    
    if (!correctionMessage.trim()) {
      toast({
        title: "Error",
        description: "Please provide a correction message",
        variant: "destructive",
      });
      return;
    }
    
    const updatedEntry = {
      ...entry,
      status: "correction-requested" as const,
      correctionRequest: {
        message: correctionMessage,
        requestedAt: new Date().toISOString(),
        requestedBy: user.id,
      },
    };
    
    updateProgressEntry(updatedEntry);
    setEntry(updatedEntry);
    setShowCorrectionForm(false);
    
    toast({
      title: "Correction Requested",
      description: "The correction request has been sent to the leader",
    });
  };

  const handleLockEntry = () => {
    if (!user || !entry) return;
    
    const updatedEntry = {
      ...entry,
      status: "locked" as const,
      isLocked: true,
    };
    
    updateProgressEntry(updatedEntry);
    setEntry(updatedEntry);
    
    toast({
      title: "Entry Locked",
      description: "The progress entry has been locked",
    });
  };

  if (loading) {
    return (
      <Layout requiredRoles={["checker", "admin"]}>
        <div className="flex justify-center py-8">
          <p>Loading submission details...</p>
        </div>
      </Layout>
    );
  }

  if (!entry || !project) {
    return (
      <Layout requiredRoles={["checker", "admin"]}>
        <div className="flex flex-col items-center justify-center py-8">
          <h1 className="text-2xl font-bold mb-4">Submission Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The submission you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/submissions">
            <Button>Back to Submissions</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout requiredRoles={["checker", "admin"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Review Submission</h1>
            <p className="text-muted-foreground">
              Project: {project.name} - Date: {new Date(entry.date).toLocaleDateString()}
            </p>
          </div>
          
          <Link to="/submissions">
            <Button variant="outline">Back to Submissions</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Progress Photos</CardTitle>
          </CardHeader>
          <CardContent>
            {entry.photos.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No photos available</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {entry.photos.map((photo) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.url}
                      alt="Progress"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs">
                      {new Date(photo.metadata.timestamp).toLocaleString()}
                      <br />
                      Lat: {photo.metadata.location.latitude.toFixed(6)}, 
                      Lon: {photo.metadata.location.longitude.toFixed(6)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {entry.vehicleUsed && (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground">Vehicle ID</p>
                <p className="font-medium">{entry.vehicleUsed.vehicleId}</p>
              </div>
              
              {entry.vehicleUsed.driverId && (
                <div>
                  <p className="text-muted-foreground">Driver ID</p>
                  <p className="font-medium">{entry.vehicleUsed.driverId}</p>
                </div>
              )}
              
              {entry.vehicleUsed.externalDriver && (
                <div>
                  <p className="text-muted-foreground">External Driver</p>
                  <p className="font-medium">
                    {entry.vehicleUsed.externalDriver.name} - {entry.vehicleUsed.externalDriver.licenseNumber}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-muted-foreground mb-2">Start Meter Reading</p>
                  <img
                    src={entry.vehicleUsed.meterReadings.start.photo.url}
                    alt="Start Meter"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="mt-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Time:</span> {' '}
                      {new Date(entry.vehicleUsed.meterReadings.start.photo.metadata.timestamp).toLocaleString()}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Location:</span> {' '}
                      Lat: {entry.vehicleUsed.meterReadings.start.photo.metadata.location.latitude.toFixed(6)},
                      Lon: {entry.vehicleUsed.meterReadings.start.photo.metadata.location.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-muted-foreground mb-2">End Meter Reading</p>
                  <img
                    src={entry.vehicleUsed.meterReadings.end.photo.url}
                    alt="End Meter"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="mt-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Time:</span> {' '}
                      {new Date(entry.vehicleUsed.meterReadings.end.photo.metadata.timestamp).toLocaleString()}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Location:</span> {' '}
                      Lat: {entry.vehicleUsed.meterReadings.end.photo.metadata.location.latitude.toFixed(6)},
                      Lon: {entry.vehicleUsed.meterReadings.end.photo.metadata.location.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Payment Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No payment requests</p>
            ) : (
              <div className="space-y-6">
                {paymentRequests.map((request) => (
                  <div key={request.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">₹{request.amount.toFixed(2)}</h3>
                        <p className="text-sm text-muted-foreground">
                          Purposes: {request.purposes.join(", ")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Requested: {new Date(request.requestedAt).toLocaleString()}
                        </p>
                      </div>
                      
                      {request.status === "pending" ? (
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleRejectPayment(request.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <X className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                          <Button 
                            onClick={() => handleApprovePayment(request.id)}
                            variant="default"
                            size="sm"
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                        </div>
                      ) : (
                        <div className={`px-3 py-1 rounded-full text-sm ${
                          request.status === "approved" ? "bg-green-100 text-green-800" :
                          request.status === "rejected" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </div>
                      )}
                    </div>
                    
                    <p className="mb-3">{request.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {request.photos.map((photo) => (
                        <div key={photo.id} className="relative">
                          <img
                            src={photo.url}
                            alt="Supporting Document"
                            className="w-full h-24 object-cover rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center pt-4">
          <div className="space-x-2">
            <Button
              onClick={() => setShowCorrectionForm(!showCorrectionForm)}
              variant="outline"
            >
              Request Correction
            </Button>
            <Button
              onClick={handleLockEntry}
              disabled={entry.isLocked}
            >
              Lock Entry
            </Button>
          </div>
          <Link to="/submissions">
            <Button variant="ghost">Back to Submissions</Button>
          </Link>
        </div>

        {showCorrectionForm && (
          <Card>
            <CardHeader>
              <CardTitle>Request Correction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Explain what needs to be corrected"
                value={correctionMessage}
                onChange={(e) => setCorrectionMessage(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCorrectionForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitCorrection}>
                  Send Request
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
