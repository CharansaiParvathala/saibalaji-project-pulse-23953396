
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  LinkIcon,
  FileDown,
  HardDrive,
  Database,
  Upload,
  Download,
  Clock,
  BarChart,
} from "lucide-react";
import { BackupLink } from "@/types";

export default function BackupPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [links, setLinks] = useState<BackupLink[]>([]);
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null);
  
  useEffect(() => {
    // Get last backup time from localStorage
    const storedBackupTime = localStorage.getItem("sai-balaji-last-backup");
    setLastBackupTime(storedBackupTime);
    
    // Fetch backup links (only latest 3)
    fetchRecentBackupLinks();
  }, []);
  
  const fetchRecentBackupLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('backup_links')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (!error && data) {
        setLinks(data);
      }
    } catch (error) {
      console.error("Error fetching backup links:", error);
    }
  };
  
  const isAdmin = user?.role === "admin";
  
  return (
    <Layout requiredRoles={["admin", "owner"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t('backup.backupData')}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-primary" /> 
                {t('backup.backupLinks')}
              </CardTitle>
              <CardDescription>
                {isAdmin ? "Manage backup links for owners" : "Access backup links shared by admin"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {links.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No backup links found</p>
              ) : (
                links.map(link => (
                  <div key={link.id} className="flex items-center gap-2 text-sm border-b pb-2">
                    <LinkIcon className="h-4 w-4 text-primary" />
                    <span className="flex-1 truncate">{link.title}</span>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline"
                    >
                      Open
                    </a>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/backup/links">
                  {isAdmin ? "Manage Backup Links" : "View All Backup Links"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileDown className="h-5 w-5 text-primary" /> 
                {t('backup.downloadReport')}
              </CardTitle>
              <CardDescription>
                Generate and download data reports in various formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Last Report:</span>
                  </div>
                  <span className="text-sm">
                    {lastBackupTime ? new Date(lastBackupTime).toLocaleString() : "Never"}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.5 21H4.5C3.67157 21 3 20.3284 3 19.5V4.5C3 3.67157 3.67157 3 4.5 3H19.5C20.3284 3 21 3.67157 21 4.5V19.5C21 20.3284 20.3284 21 19.5 21Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M7 7L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M7 12L17 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M7 17L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    DOCX
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 17V11M12 11V5M12 11H18M12 11H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/backup/download">Generate Report</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-primary" /> 
                Storage Management
              </CardTitle>
              <CardDescription>
                Manage application data and storage settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-primary" />
                  <div className="flex-1 text-sm">Storage Analytics</div>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  <div className="flex-1 text-sm">Data Management</div>
                </div>
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-primary" />
                  <div className="flex-1 text-sm">Import Data</div>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  <div className="flex-1 text-sm">Export Data</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/backup/storage-management">Manage Storage</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="p-6 bg-muted/30 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Backup Best Practices</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-medium">Regular Backups</h3>
              <p className="text-sm text-muted-foreground">
                Generate reports on a weekly basis to ensure your data is always backed up and accessible.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Multiple Formats</h3>
              <p className="text-sm text-muted-foreground">
                Store your data in different formats (PDF, DOCX) for redundancy and different use cases.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Secure Storage</h3>
              <p className="text-sm text-muted-foreground">
                Store your backup links and files in secure locations with access restricted to authorized personnel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
