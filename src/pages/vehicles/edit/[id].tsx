import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { getVehicle, updateVehicle } from '@/lib/storage';
import { Separator } from '@/components/ui/separator';
import { VehicleType } from '@/types';

export default function EditVehicle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [model, setModel] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [type, setType] = useState<"truck" | "car" | "bike">("truck");
  const [pollutionNumber, setPollutionNumber] = useState("");
  const [pollutionExpiry, setPollutionExpiry] = useState("");
  const [fitnessNumber, setFitnessNumber] = useState("");
  const [fitnessExpiry, setFitnessExpiry] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("truck");
  
  useEffect(() => {
    if (!id) return;
    
    const vehicleData = getVehicle(id);
    if (vehicleData) {
      setVehicle(vehicleData);
      setModel(vehicleData.model);
      setRegistrationNumber(vehicleData.registrationNumber);
      setType(vehicleData.type);
      
      if (vehicleData.pollutionCertificate) {
        setPollutionNumber(vehicleData.pollutionCertificate.number);
        
        // Format date for input type="date"
        const pollutionDate = new Date(vehicleData.pollutionCertificate.expiryDate);
        setPollutionExpiry(pollutionDate.toISOString().split('T')[0]);
      }
      
      if (vehicleData.fitnessCertificate) {
        setFitnessNumber(vehicleData.fitnessCertificate.number);
        
        const fitnessDate = new Date(vehicleData.fitnessCertificate.expiryDate);
        setFitnessExpiry(fitnessDate.toISOString().split('T')[0]);
      }
    }
    setLoading(false);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !vehicle) return;
    
    setSaving(true);
    
    try {
      // Create updated vehicle object
      const updatedVehicle: Vehicle = {
        ...vehicle,
        model,
        registrationNumber,
        type,
        pollutionCertificate: {
          number: pollutionNumber,
          expiryDate: new Date(pollutionExpiry).toISOString()
        },
        fitnessCertificate: {
          number: fitnessNumber,
          expiryDate: new Date(fitnessExpiry).toISOString()
        }
      };
      
      updateVehicle(updatedVehicle);
      
      toast.success("Vehicle updated successfully");
      navigate(`/vehicles/${id}`);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error("Failed to update vehicle");
      setSaving(false);
    }
  };

  const handleSelectChange = (value: VehicleType) => {
    setVehicleType(value);
  };

  if (loading) {
    return (
      <Layout requiredRoles={["admin"]}>
        <div className="flex justify-center py-8">
          <p>Loading vehicle details...</p>
        </div>
      </Layout>
    );
  }

  if (!vehicle) {
    return (
      <Layout requiredRoles={["admin"]}>
        <div className="flex flex-col items-center justify-center py-8">
          <h1 className="text-2xl font-bold mb-4">Vehicle Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The vehicle you're trying to edit doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/vehicles")}>
            Back to Vehicles
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Edit Vehicle</h1>
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="model">Vehicle Model</Label>
                  <Input
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Pollution Certificate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="pollutionNumber">Certificate Number</Label>
                  <Input
                    id="pollutionNumber"
                    value={pollutionNumber}
                    onChange={(e) => setPollutionNumber(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="pollutionExpiry">Expiry Date</Label>
                  <Input
                    id="pollutionExpiry"
                    type="date"
                    value={pollutionExpiry}
                    onChange={(e) => setPollutionExpiry(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Fitness Certificate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="fitnessNumber">Certificate Number</Label>
                  <Input
                    id="fitnessNumber"
                    value={fitnessNumber}
                    onChange={(e) => setFitnessNumber(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="fitnessExpiry">Expiry Date</Label>
                  <Input
                    id="fitnessExpiry"
                    type="date"
                    value={fitnessExpiry}
                    onChange={(e) => setFitnessExpiry(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Vehicle Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate(`/vehicles/${id}`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
