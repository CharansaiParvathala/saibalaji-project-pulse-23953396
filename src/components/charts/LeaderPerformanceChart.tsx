
import { useState } from "react";
import { ProgressEntry } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { prepareLeaderData, COLORS } from "@/lib/statisticsHelpers";
import { X } from "lucide-react";

interface LeaderPerformanceChartProps {
  entries: ProgressEntry[];
}

export function LeaderPerformanceChart({ entries }: LeaderPerformanceChartProps) {
  const data = prepareLeaderData(entries);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Replace "Unknown" with "Leader" in names
  const processedData = data.map(item => ({
    ...item,
    name: item.name === "Unknown" ? "Leader" : item.name
  }));

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
            <p className="text-muted-foreground">No leader performance data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} km`, "Distance Completed"]}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Distance Completed" 
                fill={COLORS[0]} 
                label={{ 
                  position: 'top',
                  formatter: (value) => `${value} km`,
                  fontSize: 12
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
