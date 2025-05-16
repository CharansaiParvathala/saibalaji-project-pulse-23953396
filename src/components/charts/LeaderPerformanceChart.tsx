
import { ProgressEntry } from "@/types";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, Cell, ResponsiveContainer 
} from "recharts";
import { COLORS, prepareLeaderData } from "@/lib/statisticsHelpers";

interface LeaderPerformanceChartProps {
  entries: ProgressEntry[];
  title: string;
}

export function LeaderPerformanceChart({ entries, title }: LeaderPerformanceChartProps) {
  const data = prepareLeaderData(entries);

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
            <Bar dataKey="entries" fill="#82ca9d" name="Progress Entries">
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
