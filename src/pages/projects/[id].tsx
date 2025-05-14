
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { getProject, getProgressEntries } from "@/lib/storage";
import { Project, ProgressEntry } from "@/types";
import { Calendar, Plus } from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;

    const projectData = getProject(id);
    if (projectData) {
      setProject(projectData);

      const entries = getProgressEntries().filter(
        (entry) => entry.projectId === id
      );
      setProgressEntries(entries);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-8">
          <p>Loading project details...</p>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-8">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">
              Project ID: {project.id}
            </p>
          </div>
          
          {user && (user.role === "leader" || user.role === "admin") && (
            <Link to={`/progress/add/${project.id}`}>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                Add Progress
              </Button>
            </Link>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Number of Workers</p>
                <p className="text-xl font-medium">{project.numWorkers}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="text-xl font-medium capitalize">{project.status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created By</p>
                <p className="text-xl font-medium">{project.createdBy}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created At</p>
                <p className="text-xl font-medium">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Progress Entries</CardTitle>
            {user && (user.role === "leader" || user.role === "admin") && (
              <Link to={`/progress/add/${project.id}`}>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Entry
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {progressEntries.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No progress entries yet</p>
                {user && (user.role === "leader" || user.role === "admin") && (
                  <Link to={`/progress/add/${project.id}`} className="mt-4 inline-block">
                    <Button variant="outline">Add First Entry</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {progressEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: {entry.status}
                      </p>
                    </div>
                    <Link to={`/progress/${entry.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
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
