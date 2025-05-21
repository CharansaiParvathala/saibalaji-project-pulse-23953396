
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { saveProject } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types';
import { generateId } from '@/lib/storage/utils';

interface FormData {
  name: string;
  description: string;
  numWorkers: number;
  totalDistance: number;
}

const CreateProject = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    setSubmitting(true);
    try {
      const currentDate = new Date().toISOString();
      
      const newProject: Project = {
        id: generateId(),
        name: data.name,
        description: data.description,
        numWorkers: data.numWorkers,
        totalDistance: data.totalDistance,
        createdBy: user.id,
        createdAt: currentDate,
        status: 'active',
        
        // For backward compatibility
        created_by: user.id,
        created_at: currentDate,
        num_workers: data.numWorkers,
        total_distance: data.totalDistance
      };
      
      await saveProject(newProject);
      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout requiredRoles={['admin', 'leader']}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground">Fill in the project details below</p>
      </div>
      
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-soft p-6 max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Project name is required' })}
              placeholder="Enter project name"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter project description"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="numWorkers">Number of Workers</Label>
              <Input
                id="numWorkers"
                type="number"
                {...register('numWorkers', { 
                  required: 'Number of workers is required',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Must be at least 1' }
                })}
                placeholder="Enter number of workers"
                className={errors.numWorkers ? 'border-destructive' : ''}
              />
              {errors.numWorkers && (
                <p className="text-destructive text-sm mt-1">{errors.numWorkers.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="totalDistance">Total Distance (km)</Label>
              <Input
                id="totalDistance"
                type="number"
                step="0.01"
                {...register('totalDistance', { 
                  required: 'Total distance is required',
                  valueAsNumber: true,
                  min: { value: 0.01, message: 'Must be greater than 0' }
                })}
                placeholder="Enter total distance"
                className={errors.totalDistance ? 'border-destructive' : ''}
              />
              {errors.totalDistance && (
                <p className="text-destructive text-sm mt-1">{errors.totalDistance.message}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/projects')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateProject;
