import { PaymentRequest } from "@/types";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { COLORS } from "@/lib/statisticsHelpers";
import { useState } from "react";
import { X } from "lucide-react";

interface PurposeChartProps {
  payments: PaymentRequest[];
  title: string;
}

// New helper function to prepare purpose data with costs
const preparePurposeData = (payments: PaymentRequest[]) => {
  const purposeTotals: Record<string, number> = {};
  
  payments.forEach((payment) => {
    // If we have purposeCosts, use them
    if (payment.purposeCosts) {
      Object.entries(payment.purposeCosts).forEach(([purpose, cost]) => {
        if (!purposeTotals[purpose]) {
          purposeTotals[purpose] = 0;
        }
        if (typeof cost === 'number') {
          purposeTotals[purpose] += cost;
        } else {
          // Handle potential non-number values safely
          const costNumber = Number(cost);
          if (!isNaN(costNumber)) {
            purposeTotals[purpose] += costNumber;
          }
        }
      });
    } else if (payment.purposes && payment.purposes.length) {
      // Fall back to old method for backward compatibility
      const purposeCount = payment.purposes.length;
      const amountPerPurpose = payment.amount / purposeCount;
      
      payment.purposes.forEach((purpose) => {
        if (!purposeTotals[purpose]) {
          purposeTotals[purpose] = 0;
        }
        purposeTotals[purpose] += amountPerPurpose;
      });
    } else if (payment.purpose) {
      // Single purpose case
      if (!purposeTotals[payment.purpose]) {
        purposeTotals[payment.purpose] = 0;
      }
      purposeTotals[payment.purpose] += payment.amount;
    }
  });
  
  // Filter out entries with zero value before returning
  return Object.keys(purposeTotals)
    .filter(purpose => purposeTotals[purpose] > 0)
    .map((purpose) => ({
      name: purpose.charAt(0).toUpperCase() + purpose.slice(1),
      value: parseFloat(purposeTotals[purpose].toFixed(2)),
    }));
};

export function PurposeChart({ payments, title }: PurposeChartProps) {
  const data = preparePurposeData(payments);
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
                labelLine={false}
                outerRadius={isExpanded ? 150 : 80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => percent > 0.01 ? `${name} ${(percent * 100).toFixed(0)}%` : null}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `₹${value.toFixed(2)}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
