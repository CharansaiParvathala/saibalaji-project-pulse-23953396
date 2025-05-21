
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { NotificationCenter } from "@/components/NotificationCenter";
import { LanguageSelector } from "@/components/LanguageSelector";
import { 
  Building2, Menu, X, LogOut, User, Bell, ChevronDown, Search, 
  ShoppingCart, MapPin, Package, BarChart4, Users, Truck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchTerm);
  };
  
  const categories = [
    { name: t('common.projects'), href: "/projects" },
    { name: t('common.progress'), href: "/progress" },
    { name: t('common.payments'), href: "/payments/request" },
    { name: t('common.statistics'), href: "/statistics" },
    { name: t('common.vehicles'), href: "/vehicles" },
    { name: t('common.users'), href: "/users" },
    { name: t('common.backup'), href: "/backup" },
  ];
  
  return (
    <header className="sticky top-0 z-50">
      {/* Top navigation bar */}
      <div className="amz-nav">
        <div className="container mx-auto px-2 py-2">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1 text-white py-1 px-2 hover:border hover:border-white rounded">
              <Building2 className="h-7 w-7" />
              <span className="font-bold text-xl font-display hidden md:inline">
                Sai Balaji
              </span>
            </Link>
            
            {/* Delivery location */}
            <div className="amz-nav-item hidden md:flex">
              <span className="amz-nav-label">{t('common.delivery')}</span>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="amz-nav-text">India</span>
              </div>
            </div>
            
            {/* Search bar */}
            <form onSubmit={handleSearch} className="amz-search-bar">
              <div className="flex-1 flex">
                <select className="bg-white text-gray-700 px-2 py-2 rounded-l-md border-r border-gray-300 text-sm">
                  <option value="all">{t('common.all')}</option>
                  <option value="projects">{t('common.projects')}</option>
                  <option value="vehicles">{t('common.vehicles')}</option>
                  <option value="users">{t('common.users')}</option>
                </select>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`${t('common.search')}...`}
                  className="amz-search-input"
                />
                <button type="submit" className="amz-search-button">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
            
            {/* Language selector */}
            <div className="hidden md:block">
              <LanguageSelector />
            </div>
            
            {/* Theme toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            
            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="amz-nav-item">
                    <span className="amz-nav-label">{t('common.hello')}, {user.name}</span>
                    <div className="flex items-center">
                      <span className="amz-nav-text">{t('common.account')}</span>
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <div className="px-3 py-2 text-sm font-medium border-b mb-1 text-foreground">
                    {user.name}
                    <p className="text-xs text-muted-foreground font-normal">{user.role}</p>
                  </div>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/users/credentials" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      {t('common.profile')}
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => logout()}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('common.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="bg-primary text-white hover:bg-primary/90">
                <Link to="/login">{t('common.login')}</Link>
              </Button>
            )}
            
            {/* Notifications */}
            {user && (
              <div className="amz-nav-item">
                <NotificationCenter />
              </div>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="inline-flex md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom navigation bar with categories (desktop) */}
      <div className="bg-primary/90 text-white hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center py-1 overflow-x-auto">
            {/* Hamburger menu */}
            <button className="flex items-center gap-1 px-3 py-1 hover:bg-primary/80 rounded">
              <Menu className="h-5 w-5" />
              <span className="font-medium">{t('common.menu')}</span>
            </button>
            
            {/* Categories */}
            {categories.map((category) => (
              <Link
                key={category.href}
                to={category.href}
                className="px-3 py-1 hover:bg-primary/80 text-sm whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="container mx-auto py-3 px-4">
            <div className="space-y-3">
              {user && (
                <div className="border-b pb-2">
                  <span className="text-xs text-muted-foreground">{t('common.hello')}, {user.name}</span>
                  <h3 className="font-medium">{user.role}</h3>
                </div>
              )}
              
              {categories.map((category) => (
                <Link
                  key={category.href}
                  to={category.href}
                  className="block px-2 py-2 hover:bg-muted rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              
              <div className="flex items-center gap-2 border-t pt-2">
                <LanguageSelector />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
