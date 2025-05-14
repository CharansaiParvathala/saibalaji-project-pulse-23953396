
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUsers, updateUser } from "@/lib/storage";
import { User, UserRole } from "@/types";
import { toast } from "sonner";

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("leader");
  
  useEffect(() => {
    if (!id) return;
    
    const users = getUsers();
    const userData = users.find(u => u.id === id);
    
    if (userData) {
      setUser(userData);
      setName(userData.name);
      setEmail(userData.email);
      setRole(userData.role);
    }
    setLoading(false);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !user) return;
    
    setSaving(true);
    
    try {
      // Create updated user object
      const updatedUser: User = {
        ...user,
        name,
        email,
        role
      };
      
      updateUser(updatedUser);
      
      toast.success("User updated successfully");
      navigate("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout requiredRoles={["admin"]}>
        <div className="flex justify-center py-8">
          <p>Loading user details...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout requiredRoles={["admin"]}>
        <div className="flex flex-col items-center justify-center py-8">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The user you're trying to edit doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/users")}>
            Back to Users
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Edit User</h1>
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={role}
                  onValueChange={(value: UserRole) => setRole(value)}
                >
                  <SelectTrigger>
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
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/users")}>
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
