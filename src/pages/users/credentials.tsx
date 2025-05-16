
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getUsers, updateUser, saveUser, generateId } from "@/lib/storage";
import { User } from "@/types";
import { UserRole } from "@/hooks/useAuth";
import { Eye, EyeOff, Edit, Plus } from "lucide-react";

export default function Credentials() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("leader");

  useEffect(() => {
    // Load all users
    const allUsers = getUsers();
    setUsers(allUsers);
    setLoading(false);
  }, []);

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword("password"); // Default password (mock)
    setRole(user.role);
    setEditDialogOpen(true);
  };

  const openAddDialog = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("leader");
    setAddDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;
    
    const updatedUser = {
      ...selectedUser,
      name,
      email,
      role,
      // In a real app, you'd encrypt the password
    };
    
    updateUser(updatedUser);
    
    // Update local state
    setUsers(users.map(user => 
      user.id === selectedUser.id ? updatedUser : user
    ));
    
    toast({
      title: "User Updated",
      description: `${name}'s information has been updated.`,
    });
    
    setEditDialogOpen(false);
  };

  const handleAddUser = () => {
    // Validate inputs
    if (!name || !email || !password || !role) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive"
      });
      return;
    }
    
    // Check for duplicate email
    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
      toast({
        title: "Error",
        description: "This email is already in use.",
        variant: "destructive"
      });
      return;
    }
    
    const newUser: User = {
      id: generateId(),
      name,
      email,
      role,
      // In a real app, you'd encrypt the password
    };
    
    saveUser(newUser);
    
    // Update local state
    setUsers([...users, newUser]);
    
    toast({
      title: "User Added",
      description: `${name} has been added successfully.`,
    });
    
    setAddDialogOpen(false);
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "owner":
        return "bg-blue-100 text-blue-800";
      case "checker":
        return "bg-green-100 text-green-800";
      case "leader":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">User Credentials</h1>
            <p className="text-muted-foreground">
              Manage user login credentials
            </p>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              View and manage all user credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <p>Loading users...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${getRoleBadgeClass(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>••••••••</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input 
                id="edit-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input 
                id="edit-email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-password">Password</Label>
              <div className="relative">
                <Input 
                  id="edit-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 px-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select 
                value={role} 
                onValueChange={(value) => setRole(value as UserRole)}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leader">Leader</SelectItem>
                  <SelectItem value="checker">Checker</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="add-name">Name</Label>
              <Input 
                id="add-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            
            <div>
              <Label htmlFor="add-email">Email</Label>
              <Input 
                id="add-email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            
            <div>
              <Label htmlFor="add-password">Password</Label>
              <div className="relative">
                <Input 
                  id="add-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 px-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="add-role">Role</Label>
              <Select 
                value={role} 
                onValueChange={(value) => setRole(value as UserRole)}
              >
                <SelectTrigger id="add-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leader">Leader</SelectItem>
                  <SelectItem value="checker">Checker</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
