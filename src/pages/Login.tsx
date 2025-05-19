
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Lock,
  User,
  UserPlus,
  LogIn,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("checker");
  const [isAgree, setIsAgree] = useState(false);
  const { login, signup, isAuthenticated, isLoading } = useSupabaseAuth();
  const { toast } = useToast();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await login(email, password);
      console.log("Login attempt completed"); // Debug
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: String(error),
        variant: "destructive",
      });
    }
  };
  
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!isAgree) {
      toast({
        title: "Terms & Conditions",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await signup(email, password, name, role);
      toast({
        title: "Success!",
        description: "Your account has been created. Please log in.",
      });
      setIsLogin(true);
      console.log("Signup attempt completed"); // Debug
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  if (isAuthenticated) {
    console.log("User is authenticated, redirecting to dashboard"); // Debug
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left side - Branding */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 bg-black/40 backdrop-blur-lg">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Sai Balaji Construction</h1>
            <p className="text-xl text-white/80 mb-6">
              Manage your construction projects with ease and precision
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-md rounded-xl">
                <span className="text-white/90 text-lg font-bold">15+</span>
                <span className="text-white/70 text-sm">Years Experience</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-md rounded-xl">
                <span className="text-white/90 text-lg font-bold">200+</span>
                <span className="text-white/70 text-sm">Projects</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-md rounded-xl">
                <span className="text-white/90 text-lg font-bold">500+</span>
                <span className="text-white/70 text-sm">Workers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-12 bg-white">
          <div className="w-full max-w-md">
            {/* Auth toggle */}
            <div className="flex items-center mb-8 border-b border-gray-200">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 text-center font-medium ${
                  isLogin ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"
                }`}
              >
                <LogIn className="inline mr-2 h-5 w-5" />
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 text-center font-medium ${
                  !isLogin ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"
                }`}
              >
                <UserPlus className="inline mr-2 h-5 w-5" />
                Sign Up
              </button>
            </div>

            {/* Login form */}
            {isLogin ? (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome back</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <button
                        type="button"
                        className="text-sm text-purple-600 hover:text-purple-800"
                        onClick={() =>
                          toast({
                            title: "Password Recovery",
                            description: "Please contact your administrator to reset your password.",
                          })
                        }
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg transform transition hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Login <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  )}
                </button>
                
                <p className="text-sm text-center text-gray-500 mt-6">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="font-semibold text-purple-600 hover:text-purple-800"
                    onClick={() => setIsLogin(false)}
                  >
                    Create one now
                  </button>
                </p>
              </form>
            ) : (
              /* Sign up form */
              <form onSubmit={handleSignupSubmit} className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Create your account</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="signup-password"
                        type="password"
                        placeholder="Create a strong password"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white"
                    >
                      <option value="checker">Checker</option>
                      <option value="leader">Leader</option>
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={isAgree}
                        onChange={(e) => setIsAgree(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="terms" className="text-sm text-gray-700">
                        I agree to the{" "}
                        <a href="#" className="font-medium text-purple-600 hover:text-purple-800">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="font-medium text-purple-600 hover:text-purple-800">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg transform transition hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Create Account <UserPlus className="ml-2 h-5 w-5" />
                    </span>
                  )}
                </button>
                
                <p className="text-sm text-center text-gray-500 mt-6">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="font-semibold text-purple-600 hover:text-purple-800"
                    onClick={() => setIsLogin(true)}
                  >
                    Log in now
                  </button>
                </p>
              </form>
            )}

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-center">
                <AlertTriangle className="text-yellow-500 h-5 w-5 mr-2" />
                <p className="text-xs text-gray-500">
                  For testing: Use email "admin@example.com" with password "password"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
