
import { Project } from "@/types";
import { STORAGE_KEYS } from "../constants";
import { getFromStorage, saveToStorage } from "../utils";

// Projects
export function getProjects(): Project[] {
  return getFromStorage<Project>(STORAGE_KEYS.PROJECTS);
}

export function getProject(id: string): Project | undefined {
  const projects = getProjects();
  return projects.find((project) => project.id === id);
}

export function saveProject(project: Project): Project {
  const projects = getProjects();
  projects.push(project);
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  return project;
}

export function updateProject(updatedProject: Project): Project {
  const projects = getProjects();
  const index = projects.findIndex((project) => project.id === updatedProject.id);
  
  if (index !== -1) {
    projects[index] = updatedProject;
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  }
  
  return updatedProject;
}
