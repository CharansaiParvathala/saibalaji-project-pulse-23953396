
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { generateId, getProject, saveProgressEntry, getProgressEntries } from "@/lib/storage";
import { useAuth } from "@/hooks/useAuth";

interface ProgressFormValues {
  distanceCompleted: number;
  timeSpent: number;
  workersPresent: number;
  notes: string;
}

export default function AddProgress() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [today] = useState(new Date().toISOString().split('T')[0]); // Today's date in YYYY-MM-DD format
  const [existingEntries, setExistingEntries] = useState<any[]>([]);

  const form = useForm<ProgressFormValues>({
    defaultValues: {
      distanceCompleted: 0,
      timeSpent: 0,
      workersPresent: 0,
      notes: "",
    },
  });

  useEffect(() => {
    if (!projectId || !user) return;

    // Load project data
    const projectData = getProject(projectId);
    if (projectData) {
      setProject(projectData);
      
      // Check if user has already submitted progress for this project today
      const allEntries = getProgressEntries();
      const todayDateStr = new Date().toISOString().split('T')[0];
      
      const todayEntries = allEntries.filter(
        entry => entry.projectId === projectId && 
                 entry.createdBy === user.id && 
                 entry.date.startsWith(todayDateStr)
      );
      
      setExistingEntries(todayEntries);
    }
    
    setLoading(false);
  }, [projectId, user]);

  const onSubmit = async (data: ProgressFormValues) => {
    if (!projectId || !user) return;
    
    try {
      // Check if this project has totalDistance defined
      if (project.totalDistance === undefined) {
        toast({
          title: "Error",
          description: "This project does not have a total distance defined.",
          variant: "destructive",
        });
        return;
      }
      
      // Create the progress entry
      const newEntry = {
        id: generateId(),
        projectId,
        distanceCompleted: parseFloat(data.distanceCompleted.toString()),
        timeSpent: parseFloat(data.timeSpent.toString()),
        workersPresent: parseInt(data.workersPresent.toString()),
        notes: data.notes,
        createdBy: user.id,
        userName: user.name,
        date: new Date().toISOString(),
      };
      
      // Calculate the total progress including today's entry
      const totalCompletedSoFar = existingEntries.reduce(
        (sum, entry) => sum + (entry.distanceCompleted || 0), 
        0
      );
      
      const newTotalCompleted = totalCompletedSoFar + newEntry.distanceCompleted;
      
      // Check if the new total exceeds the project's total distance
      if (newTotalCompleted > project.totalDistance) {
        toast({
          title: "Warning",
          description: `Total completed distance (${newTotalCompleted}m) exceeds project total distance (${project.totalDistance}m). Please enter a smaller value.`,
          variant: "destructive",
        });
        return;
      }
      
      // Save to storage
      saveProgressEntry(newEntry);
      
      toast({
        title: "Success",
        description: "Progress has been recorded successfully.",
      });
      
      // Navigate back to projects
      navigate("/progress");
      
    } catch (error) {
      console.error("Error saving progress:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-8">
          <p>Loading project data...</p>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="py-8">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p>The project you're looking for doesn't exist.</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate("/projects")}
          >
            Back to Projects
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add Progress for: {project.name}</h1>
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>

        {existingEntries.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Today's Progress</CardTitle>
              <CardDescription>
                You have already recorded progress entries today for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {existingEntries.map((entry) => (
                  <div key={entry.id} className="border-b pb-2 last:border-0">
                    <p className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleTimeString()}
                    </p>
                    <p>Distance completed: {entry.distanceCompleted} meters</p>
                    <p>Time spent: {entry.timeSpent} hours</p>
                  </div>
                ))}
                <div className="mt-4 pt-2 border-t">
                  <p className="font-medium">
                    Total today: {existingEntries.reduce((sum, entry) => sum + entry.distanceCompleted, 0)} meters
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Record Today's Progress</CardTitle>
            <CardDescription>
              Enter the work completed today ({today})
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="distanceCompleted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distance Completed (meters)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.1" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the distance covered in meters today
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeSpent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Spent (hours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.5" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the number of hours worked
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workersPresent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workers Present</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the number of workers present today
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any additional information about today's work"
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit Progress</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </Layout>
  );
}
