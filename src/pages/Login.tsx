
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password);
      toast({
        title: "Login successful",
        description: "Welcome back to Sai Balaji.",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  // Sample login credentials for demo
  const credentials = [
    { role: "Leader", email: "leader@example.com" },
    { role: "Checker", email: "checker@example.com" },
    { role: "Owner", email: "owner@example.com" },
    { role: "Admin", email: "admin@example.com" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-soft-brown/20 dark:bg-charcoal">
      <Card className="w-full max-w-md shadow-soft-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full overflow-hidden flex items-center justify-center bg-white">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-full w-full object-cover"
                />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Sai Balaji
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="w-full text-center text-sm text-muted-foreground">
            <p className="mb-2">Demo accounts (password: "password"):</p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {credentials.map((cred) => (
                <div key={cred.role} className="p-1 rounded bg-muted">
                  <div><strong>{cred.role}</strong></div>
                  <div>{cred.email}</div>
                </div>
              ))}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
