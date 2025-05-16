
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { getVehicles } from "@/lib/storage";
import { generateDemoData } from "@/lib/demoData";
import { Vehicle } from "@/types";

export default function VehicleRegistry() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate demo data if it doesn't exist
    generateDemoData();
    
    // Load vehicles
    setVehicles(getVehicles());
    setLoading(false);
  }, []);

  return (
    <Layout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Vehicle Registry</h1>
          <Link to="/vehicles/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <p>Loading vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-4">No vehicles in the registry</p>
              <Link to="/vehicles/add">
                <Button>Add Your First Vehicle</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => {
              const isPollutionExpired = vehicle.pollutionCertificate ? 
                new Date(vehicle.pollutionCertificate.expiryDate) < new Date() : false;
              const isFitnessExpired = vehicle.fitnessCertificate ? 
                new Date(vehicle.fitnessCertificate.expiryDate) < new Date() : false;
              
              return (
                <Card key={vehicle.id}>
                  <CardHeader>
                    <CardTitle>{vehicle.model}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Registration:</strong> {vehicle.registrationNumber}</p>
                      <p>
                        <strong>Pollution Certificate:</strong> 
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${isPollutionExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {isPollutionExpired ? 'Expired' : 'Valid'}
                        </span>
                      </p>
                      <p>
                        <strong>Fitness Certificate:</strong>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${isFitnessExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {isFitnessExpired ? 'Expired' : 'Valid'}
                        </span>
                      </p>
                      
                      <div className="flex space-x-2 pt-4">
                        <Link to={`/vehicles/${vehicle.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </Link>
                        <Link to={`/vehicles/edit/${vehicle.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
