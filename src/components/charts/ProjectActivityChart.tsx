
import { ProgressEntry, Project } from "@/types";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, Cell, ResponsiveContainer 
} from "recharts";
import { COLORS, prepareProjectData } from "@/lib/statisticsHelpers";

interface ProjectActivityChartProps {
  entries: ProgressEntry[];
  projects: Project[];
  title: string;
}

export function ProjectActivityChart({ entries, projects, title }: ProjectActivityChartProps) {
  const data = prepareProjectData(entries, projects);

  return (
    <div className="h-80">
      {entries.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Progress Entries">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
