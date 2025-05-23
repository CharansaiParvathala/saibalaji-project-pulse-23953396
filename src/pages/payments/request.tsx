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
import { GeoLocation, PaymentPurpose, Project, ProgressEntry, PaymentRequest, Vehicle, Driver, Photo } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

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
  const [purposeCosts, setPurposeCosts] = useState<Record<PaymentPurpose, string>>({} as Record<PaymentPurpose, string>);
  
  // Initialize purposeCosts with available options
  useEffect(() => {
    const initialPurposeCosts: Partial<Record<PaymentPurpose, string>> = {
      food: "",
      fuel: "",
      labour: "",
      vehicle: "",
      water: "",
      other: "",
      salary: "",
      equipment: "",
      materials: "",
      transport: "",
      maintenance: "",
    };
    
    setPurposeCosts(initialPurposeCosts as Record<PaymentPurpose, string>);
  }, []);
  
  // Vehicle related states
  const [vehicleUsed, setVehicleUsed] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [meterStartReading, setMeterStartReading] = useState<Photo | null>(null);
  const [meterEndReading, setMeterEndReading] = useState<Photo | null>(null);

  const availablePurposes: { value: PaymentPurpose; label: string }[] = [
    { value: "food", label: "Food" },
    { value: "fuel", label: "Fuel" },
    { value: "labour", label: "Labour" },
    { value: "vehicle", label: "Vehicle" },
    { value: "water", label: "Water" },
    { value: "other", label: "Other" },
    { value: "salary", label: "Salary" },
    { value: "equipment", label: "Equipment" },
    { value: "materials", label: "Materials" },
    { value: "transport", label: "Transport" },
    { value: "maintenance", label: "Maintenance" },
  ];

  // Calculate total amount from purpose costs
  useEffect(() => {
    const total = Object.values(purposeCosts)
      .filter(cost => cost !== "")
      .reduce((sum, cost) => sum + parseFloat(cost || "0"), 0);
    
    if (total > 0) {
      setAmount(total.toString());
    }
  }, [purposeCosts]);

  useEffect(() => {
    // Load projects for the current user
    if (user) {
      const allProjects = getProjects();
      const userProjects = user.role === "admin" 
        ? allProjects 
        : allProjects.filter(p => p.createdBy === user.id);
      
      setProjects(userProjects);
      
      // Load vehicles and drivers from Supabase
      fetchVehiclesAndDrivers();
    }
  }, [user]);
  
  const fetchVehiclesAndDrivers = async () => {
    try {
      // Fetch vehicles
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*');
      
      if (vehiclesError) {
        console.error("Error fetching vehicles:", vehiclesError);
        toast({
          title: "Error",
          description: "Failed to load vehicles",
          variant: "destructive",
        });
      } else if (vehiclesData) {
        // Map database fields to our Vehicle interface
        const mappedVehicles: Vehicle[] = vehiclesData.map((v) => ({
          id: v.id,
          model: v.model,
          manufacturer: v.model.split(' ')[0] || 'Unknown',  // Extract manufacturer from model as fallback
          vehicle_number: v.registration_number,
          registration_number: v.registration_number,
          vehicle_type: (v.type as VehicleType) || 'truck',
          is_active: true,
          created_at: v.created_at || new Date().toISOString(),
          created_by: 'system',
          pollution_certificate: v.pollution_certificate,
          fitness_certificate: v.fitness_certificate
        }));
        
        setVehicles(mappedVehicles);
      }
      
      // Fetch drivers
      const { data: driversData, error: driversError } = await supabase
        .from('drivers')
        .select('*');
      
      if (driversError) {
        console.error("Error fetching drivers:", driversError);
        toast({
          title: "Error",
          description: "Failed to load drivers",
          variant: "destructive",
        });
      } else if (driversData) {
        // Map database fields to our Driver interface
        const mappedDrivers: Driver[] = driversData.map((d) => ({
          id: d.id,
          name: d.name,
          licenseNumber: d.license_number,
          contactNumber: d.type || 'Unknown', // Using type field as contactNumber as fallback
          createdAt: d.created_at || new Date().toISOString(),
          license_number: d.license_number // For backward compatibility
        }));
        
        setDrivers(mappedDrivers);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    }
  };

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

  const capturePhoto = async (event: React.ChangeEvent<HTMLInputElement>, isMeterReading: boolean = false, isStartReading: boolean = true) => {
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
        
        if (isMeterReading) {
          if (isStartReading) {
            setMeterStartReading(newPhoto);
          } else {
            setMeterEndReading(newPhoto);
          }
        } else {
          setPhotos((prev) => [...prev, newPhoto]);
        }
        
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
      // Clear the cost when purpose is deselected
      const updatedCosts = { ...purposeCosts };
      updatedCosts[purpose] = "";
      setPurposeCosts(updatedCosts);
    } else {
      setPurposes([...purposes, purpose]);
    }
  };

  const handleCostChange = (purpose: PaymentPurpose, value: string) => {
    const updatedCosts = { ...purposeCosts };
    updatedCosts[purpose] = value;
    setPurposeCosts(updatedCosts);
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
    
    // Validate that all selected purposes have costs
    const invalidPurposes = purposes.filter(
      purpose => !purposeCosts[purpose] || isNaN(parseFloat(purposeCosts[purpose])) || parseFloat(purposeCosts[purpose]) <= 0
    );
    
    if (invalidPurposes.length > 0) {
      toast({
        title: "Error",
        description: "All selected purposes must have valid costs",
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
    
    // Vehicle validation
    if (vehicleUsed) {
      if (!selectedVehicle) {
        toast({
          title: "Error",
          description: "You must select a vehicle",
          variant: "destructive",
        });
        return;
      }
      
      if (!selectedDriver) {
        toast({
          title: "Error",
          description: "You must select a driver",
          variant: "destructive",
        });
        return;
      }
      
      if (!meterStartReading) {
        toast({
          title: "Error",
          description: "You must add meter start reading photo",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      setLoading(true);
      
      const projectId = selectedProject;
      const progressId = selectedEntry;
      
      // Convert purpose costs to numbers
      const parsedPurposeCosts: Record<PaymentPurpose, number> = {} as Record<PaymentPurpose, number>;
      purposes.forEach(purpose => {
        parsedPurposeCosts[purpose] = parseFloat(purposeCosts[purpose]);
      });
      
      // Get current location
      let currentLocation: GeoLocation = { latitude: 0, longitude: 0, accuracy: 0 };
      try {
        currentLocation = await getCurrentLocation();
      } catch (error) {
        console.error("Error getting location:", error);
      }
      
      // Create a new payment request ID
      const newRequestId = generateId();

      // Prepare vehicle-related data
      const vehicleData = vehicleUsed ? {
        vehicle_used: true,
        vehicle_id: selectedVehicle,
        driver_id: selectedDriver,
        meter_start_reading: meterStartReading,
        meter_end_reading: meterEndReading
      } : {
        vehicle_used: false
      };
      
      // Create payment request object with primary purpose field for compatibility
      const paymentRequest: PaymentRequest = {
        id: newRequestId,
        projectId,
        amount: parseFloat(amount),
        description,
        purpose: purposes.length > 0 ? purposes[0] : "other", // Set first purpose as primary
        purposes,
        purposeCosts: parsedPurposeCosts,
        photos,
        status: "pending",
        requestedBy: user?.id || "Anonymous",
        requestedAt: new Date().toISOString(),
        ...vehicleData
      };

      let response;
      // Insert payment request to Supabase
      try {
        // Try to insert to Supabase
        response = await supabase
          .from('payment_requests')
          .insert([{
            project_id: projectId,
            amount: parseFloat(amount),
            description,
            purposes,
            purpose_costs: parsedPurposeCosts,
            photos,
            requested_by: user?.id,
            ...vehicleData
          }]);
        
        if (response.error) {
          console.error("Supabase error, falling back to local storage:", response.error);
          // If Supabase insertion fails, fall back to local storage
          savePaymentRequest(paymentRequest);
        }
      } catch (error) {
        console.error("Error with Supabase, using local storage:", error);
        // Fall back to local storage
        savePaymentRequest(paymentRequest);
      }
      
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
      
      // Navigate back to the dashboard
      navigate("/dashboard");
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
              
              {purposes.length > 0 && (
                <div className="space-y-4 mt-4">
                  <Label>Cost for each purpose</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {purposes.map((purpose) => (
                      <div key={purpose} className="space-y-2">
                        <Label htmlFor={`cost-${purpose}`}>{purpose.charAt(0).toUpperCase() + purpose.slice(1)} Cost (₹)</Label>
                        <Input
                          id={`cost-${purpose}`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={purposeCosts[purpose]}
                          onChange={(e) => handleCostChange(purpose, e.target.value)}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="amount">Total Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  readOnly={purposes.length > 0}
                  className={purposes.length > 0 ? "bg-gray-100" : ""}
                />
                {purposes.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Total is calculated automatically from the purpose costs above
                  </p>
                )}
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
              
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vehicleUsed" 
                    checked={vehicleUsed} 
                    onCheckedChange={(checked) => setVehicleUsed(checked as boolean)}
                  />
                  <Label htmlFor="vehicleUsed" className="font-medium">This work uses vehicle</Label>
                </div>
              </div>
              
              {vehicleUsed && (
                <div className="space-y-4 border-l-2 pl-4 mt-2 border-primary/20">
                  <div>
                    <Label htmlFor="vehicle">Select Vehicle</Label>
                    <Select
                      value={selectedVehicle}
                      onValueChange={setSelectedVehicle}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.model} ({vehicle.registration_number})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="driver">Select Driver</Label>
                    <Select
                      value={selectedDriver}
                      onValueChange={setSelectedDriver}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name} ({driver.licenseNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="meterStart">Meter Start Reading (Photo)</Label>
                    <Input
                      id="meterStart"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => capturePhoto(e, true, true)}
                      disabled={loading}
                      className="mt-1"
                    />
                    {meterStartReading && (
                      <div className="mt-2">
                        <img
                          src={meterStartReading.url}
                          alt="Meter Start Reading"
                          className="w-full max-h-40 object-contain rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="meterEnd">Meter End Reading (Photo) - Optional</Label>
                    <p className="text-xs text-muted-foreground mb-1">
                      You can add this later after work completion
                    </p>
                    <Input
                      id="meterEnd"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => capturePhoto(e, true, false)}
                      disabled={loading}
                      className="mt-1"
                    />
                    {meterEndReading && (
                      <div className="mt-2">
                        <img
                          src={meterEndReading.url}
                          alt="Meter End Reading"
                          className="w-full max-h-40 object-contain rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                  onChange={(e) => capturePhoto(e)}
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
