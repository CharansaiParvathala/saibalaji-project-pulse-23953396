
import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { LanguageSelector } from "@/components/LanguageSelector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Mail,
  Lock,
  User,
  LogIn,
  Building2,
  MoonStar,
  Sun,
  UserPlus,
  ArrowLeft
} from "lucide-react";

const DEFAULT_ADMIN_EMAIL = "admin@example.com";
const DEFAULT_CHECKER_EMAIL = "checker@example.com";
const DEFAULT_OWNER_EMAIL = "owner@example.com";
const DEFAULT_PASSWORD = "password";

export default function Login() {
  const [activeTab, setActiveTab] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"leader">("leader");
  const [isAgree, setIsAgree] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    name: "",
    terms: "",
  });
  
  // Password reset state
  const [resetEmail, setResetEmail] = useState("");
  const [resetOTP, setResetOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetStep, setResetStep] = useState<"email" | "otp" | "newPassword">("email");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  
  const { login, signup, isAuthenticated, isLoading } = useSupabaseAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  
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
      setEmail(DEFAULT_ADMIN_EMAIL);
      setPassword(DEFAULT_PASSWORD);
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

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        toast({
          title: "Google sign-in failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Google sign-in failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };
  
  const handlePasswordReset = async () => {
    if (resetStep === "email") {
      if (!resetEmail || !validateEmail(resetEmail)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address",
          variant: "destructive"
        });
        return;
      }
      
      // In a real application, this would send an OTP to the user's email
      // For this demo, we'll simulate sending an OTP
      toast({
        title: "OTP sent",
        description: "A verification code has been sent to your email",
      });
      
      // For demo purposes, set a fake OTP
      // In a real application, this would be handled by the backend
      const fakeOTP = "123456";
      console.log("Demo OTP:", fakeOTP);
      
      setResetStep("otp");
    } 
    else if (resetStep === "otp") {
      if (!resetOTP || resetOTP.length < 4) {
        toast({
          title: "Invalid OTP",
          description: "Please enter the verification code sent to your email",
          variant: "destructive"
        });
        return;
      }
      
      // In a real application, this would validate the OTP
      // For this demo, we'll accept any OTP
      setResetStep("newPassword");
    } 
    else if (resetStep === "newPassword") {
      if (!newPassword || newPassword.length < 6) {
        toast({
          title: "Invalid password",
          description: "Password must be at least 6 characters",
          variant: "destructive"
        });
        return;
      }
      
      if (newPassword !== confirmPassword) {
        toast({
          title: "Passwords do not match",
          description: "Please make sure your passwords match",
          variant: "destructive"
        });
        return;
      }
      
      // In a real application, this would update the user's password
      // For this demo, we'll just show a success message
      toast({
        title: "Password reset successful",
        description: "Your password has been reset. You can now login with your new password.",
      });
      
      // Close the reset dialog and switch to login tab
      setIsResetDialogOpen(false);
      setResetStep("email");
      setResetEmail("");
      setResetOTP("");
      setNewPassword("");
      setConfirmPassword("");
      setActiveTab("login");
    }
  };
  
  const resetPasswordUI = () => {
    if (resetStep === "email") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="reset-email"
                type="email"
                placeholder="name@example.com"
                className="pl-10"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            type="button" 
            className="w-full"
            onClick={handlePasswordReset}
          >
            Send Verification Code
          </Button>
        </div>
      );
    }
    
    if (resetStep === "otp") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-otp">Verification Code</Label>
            <Input
              id="reset-otp"
              type="text"
              placeholder="Enter the 6-digit code"
              value={resetOTP}
              onChange={(e) => setResetOTP(e.target.value)}
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
            <p className="text-xs text-muted-foreground">
              Enter the verification code sent to {resetEmail}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline"
              className="flex-1"
              onClick={() => setResetStep("email")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button 
              type="button" 
              className="flex-1"
              onClick={handlePasswordReset}
            >
              Verify Code
            </Button>
          </div>
        </div>
      );
    }
    
    if (resetStep === "newPassword") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="new-password"
                type="password"
                placeholder="New password"
                className="pl-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                className="pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            type="button" 
            className="w-full"
            onClick={handlePasswordReset}
          >
            Reset Password
          </Button>
        </div>
      );
    }
    
    return null;
  };

  if (isAuthenticated) {
    console.log("User is authenticated, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Header with Theme Toggle */}
      <header className="w-full p-4 flex justify-between items-center z-10">
        <div className="flex items-center">
          <Building2 className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-xl font-bold text-foreground">Sai Balaji Construction</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
          </button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-4 md:p-8">
        {/* Left side - Company Info (hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-8 text-foreground">
          <div className="max-w-md text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display">
              Building Excellence, Delivering Trust
            </h1>
            <p className="text-xl mb-8 text-muted-foreground">
              Sai Balaji Construction provides top-tier construction services with precision and reliability.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card shadow-soft p-4 rounded-lg">
                <p className="text-2xl font-bold text-primary">15+</p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
              <div className="bg-card shadow-soft p-4 rounded-lg">
                <p className="text-2xl font-bold text-primary">200+</p>
                <p className="text-sm text-muted-foreground">Projects Completed</p>
              </div>
              <div className="bg-card shadow-soft p-4 rounded-lg">
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Workers Employed</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Login/Signup Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <Card className="w-full max-w-md shadow-medium">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                {activeTab === "login" ? t('common.welcome') : t('common.signup')}
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === "login" 
                  ? "Enter your credentials to access your account" 
                  : "Create a leader account to get started"}
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
                    <span>{t('common.login')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span>{t('common.signup')}</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('common.email')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className={`pl-10 ${formErrors.email ? 'border-destructive' : ''}`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      {formErrors.email && (
                        <p className="text-sm text-destructive">{formErrors.email}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">{t('common.password')}</Label>
                        <button 
                          type="button"
                          onClick={() => setIsResetDialogOpen(true)}
                          className="text-sm text-primary hover:underline"
                        >
                          {t('common.forgotPassword')}
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="password" 
                          type="password" 
                          className={`pl-10 ${formErrors.password ? 'border-destructive' : ''}`}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      {formErrors.password && (
                        <p className="text-sm text-destructive">{formErrors.password}</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </div>
                      ) : (
                        <span className="flex items-center">
                          {t('common.login')} <LogIn className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                    
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-card px-2 text-muted-foreground">
                          OR
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="outline"
                      className="w-full flex items-center gap-2"
                      onClick={handleGoogleSignIn}
                    >
                      <svg viewBox="0 0 48 48" className="h-5 w-5">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                      </svg>
                      {t('common.signInWithGoogle')}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('common.fullName')}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="name" 
                          type="text" 
                          placeholder="John Doe" 
                          className={`pl-10 ${formErrors.name ? 'border-destructive' : ''}`}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      {formErrors.name && (
                        <p className="text-sm text-destructive">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">{t('common.email')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className={`pl-10 ${formErrors.email ? 'border-destructive' : ''}`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      {formErrors.email && (
                        <p className="text-sm text-destructive">{formErrors.email}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">{t('common.password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="signup-password" 
                          type="password" 
                          className={`pl-10 ${formErrors.password ? 'border-destructive' : ''}`}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimum 6 characters"
                        />
                      </div>
                      {formErrors.password && (
                        <p className="text-sm text-destructive">{formErrors.password}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 6 characters long
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={isAgree}
                        onCheckedChange={(checked) => setIsAgree(checked as boolean)}
                      />
                      <Label 
                        htmlFor="terms" 
                        className={`text-sm ${formErrors.terms ? 'text-destructive' : ''}`}
                      >
                        I agree to the Terms of Service and Privacy Policy
                      </Label>
                    </div>
                    {formErrors.terms && (
                      <p className="text-sm text-destructive">{formErrors.terms}</p>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Account...
                        </div>
                      ) : (
                        <span className="flex items-center">
                          {t('common.signup')} <UserPlus className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                <div className="flex flex-col sm:flex-row items-center justify-center mb-2 gap-4">
                  <Button 
                    variant="outline" size="sm" 
                    onClick={() => { setEmail(DEFAULT_ADMIN_EMAIL); setPassword(DEFAULT_PASSWORD); }}
                  >
                    Admin: {DEFAULT_ADMIN_EMAIL}
                  </Button>
                  <Button 
                    variant="outline" size="sm"
                    onClick={() => { setEmail(DEFAULT_OWNER_EMAIL); setPassword(DEFAULT_PASSWORD); }}
                  >
                    Owner: {DEFAULT_OWNER_EMAIL}
                  </Button>
                  <Button 
                    variant="outline" size="sm"
                    onClick={() => { setEmail(DEFAULT_CHECKER_EMAIL); setPassword(DEFAULT_PASSWORD); }}
                  >
                    Checker: {DEFAULT_CHECKER_EMAIL}
                  </Button>
                </div>
                <p>
                  Password for all test accounts: <strong>{DEFAULT_PASSWORD}</strong>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Password Reset Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('common.forgotPassword')}</DialogTitle>
            <DialogDescription>
              {resetStep === "email" 
                ? "Enter your email address to receive a verification code" 
                : resetStep === "otp" 
                  ? "Enter the verification code sent to your email" 
                  : "Create a new password for your account"}
            </DialogDescription>
          </DialogHeader>
          
          {resetPasswordUI()}
          
          <DialogFooter className="mt-4">
            <Button 
              type="button"
              variant="outline"
              onClick={() => setIsResetDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
