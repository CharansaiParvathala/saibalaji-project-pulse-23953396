
import { useState, useEffect } from "react";
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
  Plus, LinkIcon, ExternalLink, Trash, Search, AlertCircle
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
    } catch (error) {
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Backup Links</h1>
          {isAdmin && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Link
            </Button>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Shared Backup Links</CardTitle>
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
                <p className="text-muted-foreground mb-2">No backup links found</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
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
      </div>
      
      {/* Add Link Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Backup Link</DialogTitle>
            <DialogDescription>
              Add a new backup link that will be visible to owner accounts.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://example.com/backup-location"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
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
              Cancel
            </Button>
            <Button type="button" onClick={handleAddLink}>
              Add Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
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
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteLink}
            >
              Delete Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
