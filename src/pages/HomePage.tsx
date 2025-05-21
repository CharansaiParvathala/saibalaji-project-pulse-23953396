
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Building2, BarChart4, FileText, Users, 
  Truck, TrendingUp, CreditCard, FileDown, Shield,
  LayoutGrid, Package, ChevronRight, Star, Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
  linkText: string;
  badge?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, title, description, linkTo, linkText, badge 
}) => {
  return (
    <Card className="amz-product-card h-full relative overflow-hidden border border-border/40 shadow-soft hover:shadow-medium transition-all">
      {badge && (
        <Badge className="absolute top-3 right-3 bg-secondary text-white">
          {badge}
        </Badge>
      )}
      <CardContent className="p-4 flex flex-col h-full">
        <div className="text-primary mb-3 p-2 rounded-full bg-primary/10 w-fit">{icon}</div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-grow">{description}</p>
        <Link to={linkTo} className="text-primary hover:text-primary/80 text-sm font-medium flex items-center mt-auto">
          {linkText} <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </CardContent>
    </Card>
  );
};

const HomePage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const carouselSlides = [
    {
      title: t('home.carousel.management'),
      description: t('home.carousel.managementDesc'),
      image: 'bg-gradient-to-r from-primary/20 to-accent/20',
      action: { text: t('common.exploreProjects'), link: '/projects' }
    },
    {
      title: t('home.carousel.tracking'),
      description: t('home.carousel.trackingDesc'), 
      image: 'bg-gradient-to-r from-secondary/20 to-primary/20',
      action: { text: t('common.addProgress'), link: '/progress' }
    },
    {
      title: t('home.carousel.payments'),
      description: t('home.carousel.paymentsDesc'),
      image: 'bg-gradient-to-r from-accent/20 to-secondary/20',
      action: { text: t('common.requestPayment'), link: '/payments/request' }
    }
  ];

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: t('modules.projects.title'),
      description: t('modules.projects.description'),
      linkTo: "/projects",
      linkText: t('common.viewProjects'),
      badge: t('common.essential')
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: t('modules.progress.title'),
      description: t('modules.progress.description'),
      linkTo: "/progress",
      linkText: t('common.trackProgress')
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: t('modules.payments.title'),
      description: t('modules.payments.description'),
      linkTo: "/payments/request",
      linkText: t('common.requestPayment')
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: t('modules.vehicles.title'),
      description: t('modules.vehicles.description'),
      linkTo: "/vehicles",
      linkText: t('common.manageVehicles')
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t('modules.users.title'),
      description: t('modules.users.description'),
      linkTo: "/users",
      linkText: t('common.manageUsers')
    },
    {
      icon: <BarChart4 className="h-6 w-6" />,
      title: t('modules.statistics.title'),
      description: t('modules.statistics.description'),
      linkTo: "/statistics",
      linkText: t('common.viewStatistics')
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: t('modules.submissions.title'),
      description: t('modules.submissions.description'),
      linkTo: "/submissions",
      linkText: t('common.reviewSubmissions')
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: t('modules.backup.title'),
      description: t('modules.backup.description'),
      linkTo: "/backup",
      linkText: t('common.manageBackup')
    },
  ];

  const quickActions = [
    {
      icon: <FileText />,
      title: t('common.createProject'),
      link: "/projects/create",
      color: "primary"
    },
    {
      icon: <TrendingUp />,
      title: t('common.addProgress'),
      link: "/progress",
      color: "secondary"
    },
    {
      icon: <FileDown />,
      title: t('common.requestPayment'),
      link: "/payments/request",
      color: "accent"
    },
    {
      icon: <Truck />,
      title: t('common.manageVehicles'),
      link: "/vehicles",
      color: "primary"
    }
  ];

  return (
    <Layout hideAuth={true} containerClassName="p-0">
      {/* Hero Carousel */}
      <div className="w-full mb-8">
        <Carousel className="w-full">
          <CarouselContent>
            {carouselSlides.map((slide, index) => (
              <CarouselItem key={index} className="relative">
                <div className={`relative w-full h-80 ${slide.image} rounded-md overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center px-8">
                    <div className="max-w-lg">
                      <h1 className="text-3xl md:text-4xl font-bold mb-3">
                        {slide.title}
                      </h1>
                      <p className="text-muted-foreground mb-6">
                        {slide.description}
                      </p>
                      <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                        <Link to={slide.action.link}>{slide.action.text}</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Quick Access Panel */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t('home.quickAccess')}</h2>
          <Link to="/dashboard" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
            {t('common.dashboard')} <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link} className={`bg-${action.color}/10 hover:bg-${action.color}/20 p-4 rounded-md text-center transition-colors`}>
              <div className={`h-10 w-10 mx-auto mb-2 text-${action.color} bg-${action.color}/20 rounded-full flex items-center justify-center`}>
                {action.icon}
              </div>
              <span className="text-sm font-medium">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Feature Grid */}
      <div className="bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{t('home.exploreModules')}</h2>
            <Link to="/dashboard" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
              {t('common.dashboard')} <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6">{t('home.resources')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Documentation */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="rounded-full p-2 bg-primary/10">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="ml-3 text-lg font-semibold">{t('home.documentation')}</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                {t('home.documentationDesc')}
              </p>
              <Link to="/backup/download" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                {t('common.downloadReports')} <ChevronRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
          
          {/* Statistics */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="rounded-full p-2 bg-secondary/10">
                  <BarChart4 className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="ml-3 text-lg font-semibold">{t('home.statistics')}</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                {t('home.statisticsDesc')}
              </p>
              <Link to="/statistics" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                {t('common.viewStatistics')} <ChevronRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
          
          {/* Backup */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="rounded-full p-2 bg-accent/10">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h3 className="ml-3 text-lg font-semibold">{t('home.backupSharing')}</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                {t('home.backupDesc')}
              </p>
              <Link to="/backup/links" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                {t('common.manageBackupLinks')} <ChevronRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-primary to-accent rounded-md p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{t('home.banner.title')}</h2>
              <p className="text-white/80 max-w-xl">
                {t('home.banner.description')}
              </p>
            </div>
            <div>
              <Button asChild className="bg-white text-primary hover:bg-white/90">
                <Link to="/dashboard">
                  {t('common.dashboard')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t pt-8 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl">Sai Balaji</span>
              </div>
              <p className="text-muted-foreground text-sm">
                {t('home.footer.description')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('home.footer.quickLinks')}</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/projects" className="text-sm text-muted-foreground hover:text-primary">{t('common.projects')}</Link>
                <Link to="/progress" className="text-sm text-muted-foreground hover:text-primary">{t('common.progress')}</Link>
                <Link to="/payments/request" className="text-sm text-muted-foreground hover:text-primary">{t('common.payments')}</Link>
                <Link to="/vehicles" className="text-sm text-muted-foreground hover:text-primary">{t('common.vehicles')}</Link>
                <Link to="/users" className="text-sm text-muted-foreground hover:text-primary">{t('common.users')}</Link>
                <Link to="/statistics" className="text-sm text-muted-foreground hover:text-primary">{t('common.statistics')}</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('home.footer.account')}</h3>
              {user ? (
                <div className="space-y-2">
                  <Link to="/users/credentials" className="text-sm text-muted-foreground hover:text-primary block">{t('common.profileSettings')}</Link>
                  <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary block">{t('common.dashboard')}</Link>
                  <button 
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.clear();
                        window.location.href = '/login';
                      }
                    }} 
                    className="text-sm text-muted-foreground hover:text-primary block text-left"
                  >
                    {t('common.logout')}
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">{t('common.login')}</Link>
              )}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {t('home.footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default HomePage;
