
import { ProgressEntry, PaymentRequest, Project } from "@/types";

// Helper to get payments from the last N days
export const getRecentPayments = (days: number): PaymentRequest[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return getPaymentRequests().filter(payment => {
    const paymentDate = new Date(payment.requestedAt);
    return paymentDate >= cutoffDate;
  });
};

// Helper to get progress entries from the last N days
export const getRecentEntries = (days: number): ProgressEntry[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return getProgressEntries().filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= cutoffDate;
  });
};

// Colors for charts
export const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'
];

// Prepare data for expense by purpose chart
export const preparePurposeData = (payments: PaymentRequest[]) => {
  const purposeTotals: Record<string, number> = {
    food: 0,
    fuel: 0,
    labour: 0,
    vehicle: 0,
    water: 0,
    other: 0,
  };
  
  payments.forEach(payment => {
    payment.purposes.forEach(purpose => {
      // Divide the amount by the number of purposes to avoid double counting
      purposeTotals[purpose] += payment.amount / payment.purposes.length;
    });
  });
  
  return Object.keys(purposeTotals).map(purpose => ({
    name: purpose.charAt(0).toUpperCase() + purpose.slice(1),
    value: purposeTotals[purpose]
  }));
};

// Prepare data for project completion chart
export const prepareProjectData = (entries: ProgressEntry[], projects: Project[]) => {
  const projectCounts: Record<string, number> = {};
  
  entries.forEach(entry => {
    if (!projectCounts[entry.projectId]) {
      projectCounts[entry.projectId] = 0;
    }
    projectCounts[entry.projectId]++;
  });
  
  return Object.keys(projectCounts).map(projectId => {
    const project = projects.find(p => p.id === projectId);
    return {
      name: project ? project.name : `Project ${projectId}`,
      count: projectCounts[projectId]
    };
  });
};

// Prepare data for leader performance chart
export const prepareLeaderData = (entries: ProgressEntry[]) => {
  const leaderCounts: Record<string, number> = {};
  
  entries.forEach(entry => {
    if (!leaderCounts[entry.submittedBy]) {
      leaderCounts[entry.submittedBy] = 0;
    }
    leaderCounts[entry.submittedBy]++;
  });
  
  return Object.keys(leaderCounts).map(leaderId => ({
    name: `Leader ${leaderId}`,
    entries: leaderCounts[leaderId]
  }));
};

// Prepare data for payment status chart
export const prepareStatusData = (payments: PaymentRequest[]) => {
  const statusCounts: Record<string, number> = {
    "pending": 0,
    "approved": 0,
    "rejected": 0,
    "scheduled": 0,
    "paid": 0
  };
  
  payments.forEach(payment => {
    statusCounts[payment.status]++;
  });
  
  return Object.keys(statusCounts).map(status => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    count: statusCounts[status]
  }));
};

// Import at the bottom to avoid circular dependencies
import { getProjects, getProgressEntries, getPaymentRequests } from "@/lib/storage";
