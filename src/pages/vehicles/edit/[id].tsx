
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getVehicle, updateVehicle } from '@/lib/storage';
import { VehicleType, Vehicle } from '@/types';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('truck');
  const [yearManufactured, setYearManufactured] = useState<number | undefined>();
  const [lastServiceDate, setLastServiceDate] = useState<string | null | undefined>('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchVehicle = async () => {
        try {
          const vehicleData = await getVehicle(id);
          if (vehicleData) {
            setManufacturer(vehicleData.manufacturer);
            setModel(vehicleData.model);
            setVehicleNumber(vehicleData.vehicle_number);
            setVehicleType(vehicleData.vehicle_type as VehicleType || vehicleData.type as VehicleType);
            setYearManufactured(vehicleData.year_manufactured);
            setLastServiceDate(vehicleData.last_service_date);
            setAdditionalDetails(vehicleData.additional_details || '');
            setIsActive(vehicleData.is_active);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching vehicle:", error);
          toast({
            title: "Error",
            description: "Failed to load vehicle details",
            variant: "destructive"
          });
          setLoading(false);
        }
      };
      
      fetchVehicle();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;
    
    try {
      setSubmitting(true);
      
      const updatedVehicle: Vehicle = {
        id,
        manufacturer,
        model,
        vehicle_number: vehicleNumber,
        vehicle_type: vehicleType,
        year_manufactured: yearManufactured,
        last_service_date: lastServiceDate,
        is_active: isActive,
        created_at: new Date().toISOString(),
        created_by: user.id,
        additional_details: additionalDetails || {}
      };
      
      await updateVehicle(id, updatedVehicle);
      
      toast({
        title: "Vehicle Updated",
        description: "Vehicle details have been updated successfully"
      });
      
      navigate('/vehicles');
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast({
        title: "Error",
        description: "Failed to update vehicle details",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout requiredRoles={['admin']}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Vehicle Details</h1>
        <p className="text-muted-foreground">Update information for this vehicle</p>
      </div>
      
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-soft p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Number */}
            <div>
              <Label htmlFor="vehicleNumber">Registration Number</Label>
              <Input 
                id="vehicleNumber"
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="Enter vehicle registration number"
                required
              />
            </div>
            
            {/* Vehicle Type */}
            <div>
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <select
                id="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                className="w-full p-2 border border-border rounded-md"
                required
              >
                <option value="truck">Truck</option>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
              </select>
            </div>
            
            {/* Manufacturer */}
            <div>
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input 
                id="manufacturer"
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="Enter manufacturer name"
                required
              />
            </div>
            
            {/* Model */}
            <div>
              <Label htmlFor="model">Model</Label>
              <Input 
                id="model"
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Enter model name"
                required
              />
            </div>
            
            {/* Year Manufactured */}
            <div>
              <Label htmlFor="yearManufactured">Year Manufactured</Label>
              <Input 
                id="yearManufactured"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={yearManufactured || ''}
                onChange={(e) => setYearManufactured(Number(e.target.value) || undefined)}
                placeholder="Enter year manufactured"
              />
            </div>
            
            {/* Last Service Date */}
            <div>
              <Label htmlFor="lastServiceDate">Last Service Date</Label>
              <Input 
                id="lastServiceDate"
                type="date"
                value={lastServiceDate || ''}
                onChange={(e) => setLastServiceDate(e.target.value)}
              />
            </div>
          </div>
          
          {/* Additional Details */}
          <div>
            <Label htmlFor="additionalDetails">Additional Details</Label>
            <Textarea 
              id="additionalDetails"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Enter any additional details about the vehicle"
              rows={4}
            />
          </div>
          
          {/* Is Active */}
          <div className="flex items-center">
            <input 
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <Label htmlFor="isActive" className="ml-2">Active</Label>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/vehicles')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Vehicle'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditVehicle;
