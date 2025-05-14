import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { generateId, getProject, getVehicles, getDrivers, saveProgressEntry } from "@/lib/storage";
import { getCurrentLocation } from "@/lib/geolocation";
import { GeoLocation, Photo, Vehicle, Driver, MeterReading } from "@/types";

export default function AddProgress() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [driverType, setDriverType] = useState<"internal" | "external">("internal");
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [externalDriverName, setExternalDriverName] = useState("");
  const [externalDriverLicense, setExternalDriverLicense] = useState("");
  const [startMeterReading, setStartMeterReading] = useState<MeterReading | null>(null);
  const [endMeterReading, setEndMeterReading] = useState<MeterReading | null>(null);
  const [loading, setLoading] = useState(false);
  const [useVehicle, setUseVehicle] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const projectData = getProject(projectId);
    if (projectData) {
      setProject(projectData);
    } else {
      toast({
        title: "Error",
        description: "Project not found",
        variant: "destructive",
      });
      navigate("/projects");
    }

    // Load vehicles and drivers
    setVehicles(getVehicles());
    setDrivers(getDrivers());
  }, [projectId, navigate, toast]);

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

  const captureMeterReading = async (type: "start" | "end", event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !selectedVehicle) return;
    
    try {
      setLoading(true);
      const file = event.target.files[0];
      const readingId = generateId();
      
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
        const photoData: Photo = {
          id: generateId(),
          url: reader.result as string,
          metadata: {
            timestamp: new Date().toISOString(),
            location: position,
          },
        };
        
        const reading: MeterReading = {
          id: readingId,
          vehicleId: selectedVehicle,
          reading: 0, // This should be input by the user in a real app
          type: type,
          photo: photoData,
        };
        
        if (type === "start") {
          setStartMeterReading(reading);
        } else {
          setEndMeterReading(reading);
        }
        setLoading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error capturing meter reading:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to capture meter reading",
        variant: "destructive",
      });
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
    
    if (photos.length === 0) {
      toast({
        title: "Error",
        description: "You must add at least one photo",
        variant: "destructive",
      });
      return;
    }
    
    if (useVehicle) {
      if (!selectedVehicle) {
        toast({
          title: "Error",
          description: "You must select a vehicle",
          variant: "destructive",
        });
        return;
      }
      
      if (!startMeterReading || !endMeterReading) {
        toast({
          title: "Error",
          description: "You must provide both start and end meter readings",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      setLoading(true);
      
      let vehicleData = undefined;
      if (useVehicle) {
        vehicleData = {
          vehicleId: selectedVehicle,
          driverId: driverType === "internal" ? selectedDriver : undefined,
          externalDriver: driverType === "external" ? {
            name: externalDriverName,
            licenseNumber: externalDriverLicense,
          } : undefined,
          meterReadings: {
            start: startMeterReading!,
            end: endMeterReading!,
          },
        };
      }
      
      const progressEntry = {
        id: generateId(),
        projectId: projectId!,
        date: date,
        photos: photos,
        vehicleUsed: vehicleData,
        paymentRequests: [],
        submittedBy: user.id,
        submittedAt: new Date().toISOString(),
        status: "draft" as const,
        isLocked: false,
      };
      
      saveProgressEntry(progressEntry);
      
      toast({
        title: "Success",
        description: "Progress entry saved",
      });
      
      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error("Error saving progress:", error);
      toast({
        title: "Error",
        description: "Failed to save progress entry",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (!project) {
    return (
      <Layout>
        <div className="flex justify-center py-8">
          <p>Loading project details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Add Progress</h1>
        <p className="text-muted-foreground">
          Project: {project.name}
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="photos">Add Photos</Label>
                <Input
                  id="photos"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={capturePhoto}
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Take photos of the work progress
                </p>
              </div>

              {photos.length > 0 && (
                <div className="mt-4">
                  <Label>Photo Preview</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative">
                        <img
                          src={photo.url}
                          alt="Progress"
                          className="w-full h-40 object-cover rounded-md"
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
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useVehicle"
                  checked={useVehicle}
                  onChange={(e) => setUseVehicle(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="useVehicle">This work used a vehicle</Label>
              </div>

              {useVehicle && (
                <div className="space-y-4">
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
                            {vehicle.model} - {vehicle.registrationNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Driver Type</Label>
                    <div className="flex space-x-4 mt-1">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="internalDriver"
                          value="internal"
                          checked={driverType === "internal"}
                          onChange={() => setDriverType("internal")}
                        />
                        <Label htmlFor="internalDriver">Internal Driver</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="externalDriver"
                          value="external"
                          checked={driverType === "external"}
                          onChange={() => setDriverType("external")}
                        />
                        <Label htmlFor="externalDriver">External Driver</Label>
                      </div>
                    </div>
                  </div>

                  {driverType === "internal" ? (
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
                              {driver.name} - {driver.licenseNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="externalDriverName">External Driver Name</Label>
                        <Input
                          id="externalDriverName"
                          value={externalDriverName}
                          onChange={(e) => setExternalDriverName(e.target.value)}
                          required={driverType === "external"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="externalDriverLicense">Driver License Number</Label>
                        <Input
                          id="externalDriverLicense"
                          value={externalDriverLicense}
                          onChange={(e) => setExternalDriverLicense(e.target.value)}
                          required={driverType === "external"}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="startMeter">Start Meter Reading</Label>
                    <Input
                      id="startMeter"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => captureMeterReading("start", e)}
                      disabled={loading || !selectedVehicle}
                    />
                    {startMeterReading && (
                      <div className="mt-2">
                        <img
                          src={startMeterReading.photo.url}
                          alt="Start Meter"
                          className="w-40 h-40 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="endMeter">End Meter Reading</Label>
                    <Input
                      id="endMeter"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => captureMeterReading("end", e)}
                      disabled={loading || !selectedVehicle || !startMeterReading}
                    />
                    {endMeterReading && (
                      <div className="mt-2">
                        <img
                          src={endMeterReading.photo.url}
                          alt="End Meter"
                          className="w-40 h-40 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate(`/projects/${projectId}`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Progress"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
