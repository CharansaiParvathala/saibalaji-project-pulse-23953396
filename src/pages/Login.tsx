import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Mail,
  Lock,
  User,
  UserPlus,
  LogIn,
  CheckCircle,
  Menu,
  X,
  ChevronRight,
  Building2,
  MoonStar,
  Sun,
} from "lucide-react";

export default function Login() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("checker");
  const [isAgree, setIsAgree] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    name: "",
    terms: "",
  });
  const { login, signup, isAuthenticated, loading } = useSupabaseAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    // Reset form errors when switching tabs
    setFormErrors({
      email: "",
      password: "",
      name: "",
      terms: "",
    });

    // Set default test values for development
    if (activeTab === "login") {
      setEmail("admin@example.com");
      setPassword("password");
    }
  }, [activeTab]);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateForm = () => {
    const errors = {
      email: "",
      password: "",
      name: "",
      terms: "",
    };
    
    let isValid = true;

    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (activeTab === "signup") {
      if (!name) {
        errors.name = "Name is required";
        isValid = false;
      }
      
      if (!isAgree) {
        errors.terms = "You must agree to the terms";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      console.log("Attempting login with:", email, password);
      const { error } = await login(email, password);
      if (error) {
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Login error in component:", error);
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };
  
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      console.log("Attempting signup with:", email, password, name, role);
      const { error } = await signup(email, password, name, role);
      if (error) {
        toast({
          title: "Signup failed",
          description: error.message || "Please check your information",
          variant: "destructive"
        });
      } else {
        setActiveTab("login");
        toast({
          title: "Signup successful",
          description: "Please verify your email before logging in",
        });
      }
    } catch (error: any) {
      console.error("Signup error in component:", error);
      toast({
        title: "Signup failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  if (isAuthenticated) {
    console.log("User is authenticated, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 dark:from-violet-900 dark:via-purple-900 dark:to-fuchsia-900 transition-colors duration-300">
      {/* Header with Theme Toggle */}
      <header className="w-full p-4 flex justify-between items-center z-10">
        <div className="flex items-center">
          <Building2 className="h-8 w-8 text-white mr-2" />
          <h1 className="text-xl font-bold text-white">Sai Balaji Construction</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden text-white p-2 rounded-full hover:bg-white/10"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-16 right-4 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
          <a href="#" className="flex items-center px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            About Us <ChevronRight className="ml-auto h-4 w-4" />
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            Services <ChevronRight className="ml-auto h-4 w-4" />
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            Contact <ChevronRight className="ml-auto h-4 w-4" />
          </a>
        </div>
      )}
      
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-4 md:p-8">
        {/* Left side - Company Info (hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-8 text-white">
          <div className="max-w-md text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-shadow-lg">
              Building Excellence, Delivering Trust
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Sai Balaji Construction provides top-tier construction services with precision and reliability.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl shadow-glow">
                <p className="text-2xl font-bold">15+</p>
                <p className="text-sm">Years Experience</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl shadow-glow">
                <p className="text-2xl font-bold">200+</p>
                <p className="text-sm">Projects Completed</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl shadow-glow">
                <p className="text-2xl font-bold">500+</p>
                <p className="text-sm">Workers Employed</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Login/Signup Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                {activeTab === "login" ? "Welcome Back" : "Create an Account"}
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === "login" 
                  ? "Enter your credentials to access your account" 
                  : "Fill in your details to get started"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs 
                value={activeTab} 
                onValueChange={(v) => setActiveTab(v as "login" | "signup")} 
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-8 w-full">
                  <TabsTrigger value="login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className={`pl-10 ${formErrors.email ? 'border-red-500' : ''}`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      {formErrors.email && (
                        <p className="text-sm text-red-500">{formErrors.email}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link to="#" className="text-sm text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="password" 
                          type="password" 
                          className={`pl-10 ${formErrors.password ? 'border-red-500' : ''}`}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      {formErrors.password && (
                        <p className="text-sm text-red-500">{formErrors.password}</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </div>
                      ) : (
                        <span className="flex items-center">
                          Sign In <LogIn className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="name" 
                          type="text" 
                          placeholder="John Doe" 
                          className={`pl-10 ${formErrors.name ? 'border-red-500' : ''}`}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      {formErrors.name && (
                        <p className="text-sm text-red-500">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className={`pl-10 ${formErrors.email ? 'border-red-500' : ''}`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      {formErrors.email && (
                        <p className="text-sm text-red-500">{formErrors.email}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="signup-password" 
                          type="password" 
                          className={`pl-10 ${formErrors.password ? 'border-red-500' : ''}`}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimum 6 characters"
                        />
                      </div>
                      {formErrors.password && (
                        <p className="text-sm text-red-500">{formErrors.password}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 6 characters long
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checker">Checker</SelectItem>
                          <SelectItem value="leader">Leader</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={isAgree}
                        onCheckedChange={(checked) => setIsAgree(checked as boolean)}
                      />
                      <Label 
                        htmlFor="terms" 
                        className={`text-sm ${formErrors.terms ? 'text-red-500' : ''}`}
                      >
                        I agree to the Terms of Service and Privacy Policy
                      </Label>
                    </div>
                    {formErrors.terms && (
                      <p className="text-sm text-red-500">{formErrors.terms}</p>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Account...
                        </div>
                      ) : (
                        <span className="flex items-center">
                          Create Account <UserPlus className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="text-green-500 h-4 w-4 mr-1" />
                  <span>For testing: admin@example.com / password</span>
                </div>
                <p>
                  Use these roles for testing different dashboards:
                  admin, owner, leader, checker
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
