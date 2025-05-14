
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { getVehicles } from "@/lib/storage";
import { Vehicle } from "@/types";

export default function VehicleRegistry() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader>
                  <CardTitle>{vehicle.model}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Registration:</strong> {vehicle.registrationNumber}</p>
                    <p><strong>Pollution Certificate:</strong> {vehicle.pollutionCertificate.number}</p>
                    <p><strong>Pollution Expires:</strong> {new Date(vehicle.pollutionCertificate.expiryDate).toLocaleDateString()}</p>
                    <p><strong>Fitness Certificate:</strong> {vehicle.fitnessCertificate.number}</p>
                    <p><strong>Fitness Expires:</strong> {new Date(vehicle.fitnessCertificate.expiryDate).toLocaleDateString()}</p>
                    
                    <div className="pt-4">
                      <Link to={`/vehicles/${vehicle.id}`}>
                        <Button variant="outline" className="w-full">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
