import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { generateId, saveVehicle } from '@/lib/storage';
import { VehicleType } from '@/types';

export default function AddVehiclePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType | ''>('');
  const [yearManufactured, setYearManufactured] = useState<number | undefined>(undefined);
  const [lastServiceDate, setLastServiceDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vehicleNumber || !manufacturer || !model || !vehicleType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newVehicleId = generateId();
      
      // For local storage
      const newVehicle = {
        id: newVehicleId,
        vehicle_number: vehicleNumber,
        registration_number: vehicleNumber, // For backward compatibility
        manufacturer,
        model,
        vehicle_type: vehicleType,
        year_manufactured: yearManufactured || new Date().getFullYear(),
        last_service_date: lastServiceDate || '',
        is_active: true,
        created_at: new Date().toISOString(),
        created_by: user?.id || ''
      };
      
      // Save to local storage
      saveVehicle(newVehicle);
      
      // Also save to Supabase
      const { error } = await supabase.from('vehicles').insert([{
        id: newVehicleId,
        registration_number: vehicleNumber,
        model,
        manufacturer,
        type: vehicleType,
        additional_details: {
          year_manufactured: yearManufactured || new Date().getFullYear(),
          last_service_date: lastServiceDate || null
        },
        created_at: new Date().toISOString()
      }]);
      
      if (error) throw error;
      
      toast({
        title: "Vehicle Added",
        description: "The vehicle has been added successfully.",
      });
      
      navigate('/vehicles');
    } catch (error: any) {
      console.error("Error adding vehicle:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout requiredRoles={["admin", "owner"]}>
      <div className="container max-w-2xl mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Add Vehicle</CardTitle>
            <CardDescription>Add a new vehicle to the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                <Input
                  type="text"
                  id="vehicleNumber"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  type="text"
                  id="manufacturer"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  type="text"
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select onValueChange={(value) => setVehicleType(value as VehicleType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bike">Bike</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="yearManufactured">Year Manufactured</Label>
                <Input
                  type="number"
                  id="yearManufactured"
                  value={yearManufactured}
                  onChange={(e) => setYearManufactured(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="lastServiceDate">Last Service Date</Label>
                <Input
                  type="date"
                  id="lastServiceDate"
                  value={lastServiceDate}
                  onChange={(e) => setLastServiceDate(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Vehicle"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate('/vehicles')}>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
