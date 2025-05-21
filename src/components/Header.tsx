
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { NotificationCenter } from "@/components/NotificationCenter";
import { LanguageSelector } from "@/components/LanguageSelector";
import { 
  Building2, Menu, X, LogOut, User, Bell, ChevronDown, Search, 
  LayoutDashboard, FolderOpen, TrendingUp, Users, Truck, BarChart4,
  FileDown, FileUp
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
  const { user, logout } = useSupabaseAuth();
  const location = useLocation();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const navLinks = [
    { name: t('common.dashboard'), href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4 mr-2" />, roles: ["admin", "owner", "leader", "checker"] },
    { name: t('common.projects'), href: "/projects", icon: <FolderOpen className="w-4 h-4 mr-2" />, roles: ["admin", "owner", "leader", "checker"] },
    { name: t('common.progress'), href: "/progress", icon: <TrendingUp className="w-4 h-4 mr-2" />, roles: ["admin", "owner", "leader", "checker"] },
    { name: t('common.payments'), href: "/payments/request", icon: <FileDown className="w-4 h-4 mr-2" />, roles: ["admin", "owner", "leader"] },
    { name: t('common.users'), href: "/users", icon: <Users className="w-4 h-4 mr-2" />, roles: ["admin"] },
    { name: t('common.vehicles'), href: "/vehicles", icon: <Truck className="w-4 h-4 mr-2" />, roles: ["admin", "owner"] },
    { name: t('common.statistics'), href: "/statistics", icon: <BarChart4 className="w-4 h-4 mr-2" />, roles: ["admin", "owner"] },
    { name: t('common.backup'), href: "/backup", icon: <FileUp className="w-4 h-4 mr-2" />, roles: ["admin", "owner"] },
  ];
  
  const filteredLinks = user ? 
    navLinks.filter(link => link.roles.includes(user.role)) 
    : [];
  
  const isLinkActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    if (path !== "/dashboard" && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };
  
  return (
    <header className="top-navbar">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <button 
              className="inline-flex md:hidden mr-4 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            
            <Link to="/" className="flex items-center gap-2 text-primary">
              <Building2 className="h-7 w-7" />
              <span className="font-bold text-xl font-display hidden md:inline">
                Sai Balaji
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 mx-4 flex-1">
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-md text-sm flex items-center hover:bg-muted ${
                  isLinkActive(link.href) 
                    ? "bg-primary text-white font-medium" 
                    : "text-foreground"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* Right side items */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Language selector */}
            <LanguageSelector />
            
            {/* Theme toggle */}
            <ThemeToggle />
            
            {/* Notification center */}
            {user && <NotificationCenter />}
            
            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2 gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline-block max-w-28 truncate">{user.name}</span>
                    <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 text-sm font-medium border-b mb-1 truncate">
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
              <Button asChild size="sm">
                <Link to="/login">{t('common.login')}</Link>
              </Button>
            )}
          </div>
        </div>
        
        {/* Search bar */}
        {searchOpen && (
          <div className="py-2 border-t">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`${t('common.search')}...`}
                className="pl-9"
                autoFocus
              />
            </div>
          </div>
        )}
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-3 border-t">
            <div className="space-y-1 px-2">
              {filteredLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-3 py-2 rounded-md text-base flex items-center hover:bg-muted ${
                    isLinkActive(link.href) 
                      ? "bg-primary text-white font-medium" 
                      : "text-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
