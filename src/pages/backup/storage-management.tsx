import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { generateDocx } from "@/lib/documentGenerator";
import { 
  Save, Database, DownloadCloud, AlertTriangle, Trash2, HardDrive
} from "lucide-react";
import { StorageMetrics } from "@/types";

export default function StorageManagementPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [storageMetrics, setStorageMetrics] = useState<StorageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showStorageWarning, setShowStorageWarning] = useState(false);
  
  const [documentName, setDocumentName] = useState("");
  
  useEffect(() => {
    fetchStorageMetrics();
  }, []);
  
  const fetchStorageMetrics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('storage_metrics')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        console.error("Error fetching storage metrics:", error);
        // Create default metrics if none exist
        const newMetrics = {
          total_size: 1000000000, // 1GB
          used_size: 0,
          percentage_used: 0
        };
        
        const { data: insertedData, error: insertError } = await supabase
          .from('storage_metrics')
          .insert([newMetrics])
          .select()
          .single();
          
        if (insertError) {
          throw insertError;
        }
        
        setStorageMetrics(insertedData);
      } else {
        setStorageMetrics(data);
        
        // Check if we should show storage warning
        if (data.percentage_used >= 90) {
          setShowStorageWarning(true);
        }
      }
    } catch (error) {
      console.error("Error with storage metrics:", error);
      toast({
        title: "Error",
        description: "Failed to load storage information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownloadAllData = async () => {
    if (!documentName) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for the document.",
        variant: "destructive",
      });
      return;
    }
    
    setGenerating(true);
    
    try {
      // Fetch all required data
      const [
        projectsResponse, 
        progressResponse, 
        paymentsResponse
      ] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('progress_entries').select('*'),
        supabase.from('payment_requests').select('*')
      ]);
      
      if (projectsResponse.error) throw projectsResponse.error;
      if (progressResponse.error) throw progressResponse.error;
      if (paymentsResponse.error) throw paymentsResponse.error;
      
      const projects = projectsResponse.data || [];
      const progressEntries = progressResponse.data || [];
      const paymentRequests = paymentsResponse.data || [];
      
      // Generate document
      const docBlob = await generateDocx({
        title: documentName,
        projects,
        progressEntries,
        paymentRequests,
        generatedBy: user?.name || 'System',
        generatedDate: new Date().toISOString()
      });
      
      // Create download link
      const url = URL.createObjectURL(docBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentName.replace(/\s+/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Complete",
        description: "All data has been exported to a Word document.",
      });
      
      setShowDownloadDialog(false);
      setDocumentName("");
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Error",
        description: "Failed to generate the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };
  
  const handleClearDatabase = async () => {
    setLoading(true);
    
    try {
      // Delete data from tables in the right order (respect foreign keys)
      await supabase.from('payment_requests').delete().not('id', 'is', null);
      await supabase.from('progress_entries').delete().not('id', 'is', null);
      await supabase.from('projects').delete().not('id', 'is', null);
      
      // Delete files from storage buckets
      const { data: storageFiles } = await supabase.storage.from('meter_readings').list();
      if (storageFiles && storageFiles.length > 0) {
        const filePaths = storageFiles.map(file => file.name);
        await supabase.storage.from('meter_readings').remove(filePaths);
      }
      
      // Update storage metrics
      await supabase
        .from('storage_metrics')
        .update({
          used_size: 0,
          percentage_used: 0,
          last_updated: new Date().toISOString()
        })
        .eq('id', storageMetrics?.id);
      
      toast({
        title: "Database Cleared",
        description: "All project data, progress entries, and payment requests have been cleared.",
      });
      
      // Refresh storage metrics
      fetchStorageMetrics();
      setShowStorageWarning(false);
    } catch (error) {
      console.error("Error clearing database:", error);
      toast({
        title: "Error",
        description: "Failed to clear database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowClearDialog(false);
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const isAdmin = user?.role === "admin";
  const isOwner = user?.role === "owner";
  const canClearData = isOwner;
  
  return (
    <Layout requiredRoles={["admin", "owner"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Storage Management</h1>
          <Button 
            onClick={() => setShowDownloadDialog(true)}
            disabled={loading}
          >
            <DownloadCloud className="mr-2 h-4 w-4" /> Export All Data
          </Button>
        </div>
        
        {showStorageWarning && (
          <div className="bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 p-4 rounded-lg flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
                Storage Usage Warning
              </h4>
              <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed">
                Your storage usage has reached {storageMetrics?.percentage_used}%, which is above the recommended threshold. 
                Please consider downloading your data and clearing the database to free up space.
              </p>
              <div className="flex gap-3 mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-amber-600 dark:border-amber-700 text-amber-700 dark:text-amber-400"
                  onClick={() => setShowDownloadDialog(true)}
                >
                  Download Data
                </Button>
                {canClearData && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-amber-600 dark:border-amber-700 text-amber-700 dark:text-amber-400"
                    onClick={() => setShowClearDialog(true)}
                  >
                    Clear Database
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
            <CardDescription>
              Current storage usage and available space
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <p>Loading storage information...</p>
              </div>
            ) : storageMetrics ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Used Space</span>
                    <span className="text-sm font-medium">
                      {formatFileSize(storageMetrics.used_size)} / {formatFileSize(storageMetrics.total_size)}
                    </span>
                  </div>
                  <Progress 
                    value={storageMetrics.percentage_used}
                    className={`h-2 ${
                      storageMetrics.percentage_used > 90
                        ? 'bg-red-200 dark:bg-red-950'
                        : storageMetrics.percentage_used > 70
                        ? 'bg-yellow-200 dark:bg-yellow-950'
                        : 'bg-gray-200 dark:bg-gray-800'
                    }`}
                  />
                  <div className="flex justify-between text-xs">
                    <span>0%</span>
                    <span className={`${
                      storageMetrics.percentage_used > 90
                        ? 'text-red-500'
                        : storageMetrics.percentage_used > 70
                        ? 'text-yellow-500'
                        : ''
                    }`}>
                      {storageMetrics.percentage_used.toFixed(1)}%
                    </span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="border rounded-lg p-4 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <HardDrive className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Storage</p>
                      <p className="text-2xl font-semibold">
                        {formatFileSize(storageMetrics.total_size)}
                      </p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Used Storage</p>
                      <p className="text-2xl font-semibold">
                        {formatFileSize(storageMetrics.used_size)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(storageMetrics.last_updated).toLocaleString()}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Storage information not available</p>
                <Button 
                  variant="outline"
                  onClick={fetchStorageMetrics}
                >
                  Reload
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            {canClearData && (
              <Button 
                variant="destructive" 
                onClick={() => setShowClearDialog(true)}
                disabled={loading}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear Database
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowDownloadDialog(true)}
              disabled={loading}
              className="ml-auto"
            >
              <Save className="mr-2 h-4 w-4" /> Download All Data
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Download Document Dialog */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export All Data</DialogTitle>
            <DialogDescription>
              Download all project data, progress entries, and payment records as a Word document.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="document-name">Document Name</Label>
              <Input
                id="document-name"
                placeholder="Enter a name for your export document"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDocumentName("");
                setShowDownloadDialog(false);
              }}
              disabled={generating}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleDownloadAllData}
              disabled={!documentName || generating}
            >
              {generating ? "Generating..." : "Download Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Clear Database Alert Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Database</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all projects, progress entries, and payment requests. 
              User accounts, vehicles, drivers, and backup links will be preserved. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md p-3 my-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                <span className="font-medium">Important:</span> Please make sure you have downloaded a backup of all your data before proceeding.
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearDatabase}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Yes, Clear Database
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
