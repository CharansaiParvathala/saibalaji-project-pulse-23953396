
import React from 'react';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Building2, BarChart4, FileText, Users, 
  Truck, TrendingUp, CreditCard, FileDown
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
  linkText: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, title, description, linkTo, linkText 
}) => {
  return (
    <Card className="amz-product-card h-full">
      <div className="text-primary mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4 flex-grow">{description}</p>
      <Link to={linkTo} className="text-primary hover:text-primary/80 text-sm font-medium flex items-center mt-auto">
        {linkText} <ArrowRight className="h-4 w-4 ml-1" />
      </Link>
    </Card>
  );
};

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Projects Management",
      description: "Create and manage construction projects, track progress and monitor resources.",
      linkTo: "/projects",
      linkText: "View projects"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Progress Tracking",
      description: "Record daily progress, document site activities and track completion rates.",
      linkTo: "/progress",
      linkText: "Add progress"
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Payment Management",
      description: "Manage payment requests, approvals and track financial transactions.",
      linkTo: "/payments/request",
      linkText: "Request payment"
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Vehicle Management",
      description: "Track vehicles, maintenance schedules and assign to projects.",
      linkTo: "/vehicles",
      linkText: "View vehicles"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "User Management",
      description: "Manage system users, roles and permissions for your organization.",
      linkTo: "/users",
      linkText: "Manage users"
    },
    {
      icon: <BarChart4 className="h-8 w-8" />,
      title: "Statistics & Reports",
      description: "View analytical dashboards and generate reports on project performance.",
      linkTo: "/statistics",
      linkText: "View statistics"
    },
  ];

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="amz-carousel">
        <div className="relative w-full h-72 bg-gradient-to-r from-primary/20 to-accent/20 rounded-md overflow-hidden">
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-lg">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  Construction Management Made Simple
                </h1>
                <p className="text-muted-foreground mb-6">
                  Track projects, manage payments, and monitor progress with our comprehensive construction management system.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                    <Link to="/projects">Explore Projects</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/dashboard">Go to Dashboard</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="amz-section mt-4">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Link to="/projects/create" className="bg-primary/10 hover:bg-primary/20 p-4 rounded-md text-center transition-colors">
            <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
            <span className="text-sm font-medium">Create Project</span>
          </Link>
          <Link to="/progress" className="bg-secondary/10 hover:bg-secondary/20 p-4 rounded-md text-center transition-colors">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-secondary" />
            <span className="text-sm font-medium">Add Progress</span>
          </Link>
          <Link to="/payments/request" className="bg-accent/10 hover:bg-accent/20 p-4 rounded-md text-center transition-colors">
            <FileDown className="h-6 w-6 mx-auto mb-2 text-accent" />
            <span className="text-sm font-medium">Request Payment</span>
          </Link>
          <Link to="/vehicles" className="bg-primary/10 hover:bg-primary/20 p-4 rounded-md text-center transition-colors">
            <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
            <span className="text-sm font-medium">Vehicle Management</span>
          </Link>
        </div>
      </div>

      {/* Main Feature Cards */}
      <div className="amz-section mt-8">
        <h2 className="text-xl font-semibold mb-4">Explore Features</h2>
        <div className="amz-product-grid">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="amz-section mt-8">
        <div className="bg-gradient-to-r from-primary to-accent rounded-md p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Sai Balaji Construction Management</h2>
              <p className="text-white/80 max-w-xl">
                Empowering construction businesses with streamlined project management tools and insightful analytics.
              </p>
            </div>
            <div>
              <Button asChild className="bg-white text-primary hover:bg-white/90">
                <Link to="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t pt-8 pb-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl">Sai Balaji</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Comprehensive construction management system for tracking projects, managing resources, and monitoring progress.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/projects" className="text-sm text-muted-foreground hover:text-primary">Projects</Link>
                <Link to="/progress" className="text-sm text-muted-foreground hover:text-primary">Progress</Link>
                <Link to="/payments/request" className="text-sm text-muted-foreground hover:text-primary">Payments</Link>
                <Link to="/vehicles" className="text-sm text-muted-foreground hover:text-primary">Vehicles</Link>
                <Link to="/users" className="text-sm text-muted-foreground hover:text-primary">Users</Link>
                <Link to="/statistics" className="text-sm text-muted-foreground hover:text-primary">Statistics</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              {user ? (
                <div className="space-y-2">
                  <Link to="/users/credentials" className="text-sm text-muted-foreground hover:text-primary block">Profile Settings</Link>
                  <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary block">Dashboard</Link>
                  <button 
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.clear();
                        window.location.href = '/login';
                      }
                    }} 
                    className="text-sm text-muted-foreground hover:text-primary block text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">Login</Link>
              )}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Sai Balaji Construction. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default HomePage;
