
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateId, saveUser } from "@/lib/storage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["leader", "checker", "owner", "admin"], {
    required_error: "Please select a role",
  }),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function AddUser() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = (values: UserFormValues) => {
    try {
      const user = {
        id: generateId(),
        name: values.name,
        email: values.email,
        role: values.role,
        createdAt: new Date().toISOString(),
      };
      
      saveUser(user);
      
      toast({
        title: "User Added",
        description: `${values.name} has been added as a ${values.role}`,
      });
      
      navigate("/users");
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout requiredRoles={["admin"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Add User</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>User Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="leader">Leader</SelectItem>
                          <SelectItem value="checker">Checker</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate("/users")}>
                Cancel
              </Button>
              <Button type="submit">
                Add User
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
}
