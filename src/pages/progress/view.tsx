
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getProject, getProgressEntries } from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import { Project, ProgressEntry } from "@/types";
import { CalendarCheck, User, Clock } from "lucide-react";

export default function ViewProgress() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProgress, setTotalProgress] = useState<number>(0);

  useEffect(() => {
    if (!id) return;

    const projectData = getProject(id);
    const entries = getProgressEntries().filter((entry) => entry.projectId === id);
    
    // Sort entries by date, newest first
    entries.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    if (projectData) {
      setProject(projectData);
      setProgressEntries(entries);
      
      // Calculate total progress if project has total_distance
      if (projectData.total_distance) {
        const totalCompleted = entries.reduce(
          (sum, entry) => sum + (entry.distanceCompleted || 0), 
          0
        );
        setTotalProgress(Math.min(100, (totalCompleted / projectData.total_distance) * 100));
      }
    }
    
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-8">
          <p>Loading progress data...</p>
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
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{project.name} - Progress</h1>
          <p className="text-muted-foreground">
            View all progress updates for this project
          </p>
          
          {project.total_distance && (
            <div className="mt-6">
              <div className="flex justify-between mb-1 items-center">
                <h2 className="text-xl font-semibold">Overall Progress</h2>
                <span className="text-sm font-medium">{totalProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Progress History</CardTitle>
          </CardHeader>
          <CardContent>
            {progressEntries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No progress entries yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {progressEntries.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()} 
                          ({formatDistanceToNow(new Date(entry.date), { addSuffix: true })})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Reported by: {entry.userName || "Unknown"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Distance Completed</p>
                        <p className="font-semibold">{entry.distanceCompleted || 0} meters</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
                        <p className="font-semibold">{entry.timeSpent || 0} hours</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Workers Present</p>
                        <p className="font-semibold">{entry.workersPresent || 0} workers</p>
                      </div>
                    </div>
                    
                    {entry.notes && (
                      <>
                        <Separator className="my-3" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                          <p className="text-sm">{entry.notes}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
