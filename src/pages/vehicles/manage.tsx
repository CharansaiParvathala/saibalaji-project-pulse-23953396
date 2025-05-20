
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash, Plus, Search, AlertCircle, FileText } from "lucide-react";

interface Vehicle {
  id: string;
  model: string;
  registration_number: string;
  type: string;
  pollution_certificate: any;
  fitness_certificate: any;
  additional_details: any;
  created_at: string;
}

export default function VehiclesManagePage() {
  const { toast } = useToast();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  
  // Form states
  const [model, setModel] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("light");
  
  useEffect(() => {
    fetchVehicles();
  }, []);
  
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setVehicles(data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast({
        title: "Error fetching vehicles",
        description: "There was a problem loading the vehicles data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddVehicle = async () => {
    if (!model || !registrationNumber || !vehicleType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([
          {
            model,
            registration_number: registrationNumber,
            type: vehicleType,
            additional_details: {}
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Vehicle Added",
        description: `${model} (${registrationNumber}) has been added successfully.`,
      });
      
      fetchVehicles();
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.error("Error adding vehicle:", error);
      toast({
        title: "Error",
        description: error.message || "There was a problem adding the vehicle.",
        variant: "destructive",
      });
    }
  };
  
  const handleEditVehicle = async () => {
    if (!currentVehicle || !model || !registrationNumber || !vehicleType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          model,
          registration_number: registrationNumber,
          type: vehicleType
        })
        .eq('id', currentVehicle.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Vehicle Updated",
        description: `${model} (${registrationNumber}) has been updated successfully.`,
      });
      
      fetchVehicles();
      resetForm();
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating vehicle:", error);
      toast({
        title: "Error",
        description: error.message || "There was a problem updating the vehicle.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteVehicle = async () => {
    if (!currentVehicle) return;
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', currentVehicle.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Vehicle Deleted",
        description: `${currentVehicle.model} (${currentVehicle.registration_number}) has been deleted successfully.`,
      });
      
      fetchVehicles();
      setIsDeleteDialogOpen(false);
      setCurrentVehicle(null);
    } catch (error: any) {
      console.error("Error deleting vehicle:", error);
      toast({
        title: "Error",
        description: error.message || "There was a problem deleting the vehicle.",
        variant: "destructive",
      });
    }
  };
  
  const openEditDialog = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setModel(vehicle.model);
    setRegistrationNumber(vehicle.registration_number);
    setVehicleType(vehicle.type);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };
  
  const resetForm = () => {
    setModel("");
    setRegistrationNumber("");
    setVehicleType("light");
    setCurrentVehicle(null);
  };
  
  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter(
    vehicle =>
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.registration_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Layout requiredRoles={["admin", "owner"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Vehicles Management</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Vehicle
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Vehicles</CardTitle>
            <CardDescription>
              Manage your registered vehicles
            </CardDescription>
            
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <p>Loading vehicles...</p>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">No vehicles found</p>
                {searchQuery ? (
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search query
                  </p>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    Add your first vehicle
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Registration Number</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.model}</TableCell>
                        <TableCell>{vehicle.registration_number}</TableCell>
                        <TableCell>
                          <span className="capitalize">{vehicle.type}</span>
                        </TableCell>
                        <TableCell>
                          {new Date(vehicle.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View Details"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(vehicle)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(vehicle)}
                            title="Delete"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add Vehicle Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>
              Enter the details of the new vehicle.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Model
              </Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="registration" className="text-right">
                Registration #
              </Label>
              <Input
                id="registration"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="heavy">Heavy</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="specialized">Specialized</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAddVehicle}>
              Add Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Vehicle Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>
              Update the vehicle's information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-model" className="text-right">
                Model
              </Label>
              <Input
                id="edit-model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-registration" className="text-right">
                Registration #
              </Label>
              <Input
                id="edit-registration"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Type
              </Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="heavy">Heavy</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="specialized">Specialized</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setIsEditDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleEditVehicle}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete vehicle "{currentVehicle?.model} ({currentVehicle?.registration_number})"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteVehicle}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
