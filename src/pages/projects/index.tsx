import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileEdit, BarChart } from "lucide-react";
import { getProjects, getProgressEntries } from "@/lib/storage";
import { useAuth } from "@/hooks/useAuth";
import { Project } from "@/types";

interface ProjectsProps {
  showProgressButton?: boolean;
}

export default function Projects({ showProgressButton = false }: ProjectsProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectProgress, setProjectProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load projects and calculate progress
    const loadProjects = async () => {
      const allProjects = getProjects();
      const visibleProjects = user?.role === "admin"
        ? allProjects
        : allProjects.filter(project => project.created_by === user?.id);
      
      setProjects(visibleProjects);

      // Get progress data
      const progressEntries = getProgressEntries();
      
      // Calculate progress for each project
      const progress: Record<string, number> = {};
      visibleProjects.forEach(project => {
        if (project.total_distance) {
          const projectEntries = progressEntries.filter(entry => entry.projectId === project.id);
          const totalCompletedDistance = projectEntries.reduce(
            (sum, entry) => sum + (entry.distanceCompleted || 0),
            0
          );
          progress[project.id] = Math.min(100, (totalCompletedDistance / project.total_distance) * 100);
        } else {
          progress[project.id] = 0;
        }
      });
      
      setProjectProgress(progress);
      setLoading(false);
    };

    loadProjects();
  }, [user]);

  const handleCreateProject = () => {
    navigate("/projects/create");
  };

  const buttonLabel = showProgressButton ? "Add Progress" : "View Details";
  const buttonAction = showProgressButton
    ? (projectId: string) => navigate(`/progress/add/${projectId}`)
    : (projectId: string) => navigate(`/projects/${projectId}`);
  const ButtonIcon = showProgressButton ? FileEdit : undefined;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {showProgressButton ? "Select Project to Add Progress" : "Projects"}
          </h1>
          
          {(user?.role === "leader" || user?.role === "admin") && !showProgressButton && (
            <Button onClick={handleCreateProject}>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
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
              {(user?.role === "leader" || user?.role === "admin") && (
                <Button onClick={handleCreateProject}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                    <div className="text-sm text-muted-foreground mb-2">
                      <p>Workers: {project.num_workers}</p>
                      <p>Status: {project.status.charAt(0).toUpperCase() + project.status.slice(1)}</p>
                      {project.total_distance !== undefined && (
                        <p>Total Distance: {project.total_distance} meters</p>
                      )}
                    </div>
                    
                    {project.total_distance !== undefined && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${projectProgress[project.id] || 0}%` }}
                          />
                        </div>
                        <p className="text-xs mt-1 text-right">{(projectProgress[project.id] || 0).toFixed(1)}% complete</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t p-4 bg-muted/20 flex gap-2">
                    <Button 
                      onClick={() => buttonAction(project.id)}
                      variant="default"
                      className="flex-1"
                    >
                      {ButtonIcon && <ButtonIcon className="mr-2 h-4 w-4" />}
                      {buttonLabel}
                    </Button>
                    
                    {/* View Progress Button */}
                    <Button 
                      onClick={() => navigate(`/progress/view/${project.id}`)}
                      variant="outline"
                      className="flex-none"
                    >
                      <BarChart className="h-4 w-4" />
                    </Button>
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
