
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { generateReport, downloadReport } from "@/lib/documentGenerator";
import { Project, ProgressEntry, PaymentRequest } from "@/types";
import { getFromStorage } from "@/lib/storage";

export default function BackupDownloadPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"docx" | "pdf">("docx");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedContent, setSelectedContent] = useState({
    projects: true,
    progress: true,
    payments: true,
    vehicles: true
  });

  const handleReportGenerate = async () => {
    setIsGenerating(true);
    setProgress(10);
    
    try {
      // Load data from storage
      const projects = getFromStorage<Project[]>("sai-balaji-projects") || [];
      setProgress(30);
      
      const progressEntries = getFromStorage<ProgressEntry[]>("sai-balaji-progress-entries") || [];
      setProgress(50);
      
      const paymentRequests = getFromStorage<PaymentRequest[]>("sai-balaji-payment-requests") || [];
      setProgress(70);
      
      // Filter data based on selections
      const filteredProjects = selectedContent.projects ? projects : [];
      const filteredProgress = selectedContent.progress ? progressEntries : [];
      const filteredPayments = selectedContent.payments ? paymentRequests : [];
      
      // Generate report
      const reportBlob = await generateReport({
        title: "Sai Balaji Construction - Data Report",
        projects: filteredProjects,
        progressEntries: filteredProgress,
        paymentRequests: filteredPayments,
        generatedBy: user?.name || "System",
        generatedDate: new Date().toISOString()
      }, activeTab);
      
      setProgress(90);
      
      // Download the report
      downloadReport(
        reportBlob, 
        `sai-balaji-report-${new Date().toISOString().split('T')[0]}.${activeTab}`
      );
      
      setProgress(100);
      
      toast({
        title: "Report Generated Successfully",
        description: `Your ${activeTab.toUpperCase()} report has been downloaded.`,
      });
      
    } catch (error: any) {
      console.error("Error generating report:", error);
      toast({
        title: "Report Generation Failed",
        description: error.message || "An error occurred while generating the report",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <Layout requiredRoles={["admin", "owner"]}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t('backup.downloadReport')}</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>
              Create a comprehensive report with selected data from the system
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as "docx" | "pdf")} 
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="docx" disabled={isGenerating}>
                  <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.5 21H4.5C3.67157 21 3 20.3284 3 19.5V4.5C3 3.67157 3.67157 3 4.5 3H19.5C20.3284 3 21 3.67157 21 4.5V19.5C21 20.3284 20.3284 21 19.5 21Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 7L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M7 12L17 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M7 17L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Word Document (.docx)
                </TabsTrigger>
                <TabsTrigger value="pdf" disabled={isGenerating}>
                  <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17V11M12 11V5M12 11H18M12 11H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  PDF Document (.pdf)
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="docx" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Word Document Options</h3>
                  <p className="text-muted-foreground text-sm">
                    Generate a well-formatted Word document that includes tables, sections, and a table of contents.
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Content to Include</h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="projects-docx" 
                        checked={selectedContent.projects} 
                        onCheckedChange={(checked) => 
                          setSelectedContent({...selectedContent, projects: !!checked})
                        }
                      />
                      <Label htmlFor="projects-docx">Projects</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="progress-docx" 
                        checked={selectedContent.progress} 
                        onCheckedChange={(checked) => 
                          setSelectedContent({...selectedContent, progress: !!checked})
                        }
                      />
                      <Label htmlFor="progress-docx">Progress Entries</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="payments-docx" 
                        checked={selectedContent.payments} 
                        onCheckedChange={(checked) => 
                          setSelectedContent({...selectedContent, payments: !!checked})
                        }
                      />
                      <Label htmlFor="payments-docx">Payment Requests</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="vehicles-docx" 
                        checked={selectedContent.vehicles} 
                        onCheckedChange={(checked) => 
                          setSelectedContent({...selectedContent, vehicles: !!checked})
                        }
                      />
                      <Label htmlFor="vehicles-docx">Vehicles</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Document Elements</h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="toc" defaultChecked={true} disabled />
                      <Label htmlFor="toc">Table of Contents</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pagination" defaultChecked={true} disabled />
                      <Label htmlFor="pagination">Page Numbers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cover" defaultChecked={true} disabled />
                      <Label htmlFor="cover">Cover Page</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="pdf" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">PDF Document Options</h3>
                  <p className="text-muted-foreground text-sm">
                    Generate a portable PDF document ideal for sharing and printing.
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Content to Include</h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="projects-pdf" 
                        checked={selectedContent.projects} 
                        onCheckedChange={(checked) => 
                          setSelectedContent({...selectedContent, projects: !!checked})
                        }
                      />
                      <Label htmlFor="projects-pdf">Projects</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="progress-pdf" 
                        checked={selectedContent.progress} 
                        onCheckedChange={(checked) => 
                          setSelectedContent({...selectedContent, progress: !!checked})
                        }
                      />
                      <Label htmlFor="progress-pdf">Progress Entries</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="payments-pdf" 
                        checked={selectedContent.payments} 
                        onCheckedChange={(checked) => 
                          setSelectedContent({...selectedContent, payments: !!checked})
                        }
                      />
                      <Label htmlFor="payments-pdf">Payment Requests</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="vehicles-pdf" 
                        checked={selectedContent.vehicles} 
                        onCheckedChange={(checked) => 
                          setSelectedContent({...selectedContent, vehicles: !!checked})
                        }
                      />
                      <Label htmlFor="vehicles-pdf">Vehicles</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">PDF Settings</h4>
                    <div>
                      <Label>Paper Size</Label>
                      <RadioGroup defaultValue="a4" className="mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="a4" id="a4" />
                          <Label htmlFor="a4">A4</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="letter" id="letter" />
                          <Label htmlFor="letter">US Letter</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <Separator />
            
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Generating report...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              disabled={isGenerating}
            >
              Back
            </Button>
            <Button 
              onClick={handleReportGenerate}
              disabled={isGenerating || !Object.values(selectedContent).some(Boolean)}
            >
              {isGenerating ? "Generating..." : `Generate ${activeTab.toUpperCase()} Report`}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Report Features</CardTitle>
            <CardDescription>
              Key features of the generated reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Word Document (.docx)</h3>
                <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                  <li>Professional document formatting</li>
                  <li>Clickable table of contents</li>
                  <li>Structured sections with headings</li>
                  <li>Tabular data presentation</li>
                  <li>Proper pagination and layout</li>
                  <li>Can be edited in Microsoft Word or similar applications</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">PDF Document (.pdf)</h3>
                <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                  <li>Universal format readable on any device</li>
                  <li>Perfect for printing and sharing</li>
                  <li>Smaller file size</li>
                  <li>Professional layout and design</li>
                  <li>Supports bookmarks for navigation</li>
                  <li>Better security features</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
