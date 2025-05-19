
import { supabase } from "@/integrations/supabase/client";
import { 
  Project, ProgressEntry, PaymentRequest, 
  Photo, Vehicle, Driver 
} from "@/types";
import { getProjects, getProgressEntries, getPaymentRequests, getVehicles, getDrivers } from "@/lib/storage";

// Helper function to format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Function to generate a complete data report in DOCX format
export async function generateDataReport(fileName: string): Promise<Blob | null> {
  try {
    // Use local storage instead of Supabase queries
    // This avoids type errors until the database tables are properly set up
    const projects = getProjects();
    const progress = getProgressEntries();
    const payments = getPaymentRequests();
    const users = []; // We'll handle users differently for now
    const vehicles = getVehicles();
    const drivers = getDrivers();
    const photos = []; // photos will be handled differently
    
    // Create document content
    const documentContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { color: #0000aa; }
          h2 { color: #aa0000; margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th { background-color: #d3d3d3; padding: 8px; border: 1px solid #808080; }
          td { padding: 8px; border: 1px solid #808080; }
          .section { margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <h1>Sai Balaji Construction - Complete Data Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        
        <div class="section">
          <h2>1. Projects (${projects?.length || 0})</h2>
          <table>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Workers</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
            ${projects?.map(p => `
              <tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.numWorkers}</td>
                <td>${p.status}</td>
                <td>${formatDate(p.createdAt)}</td>
              </tr>
            `).join('') || 'No projects found.'}
          </table>
        </div>
        
        <div class="section">
          <h2>2. Progress Entries (${progress?.length || 0})</h2>
          <table>
            <tr>
              <th>Date</th>
              <th>Project</th>
              <th>Distance</th>
              <th>Workers</th>
              <th>Status</th>
            </tr>
            ${progress?.map(p => `
              <tr>
                <td>${formatDate(p.date)}</td>
                <td>${(projects?.find(proj => proj.id === p.projectId)?.name) || 'Unknown'}</td>
                <td>${p.distanceCompleted || 0} meters</td>
                <td>${p.workersPresent || 0}</td>
                <td>${p.status || 'Unknown'}</td>
              </tr>
            `).join('') || 'No progress entries found.'}
          </table>
        </div>
        
        <div class="section">
          <h2>3. Payment Requests (${payments?.length || 0})</h2>
          <table>
            <tr>
              <th>Project</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Requested</th>
              <th>Paid Date</th>
            </tr>
            ${payments?.map(p => `
              <tr>
                <td>${(projects?.find(proj => proj.id === p.projectId)?.name) || 'Unknown'}</td>
                <td>₹${p.amount}</td>
                <td>${p.status}</td>
                <td>${formatDate(p.requestedAt)}</td>
                <td>${p.paidDate ? formatDate(p.paidDate) : 'Not paid'}</td>
              </tr>
            `).join('') || 'No payment requests found.'}
          </table>
        </div>
        
        <div class="section">
          <h2>4. Vehicles (${vehicles?.length || 0})</h2>
          <table>
            <tr>
              <th>Model</th>
              <th>Registration</th>
              <th>Type</th>
            </tr>
            ${vehicles?.map(v => `
              <tr>
                <td>${v.model}</td>
                <td>${v.registrationNumber}</td>
                <td>${v.type}</td>
              </tr>
            `).join('') || 'No vehicles found.'}
          </table>
        </div>
        
        <div class="section">
          <h2>5. Drivers (${drivers?.length || 0})</h2>
          <table>
            <tr>
              <th>Name</th>
              <th>License</th>
              <th>Type</th>
            </tr>
            ${drivers?.map(d => `
              <tr>
                <td>${d.name}</td>
                <td>${d.licenseNumber}</td>
                <td>${d.type}</td>
              </tr>
            `).join('') || 'No drivers found.'}
          </table>
        </div>
        
        <p>--- End of Report ---</p>
      </body>
    </html>
    `;
    
    // Convert HTML to Blob
    const blob = new Blob([documentContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    
    return blob;
  } catch (error) {
    console.error('Error generating data report:', error);
    return null;
  }
}

// Function to download the report
export function downloadReport(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
