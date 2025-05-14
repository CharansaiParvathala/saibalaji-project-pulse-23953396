
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjects } from "@/lib/storage";
import { Project } from "@/types";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = () => {
      const allProjects = getProjects();
      
      let filteredProjects = allProjects;
      // For leaders, only show their created projects
      if (user && user.role === "leader") {
        filteredProjects = allProjects.filter(project => project.createdBy === user.id);
      }
      
      setProjects(filteredProjects);
      setLoading(false);
    };

    fetchProjects();
  }, [user]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Projects</h1>
          {user && (user.role === "leader" || user.role === "admin") && (
            <Link to="/projects/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <p>Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-4">No projects found</p>
              {user && (user.role === "leader" || user.role === "admin") && (
                <Link to="/projects/create">
                  <Button>Create Your First Project</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Workers:</strong> {project.numWorkers}</p>
                    <p><strong>Status:</strong> {project.status}</p>
                    <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
                    <div className="pt-4">
                      <Link to={`/projects/${project.id}`}>
                        <Button variant="outline" className="w-full">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
