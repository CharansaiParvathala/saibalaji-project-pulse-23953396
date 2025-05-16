
import { PaymentRequest } from "@/types";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { prepareStatusData, COLORS } from "@/lib/statisticsHelpers";
import { useState } from "react";
import { X } from "lucide-react";

interface PaymentStatusChartProps {
  payments: PaymentRequest[];
  title: string;
}

export function PaymentStatusChart({ payments, title }: PaymentStatusChartProps) {
  const data = prepareStatusData(payments);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`${isExpanded ? 'fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-6' : 'h-80'}`}
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
        
        {payments.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={isExpanded ? 60 : 30}
                outerRadius={isExpanded ? 120 : 60}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="count"
                nameKey="name"
                label={({ name, percent }) => percent > 0.01 ? `${name} ${(percent * 100).toFixed(0)}%` : null}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
