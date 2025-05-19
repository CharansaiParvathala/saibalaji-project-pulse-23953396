import { useState } from "react";
import { ClassicLayout } from "@/components/ClassicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, Upload, FileArchive, Trash2, AlertTriangle, Link } from "lucide-react";
import { generateDataReport, downloadReport } from "@/lib/documentGenerator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export default function BackupPage() {
  const [generating, setGenerating] = useState(false);
  const [fileName, setFileName] = useState(`sai-balaji-backup-${new Date().toISOString().split('T')[0]}`);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [backupLinks, setBackupLinks] = useState<any[]>([]);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDescription, setLinkDescription] = useState("");
  const [storageUsage, setStorageUsage] = useState<{total: number, max: number} | null>(null);
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  
  // Fetch storage usage and backup links
  useState(() => {
    async function fetchData() {
      // Get storage usage
      const { data: usageData } = await supabase
        .from('storage_usage')
        .select('*')
        .limit(1)
        .single();
      
      if (usageData) {
        setStorageUsage({
          total: usageData.total_bytes,
          max: usageData.max_bytes
        });
      }
      
      // Get backup links
      const { data: links } = await supabase
        .from('backup_links')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (links) {
        setBackupLinks(links);
      }
    }
    
    fetchData();
  }, []);
  
  // Generate and download report
  const handleGenerateReport = async () => {
    if (!fileName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a file name",
        variant: "destructive"
      });
      return;
    }
    
    setGenerating(true);
    
    try {
      const reportBlob = await generateDataReport(fileName);
      
      if (reportBlob) {
        downloadReport(reportBlob, fileName);
        toast({
          title: "Success",
          description: "Data report generated successfully!"
        });
      } else {
        throw new Error("Failed to generate report");
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate data report",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };
  
  // Save backup link
  const handleSaveLink = async () => {
    if (!linkTitle || !linkUrl) {
      toast({
        title: "Error",
        description: "Title and URL are required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('backup_links')
        .insert({
          title: linkTitle,
          url: linkUrl,
          description: linkDescription || null,
          created_by: user?.id || ""
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Backup link added successfully"
      });
      
      // Refresh links
      const { data: links } = await supabase
        .from('backup_links')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (links) {
        setBackupLinks(links);
      }
      
      // Reset form
      setLinkTitle("");
      setLinkUrl("");
      setLinkDescription("");
      setShowLinkDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save backup link",
        variant: "destructive"
      });
    }
  };
  
  // Clear database
  const handleClearDatabase = async () => {
    try {
      // Delete progress entries
      await supabase.from('progress_entries').delete().neq('id', 'placeholder');
      
      // Delete payment requests
      await supabase.from('payment_requests').delete().neq('id', 'placeholder');
      
      // Delete payment purposes
      await supabase.from('payment_purposes').delete().neq('id', 'placeholder');
      
      // Delete payment status history
      await supabase.from('payment_status_history').delete().neq('id', 'placeholder');
      
      // Delete photos (but keep references in storage)
      await supabase.from('photos').delete().neq('id', 'placeholder');
      
      // Delete projects
      await supabase.from('projects').delete().neq('id', 'placeholder');
      
      // Reset storage usage
      await supabase.from('storage_usage')
        .update({ total_bytes: 0, updated_at: new Date().toISOString() })
        .eq('id', (await supabase.from('storage_usage').select('id').limit(1).single()).data?.id);
      
      toast({
        title: "Success",
        description: "Database cleared successfully! User data, vehicle data, and backup links are preserved."
      });
      
      setShowDeleteDialog(false);
      
      // Update storage usage display
      setStorageUsage(prev => prev ? { ...prev, total: 0 } : null);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to clear database",
        variant: "destructive"
      });
    }
  };
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getUsagePercentage = () => {
    if (!storageUsage) return 0;
    return Math.round((storageUsage.total / storageUsage.max) * 100);
  };
  
  const usagePercentage = getUsagePercentage();

  return (
    <ClassicLayout requiredRoles={["admin", "owner"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Data Backup &amp; Management</h1>
        
        {/* Storage Usage Card */}
        <Card className="card-90s">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileArchive className="h-5 w-5" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            {storageUsage ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used: {formatBytes(storageUsage.total)}</span>
                    <span>Max: {formatBytes(storageUsage.max)}</span>
                  </div>
                  <div className="w-full h-4 bg-white border-inset">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: `${usagePercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-center">{usagePercentage}% used</div>
                </div>
                
                {usagePercentage >= 90 && (
                  <Alert variant="destructive" className="border-outset">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Storage Alert</AlertTitle>
                    <AlertDescription>
                      Storage usage is at {usagePercentage}%. Please backup data and consider clearing old entries.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <p>Loading storage information...</p>
            )}
          </CardContent>
        </Card>
        
        {/* Backup Generation Card */}
        <Card className="card-90s">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Generate Data Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Generate a complete Word document containing all projects, progress entries, payments, and other data.</p>
            
            <div className="space-y-2">
              <Label htmlFor="fileName">File Name</Label>
              <Input 
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="input-90s"
              />
            </div>
            
            <Button 
              onClick={handleGenerateReport}
              disabled={generating} 
              className="w-full btn-90s"
            >
              {generating ? "Generating..." : "Generate & Download Report"}
            </Button>
          </CardContent>
        </Card>
        
        {/* Backup Links Management (Admin Only) */}
        {user?.role === "admin" && (
          <Card className="card-90s">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Backup Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Store important links for backup purposes. These links will be visible to owners.</p>
              
              <Button 
                onClick={() => setShowLinkDialog(true)}
                className="w-full btn-90s"
              >
                <Upload className="h-4 w-4 mr-2" />
                Add New Backup Link
              </Button>
              
              {backupLinks.length > 0 ? (
                <div className="border border-border rounded">
                  {backupLinks.map((link, index) => (
                    <div 
                      key={link.id}
                      className={`p-3 ${index !== backupLinks.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <div className="font-bold">{link.title}</div>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary underline text-sm"
                      >
                        {link.url}
                      </a>
                      {link.description && (
                        <p className="text-sm mt-1">{link.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground">No backup links added yet</p>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Database Management (Admin Only) */}
        {user?.role === "admin" && usagePercentage >= 90 && (
          <Card className="card-90s border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Clear Database
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive" className="border-outset">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning: Destructive Action</AlertTitle>
                <AlertDescription>
                  This will permanently delete all projects, progress entries, payments, and associated data. 
                  User accounts, vehicle information, and backup links will be preserved.
                </AlertDescription>
              </Alert>
              
              <Button 
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="w-full btn-90s"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Database
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Confirmation Dialog for Database Clearing */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="border-outset card-90s">
          <DialogHeader>
            <DialogTitle>Confirm Database Clearing</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Alert variant="destructive" className="border-outset">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning!</AlertTitle>
              <AlertDescription>
                This action cannot be undone. Make sure you have downloaded a backup of all data before proceeding.
              </AlertDescription>
            </Alert>
            <p>The following data will be permanently removed:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>All projects</li>
              <li>All progress entries</li>
              <li>All payment requests</li>
              <li>All photos metadata</li>
            </ul>
            <p>The following data will be preserved:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>User accounts and credentials</li>
              <li>Vehicle and driver information</li>
              <li>Backup links</li>
            </ul>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleClearDatabase}>Confirm Clear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for Adding Backup Links */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="border-outset card-90s">
          <DialogHeader>
            <DialogTitle>Add Backup Link</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkTitle">Title</Label>
              <Input 
                id="linkTitle"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                className="input-90s"
                placeholder="Google Drive Backup"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkUrl">URL</Label>
              <Input 
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="input-90s"
                placeholder="https://drive.google.com/..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkDescription">Description (Optional)</Label>
              <Input 
                id="linkDescription"
                value={linkDescription}
                onChange={(e) => setLinkDescription(e.target.value)}
                className="input-90s"
                placeholder="Backup for Q2 2023"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveLink}>Save Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ClassicLayout>
  );
}
