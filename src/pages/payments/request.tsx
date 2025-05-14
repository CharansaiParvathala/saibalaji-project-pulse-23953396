import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { generateId, getProjects, getProgressEntries, savePaymentRequest, updateProgressEntry } from "@/lib/storage";
import { getCurrentLocation } from "@/lib/geolocation";
import { GeoLocation, Photo, PaymentPurpose, Project, ProgressEntry, PaymentRequest } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

export default function RequestPayment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState("");
  const [purposes, setPurposes] = useState<PaymentPurpose[]>([]);

  const availablePurposes: { value: PaymentPurpose; label: string }[] = [
    { value: "food", label: "Food" },
    { value: "fuel", label: "Fuel" },
    { value: "labour", label: "Labour" },
    { value: "vehicle", label: "Vehicle" },
    { value: "water", label: "Water" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    // Load projects for the current user
    if (user) {
      const allProjects = getProjects();
      const userProjects = user.role === "admin" 
        ? allProjects 
        : allProjects.filter(p => p.createdBy === user.id);
      
      setProjects(userProjects);
    }
  }, [user]);

  useEffect(() => {
    // Load progress entries for the selected project
    if (selectedProject) {
      const entries = getProgressEntries().filter(
        entry => entry.projectId === selectedProject && entry.status !== "locked"
      );
      setProgressEntries(entries);
    } else {
      setProgressEntries([]);
    }
    setSelectedEntry("");
  }, [selectedProject]);

  const capturePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    try {
      setLoading(true);
      const file = event.target.files[0];
      const photoId = generateId();
      
      // Get position
      let position: GeoLocation = { latitude: 0, longitude: 0, accuracy: 0 };
      try {
        position = await getCurrentLocation();
      } catch (error) {
        console.error("Error getting location:", error);
        toast({
          title: "Location Error",
          description: "Couldn't get your location. Using default values.",
          variant: "destructive",
        });
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto: Photo = {
          id: photoId,
          url: reader.result as string,
          metadata: {
            timestamp: new Date().toISOString(),
            location: position,
          },
        };
        
        setPhotos((prev) => [...prev, newPhoto]);
        setLoading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error capturing photo:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to capture photo",
        variant: "destructive",
      });
    }
  };

  const handlePurposeToggle = (purpose: PaymentPurpose) => {
    if (purposes.includes(purpose)) {
      setPurposes(purposes.filter(p => p !== purpose));
    } else {
      setPurposes([...purposes, purpose]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedProject) {
      toast({
        title: "Error",
        description: "You must select a project",
        variant: "destructive",
      });
      return;
    }

    if (!selectedEntry) {
      toast({
        title: "Error",
        description: "You must select a progress entry",
        variant: "destructive",
      });
      return;
    }
    
    if (purposes.length === 0) {
      toast({
        title: "Error",
        description: "You must select at least one payment purpose",
        variant: "destructive",
      });
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "You must enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    if (photos.length === 0) {
      toast({
        title: "Error",
        description: "You must add at least one supporting image",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const projectId = selectedProject;
      const progressId = selectedEntry;
      // Get current location
      let currentLocation: GeoLocation = { latitude: 0, longitude: 0, accuracy: 0 };
      try {
        currentLocation = await getCurrentLocation();
      } catch (error) {
        console.error("Error getting location:", error);
      }
      
      // Create a new payment request ID
      const newRequestId = generateId();
      
      const paymentRequest: PaymentRequest = {
        id: newRequestId,
        projectId,
        amount: parseFloat(amount),
        description,
        purposes,
        photos,
        status: "pending",
        requestedBy: user?.id || "Anonymous",
        requestedAt: new Date().toISOString(),
      };
      
      // Save the payment request
      savePaymentRequest(paymentRequest);
      
      // Update the progress entry with this payment request ID
      if (progressId) {
        const progressEntries = getProgressEntries();
        const entry = progressEntries.find(entry => entry.id === progressId);
        
        if (entry) {
          const updatedEntry: ProgressEntry = {
            ...entry,
            paymentRequests: [...(entry.paymentRequests || []), paymentRequest.id]
          };
          
          updateProgressEntry(updatedEntry);
        }
      }
      
      // Show success message
      toast({
        title: "Payment request submitted",
        description: "Your request has been submitted for approval."
      });
      
      // Navigate back to the submissions page
      navigate("/submissions");
    } catch (error) {
      console.error("Error submitting payment request:", error);
      toast({
        title: "Error",
        description: "Failed to submit payment request",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <Layout requiredRoles={["leader", "admin"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Request Payment</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="project">Select Project</Label>
                <Select
                  value={selectedProject}
                  onValueChange={setSelectedProject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedProject && (
                <div>
                  <Label htmlFor="entry">Select Progress Entry</Label>
                  <Select
                    value={selectedEntry}
                    onValueChange={setSelectedEntry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a progress entry" />
                    </SelectTrigger>
                    <SelectContent>
                      {progressEntries.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No available entries
                        </SelectItem>
                      ) : (
                        progressEntries.map((entry) => (
                          <SelectItem key={entry.id} value={entry.id}>
                            {new Date(entry.date).toLocaleDateString()}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Payment Purpose (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {availablePurposes.map((purpose) => (
                    <label
                      key={purpose.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={purposes.includes(purpose.value)}
                        onCheckedChange={() => handlePurposeToggle(purpose.value)}
                      />
                      <span>{purpose.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  placeholder="Provide details about this payment request"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supporting Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="photos">Add Supporting Images</Label>
                <Input
                  id="photos"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={capturePhoto}
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Add receipts or other supporting documentation
                </p>
              </div>

              {photos.length > 0 && (
                <div className="mt-4">
                  <Label>Image Preview</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative">
                        <img
                          src={photo.url}
                          alt="Supporting Image"
                          className="w-full h-40 object-cover rounded-md"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs">
                          {new Date(photo.metadata.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
