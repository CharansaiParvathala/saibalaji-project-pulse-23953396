
import { PaymentRequest, ProgressEntry, Project } from "@/types";
import { getProgressEntries, getPaymentRequests } from "@/lib/storage";

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

// Helper function to prepare data for leader performance chart
export const prepareLeaderData = (entries: ProgressEntry[]) => {
  const leaderCounts: Record<string, number> = {};
  
  entries.forEach((entry) => {
    if (!leaderCounts[entry.submittedBy]) {
      leaderCounts[entry.submittedBy] = 0;
    }
    leaderCounts[entry.submittedBy]++;
  });
  
  return Object.keys(leaderCounts).map((leader) => ({
    name: `Leader ${leader.substring(0, 5)}`,
    entries: leaderCounts[leader]
  }));
};

// Helper function to prepare data for project activity chart
export const prepareProjectData = (entries: ProgressEntry[], projects: Project[]) => {
  const projectCounts: Record<string, number> = {};
  const projectNames: Record<string, string> = {};
  
  // Create a mapping of project IDs to names
  projects.forEach((project) => {
    projectNames[project.id] = project.name;
  });
  
  entries.forEach((entry) => {
    if (!projectCounts[entry.projectId]) {
      projectCounts[entry.projectId] = 0;
    }
    projectCounts[entry.projectId]++;
  });
  
  return Object.keys(projectCounts).map((projectId) => ({
    name: projectNames[projectId] || `Project ${projectId.substring(0, 5)}`,
    count: projectCounts[projectId]
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

// Functions to get recent data
export const getRecentPayments = (days: number): PaymentRequest[] => {
  const allPayments = getPaymentRequests();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return allPayments.filter(payment => {
    const paymentDate = new Date(payment.requestedAt);
    return paymentDate >= cutoffDate;
  });
};

export const getRecentEntries = (days: number): ProgressEntry[] => {
  const allEntries = getProgressEntries();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return allEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= cutoffDate;
  });
};
