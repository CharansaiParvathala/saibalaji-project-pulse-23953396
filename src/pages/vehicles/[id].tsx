import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Calendar, FileText, Edit } from "lucide-react";
import { getVehicle } from "@/lib/storage";
import { Vehicle } from "@/types";
import { useAuth } from "@/hooks/useAuth";

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!id) return;
    
    const vehicleData = getVehicle(id);
    if (vehicleData) {
      setVehicle(vehicleData);
    }
    setLoading(false);
  }, [id]);

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
            The vehicle you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/vehicles">
            <Button>Back to Vehicles</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isPollutionExpired = vehicle.pollutionCertificate ? 
    new Date(vehicle.pollutionCertificate.expiryDate) < new Date() : false;
  const isFitnessExpired = vehicle.fitnessCertificate ? 
    new Date(vehicle.fitnessCertificate.expiryDate) < new Date() : false;
  
  const pollutionExpiryDate = vehicle.pollutionCertificate ? 
    new Date(vehicle.pollutionCertificate.expiryDate) : new Date();
  const fitnessExpiryDate = vehicle.fitnessCertificate ? 
    new Date(vehicle.fitnessCertificate.expiryDate) : new Date();
  
  const daysUntilPollutionExpiry = Math.ceil((pollutionExpiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilFitnessExpiry = Math.ceil((fitnessExpiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Layout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{vehicle.model}</h1>
            <p className="text-muted-foreground">
              Registration: {vehicle.registration_number}
            </p>
          </div>
          
          {user && user.role === "admin" && (
            <Link to={`/vehicles/edit/${vehicle.id}`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Vehicle
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="bg-primary/5">
              <div className="flex items-center space-x-2">
                <Truck className="h-6 w-6" />
                <CardTitle>Vehicle Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Model</p>
                  <p className="text-xl font-medium">{vehicle.model}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registration Number</p>
                  <p className="text-xl font-medium">{vehicle.registration_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="text-xl font-medium">{vehicle.type}</p>
                </div>
                {vehicle.additional_details && Object.entries(vehicle.additional_details).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-muted-foreground">{key}</p>
                    <p className="text-xl font-medium">{String(value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-primary/5">
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6" />
                <CardTitle>Certificate Expiry</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {vehicle.pollutionCertificate && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-muted-foreground">Pollution Certificate</p>
                      <div className={`px-2 py-1 rounded text-xs ${isPollutionExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {isPollutionExpired ? 'Expired' : daysUntilPollutionExpiry <= 30 ? 'Expiring Soon' : 'Active'}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p><strong>Certificate Number:</strong> {vehicle.pollutionCertificate.number}</p>
                      <p><strong>Expiry Date:</strong> {new Date(vehicle.pollutionCertificate.expiryDate).toLocaleDateString()}</p>
                      {!isPollutionExpired && (
                        <p className="text-sm text-muted-foreground">
                          {daysUntilPollutionExpiry} days remaining
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {vehicle.fitnessCertificate && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-muted-foreground">Fitness Certificate</p>
                      <div className={`px-2 py-1 rounded text-xs ${isFitnessExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {isFitnessExpired ? 'Expired' : daysUntilFitnessExpiry <= 30 ? 'Expiring Soon' : 'Active'}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p><strong>Certificate Number:</strong> {vehicle.fitnessCertificate.number}</p>
                      <p><strong>Expiry Date:</strong> {new Date(vehicle.fitnessCertificate.expiryDate).toLocaleDateString()}</p>
                      {!isFitnessExpired && (
                        <p className="text-sm text-muted-foreground">
                          {daysUntilFitnessExpiry} days remaining
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="bg-primary/5">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <CardTitle>Maintenance Records</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="py-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No maintenance records available yet</p>
              {user && user.role === "admin" && (
                <Button variant="outline" className="mt-4">
                  Add Maintenance Record
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Link to="/vehicles">
            <Button variant="outline">Back to All Vehicles</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
