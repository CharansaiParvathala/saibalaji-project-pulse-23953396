
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Plus, LinkIcon, ExternalLink, Trash, Search, AlertCircle, 
  SlidersHorizontal, FileDown, FileUp
} from "lucide-react";

interface BackupLink {
  id: string;
  title: string;
  url: string;
  description: string | null;
  created_by: string;
  created_at: string;
}

export default function BackupLinksPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [links, setLinks] = useState<BackupLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<BackupLink | null>(null);
  
  // Form states
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  
  useEffect(() => {
    fetchBackupLinks();
  }, []);
  
  const fetchBackupLinks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('backup_links')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setLinks(data || []);
    } catch (error: any) {
      console.error("Error fetching backup links:", error);
      toast({
        title: "Error fetching backup links",
        description: "There was a problem loading the backup links.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const handleAddLink = async () => {
    if (!title || !url) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and URL.",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (including http:// or https://).",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('backup_links')
        .insert([
          {
            title,
            url,
            description: description || null,
            created_by: user?.id
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Link Added",
        description: `"${title}" has been added to backup links.`,
      });
      
      fetchBackupLinks();
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.error("Error adding backup link:", error);
      toast({
        title: "Error",
        description: error.message || "There was a problem adding the link.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteLink = async () => {
    if (!currentLink) return;
    
    try {
      const { error } = await supabase
        .from('backup_links')
        .delete()
        .eq('id', currentLink.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Link Deleted",
        description: `"${currentLink.title}" has been deleted.`,
      });
      
      fetchBackupLinks();
      setIsDeleteDialogOpen(false);
      setCurrentLink(null);
    } catch (error: any) {
      console.error("Error deleting backup link:", error);
      toast({
        title: "Error",
        description: error.message || "There was a problem deleting the link.",
        variant: "destructive",
      });
    }
  };
  
  const openDeleteDialog = (link: BackupLink) => {
    setCurrentLink(link);
    setIsDeleteDialogOpen(true);
  };
  
  const resetForm = () => {
    setTitle("");
    setUrl("");
    setDescription("");
  };
  
  // Filter links based on search query
  const filteredLinks = links.filter(
    link =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (link.description && link.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const isAdmin = user?.role === "admin";
  
  return (
    <Layout requiredRoles={["admin", "owner"]}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t('backup.backupLinks')}</h1>
          <div className="flex gap-2">
            {isAdmin && (
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-1">
                <Plus className="h-4 w-4" /> {t('backup.addBackupLink')}
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader className="space-y-0 pb-2">
              <CardTitle>{t('backup.sharedBackupLinks')}</CardTitle>
              <CardDescription>
                {isAdmin 
                  ? "Manage backup links that will be visible to owners" 
                  : "Access backup links shared by administrators"}
              </CardDescription>
              
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search links..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <p>Loading backup links...</p>
                </div>
              ) : filteredLinks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">{t('backup.noBackupLinks')}</p>
                  {searchQuery ? (
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search query
                    </p>
                  ) : isAdmin ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      Add your first backup link
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No backup links have been shared by administrators yet
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {filteredLinks.map((link) => (
                    <Card key={link.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-primary" />
                          {link.title}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground truncate">
                          {link.url}
                        </div>
                      </CardHeader>
                      {link.description && (
                        <CardContent className="p-4 pt-0 pb-2">
                          <p className="text-sm">{link.description}</p>
                        </CardContent>
                      )}
                      <div className="p-4 pt-2 flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">
                          Added on {new Date(link.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(link.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" /> Open
                          </Button>
                          {isAdmin && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openDeleteDialog(link)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <FileDown className="h-5 w-5 text-primary" /> 
                  {t('backup.downloadReport')}
                </CardTitle>
                <CardDescription>
                  Download all data as a report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('backup.selectFormat')}</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 flex items-center gap-2"
                      onClick={() => {
                        toast({
                          title: "Generating PDF",
                          description: "Your PDF report is being generated..."
                        });
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17V11M12 11V5M12 11H18M12 11H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 flex items-center gap-2"
                      onClick={() => {
                        toast({
                          title: "Generating Word Document",
                          description: "Your DOCX report is being generated..."
                        });
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.5 21H4.5C3.67157 21 3 20.3284 3 19.5V4.5C3 3.67157 3.67157 3 4.5 3H19.5C20.3284 3 21 3.67157 21 4.5V19.5C21 20.3284 20.3284 21 19.5 21Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M7 7L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M7 12L17 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M7 17L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Word
                    </Button>
                  </div>
                </div>
                <Button className="w-full">
                  <FileDown className="h-4 w-4 mr-2" /> {t('backup.downloadReport')}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-primary" /> 
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <FileUp className="h-4 w-4" /> {t('backup.exportData')}
                </Button>
                {isAdmin && (
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <FileDown className="h-4 w-4" /> {t('backup.importData')}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Add Link Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('backup.addBackupLink')}</DialogTitle>
            <DialogDescription>
              Add a new backup link that will be visible to owner accounts.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t('backup.linkTitle')}</Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">{t('backup.linkURL')}</Label>
              <Input
                id="url"
                placeholder="https://example.com/backup-location"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t('backup.linkDescription')}</Label>
              <Textarea
                id="description"
                placeholder="Add details about this backup link"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(false);
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button type="button" onClick={handleAddLink}>
              {t('backup.addBackupLink')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('backup.confirmDeletion')}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the backup link "{currentLink?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteLink}
            >
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
