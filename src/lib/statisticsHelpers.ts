
import { PaymentRequest, ProgressEntry, Project } from "@/types";

// Colors for charts
export const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", 
  "#82CA9D", "#FFC658", "#FF7300", "#A4DE6C", "#FF6B6B",
];

// Helper function to get recent payment requests (last 7 days)
export const getRecentPayments = (payments: PaymentRequest[]): PaymentRequest[] => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return payments.filter((payment) => {
    const paymentDate = new Date(payment.requestedAt);
    return paymentDate >= sevenDaysAgo;
  });
};

// Helper function to get recent progress entries (last 7 days)
export const getRecentEntries = (entries: ProgressEntry[]): ProgressEntry[] => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= sevenDaysAgo;
  });
};

// Helper function to prepare data for project activity chart
export const prepareProjectData = (entries: ProgressEntry[], projects: Project[]) => {
  // Group by date and project
  const dataByDate: Record<string, Record<string, number>> = {};
  
  // Create a map of project IDs to names
  const projectMap = new Map(projects.map(p => [p.id, p.name]));
  
  // Process entries
  entries.forEach(entry => {
    const date = new Date(entry.date).toISOString().split('T')[0]; // YYYY-MM-DD format
    const projectId = entry.projectId;
    const projectName = projectMap.get(projectId) || `Project ${projectId.substring(0, 4)}`;
    
    if (!dataByDate[date]) {
      dataByDate[date] = {};
    }
    
    if (!dataByDate[date][projectName]) {
      dataByDate[date][projectName] = 0;
    }
    
    dataByDate[date][projectName] += entry.distanceCompleted || 0;
  });
  
  // Convert to format needed for the chart
  return Object.entries(dataByDate)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
    .map(([date, projects]) => {
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ...projects
      };
    });
};

// Helper function to prepare data for leader performance chart
export const prepareLeaderData = (entries: ProgressEntry[]) => {
  // Group by leader
  const dataByLeader: Record<string, number> = {};
  
  // Process entries
  entries.forEach(entry => {
    const leaderName = entry.userName || entry.submittedBy || 'Unknown';
    
    if (!dataByLeader[leaderName]) {
      dataByLeader[leaderName] = 0;
    }
    
    dataByLeader[leaderName] += entry.distanceCompleted || 0;
  });
  
  // Convert to format needed for the chart
  return Object.entries(dataByLeader).map(([name, value]) => {
    return { name, value };
  });
};

// Helper function to prepare purpose data with costs
export const preparePurposeData = (payments: PaymentRequest[]) => {
  const purposeTotals: Record<string, number> = {};
  
  payments.forEach((payment) => {
    // If we have purposeCosts, use them
    if (payment.purposeCosts) {
      Object.entries(payment.purposeCosts).forEach(([purpose, cost]) => {
        if (!purposeTotals[purpose]) {
          purposeTotals[purpose] = 0;
        }
        purposeTotals[purpose] += Number(cost); // Convert to number to prevent type errors
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
  
  return Object.keys(purposeTotals)
    .filter(purpose => purposeTotals[purpose] > 0) // Filter out zero values
    .map((purpose) => ({
      name: purpose.charAt(0).toUpperCase() + purpose.slice(1),
      value: parseFloat(purposeTotals[purpose].toFixed(2)),
    }));
};

// Helper function to prepare status data for payment chart
export const prepareStatusData = (payments: PaymentRequest[]) => {
  const statusCount: Record<string, number> = {};
  
  payments.forEach((payment) => {
    const status = payment.status;
    if (!statusCount[status]) {
      statusCount[status] = 0;
    }
    statusCount[status]++;
  });
  
  return Object.keys(statusCount).map((status) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    count: statusCount[status],
  }));
};
