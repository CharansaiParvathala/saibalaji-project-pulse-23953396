
import { PaymentRequest, ProgressEntry, Project } from "@/types";

// Color palette for charts
export const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
  "#82CA9D", "#FFC658", "#FF6B6B", "#6A5ACD", "#20B2AA"
];

// Helper function to prepare data for payment purpose piechart
export const preparePurposeData = (payments: PaymentRequest[]) => {
  const purposeTotals: Record<string, number> = {};
  
  payments.forEach((payment) => {
    // If we have purposeCosts, use them
    if (payment.purposeCosts) {
      Object.entries(payment.purposeCosts).forEach(([purpose, cost]) => {
        if (!purposeTotals[purpose]) {
          purposeTotals[purpose] = 0;
        }
        purposeTotals[purpose] += cost;
      });
    } else {
      // Fall back to old method for backward compatibility
      const purposeCount = payment.purposes.length;
      const amountPerPurpose = payment.amount / purposeCount;
      
      payment.purposes.forEach((purpose) => {
        if (!purposeTotals[purpose]) {
          purposeTotals[purpose] = 0;
        }
        purposeTotals[purpose] += amountPerPurpose;
      });
    }
  });
  
  return Object.keys(purposeTotals).map((purpose) => ({
    name: purpose.charAt(0).toUpperCase() + purpose.slice(1),
    value: parseFloat(purposeTotals[purpose].toFixed(2)),
  }));
};

// Helper function to prepare data for payment status chart
export const prepareStatusData = (payments: PaymentRequest[]) => {
  const statusCounts: Record<string, number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
    scheduled: 0,
    paid: 0,
  };
  
  payments.forEach((payment) => {
    if (statusCounts[payment.status] !== undefined) {
      statusCounts[payment.status]++;
    }
  });
  
  return Object.keys(statusCounts).map((status) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    count: statusCounts[status],
  }));
};

// Helper function to calculate project progress
export const calculateProjectProgress = (
  project: Project, 
  progressEntries: ProgressEntry[]
): number => {
  if (!project.totalDistance || project.totalDistance <= 0) {
    return 0;
  }
  
  const projectEntries = progressEntries.filter(entry => entry.projectId === project.id);
  const totalCompletedDistance = projectEntries.reduce(
    (sum, entry) => sum + (entry.distanceCompleted || 0), 
    0
  );
  
  return Math.min(100, (totalCompletedDistance / project.totalDistance) * 100);
};
