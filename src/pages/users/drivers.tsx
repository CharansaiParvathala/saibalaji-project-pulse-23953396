
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Pencil, Trash, Plus, Search, AlertCircle } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  license_number: string;
  type: string;
  created_at: string;
}

export default function DriversPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [driverType, setDriverType] = useState("regular");
  
  // Load drivers on component mount
  useEffect(() => {
    fetchDrivers();
  }, []);
  
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setDrivers(data || []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast({
        title: "Error fetching drivers",
        description: "There was a problem loading the drivers data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddDriver = async () => {
    if (!name || !licenseNumber || !driverType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('drivers')
        .insert([
          { 
            name,
            license_number: licenseNumber,
            type: driverType
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Driver Added",
        description: `${name} has been added successfully.`,
      });
      
      fetchDrivers();
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.error("Error adding driver:", error);
      toast({
        title: "Error",
        description: error.message || "There was a problem adding the driver.",
        variant: "destructive",
      });
    }
  };
  
  const handleEditDriver = async () => {
    if (!currentDriver || !name || !licenseNumber || !driverType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('drivers')
        .update({ 
          name,
          license_number: licenseNumber,
          type: driverType
        })
        .eq('id', currentDriver.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Driver Updated",
        description: `${name} has been updated successfully.`,
      });
      
      fetchDrivers();
      resetForm();
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating driver:", error);
      toast({
        title: "Error",
        description: error.message || "There was a problem updating the driver.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteDriver = async () => {
    if (!currentDriver) return;
    
    try {
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', currentDriver.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Driver Deleted",
        description: `${currentDriver.name} has been deleted successfully.`,
      });
      
      fetchDrivers();
      setIsDeleteDialogOpen(false);
      setCurrentDriver(null);
    } catch (error: any) {
      console.error("Error deleting driver:", error);
      toast({
        title: "Error",
        description: error.message || "There was a problem deleting the driver.",
        variant: "destructive",
      });
    }
  };
  
  const openEditDialog = (driver: Driver) => {
    setCurrentDriver(driver);
    setName(driver.name);
    setLicenseNumber(driver.license_number);
    setDriverType(driver.type);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (driver: Driver) => {
    setCurrentDriver(driver);
    setIsDeleteDialogOpen(true);
  };
  
  const resetForm = () => {
    setName("");
    setLicenseNumber("");
    setDriverType("regular");
    setCurrentDriver(null);
  };
  
  // Filter drivers based on search query
  const filteredDrivers = drivers.filter(
    driver => 
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.license_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Layout requiredRoles={["admin", "owner"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Drivers Management</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Driver
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Drivers</CardTitle>
            <CardDescription>
              Manage your registered drivers
            </CardDescription>
            
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <p>Loading drivers...</p>
              </div>
            ) : filteredDrivers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">No drivers found</p>
                {searchQuery ? (
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search query
                  </p>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    Add your first driver
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>License Number</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">{driver.name}</TableCell>
                        <TableCell>{driver.license_number}</TableCell>
                        <TableCell>
                          <span className="capitalize">{driver.type}</span>
                        </TableCell>
                        <TableCell>
                          {new Date(driver.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(driver)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(driver)}
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
      
      {/* Add Driver Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
            <DialogDescription>
              Enter the details of the new driver.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="license" className="text-right">
                License #
              </Label>
              <Input
                id="license"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={driverType} onValueChange={setDriverType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select driver type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="heavy">Heavy Vehicle</SelectItem>
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
            <Button type="button" onClick={handleAddDriver}>
              Add Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Driver Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>
              Update the driver's information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-license" className="text-right">
                License #
              </Label>
              <Input
                id="edit-license"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Type
              </Label>
              <Select value={driverType} onValueChange={setDriverType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select driver type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="heavy">Heavy Vehicle</SelectItem>
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
            <Button type="button" onClick={handleEditDriver}>
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
              Are you sure you want to delete driver "{currentDriver?.name}"? This action cannot be undone.
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
              onClick={handleDeleteDriver}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
