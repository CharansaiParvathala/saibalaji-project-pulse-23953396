
import { useState } from "react";
import { ProgressEntry, Project } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { prepareProjectData, COLORS } from "@/lib/statisticsHelpers";
import { X } from "lucide-react";

interface ProjectActivityChartProps {
  entries: ProgressEntry[];
  projects: Project[];
}

export function ProjectActivityChart({ entries, projects }: ProjectActivityChartProps) {
  const data = prepareProjectData(entries, projects);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get project names from data
  const projectNames = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== "date") 
    : [];

  return (
    <div 
      className={`${isExpanded ? 'fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-6' : 'h-full'}`}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      <div 
        className={`relative bg-background rounded-lg ${isExpanded ? 'w-full h-full max-w-4xl max-h-[80vh]' : 'w-full h-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {isExpanded && (
          <button 
            className="absolute right-2 top-2 p-2 bg-muted rounded-full hover:bg-muted-foreground/20 z-10"
            onClick={() => setIsExpanded(false)}
          >
            <X size={20} />
          </button>
        )}
        
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No project activity data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 50
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-35} 
                textAnchor="end" 
                height={70} 
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} km`, ""]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend wrapperStyle={{ bottom: 0 }} />
              
              {projectNames.map((name, index) => (
                <Bar 
                  key={name} 
                  dataKey={name} 
                  stackId="a" 
                  fill={COLORS[index % COLORS.length]} 
                  name={name.replace("Unknown", "Project")}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
